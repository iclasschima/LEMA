"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const test_database_1 = require("../test-database");
const database_1 = require("../database");
let testDbInstance;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    testDbInstance = yield (0, test_database_1.getTestDb)();
    (0, database_1.setDbInstanceForTesting)(testDbInstance);
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    //   await clearTestDb();
    yield (0, test_database_1.getTestDb)();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, test_database_1.closeTestDb)();
    (0, database_1.setDbInstanceForTesting)(null);
}));
describe("API Endpoints", () => {
    it("should return 200 for health check", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.default).get("/health");
        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toEqual("ok");
    }));
    describe("User API", () => {
        it("should fetch all users with pagination", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(index_1.default).get("/api/users?_page=1&_limit=1");
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toHaveLength(1);
            expect(res.body.data[0]).toHaveProperty("id", "1");
            expect(res.body.data[0]).toHaveProperty("name", "Test User 1");
            expect(res.body.pagination.total).toEqual(2);
            expect(res.body.pagination.page).toEqual(1);
            expect(res.body.pagination.limit).toEqual(1);
        }));
        it("should fetch all users with address information", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(index_1.default).get("/api/users?_page=1&_limit=10");
            expect(res.statusCode).toEqual(200);
            expect(res.body.data[0]).toHaveProperty("address");
            expect(res.body.data[0].address).toHaveProperty("street", "123 Test St");
            expect(res.body.data[0].address).toHaveProperty("state", "CA");
        }));
        it("should return empty array and correct pagination for out-of-bounds page", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(index_1.default).get("/api/users?_page=100&_limit=10");
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toHaveLength(0);
            expect(res.body.pagination.total).toEqual(2);
            expect(res.body.pagination.page).toEqual(100);
        }));
    });
    describe("Post API", () => {
        it("should return 404 for non-existent user posts", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(index_1.default).get("/api/users/999/posts");
            expect(res.statusCode).toEqual(404);
            expect(res.body.error).toEqual("User not found");
        }));
        it("should fetch posts for a specific user", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(index_1.default).get("/api/users/1/posts");
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toHaveLength(2);
            expect(res.body.data[0]).toHaveProperty("userId", "1");
            expect(res.body.pagination.total).toEqual(2);
        }));
        // NEW TEST: Create a new post
        it("should create a new post for an existing user", () => __awaiter(void 0, void 0, void 0, function* () {
            const newPost = {
                userId: "1",
                title: "New Test Post",
                body: "This is a new test post created via the API.",
            };
            const res = yield (0, supertest_1.default)(index_1.default)
                .post("/api/posts") // Note: Post route is /api/posts
                .send(newPost);
            expect(res.statusCode).toEqual(201);
            expect(res.body.message).toEqual("Post created successfully");
            expect(res.body.post).toHaveProperty("id");
            expect(res.body.post).toHaveProperty("userId", newPost.userId);
            expect(res.body.post).toHaveProperty("title", newPost.title);
            expect(res.body.post).toHaveProperty("body", newPost.body);
            // Verify the post count for the user has increased
            const postsAfterCreation = yield (0, supertest_1.default)(index_1.default).get("/api/users/1/posts");
            expect(postsAfterCreation.statusCode).toEqual(200);
            expect(postsAfterCreation.body.data).toHaveLength(3); // Original 2 + 1 new
            expect(postsAfterCreation.body.data.some((p) => p.title === newPost.title)).toBeTruthy();
        }));
        // NEW TEST: Fail to create post without required fields
        it("should return 400 if required fields are missing for post creation", () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidPost = {
                userId: "1",
                title: "Missing Body",
                // body is missing
            };
            const res = yield (0, supertest_1.default)(index_1.default).post("/api/posts").send(invalidPost);
            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual("User ID, title, and body are required to create a post.");
        }));
        // NEW TEST: Fail to create post for non-existent user
        it("should return 404 if user does not exist for post creation", () => __awaiter(void 0, void 0, void 0, function* () {
            const newPost = {
                userId: "999", // Non-existent user
                title: "Post for non-existent user",
                body: "This should fail.",
            };
            const res = yield (0, supertest_1.default)(index_1.default).post("/api/posts").send(newPost);
            expect(res.statusCode).toEqual(404);
            expect(res.body.error).toEqual("User not found");
        }));
        it("should return 404 when deleting a non-existent post", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(index_1.default).delete("/api/posts/9999");
            expect(res.statusCode).toEqual(404);
            expect(res.body.error).toEqual("Post not found");
        }));
        it("should delete a post", () => __awaiter(void 0, void 0, void 0, function* () {
            const initialPostsRes = yield (0, supertest_1.default)(index_1.default).get("/api/users/1/posts?_page=1&_limit=2");
            expect(initialPostsRes.statusCode).toEqual(200);
            expect(initialPostsRes.body.data).toHaveLength(2);
            const postIdToDelete = initialPostsRes.body.data[0].id;
            const res = yield (0, supertest_1.default)(index_1.default).delete(`/api/posts/${postIdToDelete}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual("Post deleted successfully");
            const afterDeletePostsRes = yield (0, supertest_1.default)(index_1.default).get("/api/users/1/posts");
            expect(afterDeletePostsRes.statusCode).toEqual(200);
            expect(afterDeletePostsRes.body.data).toHaveLength(1);
            expect(afterDeletePostsRes.body.data.find((p) => p.id === postIdToDelete)).toBeUndefined();
        }));
        it("should delete a post even if other fields are present in the request body", () => __awaiter(void 0, void 0, void 0, function* () {
            const initialPostsRes = yield (0, supertest_1.default)(index_1.default).get("/api/users/1/posts");
            const postIdToDelete = initialPostsRes.body.data[0].id;
            const res = yield (0, supertest_1.default)(index_1.default)
                .delete(`/api/posts/${postIdToDelete}`)
                .send({ someOtherField: "value" });
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual("Post deleted successfully");
        }));
    });
});
