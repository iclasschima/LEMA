"use client";

import React, { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useUserPosts, useDeletePost, useCreatePost } from "@/app/hooks";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import ErrorMessage from "@/app/components/ErrorMessage";
import PostListItem from "@/app/components/PostListItem";
import { toast } from "react-toastify";
import { BsArrowLeft } from "react-icons/bs";

import { FiPlusCircle } from "react-icons/fi";
import NewPostModal from "@/app/components/NewPostModal";

const UserPostsPage: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const params = useParams();
  const userId = params.userId as string;
  const router = useRouter();
  const searchParams = useSearchParams();

  const userName = searchParams.get("name") || "";
  const userEmail = searchParams.get("email") || "";

  const [page] = useState(1);
  const postsLimit = 20;

  const {
    data: postsData,
    isLoading: isLoadingPosts,
    isError: isErrorPosts,
    error: postsError,
  } = useUserPosts(userId, page, postsLimit);

  const createPostMutation = useCreatePost();

  const handlePublishPost = (title: string, content: string) => {
    createPostMutation
      .mutateAsync({ userId, title, body: content })
      .then(() => {
        toast.success("Post published successfully!");
        setShowModal(false);
      })
      .catch((error) => {
        toast.error(
          `Failed to publish post: ${
            (error as Error).message || "Unknown error"
          }`
        );
      });
  };

  if (isLoadingPosts) return <LoadingSpinner isLoadingFullScreen />;
  if (isErrorPosts)
    return (
      <ErrorMessage message={postsError?.message || "Failed to load posts."} />
    );

  return (
    <div className="container mx-auto p-4 sm:p-8 min-h-screen max-w-[900px]">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="mb-6 font-semibold px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center text-sm"
        >
          <BsArrowLeft className="mr-2 text-2xl" /> Back to Users
        </button>

        <h1 className="text-4xl font-semibold text-gray-900 mb-2">
          {userName}
        </h1>
        <p className="text-md text-gray-600 font-medium mb-4">
          <span className="font-normal"> {userEmail}</span> &bull;{" "}
          {postsData?.pagination.total || 0} Posts
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          onClick={() => setShowModal(true)}
          className="bg-white rounded-lg border-dashed border-2 h-[293px] w-[270px] p-6 flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors duration-200 cursor-pointer border-gray-200"
        >
          <FiPlusCircle className="w-5 h-5 mb-2" />
          <span className="text-sm text-[#717680] font-medium">New Post</span>
        </div>

        {postsData?.data.map((post) => (
          <PostListItem key={post.id} post={post} />
        ))}
      </div>

      {showModal && (
        <NewPostModal
          onClose={() => setShowModal(false)}
          onPublish={handlePublishPost}
          isPublishing={createPostMutation.isPending}
        />
      )}
    </div>
  );
};

export default UserPostsPage;
