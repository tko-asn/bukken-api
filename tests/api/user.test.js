const request = require("supertest");
const server = require("../../app");
const db = require("../../models/index");
const bcryptjs = require("bcryptjs");

const userData = [
  {
    id: "userId1",
    username: "user1",
    email: "email1",
    password: "passwd1",
    self_introduction: "selfIntroduction1",
    icon_url: "userIcon1",
    createdAt: new Date(2021, 1, 1, 0, 0, 0),
    updatedAt: new Date(2021, 1, 1, 0, 0, 0),
  },
  {
    id: "userId2",
    username: "user2",
    email: "email2",
    password: "passwd2",
    self_introduction: "selfIntroduction2",
    icon_url: "userIcon2",
    createdAt: new Date(2021, 1, 2, 0, 0, 0),
    updatedAt: new Date(2021, 1, 2, 0, 0, 0),
  },
  {
    id: "userId3",
    username: "user3",
    email: "email3",
    password: "passwd3",
    self_introduction: "selfIntroduction3",
    icon_url: "userIcon3",
    createdAt: new Date(2021, 1, 3, 0, 0, 0),
    updatedAt: new Date(2021, 1, 3, 0, 0, 0),
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
    evaluation: 0,
    questionId: "postId1",
    respondentId: "userId1",
    createdAt: new Date(2021, 1, 5, 0, 0, 0),
    updatedAt: new Date(2021, 1, 10, 0, 0, 0),
  },
  {
    id: "answerId2",
    content: "answer2",
    evaluation: 1,
    questionId: "postId2",
    respondentId: "userId1",
    createdAt: new Date(2021, 2, 5, 0, 0, 0),
    updatedAt: new Date(2021, 2, 10, 0, 0, 0),
  },
];
const followData = [
  {
    id: "followId1",
    followId: "userId1",
    userId: "userId2",
  },
  {
    id: "followId2",
    followId: "userId2",
    userId: "userId1",
  },
  {
    id: "followId3",
    followId: "userId3",
    userId: "userId1",
  },
];

