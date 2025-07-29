import React, { useState } from "react";
import { Post } from "@/app/types";
import { FaTrashAlt } from "react-icons/fa";
import ConfirmPostDeleteModal from "./ConfirmPostDeleteModal";
import { useDeletePost } from "../hooks";
import { toast } from "react-toastify";

interface PostListItemProps {
  post: Post;
}

const PostListItem: React.FC<PostListItemProps> = ({ post }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deletePostMutation = useDeletePost();

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const handleDeletePost = async (postId: number) => {
    deletePostMutation
      .mutateAsync(postId)
      .then(() => {
        toast.success("Post deleted successfully!");
      })
      .catch((error) => {
        toast.error(
          `Failed to delete post: ${
            (error as Error).message || "Unknown error"
          }`
        );
      });
  };

  return (
    <>
      <div
        className="bg-white rounded-lg h-[293px] w-[270px] shadow-md p-6 pt-10 relative flex flex-col border border-gray-200 cursor-pointer
      hover:shadow-lg transition-colors duration-200 ease-in-out
      hover:border-gray-300 active:scale-[0.98] active:transition-transform
      focus:outline-none focus:ring-2 focus:ring-[#7F56D9] focus:ring-offset-2
      focus:ring-offset-white"
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-4 right-4 text-gray-400 cursor-pointer "
          aria-label={`Delete post ${post.title}`}
        >
          <FaTrashAlt className="w-3 h-3 text-red-300 hover:text-red-500 transition-colors duration-200" />
        </button>

        {post.title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-8">
            {truncateText(post.title, 30)}
          </h3>
        )}

        <p className="text-sm text-gray-600 overflow-hidden leading-relaxed flex-grow">
          {truncateText(post.body, 220)}
        </p>
      </div>

      <ConfirmPostDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => handleDeletePost(post.id)}
        isDeleting={deletePostMutation.isPending}
      />
    </>
  );
};

export default PostListItem;
