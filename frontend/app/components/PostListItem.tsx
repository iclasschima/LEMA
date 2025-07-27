import React from "react";
import { Post } from "@/app/types";
import { FaTrashAlt } from "react-icons/fa";

interface PostListItemProps {
  post: Post;
  onDelete: (postId: number) => void;
}

const PostListItem: React.FC<PostListItemProps> = ({ post, onDelete }) => {
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };
  return (
    <div className="bg-white rounded-lg shadow-md p-6 pt-14 h-[293px] relative flex flex-col border border-gray-200">
      <button
        onClick={() => onDelete(post.id)}
        className="absolute top-4 right-4 text-gray-400 cursor-pointer "
        aria-label={`Delete post ${post.title}`}
      >
        <FaTrashAlt className="w-3 h-3 text-red-300 hover:text-red-500 transition-colors duration-200" />
      </button>

      {post.title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-8">
          {post.title}
        </h3>
      )}

      <p className="text-sm text-gray-600 leading-relaxed flex-grow">
        {truncateText(post.body, 200)}
      </p>
    </div>
  );
};

export default PostListItem;
