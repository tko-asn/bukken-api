const request = require("supertest");
const server = require("../../app");
const db = require("../../models/index");
const bcrypt = require("bcrypt");

const userData = {
  id: "userId1",
  username: "user1",
  email: "email1",
  password: bcrypt.hashSync("passwd1", 10),
  icon_url: "userIcon1",
  self_introduction: "selfIntroduction1",
};
const loginParams = {
  username: "user1",
  password: "passwd1",
};

describe("authAPIのテスト", () => {
  beforeAll(async () => {
    await db.user.create(userData);
  });

  afterAll(async () => {
    await db.user.destroy({ where: {} });
  });

  describe("POST /auth/login のテスト", () => {
    describe("正常系", () => {
      it("正常にログインできてユーザーのデータが返される", async () => {
        const response = await request(server)
          .post("/auth/login")
          .send(loginParams);

        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeTruthy();
        expect(response.body.id).toBe(userData.id);
        expect(response.body.username).toBe(userData.username);
        expect(response.body.email).toBe(userData.email);
        expect(response.body.self_introduction).toBe(
          userData.self_introduction
        );
        expect(response.body.icon_url).toBe(userData.icon_url);
      });
    });
  });
  describe("異常系", () => {
    it("認証情報が不正な場合401認証エラーが発生する", async () => {
      const params = {
        username: "invalidUsername",
        password: "invalidPassword",
      };
      const response = await request(server).post("/auth/login").send(params);

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });
  });

  describe("GET /auth/verify", () => {
    describe("正常系", () => {
      it("トークンの検証が成功した場合ユーザーのデータが返される", async () => {
        const { body } = await request(server)
          .post("/auth/login")
          .send(loginParams);

        const response = await request(server)
          .get("/auth/verify")
          .set("Authorization", "Bearer " + body.token);

        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(userData.id);
        expect(response.body.username).toBe(userData.username);
        expect(response.body.email).toBe(userData.email);
        expect(response.body.self_introduction).toBe(
          userData.self_introduction
        );
        expect(response.body.icon_url).toBe(userData.icon_url);
      });
    });
    describe("異常系", () => {
      it("トークンの検証が失敗したとき401認証エラーが発生する", async () => {
        const token = "invalidToken";
        const response = await request(server)
          .get("/auth/verify")
          .set("Authorization", "Bearer " + token);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
      });
    });
  });
});
