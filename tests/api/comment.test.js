const request = require("supertest");
const server = require("../../app");
const db = require("../../models/index");

const userData = {
  id: "authorId1",
  username: "user1",
  email: "email1",
  password: "passwd1",
  icon_url: "userIcon1",
};

const answerData = {
  id: "answerId1",
  content: "answer1",
  questionId: "postId12",
  respondentId: "authorId1",
  updatedAt: new Date(2021, 12, 10, 0, 0, 0),
};

describe("commentAPIのテスト", () => {
  beforeAll(async () => {
    await db.user.create(userData);
    await db.answer.create(answerData);
  });

  afterAll(async () => {
    await db.answer.destroy({ where: {} });
    await db.user.destroy({ where: {} });
  });

  describe("POST /comments/create のテスト", () => {
    describe("正常系", () => {
      it("コメントを正常に作成できる", async () => {
        const params = {
          id: "commentId1",
          content: "comment1",
          answerId: "answerId1",
          authorId: "authorId1",
        };
        const response = await request(server)
          .post("/comments/create")
          .send(params);
        expect(response.statusCode).toBe(201);

        const commentData = await db.comment.findAll();
        expect(commentData).toHaveLength(1);
        expect(commentData[0].id).toBe("commentId1");
        expect(commentData[0].content).toBe("comment1");
        expect(commentData[0].answerId).toBe("answerId1");
        expect(commentData[0].authorId).toBe("authorId1");
      });
    });
  });

  describe("PATCH /comments/update/:commentId のテスト", () => {
    describe("正常系", () => {
      it("コメントを正常に編集できる", async () => {
        const params = { content: "updatedComment1" };
        const response = await request(server)
          .patch("/comments/update/commentId1")
          .send(params);
        expect(response.statusCode).toBe(200);

        const commentData = await db.comment.findAll();
        expect(commentData).toHaveLength(1);
        expect(commentData[0].id).toBe("commentId1");
        expect(commentData[0].content).toBe("updatedComment1");
      });
    });
  });

  describe("DELETE /comments/delete/:commentId のテスト", () => {
    describe("正常系", () => {
      it("コメントを正常に削除できる", async () => {
        const response = await request(server).delete(
          "/comments/delete/commentId1"
        );
        expect(response.statusCode).toBe(200);

        const commentData = await db.comment.findAll();
        expect(commentData).toHaveLength(0);
      });
    });
  });
});
