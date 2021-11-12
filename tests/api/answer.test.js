const request = require("supertest");
const server = require("../../app");
const db = require("../../models/index");

const userData = [
  {
    id: "userId1",
    username: "user1",
    icon_url: "userIcon1",
    email: "email1",
    password: "password1",
  },
  {
    id: "userId2",
    username: "user2",
    icon_url: "userIcon2",
    email: "email2",
    password: "password2",
  },
  {
    id: "userId3",
    username: "user3",
    icon_url: "userIcon3",
    email: "email3",
    password: "password3",
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

const postData = [
  {
    id: "post1",
    title: "title1",
    property: "test-property1",
    text: "text1",
    authorId: "userId1",
    addressId: "addressId1",
    updatedAt: new Date(2021, 1, 1, 0, 0, 0),
  },
  {
    id: "post2",
    title: "title2",
    property: "test-property2",
    text: "text2",
    authorId: "userId2",
    addressId: "addressId1",
    updatedAt: new Date(2021, 1, 2, 0, 0, 0),
  },
];

const answerData = [
  {
    id: "answerId1",
    content: "content1",
    evaluation: 0,
    questionId: "post1",
    respondentId: "userId2",
    createdAt: new Date(2021, 1, 10, 0, 0, 0),
  },
  {
    id: "answerId2",
    content: "content2",
    evaluation: 1,
    questionId: "post2",
    respondentId: "userId3",
    createdAt: new Date(2021, 1, 20, 0, 0, 0),
  },
  {
    id: "answerId3",
    content: "content3",
    evaluation: 2,
    questionId: "post2",
    respondentId: "userId2",
    createdAt: new Date(2021, 1, 30, 0, 0, 0),
  },
];

const userAnswerData = [
  {
    answerId: "answerId1",
    userId: "userId2",
  },
  {
    answerId: "answerId2",
    userId: "userId2",
  },
  {
    answerId: "answerId2",
    userId: "userId1",
  },
];

describe("answerAPIのテスト", () => {
  beforeAll(async () => {
    await db.user.bulkCreate(userData);
    await db.address.create(addressData);
    await db.post.bulkCreate(postData);
    await db.answer.bulkCreate(answerData);
    await db.UserAnswer.bulkCreate(userAnswerData);
  });

  afterAll(async () => {
    await db.UserAnswer.destroy({ where: {} });
    await db.post.destroy({ where: {} });
    await db.address.destroy({ where: {} });
    await db.user.destroy({ where: {} });
    await db.answer.destroy({ where: {} });
  });

  describe("GET /answers/user/:id/:page のテスト", () => {
    describe("正常系", () => {
      it("ユーザーの回答を正常に取得できる", async () => {
        const user2Response = await request(server).get(
          "/answers/user/userId2/1"
        );
        const user3Response = await request(server).get(
          "/answers/user/userId3/1"
        );

        const answer1CreatedAt = new Date(2021, 1, 10, 0, 0, 0);
        const answer2CreatedAt = new Date(2021, 1, 20, 0, 0, 0);
        const answer3CreatedAt = new Date(2021, 1, 30, 0, 0, 0);

        expect(user2Response.statusCode).toBe(200);
        expect(user3Response.statusCode).toBe(200);
        expect(user2Response.body.total).toBe(1);
        expect(user3Response.body.total).toBe(1);
        expect(user2Response.body.answers).toHaveLength(2);
        expect(user3Response.body.answers).toHaveLength(1);

        expect(user2Response.body.answers[0].id).toBe("answerId3");
        expect(user2Response.body.answers[0].content).toBe("content3");
        expect(user2Response.body.answers[0].evaluation).toBe(2);
        expect(user2Response.body.answers[0].createdAt).toBe(
          answer3CreatedAt.toISOString()
        );
        expect(user2Response.body.answers[1].id).toBe("answerId1");
        expect(user2Response.body.answers[1].content).toBe("content1");
        expect(user2Response.body.answers[1].evaluation).toBe(0);
        expect(user2Response.body.answers[1].createdAt).toBe(
          answer1CreatedAt.toISOString()
        );
        expect(user3Response.body.answers[0].id).toBe("answerId2");
        expect(user3Response.body.answers[0].content).toBe("content2");
        expect(user3Response.body.answers[0].evaluation).toBe(1);
        expect(user3Response.body.answers[0].createdAt).toBe(
          answer2CreatedAt.toISOString()
        );
      });
      it("回答から投稿のデータを取得できる", async () => {
        const response = await request(server).get("/answers/user/userId2/1");

        expect(response.body.answers[0].post.id).toBe("post2");
        expect(response.body.answers[0].post.title).toBe("title2");
        expect(response.body.answers[1].post.id).toBe("post1");
        expect(response.body.answers[1].post.title).toBe("title1");
      });
      it("回答から回答者のデータを取得できる", async () => {
        const response = await request(server).get("/answers/user/userId3/1");

        expect(response.body.answers[0].user.id).toBe("userId3");
        expect(response.body.answers[0].user.username).toBe("user3");
        expect(response.body.answers[0].user.icon_url).toBe("userIcon3");
      });
    });
  });

  describe("GET /answers/liked/answer/:id/:page のテスト", () => {
    describe("正常系", () => {
      it("ユーザーがいいねした回答を正常に取得できる", async () => {
        const response = await request(server).get(
          "/answers/liked/answer/userId2/1"
        );

        const answer1CreatedAt = new Date(2021, 1, 10, 0, 0, 0);
        const answer2CreatedAt = new Date(2021, 1, 20, 0, 0, 0);

        expect(response.statusCode).toBe(200);
        expect(response.body.total).toBe(1);
        expect(response.body.answers).toHaveLength(2);
        expect(response.body.answers[0].id).toBe("answerId2");
        expect(response.body.answers[0].content).toBe("content2");
        expect(response.body.answers[0].evaluation).toBe(1);
        expect(response.body.answers[0].createdAt).toBe(
          answer2CreatedAt.toISOString()
        );
        expect(response.body.answers[1].id).toBe("answerId1");
        expect(response.body.answers[1].content).toBe("content1");
        expect(response.body.answers[1].evaluation).toBe(0);
        expect(response.body.answers[1].createdAt).toBe(
          answer1CreatedAt.toISOString()
        );
      });
      it("いいねした回答から投稿のデータを取得できる", async () => {
        const response = await request(server).get(
          "/answers/liked/answer/userId2/1"
        );

        expect(response.body.answers[0].post.id).toBe("post2");
        expect(response.body.answers[0].post.title).toBe("title2");
        expect(response.body.answers[1].post.id).toBe("post1");
        expect(response.body.answers[1].post.title).toBe("title1");
      });
      it("いいねした回答の回答者のデータを取得できる", async () => {
        const response = await request(server).get(
          "/answers/liked/answer/userId2/1"
        );

        expect(response.body.answers[0].user.id).toBe("userId3");
        expect(response.body.answers[0].user.username).toBe("user3");
        expect(response.body.answers[0].user.icon_url).toBe("userIcon3");
        expect(response.body.answers[1].user.id).toBe("userId2");
        expect(response.body.answers[1].user.username).toBe("user2");
        expect(response.body.answers[1].user.icon_url).toBe("userIcon2");
      });
    });
  });

  describe("POST /answers/create のテスト", () => {
    describe("正常系", () => {
      it("回答を正常に作成できる", async () => {
        const params = {
          id: "createAnswerId",
          content: "createAnswer",
          evaluation: 2,
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
        expect(answerData[0].evaluation).toBe(2);
        expect(answerData[0].questionId).toBe("post1");
        expect(answerData[0].respondentId).toBe("userId1");
      });
    });
    describe("異常系", () => {
      it("ユーザーが同じ投稿に2度目の回答をした場合に403エラーが発生する", async () => {
        const params = {
          content: "createAnswerErrorVer",
          questionId: "post1",
          respondentId: "userId1",
        };
        const response = await request(server)
          .post("/answers/create")
          .send(params);
        expect(response.status).toBe(403);
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
        expect(actualPostResponse.body.answers[0].likedBy).toHaveLength(2);
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
        expect(actualPostResponse.body.answers[0].likedBy).toHaveLength(1);
        expect(actualPostResponse.body.answers[0].likedBy[0].id).toBe(
          "userId2"
        );
      });
    });
  });
});
