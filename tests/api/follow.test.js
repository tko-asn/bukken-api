const request = require("supertest");
const server = require("../../app");
const db = require("../../models/index");

const followData = [
  {
    id: "followId1",
    user: {
      id: "userId1",
      username: "user1",
      icon_url: "userIcon1",
    },
    follow: {
      id: "userId2",
      username: "user2",
      icon_url: "userIcon2",
    },
    updatedAt: new Date(2020, 1, 1, 0, 0, 0),
  },
  {
    id: "followId2",
    user: {
      id: "userId2",
      username: "user2",
      icon_url: "userIcon2",
    },
    follow: {
      id: "userId1",
      username: "user1",
      icon_url: "userIcon1",
    },
    updatedAt: new Date(2020, 1, 2, 0, 0, 0),
  },
  {
    id: "followId3",
    user: {
      id: "userId1",
      username: "user1",
      icon_url: "userIcon1",
    },
    follow: {
      id: "userId3",
      username: "user3",
      icon_url: "userIcon3",
    },
    updatedAt: new Date(2020, 1, 3, 0, 0, 0),
  },
  {
    id: "followId4",
    user: {
      id: "userId3",
      username: "user3",
      icon_url: "userIcon3",
    },
    follow: {
      id: "userId2",
      username: "user2",
      icon_url: "userIcon2",
    },
    updatedAt: new Date(2020, 1, 4, 0, 0, 0),
  },
];
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
  {
    id: "userId3",
    username: "user3",
    email: "email3",
    password: "passwd3",
    icon_url: "userIcon3",
  },
];

describe("followAPIのテスト", () => {
  beforeAll(async () => {
    await db.follow.bulkCreate(followData);
    await db.user.bulkCreate(userData);
  });

  afterAll(async () => {
    await db.user.destroy({ where: {} });
    await db.follow.destroy({ where: {} });
  });

  describe("GET /follows/follow/:userId のテスト", () => {
    describe("正常系", () => {
      it("ユーザーのフォローしているユーザーのリストを正常に取得できる", async () => {
        const response = await request(server).get("/follows/follow/userId1");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(response.body[0].id).toBe(followData[0].id);
        expect(response.body[0].follow).toStrictEqual(followData[0].follow);
        expect(response.body[1].id).toBe(followData[2].id);
        expect(response.body[1].follow).toStrictEqual(followData[2].follow);
      });
    });
  });

  describe("GET /follows/follower/:followId のテスト", () => {
    describe("正常系", () => {
      it("ユーザーのフォロワーのリストを正常に取得できる", async () => {
        const response = await request(server).get("/follows/follower/userId2");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(response.body[0].id).toBe(followData[0].id);
        expect(response.body[0].user).toStrictEqual(followData[0].user);
        expect(response.body[1].id).toBe(followData[3].id);
        expect(response.body[1].user).toStrictEqual(followData[3].user);
      });
    });
  });

  describe("GET /follows/create のテスト", () => {
    describe("正常系", () => {
      it("フォローデータを正常に作成できる", async () => {
        const params = {
          id: "followId5",
          user: {
            id: "userId2",
            username: "user2",
            icon_url: "userIcon2",
          },
          follow: {
            id: "userId3",
            username: "user3",
            icon_url: "userIcon3",
          },
        };
        const response = await request(server)
          .post("/follows/create")
          .send(params);

        expect(response.statusCode).toBe(201);
        expect(response.body.followId).toBe("followId5");
      });
    });
    describe("異常系", () => {
      it("空の値が入力されるとエラーが発生する", async () => {
        const response = await request(server).post("/follows/create").send({});

        expect(response.statusCode).toBe(500);
      });
    });
  });

  describe("DELETE /follows/delete/:followId のテスト", () => {
    describe("正常系", () => {
      it("フォローデータを正常に削除できる", async () => {
        const response = await request(server).delete(
          "/follows/delete/followId5"
        );
        expect(response.statusCode).toBe(200);

        const actualFollowData = await request(server).get(
          "/follows/follow/userId2"
        );
        expect(actualFollowData.body).toHaveLength(1);
        expect(actualFollowData.body[0].id).toBe("followId2");
      });
    });
  });
});
