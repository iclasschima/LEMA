import React, { useState } from "react";

interface NewPostModalProps {
  onClose: () => void;
  onPublish: (title: string, content: string) => void;
}

const NewPostModal: React.FC<NewPostModalProps> = ({ onClose, onPublish }) => {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");

  const MAX_TITLE_LENGTH = 100;
  const MAX_CONTENT_LENGTH = 500;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (value.length <= MAX_TITLE_LENGTH) {
      setPostTitle(value);
      setTitleError("");
    } else {
      setPostTitle(value.substring(0, MAX_TITLE_LENGTH));
      setTitleError(`Title cannot exceed ${MAX_TITLE_LENGTH} characters.`);
    }
  };

  const handleContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const value = e.target.value;
    if (value.length <= MAX_CONTENT_LENGTH) {
      setPostContent(value);
      setContentError("");
    } else {
      setPostContent(value.substring(0, MAX_CONTENT_LENGTH));
      setContentError(
        `Content cannot exceed ${MAX_CONTENT_LENGTH} characters.`
      );
    }
  };

  const handlePublishClick = () => {
    if (!postTitle.trim()) {
      setTitleError("Post title cannot be empty.");
      return;
    }
    if (!postContent.trim()) {
      setContentError("Post content cannot be empty.");
      return;
    }
    if (titleError || contentError) {
      return;
    }

    onPublish(postTitle, postContent);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl transform transition-all duration-300 scale-100 opacity-100">
        <div className="mb-6">
          <h2 className="text-4xl font-medium text-gray-900">New Post</h2>
        </div>

        <div className="mb-6">
          <label
            htmlFor="postTitle"
            className="block text-lg font-medium text-gray-600 mb-2"
          >
            Post title
          </label>
          <input
            type="text"
            id="postTitle"
            className={`w-full p-3 border rounded-lg focus:ring-2 border-gray-300 focus:border-none focus:border-transparent transition duration-150 ease-in-out ${
              titleError ? "border-red-500" : ""
            }`}
            placeholder="Give your post a title"
            value={postTitle}
            onChange={handleTitleChange}
            maxLength={MAX_TITLE_LENGTH}
          />
          {titleError && (
            <p className="text-red-500 text-sm mt-1">{titleError}</p>
          )}
          <p className="text-right text-sm text-gray-500 mt-1">
            {postTitle.length}/{MAX_TITLE_LENGTH} characters
          </p>
        </div>

        <div className="mb-8">
          <label
            htmlFor="postContent"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Post content
          </label>
          <textarea
            id="postContent"
            rows={8}
            className={`w-full p-3 border rounded-lg border-gray-300 focus:border-none focus:ring-2 focus:border-transparent transition duration-150 ease-in-out resize-y ${
              contentError ? "border-red-500" : ""
            }`}
            placeholder="Write something mind-blowing"
            value={postContent}
            onChange={handleContentChange}
            maxLength={MAX_CONTENT_LENGTH}
          ></textarea>
          {contentError && (
            <p className="text-red-500 text-sm mt-1">{contentError}</p>
          )}
          <p className="text-right text-sm text-gray-500 mt-1">
            {postContent.length}/{MAX_CONTENT_LENGTH} characters
          </p>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-3 border cursor-pointer border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handlePublishClick}
            className="px-6 py-3 bg-[#334155] text-white rounded-lg shadow-md hover:bg-blue-900 transition duration-200 cursor-pointer"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPostModal;
