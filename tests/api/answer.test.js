const request = require("supertest");
const server = require("../../app");
const db = require("../../models/index");

const userData = [
  {
    id: "userId1",
    username: "user1",
    email: "email1",
    password: "password1",
  },
  {
    id: "userId2",
    username: "user2",
    email: "email2",
    password: "password2",
  },
];

const addressData = {
  id: "addressId1",
  postalCode: "1111111",
  prefecture: "prefecture1",
  municipality: "municipality1",
  townName: "town1",
  buildingName: "building1",
};

const postData = {
  id: "post1",
  title: "title1",
  property: "test-property1",
  text: "text1",
  authorId: "userId1",
  addressId: "addressId1",
  updatedAt: new Date(2021, 1, 1, 0, 0, 0),
};

const answerData = {
  id: "answerId1",
  content: "content1",
  questionId: "post1",
  respondentId: "userId2",
};

describe("answerAPIのテスト", () => {
  beforeAll(async () => {
    await db.user.bulkCreate(userData);
    await db.address.create(addressData);
    await db.post.create(postData);
    await db.answer.create(answerData);
  });

  afterAll(async () => {
    await db.post.destroy({ where: {} });
    await db.address.destroy({ where: {} });
    await db.user.destroy({ where: {} });
    await db.answer.destroy({ where: {} });
  });

  describe("POST /answers/create のテスト", () => {
    describe("正常系", () => {
      it("回答を正常に作成できる", async () => {
        const params = {
          id: "createAnswerId",
          content: "createAnswer",
          questionId: "post1",
          respondentId: "userId1",
        };
        const response = await request(server)
          .post("/answers/create")
          .send(params);
        expect(response.statusCode).toBe(201);

        const answerData = await db.answer.findAll({
          where: params,
        });
        expect(answerData).toHaveLength(1);
        expect(answerData[0].id).toBe("createAnswerId");
        expect(answerData[0].content).toBe("createAnswer");
        expect(answerData[0].questionId).toBe("post1");
        expect(answerData[0].respondentId).toBe("userId1");
      });
    });
  });

  describe("PATCH /answers/update/:answerId のテスト", () => {
    describe("正常系", () => {
      it("回答を正常に更新できる", async () => {
        const params = {
          content: "createAnswer2",
        };
        const response = await request(server)
          .patch("/answers/update/createAnswerId")
          .send(params);

        expect(response.statusCode).toBe(200);

        const answerData = await db.answer.findByPk("createAnswerId");
        expect(answerData.content).toBe("createAnswer2");
      });
    });
  });

  describe("DELETE /answers/destroy/:answerId のテスト", () => {
    describe("正常系", () => {
      it("回答を正常に削除できる", async () => {
        const response = await request(server).delete(
          "/answers/destroy/createAnswerId"
        );
        expect(response.statusCode).toBe(200);

        const answerData = await db.answer.findAll({
          where: { id: "createAnswerId" },
        });
        expect(answerData).toHaveLength(0);
      });
    });
  });

  describe("POST /answers/add/like のテスト", () => {
    describe("正常系", () => {
      it("回答にいいねを正常につけられる", async () => {
        const params = {
          userId: "userId1",
          answerId: "answerId1",
        };
        const response = await request(server)
          .post("/answers/add/like")
          .send(params);
        expect(response.statusCode).toBe(201);

        const actualPostResponse = await request(server).get(
          "/posts/post/post1"
        );
        expect(actualPostResponse.body.answers[0].likedBy).toHaveLength(1);
        expect(actualPostResponse.body.answers[0].likedBy[0].id).toBe(
          "userId1"
        );
      });
    });
  });

  describe("DELETE /answers/remove/like/:answerId/user/:userId のテスト", () => {
    describe("正常系", () => {
      it("回答からいいねを正常に外せる", async () => {
        const response = await request(server).delete(
          "/answers/remove/like/answerId1/user/userId1"
        );
        expect(response.statusCode).toBe(200);

        const actualPostResponse = await request(server).get(
          "/posts/post/post1"
        );
        expect(actualPostResponse.body.answers[0].likedBy).toHaveLength(0);
      });
    });
  });
});
