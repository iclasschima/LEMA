import request from "supertest";
import app from "../index";
import { getTestDb, closeTestDb, clearTestDb } from "../test-database";
import { Database } from "sqlite3";
import { setDbInstanceForTesting } from "../database";

let testDbInstance: Database;

beforeAll(async () => {
  testDbInstance = await getTestDb();
  setDbInstanceForTesting(testDbInstance);
});

beforeEach(async () => {
  //   await clearTestDb();
  await getTestDb();
});

afterAll(async () => {
  await closeTestDb();
  setDbInstanceForTesting(null);
});

describe("API Endpoints", () => {
  it("should return 200 for health check", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual("ok");
  });

  describe("User API", () => {
    it("should fetch all users with pagination", async () => {
      const res = await request(app).get("/api/users?_page=1&_limit=1");

      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0]).toHaveProperty("id", "1");
      expect(res.body.data[0]).toHaveProperty("name", "Test User 1");
      expect(res.body.pagination.total).toEqual(2);
      expect(res.body.pagination.page).toEqual(1);
      expect(res.body.pagination.limit).toEqual(1);
    });

    it("should fetch all users with address information", async () => {
      const res = await request(app).get("/api/users?_page=1&_limit=10");

      expect(res.statusCode).toEqual(200);
      expect(res.body.data[0]).toHaveProperty("address");
      expect(res.body.data[0].address).toHaveProperty("street", "123 Test St");
      expect(res.body.data[0].address).toHaveProperty("state", "CA");
    });

    it("should return empty array and correct pagination for out-of-bounds page", async () => {
      const res = await request(app).get("/api/users?_page=100&_limit=10");
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveLength(0);
      expect(res.body.pagination.total).toEqual(2);
      expect(res.body.pagination.page).toEqual(100);
    });
  });

  describe("Post API", () => {
    it("should return 404 for non-existent user posts", async () => {
      const res = await request(app).get("/api/users/999/posts");
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual("User not found");
    });
    it("should fetch posts for a specific user", async () => {
      const res = await request(app).get("/api/users/1/posts");
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0]).toHaveProperty("userId", "1");
      expect(res.body.pagination.total).toEqual(2);
    });
    // NEW TEST: Create a new post
    it("should create a new post for an existing user", async () => {
      const newPost = {
        userId: "1",
        title: "New Test Post",
        body: "This is a new test post created via the API.",
      };
      const res = await request(app)
        .post("/api/posts") // Note: Post route is /api/posts
        .send(newPost);
      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toEqual("Post created successfully");
      expect(res.body.post).toHaveProperty("id");
      expect(res.body.post).toHaveProperty("userId", newPost.userId);
      expect(res.body.post).toHaveProperty("title", newPost.title);
      expect(res.body.post).toHaveProperty("body", newPost.body);
      // Verify the post count for the user has increased
      const postsAfterCreation = await request(app).get("/api/users/1/posts");
      expect(postsAfterCreation.statusCode).toEqual(200);
      expect(postsAfterCreation.body.data).toHaveLength(3); // Original 2 + 1 new
      expect(
        postsAfterCreation.body.data.some((p: any) => p.title === newPost.title)
      ).toBeTruthy();
    });
    // NEW TEST: Fail to create post without required fields
    it("should return 400 if required fields are missing for post creation", async () => {
      const invalidPost = {
        userId: "1",
        title: "Missing Body",
        // body is missing
      };
      const res = await request(app).post("/api/posts").send(invalidPost);
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toEqual(
        "User ID, title, and body are required to create a post."
      );
    });
    // NEW TEST: Fail to create post for non-existent user
    it("should return 404 if user does not exist for post creation", async () => {
      const newPost = {
        userId: "999", // Non-existent user
        title: "Post for non-existent user",
        body: "This should fail.",
      };
      const res = await request(app).post("/api/posts").send(newPost);
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual("User not found");
    });
    it("should return 404 when deleting a non-existent post", async () => {
      const res = await request(app).delete("/api/posts/9999");
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual("Post not found");
    });
    it("should delete a post", async () => {
      const initialPostsRes = await request(app).get(
        "/api/users/1/posts?_page=1&_limit=2"
      );
      expect(initialPostsRes.statusCode).toEqual(200);
      expect(initialPostsRes.body.data).toHaveLength(2);
      const postIdToDelete = initialPostsRes.body.data[0].id;
      const res = await request(app).delete(`/api/posts/${postIdToDelete}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual("Post deleted successfully");
      const afterDeletePostsRes = await request(app).get("/api/users/1/posts");
      expect(afterDeletePostsRes.statusCode).toEqual(200);
      expect(afterDeletePostsRes.body.data).toHaveLength(1);
      expect(
        afterDeletePostsRes.body.data.find((p: any) => p.id === postIdToDelete)
      ).toBeUndefined();
    });
    it("should delete a post even if other fields are present in the request body", async () => {
      const initialPostsRes = await request(app).get("/api/users/1/posts");
      const postIdToDelete = initialPostsRes.body.data[0].id;
      const res = await request(app)
        .delete(`/api/posts/${postIdToDelete}`)
        .send({ someOtherField: "value" });
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual("Post deleted successfully");
    });
  });
});
