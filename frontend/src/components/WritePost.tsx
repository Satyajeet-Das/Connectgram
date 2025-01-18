import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WritePost: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<FileList | null>(null); // To handle multiple files
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", content);

    // Append all selected files to the form data
    if (files) {
      Array.from(files).forEach((file) => {
        formData.append("photo", file); // Append each file as 'photo'
      });
    }

    try {
      // Make a POST request to upload the post
      const response = await axios.post("/api/v1/posts/upload", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data", // Important for sending form-data
        },
      });

      console.log("Post created successfully:", response.data);
      // Reset form
      setContent("");
      setFiles(null);
      navigate(0);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files); // Set the selected files
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="space-y-4">
          {/* Input Text */}
          <textarea
            placeholder="What's on your mind?"
            rows={3} // Default smaller size
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full p-4 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-400 resize-none transition-all duration-300 ease-in-out ${
              isFocused ? "h-40" : "h-16"
            }`} // Adjust height based on focus state
          />

          {/* Attach File and Post Buttons */}
          <div className="flex justify-between items-center">
            {/* Attach File */}
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <label
                htmlFor="file-upload"
                className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center space-x-2 cursor-pointer"
              >
                <FontAwesomeIcon icon={faPaperclip} className="text-white" />
                <span>Attach Files</span>
              </label>
              <input
                type="file"
                id="file-upload"
                name="photo"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
                multiple // Allow selecting multiple files
              />
              <span className="text-xs">JPG, JPEG, PNG, etc.</span>
            </div>

            {/* Post Button */}
            <button
              type="submit"
              className="px-6 py-2 text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WritePost;
