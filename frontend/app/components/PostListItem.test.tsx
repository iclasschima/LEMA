import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PostListItem from "./PostListItem";
import { Post } from "../types";

describe("PostListItem", () => {
  const mockPost: Post = {
    id: 1,
    userId: 1,
    title: "Test Post Title",
    body: "This is the body of the test post. It contains some descriptive text.",
  };

  const mockOnDelete = jest.fn();

  beforeEach(() => {
    mockOnDelete.mockClear();
  });

  test("renders post title and body correctly", () => {
    render(<PostListItem post={mockPost} onDelete={mockOnDelete} />);
    expect(
      screen.getByRole("heading", { level: 3, name: mockPost.title })
    ).toBeInTheDocument();
    expect(screen.getByText(mockPost.body)).toBeInTheDocument();
  });

  test("calls onDelete when the delete button is clicked", () => {
    render(<PostListItem post={mockPost} onDelete={mockOnDelete} />);
    const deleteButton = screen.getByLabelText(`Delete post ${mockPost.title}`);
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockPost.id);
  });

  test("delete button has correct accessibility attributes", () => {
    render(<PostListItem post={mockPost} onDelete={mockOnDelete} />);
    const deleteButton = screen.getByRole("button", {
      name: `Delete post ${mockPost.title}`,
    });
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveAttribute(
      "aria-label",
      `Delete post ${mockPost.title}`
    );
  });

  test("truncates long body text correctly", () => {
    const longBodyPost = {
      ...mockPost,
      body: "This is a very long body text that exceeds the truncation limit of 100 characters. It should be truncated.",
    };
    render(<PostListItem post={longBodyPost} onDelete={mockOnDelete} />);
    expect(
      screen.getByText((content, element) =>
        content.includes(
          "This is a very long body text that exceeds the truncation limit of 100 characters"
        )
      )
    ).toBeInTheDocument();
  });

  test("does not truncate short body text", () => {
    render(<PostListItem post={mockPost} onDelete={mockOnDelete} />);
    expect(screen.getByText(mockPost.body)).toBeInTheDocument();
  });

  test("renders without crashing when post body is empty", () => {
    const emptyBodyPost = { ...mockPost, body: "" };
    render(<PostListItem post={emptyBodyPost} onDelete={mockOnDelete} />);
    expect(
      screen.getByRole("heading", { level: 3, name: mockPost.title })
    ).toBeInTheDocument();
    expect(screen.queryByText(mockPost.body)).not.toBeInTheDocument();
  });

  test("renders without crashing when post title is empty", () => {
    const emptyTitlePost = { ...mockPost, title: "" };
    render(<PostListItem post={emptyTitlePost} onDelete={mockOnDelete} />);
    expect(screen.queryByRole("heading", { level: 3 })).not.toBeInTheDocument();
    expect(screen.getByText(mockPost.body)).toBeInTheDocument();
  });
});
