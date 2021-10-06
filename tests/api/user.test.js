const request = require("supertest");
const server = require("../../app");
const db = require("../../models/index");
const bcrypt = require("bcrypt");

const userData = [
  {
    id: "userId1",
    username: "user1",
    email: "email1",
    password: "passwd1",
    self_introduction: "selfIntroduction1",
    icon_url: "userIcon1",
    updatedAt: new Date(2021, 1, 1, 0, 0, 0),
  },
  {
    id: "userId2",
    username: "user2",
    email: "email2",
    password: "passwd2",
    self_introduction: "selfIntroduction2",
    icon_url: "userIcon2",
    updatedAt: new Date(2021, 1, 2, 0, 0, 0),
  },
];
const postData = [
  {
    id: "postId1",
    title: "test-post1",
    property: "test-property1",
    text: "text1",
    authorId: "userId1",
    addressId: "addressId1",
    updatedAt: new Date(2021, 1, 1, 0, 0, 0),
  },
  {
    id: "postId2",
    title: "test-post2",
    property: "test-property2",
    text: "text2",
    authorId: "userId1",
    addressId: "addressId1",
    updatedAt: new Date(2021, 2, 1, 0, 0, 0),
  },
];
const answerData = [
  {
    id: "answerId1",
    content: "answer1",
    questionId: "postId1",
    respondentId: "userId1",
    updatedAt: new Date(2021, 1, 10, 0, 0, 0),
  },
  {
    id: "answerId2",
    content: "answer2",
    questionId: "postId2",
    respondentId: "userId1",
    updatedAt: new Date(2021, 2, 10, 0, 0, 0),
  },
];

