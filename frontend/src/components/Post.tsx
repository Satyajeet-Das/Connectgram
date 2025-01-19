import { useState } from "react";
import axios from "axios";
import { timeAgo } from "../utils/timeAgo";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface Comment {
  author: string;
  content: string;
  date: Date;
}

interface PostProps {
  postId: string; // Add the postId to be passed as a prop
  author: string;
  authorId: string;
  content: string;
  timePosted: string;
  initialLikes?: number;
  initialLiked?: boolean;
  initialComments?: Comment[];
  images?: string[];
}

const Post: React.FC<PostProps> = ({
  postId,
  author,
  authorId,
  content,
  timePosted,
  initialLikes = 0,
  initialLiked = false,
  initialComments = [],
  images = [],
}) => {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isPostOpen, setIsPostOpen] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [newContent, setNewContent] = useState<string>(content);
  const [newImages, setNewImages] = useState<FileList | null>(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState<boolean>(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleLike = async () => {
    try {
      setLikes(liked ? likes - 1 : likes + 1);
      setLiked(!liked);
      await axios.post(
        `/api/v1/posts/addLike/${postId}`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.log("Error adding/removing like: ", error);
    }
  };

  const openPost = () => {
    setIsPostOpen(true);
  };

  const closePost = () => {
    setIsPostOpen(false);
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (newComment.trim()) {
        console.log(newComment);
        const newCommentData = { comment: newComment };
        await axios.post(`/api/v1/posts/addComment/${postId}`, newCommentData, {
          withCredentials: true,
        });
        setComments([
          { author: user.name, content: newComment, date: new Date() },
          ...comments,
        ]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Error adding comment: ", err);
    }
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
    setShowOptions(false);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/v1/posts/delete/${postId}`, {
        withCredentials: true,
      });
      console.log("Post deleted:", response.data);
      // Optionally, you can trigger a state update to remove this post from the UI
      navigate(0);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const confirmDelete = () => {
    setIsDeleteConfirmationOpen(true);
    setShowOptions(false);
  };

  const cancelDelete = () => {
    setIsDeleteConfirmationOpen(false);
  };

  const handleSaveEdit = async () => {
    const formData = new FormData();
    formData.append("content", newContent);
    if (newImages) {
      Array.from(newImages).forEach((image) => formData.append("photo", image));
    }

    try {
      const response = await axios.put(
        `/api/v1/posts/update/${postId}`,
        formData,
        { withCredentials: true }
      );
      console.log("Post updated:", response.data);
      setIsEditDialogOpen(false);
      setNewContent(response.data.content);
      // Optionally, you can update the post content and images in the state after successful update
      navigate(0);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all ease-in-out duration-300 mb-6 dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="font-bold text-xl text-gray-800 dark:text-gray-200">
              {author}
            </div>
            <div className="text-gray-500 dark:text-gray-400">·</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {timePosted}
            </div>
          </div>
          <div className="relative">
            {user._id === authorId && (
              <div
                className="cursor-pointer text-gray-500 dark:text-gray-400"
                onClick={toggleOptions}
              >
                &#8230;
              </div>
            )}
            {showOptions && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-10">
                <button
                  onClick={handleEdit}
                  className="block w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Edit
                </button>
                <button
                  onClick={confirmDelete}
                  className="block w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mb-4 text-gray-800 dark:text-gray-200 text-lg font-medium">
          {content}
        </div>
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Post image ${index + 1}`}
                className="w-full object-cover rounded-lg"
              />
            ))}
          </div>
          {currentIndex !== 0 && (
            <div
              className="absolute top-1/2 left-0 transform -translate-y-1/2 text-gray-500 text-3xl cursor-pointer p-4 dark:text-gray-500"
              onClick={prevImage}
            >
              <FontAwesomeIcon icon={faChevronLeft}/>
              {/* &#60; */}
            </div>
          )}
          {currentIndex !== images.length - 1 && (
            <div
            className="absolute top-1/2 right-0 transform -translate-y-1/2 text-gray-500 text-3xl cursor-pointer p-4 dark:text-gray-500"
            onClick={nextImage}
            >
            <FontAwesomeIcon icon={faChevronRight}/>
              {/* &#62; */}
            </div>
          )}
        </div>
        <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 mt-4">
          <div className="flex space-x-4">
            <div
              className="flex items-center cursor-pointer hover:text-blue-500 transition-all dark:hover:text-blue-300"
              onClick={toggleLike}
            >
              <span className="text-xl">{liked ? "❤️" : "🤍"}</span>
              <span className="ml-1">{liked ? "Unlike" : "Like"}</span>
            </div>
            <div
              className="flex items-center cursor-pointer hover:text-blue-500 transition-all dark:hover:text-blue-300"
              onClick={openPost}
            >
              <span className="text-xl">💬</span>
              <span className="ml-1">Comment</span>
            </div>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            {likes} {likes === 1 ? "Like" : "Likes"} · {comments.length}{" "}
            {comments.length === 1 ? "Comment" : "Comments"}
          </div>
        </div>
      </div>

      {isPostOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-11/12 max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                Comments
              </h2>
              <button
                className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                onClick={closePost}
              >
                ✖
              </button>
            </div>
            <div className="mb-4 space-y-3 max-h-64 overflow-y-auto">
              {comments.map((comment, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 text-white flex items-center justify-center font-bold text-xs">
                    U{index + 1}
                  </div>
                  <div className="flex flex-col">
                    <div className="font-semibold text-gray-800 dark:text-gray-200">
                      {comment.author}
                    </div>
                    <div className="text-gray-700 dark:text-gray-400">
                      {comment.content}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {timeAgo(comment.date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleCommentSubmit} className="flex">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={handleCommentChange}
                className="flex-grow p-2 border rounded-l-lg dark:bg-gray-600 dark:text-white dark:border-gray-500"
              />
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-r-lg dark:bg-blue-600"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}

      {isEditDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-11/12 max-w-md">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                Edit Post
              </h2>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-600 dark:text-white dark:border-gray-500"
                rows={4}
              />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setNewImages(e.target.files)}
                className="mt-4"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditDialogOpen(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteConfirmationOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-11/12 max-w-md">
            <div className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-200">
              Are you sure you want to delete this post?
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
