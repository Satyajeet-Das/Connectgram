import { Request, Response } from "express";
import Post from "../models/post";
import Comment from "../models/comment";
import { JwtPayloadWithUserId } from "../types/payload";
import mongoose from "mongoose";

export const getMedia = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  try {
    const posts = await Post.find()
      .populate("author", "name")
      // .populate("likes", "name")
      .populate({path: "comments", populate: {path: "author", select: "name"}})
      .skip((page - 1) * limit)
      .limit(limit);

      const postsWithBase64 = posts.map((post) => {
        return {
          ...post.toObject(),
          photo: Array.isArray(post.photo)
            ? post.photo.map((buffer) => buffer.toString("base64"))
            : null,
        };
      });      

    const comments = await Comment.find().populate("author");

    res.status(200).json({ isError: false, posts: postsWithBase64 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ isError: true, message: "Error fetching posts" });
  }
};

export const postMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    const { userId } = req.user as JwtPayloadWithUserId;

    if (!userId) {
      res
        .status(401)
        .json({ isError: true, message: "Unauthorized: No user ID found" });
      return;
    }

    let photo: Buffer[] = [];
    
    // Check and type the files as an array of Express.Multer.File
    if (req.files && Array.isArray(req.files)) {
      // Assuming the files are an array, map them to their buffers
      photo = (req.files as Express.Multer.File[]).map((file) => file.buffer);
    }

    const newPost = new Post({
      photo, // Save multiple photos as an array
      content,
      author: userId,
      comments: [],
      likes: [],
    });

    await newPost.save();

    res.status(201).json({
      isError: false,
      message: "Post created successfully",
      postId: newPost._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ isError: true, message: "Error creating post" });
  }
};




export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const { userId } = req.user as JwtPayloadWithUserId;

    if (!userId) {
      res
        .status(401)
        .json({ isError: true, message: "Unauthorized: No user ID found" });
      return;
    }

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      res.status(404).json({ isError: true, message: "Post not found" });
      return;
    }

    if (post.author.toString() !== userId) {
      res.status(403).json({
        isError: true,
        message: "Forbidden: You are not allowed to update this post",
      });
      return;
    }

    if (content) {
      post.content = content;
    }

    if (req.files && Array.isArray(req.files)) {
      // Process multiple files
      const photoBuffers = (req.files as Express.Multer.File[]).map((file) => file.buffer);
      post.photo = photoBuffers; // Save multiple photos as an array
    }

    // Save the updated post
    await Post.findByIdAndUpdate(postId, post);

    res
      .status(200)
      .json({ isError: false, message: "Post updated successfully", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ isError: true, message: "Error updating post" });
  }
};



export const deletePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { postId } = req.params;
    const { userId } = req.user as JwtPayloadWithUserId;
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ isError: true, message: "Post not found" });
      return;
    }
    if (post.author.toString() !== userId) {
      res.status(403).json({
        isError: true,
        message: "Forbidden: You are not allowed to delete this",
      });
      return;
    }
    await Post.findByIdAndDelete(postId);
    res
      .status(200)
      .json({ isError: false, message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ isError: true, message: "Error deleting post" });
  }
};

export const addComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { postId } = req.params;
    const { userId } = req.user as JwtPayloadWithUserId;
    const { comment } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ isError: true, message: "Post not found" });
      return;
    }
    const newComment = new Comment({ post: postId, content: comment, author: userId });
    await newComment.save();
    post.comments.push(newComment._id);
    await post.save();
    res
      .status(201)
      .json({ isError: false, message: "Comment added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ isError: true, message: "Error adding comment" });
  }
};

export const addLike = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const { userId } = req.user as JwtPayloadWithUserId;
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ isError: true, message: "Post not found" });
      return;
    }

    const objectIdUser = new mongoose.Types.ObjectId(userId);

    const existingLike = post.likes.find((like) => like.toString() === userId);
    if (existingLike) {
      post.likes = post.likes.filter((like) => like.toString() !== userId);
      await post.save();
      res
        .status(200)
        .json({ isError: false, message: "Like removed successfully" });
    } else {
      post.likes.push(objectIdUser);
      await post.save();
      res
        .status(201)
        .json({ isError: false, message: "Like added successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ isError: true, message: "Error adding like" });
  }
};