describe("userAPIのテスト", () => {
  beforeAll(async () => {
    await db.user.bulkCreate(userData);
    await db.post.bulkCreate(postData);
    await db.answer.bulkCreate(answerData);
  });

  afterAll(async () => {
    await db.answer.destroy({ where: {} });
    await db.post.destroy({ where: {} });
    await db.user.destroy({ where: {} });
  });

  describe("GET /users/ のテスト", () => {
    describe("正常系", () => {
      it("ユーザーのリストを正常に取得できる", async () => {
        const response = await request(server).get("/users/");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(response.body[0].id).toBe("userId2");
        expect(response.body[0].username).toBe("user2");
        expect(response.body[0].self_introduction).toBe("selfIntroduction2");
        expect(response.body[0].icon_url).toBe("userIcon2");
        expect(response.body[1].id).toBe("userId1");
        expect(response.body[1].username).toBe("user1");
        expect(response.body[1].self_introduction).toBe("selfIntroduction1");
        expect(response.body[1].icon_url).toBe("userIcon1");
      });
    });
  });

  describe("GET /users/:userId のテスト", () => {
    describe("正常系", () => {
      it("ユーザーのデータを正常に取得できる", async () => {
        const response = await request(server).get("/users/userId1");

        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe("userId1");
        expect(response.body.username).toBe("user1");
        expect(response.body.self_introduction).toBe("selfIntroduction1");
        expect(response.body.icon_url).toBe("userIcon1");
      });
      it("ユーザーの回答のデータを一緒に取得できる", async () => {
        const answer1DateTime = new Date(2021, 1, 10, 0, 0, 0);
        const answer2DateTime = new Date(2021, 2, 10, 0, 0, 0);
        const response = await request(server).get("/users/userId1");

        expect(response.body.answers).toHaveLength(2);
        expect(response.body.answers[0].id).toBe(answerData[1].id);
        expect(response.body.answers[0].content).toBe(answerData[1].content);
        expect(response.body.answers[0].updatedAt).toBe(
          answer2DateTime.toISOString()
        );
        expect(response.body.answers[1].id).toBe(answerData[0].id);
        expect(response.body.answers[1].content).toBe(answerData[0].content);
        expect(response.body.answers[1].updatedAt).toBe(
          answer1DateTime.toISOString()
        );
      });
      it("取得した回答のデータから投稿のデータを取得できる", async () => {
        const response = await request(server).get("/users/userId1");

        expect(response.body.answers[0].post.id).toBe("postId2");
        expect(response.body.answers[0].post.title).toBe("test-post2");
        expect(response.body.answers[0].post.property).toBe("test-property2");
        expect(response.body.answers[1].post.id).toBe("postId1");
        expect(response.body.answers[1].post.title).toBe("test-post1");
        expect(response.body.answers[1].post.property).toBe("test-property1");
      });
    });
    describe("異常系", () => {
      it("存在しないユーザーのidを指定すると404エラーが発生する", async () => {
        const response = await request(server).get("/users/userId100");

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Not found");
      });
    });
  });

  describe("POST /users/register のテスト", () => {
    describe("正常系", () => {
      it("ユーザーを正常に作成できる", async () => {
        const params = {
          id: "newUserId",
          username: "newUser",
          email: "newUserEmail",
          password: "newUserPassword",
        };
        const response = await request(server)
          .post("/users/register")
          .send(params);

        expect(response.statusCode).toBe(201);

        const actualUserData = await db.user.findByPk(params.id);
        expect(actualUserData.id).toBe(params.id);
        expect(actualUserData.username).toBe(params.username);
        expect(actualUserData.email).toBe(params.email);
        expect(
          bcrypt.compareSync(params.password, actualUserData.password)
        ).toBe(true);
      });
    });
  });

  describe("PATCH /users/change/:userId のテスト", () => {
    describe("正常系", () => {
      it("メールアドレスを正常に更新できる", async () => {
        const params = { email: "updatedEmail" };
        const response = await request(server)
          .patch("/users/change/newUserId")
          .send(params);

        expect(response.statusCode).toBe(200);

        const actualUserData = await db.user.findByPk("newUserId");
        expect(actualUserData.email).toBe(params.email);
      });
      it("パスワードを正常に更新できる", async () => {
        const params = {
          newPassword: "updatedPassword",
          currentPassword: "newUserPassword",
        };
        const response = await request(server)
          .patch("/users/change/newUserId")
          .send(params);

        expect(response.statusCode).toBe(200);

        const actualUserData = await db.user.findByPk("newUserId");
        expect(
          bcrypt.compareSync(params.newPassword, actualUserData.password)
        ).toBe(true);
      });
    });
    describe("異常系", () => {
      it("現在のパスワードの確認に失敗した場合に400バリデーションエラーが発生する", async () => {
        const params = {
          newPassword: "notNewPassword",
          currentPassword: "notCurrentPassword",
        };
        const response = await request(server)
          .patch("/users/change/newUserId")
          .send(params);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid current password");
      });
    });
  });

  describe("DELETE /users/delete/:userId のテスト", () => {
    describe("正常系", () => {
      it("ユーザーを正常に削除できる", async () => {
        const response = await request(server).delete(
          "/users/delete/newUserId"
        );

        expect(response.statusCode).toBe(200);

        const actualUserData = await request(server).get("/users/newUserId");
        expect(actualUserData.statusCode).toBe(404);
        expect(actualUserData.body.message).toBe("Not found");
      });
    });
  });

  describe("PATCH /users/profile/:userId/edit/noicon のテスト", () => {
    describe("正常系", () => {
      it("ユーザーのプロフィールを正常に編集できる（アイコン画像なし）", async () => {
        const params = {
          username: "newUser2",
          self_introduction: "newSelfIntroduction2",
        };
        const response = await request(server)
          .patch("/users/profile/userId2/edit/noicon")
          .send(params);

        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual(params);

        const actualUserData = await request(server).get("/users/userId2");
        expect(actualUserData.body.username).toBe(params.username);
        expect(actualUserData.body.self_introduction).toBe(
          params.self_introduction
        );
      });
    });
  });
});
