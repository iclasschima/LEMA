import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, getUserPosts, deletePost, createPost } from "../lib/api";
import { AxiosError } from "axios";

export const useUsers = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["users", page, limit],
    queryFn: () => getUsers(page, limit),
  });
};

export const useUserPosts = (userId: string, page: number, limit: number) => {
  return useQuery({
    queryKey: ["userPosts", userId, page, limit],
    queryFn: () => getUserPosts(userId, page, limit),
    enabled: !!userId,
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError: (error: AxiosError) => {
      console.error("Error deleting post:", error);
      return error;
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      title,
      body,
    }: {
      userId: string;
      title: string;
      body: string;
    }) => createPost(userId, title, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError: (error: AxiosError) => {
      console.error("Error creating post:", error);
      return error;
    },
  });
};
