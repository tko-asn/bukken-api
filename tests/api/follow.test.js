const request = require("supertest");
const server = require("../../app");
const db = require("../../models/index");

const userData = [
  {
    id: "userId1",
    username: "user1",
    email: "email1",
    password: "passwd1",
    icon_url: "userIcon1",
  },
  {
    id: "userId2",
    username: "user2",
    email: "email2",
    password: "passwd2",
    icon_url: "userIcon2",
  },
];

describe("followAPIのテスト", () => {
  beforeAll(async () => {
    await db.user.bulkCreate(userData);
  });

  afterAll(async () => {
    await db.user.destroy({ where: {} });
  });

  describe("POST /follows/create のテスト", () => {
    describe("正常系", () => {
      it("フォローデータを正常に作成できる", async () => {
        const params = {
          id: "followId1",
          userId: "userId1",
          followId: "userId2",
        };

        const response = await request(server)
          .post("/follows/create")
          .send(params);

        expect(response.statusCode).toBe(201);
        
        const actualFollowData = await db.follow.findAll();

        expect(actualFollowData).toHaveLength(1);
        expect(actualFollowData[0].id).toBe("followId1");
        expect(actualFollowData[0].userId).toBe("userId1");
        expect(actualFollowData[0].followId).toBe("userId2");
      });
    });
    describe("異常系", () => {
      it("空の値が入力されるとエラーが発生する", async () => {
        const response = await request(server).post("/follows/create").send({});

        expect(response.statusCode).toBe(500);
      });
    });
  });

  describe("DELETE /follows/delete/:followId/:userId のテスト", () => {
    describe("正常系", () => {
      it("フォローデータを正常に削除できる", async () => {
        const response = await request(server).delete(
          "/follows/delete/userId2/userId1"
        );
        expect(response.statusCode).toBe(200);

        const actualFollowData = await db.follow.findAll();
        expect(actualFollowData).toHaveLength(0);
      });
    });
  });
});