describe("userAPI????????????", () => {
  beforeAll(async () => {
    await db.user.bulkCreate(userData);
    await db.post.bulkCreate(postData);
    await db.answer.bulkCreate(answerData);
    await db.follow.bulkCreate(followData);
  });

  afterAll(async () => {
    await db.follow.destroy({ where: {} });
    await db.answer.destroy({ where: {} });
    await db.post.destroy({ where: {} });
    await db.user.destroy({ where: {} });
  });

  describe("GET /users/ ????????????", () => {
    describe("?????????", () => {
      it("???????????????????????????????????????????????????", async () => {
        const response = await request(server).get("/users/");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(3);
        expect(response.body[0].id).toBe("userId3");
        expect(response.body[0].username).toBe("user3");
        expect(response.body[0].self_introduction).toBe("selfIntroduction3");
        expect(response.body[0].icon_url).toBe("userIcon3");
        expect(response.body[1].id).toBe("userId2");
        expect(response.body[1].username).toBe("user2");
        expect(response.body[1].self_introduction).toBe("selfIntroduction2");
        expect(response.body[1].icon_url).toBe("userIcon2");
        expect(response.body[2].id).toBe("userId1");
        expect(response.body[2].username).toBe("user1");
        expect(response.body[2].self_introduction).toBe("selfIntroduction1");
        expect(response.body[2].icon_url).toBe("userIcon1");
      });
    });
  });

  describe("GET /follow/id/list/:userId ????????????", () => {
    describe("?????????", () => {
      it("???????????????????????????????????????id???????????????????????????????????????", async () => {
        const user1Follows = await request(server).get(
          "/users/follow/id/list/userId1"
        );
        const user2Follows = await request(server).get(
          "/users/follow/id/list/userId2"
        );

        expect(user1Follows.statusCode).toBe(200);
        expect(user1Follows.body).toHaveLength(2);
        expect(user1Follows.body[0].id).toBe("userId3");
        expect(user1Follows.body[1].id).toBe("userId2");

        expect(user2Follows.statusCode).toBe(200);
        expect(user2Follows.body).toHaveLength(1);
        expect(user2Follows.body[0].id).toBe("userId1");
      });
    });
  });

  describe("GET /follow/:userId/:page ????????????", () => {
    describe("?????????", () => {
      it("?????????????????????????????????????????????????????????????????????????????????", async () => {
        const user1Follows = await request(server).get(
          "/users/follow/userId1/1"
        );
        const user2Follows = await request(server).get(
          "/users/follow/userId2/1"
        );

        expect(user1Follows.statusCode).toBe(200);
        expect(user1Follows.body.total).toBe(1);
        expect(user1Follows.body.users).toHaveLength(2);
        expect(user1Follows.body.users[0].id).toBe("userId3");
        expect(user1Follows.body.users[0].username).toBe("user3");
        expect(user1Follows.body.users[0].icon_url).toBe("userIcon3");
        expect(user1Follows.body.users[1].id).toBe("userId2");
        expect(user1Follows.body.users[1].username).toBe("user2");
        expect(user1Follows.body.users[1].icon_url).toBe("userIcon2");

        expect(user2Follows.statusCode).toBe(200);
        expect(user2Follows.body.total).toBe(1);
        expect(user2Follows.body.users).toHaveLength(1);
        expect(user2Follows.body.users[0].id).toBe("userId1");
        expect(user2Follows.body.users[0].username).toBe("user1");
        expect(user2Follows.body.users[0].icon_url).toBe("userIcon1");
      });
    });
  });

  describe("GET /follower/:userId/:page ????????????", () => {
    describe("?????????", () => {
      it("?????????????????????????????????????????????????????????????????????????????????", async () => {
        const user1Followers = await request(server).get(
          "/users/follower/userId1/1"
        );
        const user2Followers = await request(server).get(
          "/users/follower/userId2/1"
        );
        const user3Followers = await request(server).get(
          "/users/follower/userId3/1"
        );

        expect(user1Followers.statusCode).toBe(200);
        expect(user1Followers.body.total).toBe(1);
        expect(user1Followers.body.users).toHaveLength(1);
        expect(user1Followers.body.users[0].id).toBe("userId2");
        expect(user1Followers.body.users[0].username).toBe("user2");
        expect(user1Followers.body.users[0].icon_url).toBe("userIcon2");

        expect(user2Followers.statusCode).toBe(200);
        expect(user2Followers.body.total).toBe(1);
        expect(user2Followers.body.users).toHaveLength(1);
        expect(user2Followers.body.users[0].id).toBe("userId1");
        expect(user2Followers.body.users[0].username).toBe("user1");
        expect(user2Followers.body.users[0].icon_url).toBe("userIcon1");

        expect(user3Followers.statusCode).toBe(200);
        expect(user3Followers.body.total).toBe(1);
        expect(user3Followers.body.users).toHaveLength(1);
        expect(user3Followers.body.users[0].id).toBe("userId1");
        expect(user3Followers.body.users[0].username).toBe("user1");
        expect(user3Followers.body.users[0].icon_url).toBe("userIcon1");
      });
    });
  });

  describe("GET /users/:userId ????????????", () => {
    describe("?????????", () => {
      it("???????????????????????????????????????????????????", async () => {
        const response = await request(server).get("/users/userId1");

        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe("userId1");
        expect(response.body.username).toBe("user1");
        expect(response.body.self_introduction).toBe("selfIntroduction1");
        expect(response.body.icon_url).toBe("userIcon1");
      });
      it("????????????????????????????????????????????????????????????", async () => {
        const answer1CreatedAt = new Date(2021, 1, 5, 0, 0, 0);
        const answer2CreatedAt = new Date(2021, 2, 5, 0, 0, 0);
        const answer1UpdatedAt = new Date(2021, 1, 10, 0, 0, 0);
        const answer2UpdatedAt = new Date(2021, 2, 10, 0, 0, 0);
        const response = await request(server).get("/users/userId1");

        expect(response.body.answers).toHaveLength(2);
        expect(response.body.answers[0].id).toBe(answerData[1].id);
        expect(response.body.answers[0].content).toBe(answerData[1].content);
        expect(response.body.answers[0].evaluation).toBe(
          answerData[1].evaluation
        );
        expect(response.body.answers[0].createdAt).toBe(
          answer2CreatedAt.toISOString()
        );
        expect(response.body.answers[0].updatedAt).toBe(
          answer2UpdatedAt.toISOString()
        );
        expect(response.body.answers[1].id).toBe(answerData[0].id);
        expect(response.body.answers[1].content).toBe(answerData[0].content);
        expect(response.body.answers[1].evaluation).toBe(
          answerData[0].evaluation
        );
        expect(response.body.answers[1].createdAt).toBe(
          answer1CreatedAt.toISOString()
        );
        expect(response.body.answers[1].updatedAt).toBe(
          answer1UpdatedAt.toISOString()
        );
      });
      it("????????????????????????????????????????????????????????????????????????", async () => {
        const response = await request(server).get("/users/userId1");

        expect(response.body.answers[0].post.id).toBe("postId2");
        expect(response.body.answers[0].post.title).toBe("test-post2");
        expect(response.body.answers[0].post.property).toBe("test-property2");
        expect(response.body.answers[1].post.id).toBe("postId1");
        expect(response.body.answers[1].post.title).toBe("test-post1");
        expect(response.body.answers[1].post.property).toBe("test-property1");
      });
    });
    describe("?????????", () => {
      it("??????????????????????????????id??????????????????404????????????????????????", async () => {
        const response = await request(server).get("/users/userId100");

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Not found");
      });
    });
  });

  describe("POST /users/register ????????????", () => {
    describe("?????????", () => {
      it("???????????????????????????????????????", async () => {
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
          bcryptjs.compareSync(params.password, actualUserData.password)
        ).toBe(true);
      });
    });
  });

  describe("PATCH /users/change/:userId ????????????", () => {
    describe("?????????", () => {
      it("????????????????????????????????????????????????", async () => {
        const params = { email: "updatedEmail" };
        const response = await request(server)
          .patch("/users/change/newUserId")
          .send(params);

        expect(response.statusCode).toBe(200);

        const actualUserData = await db.user.findByPk("newUserId");
        expect(actualUserData.email).toBe(params.email);
      });
      it("??????????????????????????????????????????", async () => {
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
          bcryptjs.compareSync(params.newPassword, actualUserData.password)
        ).toBe(true);
      });
    });
    describe("?????????", () => {
      it("?????????????????????????????????????????????????????????400?????????????????????????????????????????????", async () => {
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

  describe("DELETE /users/delete/:userId ????????????", () => {
    describe("?????????", () => {
      it("???????????????????????????????????????", async () => {
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

  describe("PATCH /users/profile/:userId/edit/noicon ????????????", () => {
    describe("?????????", () => {
      it("??????????????????????????????????????????????????????????????????????????????????????????", async () => {
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
