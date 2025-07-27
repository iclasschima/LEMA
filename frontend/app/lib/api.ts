import axios from "axios";
import { ApiResponse, Post, User } from "../types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

export const getUsers = async (
  page: number = 1,
  limit: number = 4
): Promise<ApiResponse<User>> => {
  const response = await axios.get(`${API_BASE_URL}/users`, {
    params: { _page: page, _limit: limit },
  });
  return response.data;
};

export const getUserPosts = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<Post>> => {
  const response = await axios.get(`${API_BASE_URL}/users/${userId}/posts`, {
    params: { _page: page, _limit: limit },
  });
  return response.data;
};

export const deletePost = async (postId: number): Promise<void> => {
  const response = await axios.delete(`${API_BASE_URL}/posts/${postId}`);
  return response.data;
};

export const createPost = async (
  userId: string,
  title: string,
  body: string
): Promise<Post> => {
  const response = await axios.post(`${API_BASE_URL}/posts`, {
    userId,
    title,
    body,
  });
  return response.data;
};
