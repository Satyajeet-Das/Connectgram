import React, { useEffect, useState, useRef, useCallback } from "react";
import Post from "../components/Post";
import WritePost from "../components/WritePost";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const { user } = useAuth();

  const fetchPosts = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/v1/posts/all", {
        params: { page, limit: 5 }, // Adjust the limit as needed
        withCredentials: true
      });

      const newPosts = response.data.posts;
      
      // Filter out duplicates if newPosts already exist in the posts state
      const updatedPosts = [
        ...posts,
        ...newPosts.filter((newPost: any) => !posts.some((post: any) => post._id === newPost._id))
      ];

      if (newPosts.length > 0) {
        setPosts(updatedPosts);
      } else {
        setHasMore(false); // No more posts to load
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const lastPostRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  return (
    <>
      <WritePost />
      {posts.map((post, index) => {
        if (index === posts.length - 1) {
          // Attach observer to the last post
          return (
            <div ref={lastPostRef} key={post._id}> {/* Use post._id as the unique key */}
              <Post
                postId={post._id}
                author={post.author.name}
                content={post.content}
                timePosted={new Date(post.createdAt).toLocaleString()}
                initialLikes={post.likes.length}
                initialLiked={post.likes.includes(user._id)} // Add logic to determine if the user liked this post
                initialComments={post.comments.map((comment: any) => ({
                  author: comment.author.name,
                  content: comment.content,
                  date: new Date(comment.date),
                }))}
                images={post.photo?.map((base64: string) => `data:image/png;base64,${base64}`)}
                />
            </div>
          );
        }

        return (
          <Post
          key={post._id}
            postId={post._id}
            author={post.author.name}
            content={post.content}
            timePosted={new Date(post.createdAt).toLocaleString()}
            initialLikes={post.likes.length}
            initialLiked={post.likes.includes(user._id)} // Add logic to determine if the user liked this post
            initialComments={post.comments.map((comment: any) => ({
              author: comment.author.name,
              content: comment.content,
              date: new Date(comment.date),
            }))}
            images={post.photo?.map((base64: string) => `data:image/png;base64,${base64}`)}
          />
        );
      })}
      {loading && <p>Loading...</p>}
      {!hasMore && <p>No more posts to show</p>}
    </>
  );
};

export default Home;
