const request = require("supertest");
const server = require("../../app");
const db = require("../../models/index");
const qs = require("qs");

const postData = [
  {
    id: "postId1",
    title: "test-post1",
    property: "test-property1",
    text: "text1",
    authorId: "userId1",
    addressId: "addressId1",
    updatedAt: new Date(2021, 1, 1, 0, 0, 0),
    createdAt: new Date(2020, 1, 1, 0, 0, 0),
  },
  {
    id: "postId2",
    title: "test-post2",
    property: "test-property2",
    text: "text2",
    authorId: "userId1",
    addressId: "addressId1",
    updatedAt: new Date(2021, 2, 1, 0, 0, 0),
    createdAt: new Date(2020, 2, 1, 0, 0, 0),
  },
  {
    id: "postId3",
    title: "test-post3",
    property: "test-property3",
    text: "text3",
    authorId: "userId1",
    addressId: "addressId1",
    updatedAt: new Date(2021, 3, 1, 0, 0, 0),
    createdAt: new Date(2020, 3, 1, 0, 0, 0),
  },
  {
    id: "postId4",
    title: "test-post4",
    property: "test-property4",
    text: "text4",
    authorId: "userId1",
    addressId: "addressId1",
    updatedAt: new Date(2021, 4, 1, 0, 0, 0),
    createdAt: new Date(2020, 4, 1, 0, 0, 0),
  },
  {
    id: "postId5",
    title: "test-post5",
    property: "test-property5",
    text: "text5",
    authorId: "userId1",
    addressId: "addressId1",
    updatedAt: new Date(2021, 5, 1, 0, 0, 0),
    createdAt: new Date(2020, 5, 1, 0, 0, 0),
  },
  {
    id: "postId6",
    title: "test-post6",
    property: "test-property6",
    text: "text6",
    authorId: "userId1",
    addressId: "addressId1",
    updatedAt: new Date(2021, 6, 1, 0, 0, 0),
    createdAt: new Date(2020, 6, 1, 0, 0, 0),
  },
  {
    id: "postId7",
    title: "test-post7",
    property: "test-property7",
    text: "text7",
    authorId: "userId1",
    addressId: "addressId1",
    updatedAt: new Date(2021, 7, 1, 0, 0, 0),
    createdAt: new Date(2020, 7, 1, 0, 0, 0),
  },
  {
    id: "postId8",
    title: "test-post8",
    property: "test-property8",
    text: "text8",
    authorId: "userId2",
    addressId: "addressId2",
    updatedAt: new Date(2021, 8, 1, 0, 0, 0),
    createdAt: new Date(2020, 8, 1, 0, 0, 0),
  },
  {
    id: "postId9",
    title: "test-post9",
    property: "test-property9",
    text: "text9",
    authorId: "userId2",
    addressId: "addressId2",
    updatedAt: new Date(2021, 9, 1, 0, 0, 0),
    createdAt: new Date(2020, 9, 1, 0, 0, 0),
  },
  {
    id: "postId10",
    title: "test-post10",
    property: "test-property10",
    text: "text10",
    authorId: "userId2",
    addressId: "addressId2",
    updatedAt: new Date(2021, 10, 1, 0, 0, 0),
    createdAt: new Date(2020, 10, 1, 0, 0, 0),
  },
  {
    id: "postId11",
    title: "test-post11",
    property: "test-property11",
    text: "text11",
    authorId: "userId2",
    addressId: "addressId2",
    updatedAt: new Date(2021, 11, 1, 0, 0, 0),
    createdAt: new Date(2020, 11, 1, 0, 0, 0),
  },
  {
    id: "postId12",
    title: "test-post12",
    property: "test-property12",
    text: "text12",
    authorId: "userId2",
    addressId: "addressId2",
    updatedAt: new Date(2021, 12, 1, 0, 0, 0),
    createdAt: new Date(2020, 12, 1, 0, 0, 0),
  },
];
const addressData = [
  {
    id: "addressId1",
    postalCode: "1111111",
    prefecture: "prefecture1",
    municipality: "municipality1",
    townName: "town1",
    buildingName: "building1",
  },
  {
    id: "addressId2",
    postalCode: "2222222",
    prefecture: "prefecture2",
    municipality: "municipality2",
    townName: "town2",
    buildingName: "building2",
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
];
const categoryData = [
  {
    id: "categoryId1",
    firstCategory: "test-fc1",
    secondCategory: "test-sc1",
    updatedAt: new Date(2021, 1, 1, 0, 0, 0),
  },
  {
    id: "categoryId2",
    firstCategory: "test-fc2",
    secondCategory: "test-sc2",
    updatedAt: new Date(2021, 1, 2, 0, 0, 0),
  },
];
const postCategoryData = [
  {
    postId: "postId12",
    categoryId: "categoryId1",
  },
  {
    postId: "postId12",
    categoryId: "categoryId2",
  },
];
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
  },
];
const answerData = [
  {
    id: "answerId1",
    content: "answer1",
    questionId: "postId12",
    respondentId: "userId1",
    updatedAt: new Date(2021, 12, 10, 0, 0, 0),
    createdAt: new Date(2020, 12, 10, 0, 0, 0),
  },
  {
    id: "answerId2",
    content: "answer2",
    questionId: "postId12",
    respondentId: "userId1",
    updatedAt: new Date(2021, 12, 11, 0, 0, 0),
    createdAt: new Date(2020, 12, 11, 0, 0, 0),
  },
];
const userAnswerData = [
  {
    userId: "userId2",
    answerId: "answerId1",
  },
  {
    userId: "userId2",
    answerId: "answerId2",
  },
];
const userPostData = [
  {
    userId: "userId2",
    postId: "postId11",
  },
  {
    userId: "userId2",
    postId: "postId12",
  },
];
const commentData = [
  {
    id: "commentId1",
    content: "comment1",
    answerId: "answerId1",
    authorId: "userId2",
    createdAt: new Date(2021, 12, 11, 0, 0, 0),
  },
  {
    id: "commentId2",
    content: "comment2",
    answerId: "answerId1",
    authorId: "userId1",
    createdAt: new Date(2021, 12, 12, 0, 0, 0),
  },
  {
    id: "commentId3",
    content: "comment3",
    answerId: "answerId1",
    authorId: "userId1",
    createdAt: new Date(2021, 12, 10, 0, 0, 0),
  },
];

describe("postAPIのテスト", () => {
  beforeAll(async () => {
    await db.address.bulkCreate(addressData);
    await db.user.bulkCreate(userData);
    await db.post.bulkCreate(postData);
    await db.category.bulkCreate(categoryData);
    await db.PostCategory.bulkCreate(postCategoryData);
    await db.follow.bulkCreate(followData);
    await db.answer.bulkCreate(answerData);
    await db.UserAnswer.bulkCreate(userAnswerData);
    await db.UserPost.bulkCreate(userPostData);
    await db.comment.bulkCreate(commentData);
  });

  afterAll(async () => {
    const option = { where: {} };
    await db.comment.destroy(option);
    await db.post.destroy(option);
    await db.address.destroy(option);
    await db.user.destroy(option);
    await db.category.destroy(option);
    await db.PostCategory.destroy(option);
    await db.answer.destroy(option);
    await db.UserAnswer.destroy(option);
    await db.UserPost.destroy(option);
    await db.follow.destroy(option);
  });

  describe("GET /posts/page/:page のテスト", () => {
    describe("正常系", () => {
      it("ステータスコードが200", async () => {
        const response = await request(server).get("/posts/page/1");
        expect(response.statusCode).toBe(200);
      });
      it("投稿モデルのカラムが取得できている", async () => {
        const expectedDateTime = new Date(2021, 12, 1, 0, 0, 0);
        const response = await request(server).get("/posts/page/1");
        expect(response.body.posts[0].id).toBe("postId12");
        expect(response.body.posts[0].title).toBe("test-post12");
        expect(response.body.posts[0].property).toBe("test-property12");
        expect(response.body.posts[0].text).toBe("text12");
        expect(response.body.posts[0].updatedAt).toBe(
          expectedDateTime.toISOString()
        );
      });
      it("1ページ目の10件が取得できている", async () => {
        const response = await request(server).get("/posts/page/1");
        expect(response.body.posts).toHaveLength(10);
      });
      it("2ページ目の2件が取得できている", async () => {
        const response = await request(server).get("/posts/page/2");
        expect(response.body.posts).toHaveLength(2);
      });
      it("トータルのページ数が正しい", async () => {
        const response = await request(server).get("/posts/page/1");
        expect(response.body.total).toBe(2);
      });
      it("投稿がcreatedAtの降順でソートされている", async () => {
        const [firstResponse, secondResponse] = await Promise.all([
          request(server).get("/posts/page/1"),
          request(server).get("/posts/page/2"),
        ]);
        // 1ページ目の投稿
        expect(firstResponse.body.posts[0].id).toBe(postData[11].id);
        expect(firstResponse.body.posts[1].id).toBe(postData[10].id);
        expect(firstResponse.body.posts[2].id).toBe(postData[9].id);
        expect(firstResponse.body.posts[3].id).toBe(postData[8].id);
        expect(firstResponse.body.posts[4].id).toBe(postData[7].id);
        expect(firstResponse.body.posts[5].id).toBe(postData[6].id);
        expect(firstResponse.body.posts[6].id).toBe(postData[5].id);
        expect(firstResponse.body.posts[7].id).toBe(postData[4].id);
        expect(firstResponse.body.posts[8].id).toBe(postData[3].id);
        expect(firstResponse.body.posts[9].id).toBe(postData[2].id);

        // 2ページ目の投稿
        expect(secondResponse.body.posts[0].id).toBe(postData[1].id);
        expect(secondResponse.body.posts[1].id).toBe(postData[0].id);
      });
      it("投稿者のデータを一緒に取得できる", async () => {
        const response = await request(server).get("/posts/page/1");
        expect(response.body.posts[0].user.id).toBe("userId2");
        expect(response.body.posts[0].user.username).toBe("user2");
        expect(response.body.posts[0].user.icon_url).toBe("userIcon2");

        expect(response.body.posts[9].user.id).toBe("userId1");
        expect(response.body.posts[9].user.username).toBe("user1");
        expect(response.body.posts[9].user.icon_url).toBe("userIcon1");
      });
      it("住所のデータを一緒に取得できる", async () => {
        const response = await request(server).get("/posts/page/1");
        expect(response.body.posts[0].address.postalCode).toBe("2222222");
        expect(response.body.posts[0].address.prefecture).toBe("prefecture2");
        expect(response.body.posts[0].address.municipality).toBe(
          "municipality2"
        );
        expect(response.body.posts[0].address.townName).toBe("town2");
        expect(response.body.posts[0].address.buildingName).toBe("building2");

        expect(response.body.posts[9].address.postalCode).toBe("1111111");
        expect(response.body.posts[9].address.prefecture).toBe("prefecture1");
        expect(response.body.posts[9].address.municipality).toBe(
          "municipality1"
        );
        expect(response.body.posts[9].address.townName).toBe("town1");
        expect(response.body.posts[9].address.buildingName).toBe("building1");
      });
      it("カテゴリーのデータを一緒に取得できる", async () => {
        const response = await request(server).get("/posts/page/1");
        expect(response.body.posts[0].categories[0].firstCategory).toBe(
          "test-fc1"
        );
        expect(response.body.posts[0].categories[0].secondCategory).toBe(
          "test-sc1"
        );

        expect(response.body.posts[0].categories[1].firstCategory).toBe(
          "test-fc2"
        );
        expect(response.body.posts[0].categories[1].secondCategory).toBe(
          "test-sc2"
        );
      });
    });
  });

  describe("GET /posts/:userId/page/:page のテスト", () => {
    describe("正常系", () => {
      it("特定のユーザーの投稿を取得できる", async () => {
        const user1Response = await request(server).get(
          "/posts/userId1/page/1"
        );
        const user2Response = await request(server).get(
          "/posts/userId2/page/1"
        );

        // user1
        expect(user1Response.statusCode).toBe(200);
        expect(user1Response.body.total).toBe(1);
        expect(user1Response.body.posts).toHaveLength(7);
        expect(user1Response.body.posts[0].id).toBe("postId7");
        expect(user1Response.body.posts[1].id).toBe("postId6");
        expect(user1Response.body.posts[2].id).toBe("postId5");
        expect(user1Response.body.posts[3].id).toBe("postId4");
        expect(user1Response.body.posts[4].id).toBe("postId3");
        expect(user1Response.body.posts[5].id).toBe("postId2");
        expect(user1Response.body.posts[6].id).toBe("postId1");

        // user2
        expect(user2Response.statusCode).toBe(200);
        expect(user2Response.body.total).toBe(1);
        expect(user2Response.body.posts).toHaveLength(5);
        expect(user2Response.body.posts[0].id).toBe("postId12");
        expect(user2Response.body.posts[1].id).toBe("postId11");
        expect(user2Response.body.posts[2].id).toBe("postId10");
        expect(user2Response.body.posts[3].id).toBe("postId9");
        expect(user2Response.body.posts[4].id).toBe("postId8");
      });
      it("投稿モデルのカラムが取得できている", async () => {
        const expectedDateTime = new Date(2021, 12, 1, 0, 0, 0);
        const response = await request(server).get("/posts/userId2/page/1");
        expect(response.body.posts[0].id).toBe("postId12");
        expect(response.body.posts[0].title).toBe("test-post12");
        expect(response.body.posts[0].property).toBe("test-property12");
        expect(response.body.posts[0].text).toBe("text12");
        expect(response.body.posts[0].updatedAt).toBe(
          expectedDateTime.toISOString()
        );
      });
      it("投稿者のデータを一緒に取得できる", async () => {
        const user1Response = await request(server).get(
          "/posts/userId1/page/1"
        );
        const user2Response = await request(server).get(
          "/posts/userId2/page/1"
        );

        // user1
        expect(user1Response.body.posts[0].user.id).toBe("userId1");
        expect(user1Response.body.posts[0].user.username).toBe("user1");
        expect(user1Response.body.posts[0].user.icon_url).toBe("userIcon1");

        // user2
        expect(user2Response.body.posts[0].user.id).toBe("userId2");
        expect(user2Response.body.posts[0].user.username).toBe("user2");
        expect(user2Response.body.posts[0].user.icon_url).toBe("userIcon2");
      });
      it("住所のデータを一緒に取得できる", async () => {
        const user1Response = await request(server).get(
          "/posts/userId1/page/1"
        );
        const user2Response = await request(server).get(
          "/posts/userId2/page/1"
        );

        // user1
        expect(user1Response.body.posts[0].address.postalCode).toBe("1111111");
        expect(user1Response.body.posts[0].address.prefecture).toBe(
          "prefecture1"
        );
        expect(user1Response.body.posts[0].address.municipality).toBe(
          "municipality1"
        );
        expect(user1Response.body.posts[0].address.townName).toBe("town1");
        expect(user1Response.body.posts[0].address.buildingName).toBe(
          "building1"
        );

        // user2
        expect(user2Response.body.posts[0].address.postalCode).toBe("2222222");
        expect(user2Response.body.posts[0].address.prefecture).toBe(
          "prefecture2"
        );
        expect(user2Response.body.posts[0].address.municipality).toBe(
          "municipality2"
        );
        expect(user2Response.body.posts[0].address.townName).toBe("town2");
        expect(user2Response.body.posts[0].address.buildingName).toBe(
          "building2"
        );
      });
      it("カテゴリーのデータを一緒に取得できる", async () => {
        const response = await request(server).get("/posts/userId2/page/1");
        expect(response.body.posts[0].categories[0].firstCategory).toBe(
          "test-fc1"
        );
        expect(response.body.posts[0].categories[0].secondCategory).toBe(
          "test-sc1"
        );

        expect(response.body.posts[0].categories[1].firstCategory).toBe(
          "test-fc2"
        );
        expect(response.body.posts[0].categories[1].secondCategory).toBe(
          "test-sc2"
        );
      });
    });
  });

  describe("POST /posts/followee/page/:page", () => {
    describe("正常系", () => {
      const params = { followsId: ["userId2"] };
      it("フォローしているユーザーの投稿を取得できる", async () => {
        const response = await request(server)
          .post("/posts/followee/page/1")
          .send(params);

        expect(response.statusCode).toBe(200);
        expect(response.body.posts).toHaveLength(5);
        expect(response.body.total).toBe(1);
        expect(response.body.posts[0].id).toBe("postId12");
        expect(response.body.posts[1].id).toBe("postId11");
        expect(response.body.posts[2].id).toBe("postId10");
        expect(response.body.posts[3].id).toBe("postId9");
        expect(response.body.posts[4].id).toBe("postId8");
      });
      it("投稿者のデータを一緒に取得できる", async () => {
        const response = await request(server)
          .post("/posts/followee/page/1")
          .send(params);

        expect(response.body.posts[0].user.id).toBe("userId2");
        expect(response.body.posts[0].user.username).toBe("user2");
        expect(response.body.posts[0].user.icon_url).toBe("userIcon2");
      });
      it("住所のデータを一緒に取得できる", async () => {
        const response = await request(server)
          .post("/posts/followee/page/1")
          .send(params);

        expect(response.body.posts[0].address.postalCode).toBe("2222222");
        expect(response.body.posts[0].address.prefecture).toBe("prefecture2");
        expect(response.body.posts[0].address.municipality).toBe(
          "municipality2"
        );
        expect(response.body.posts[0].address.townName).toBe("town2");
        expect(response.body.posts[0].address.buildingName).toBe("building2");
      });
      it("カテゴリーのデータを一緒に取得できる", async () => {
        const response = await request(server)
          .post("/posts/followee/page/1")
          .send(params);
        expect(response.body.posts[0].categories[0].firstCategory).toBe(
          "test-fc1"
        );
        expect(response.body.posts[0].categories[0].secondCategory).toBe(
          "test-sc1"
        );

        expect(response.body.posts[0].categories[1].firstCategory).toBe(
          "test-fc2"
        );
        expect(response.body.posts[0].categories[1].secondCategory).toBe(
          "test-sc2"
        );
      });
    });
  });

  describe("GET /posts/post/:postId", () => {
    describe("正常系", () => {
      it("投稿のカラムが取得できている", async () => {
        const expectedUpdatedAt = new Date(2021, 12, 1, 0, 0, 0);
        const expectedCreatedAt = new Date(2020, 12, 1, 0, 0, 0);
        const response = await request(server).get("/posts/post/postId12");

        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe("postId12");
        expect(response.body.title).toBe("test-post12");
        expect(response.body.property).toBe("test-property12");
        expect(response.body.text).toBe("text12");
        expect(response.body.updatedAt).toBe(expectedUpdatedAt.toISOString());
        expect(response.body.createdAt).toBe(expectedCreatedAt.toISOString());
      });
      it("投稿者のデータを一緒に取得できる", async () => {
        const response = await request(server).get("/posts/post/postId12");

        expect(response.body.user.id).toBe("userId2");
        expect(response.body.user.username).toBe("user2");
        expect(response.body.user.icon_url).toBe("userIcon2");
      });
      it("住所のデータを一緒に取得できる", async () => {
        const response = await request(server).get("/posts/post/postId12");

        expect(response.body.address.postalCode).toBe("2222222");
        expect(response.body.address.prefecture).toBe("prefecture2");
        expect(response.body.address.municipality).toBe("municipality2");
        expect(response.body.address.townName).toBe("town2");
        expect(response.body.address.buildingName).toBe("building2");
      });
      it("カテゴリーのデータを一緒に取得できる", async () => {
        const response = await request(server).get("/posts/post/postId12");
        expect(response.body.categories[0].firstCategory).toBe("test-fc1");
        expect(response.body.categories[0].secondCategory).toBe("test-sc1");

        expect(response.body.categories[1].firstCategory).toBe("test-fc2");
        expect(response.body.categories[1].secondCategory).toBe("test-sc2");
      });
      it("投稿についた回答をcreatedAtの昇順で取得できる", async () => {
        const response = await request(server).get("/posts/post/postId12");
        const answer1CreatedAt = new Date(2020, 12, 10, 0, 0, 0);
        const answer2CreatedAt = new Date(2020, 12, 11, 0, 0, 0);

        expect(response.body.answers).toHaveLength(2);
        expect(response.body.answers[0].id).toBe("answerId1");
        expect(response.body.answers[0].content).toBe("answer1");
        expect(response.body.answers[0].createdAt).toBe(
          answer1CreatedAt.toISOString()
        );
        expect(response.body.answers[1].id).toBe("answerId2");
        expect(response.body.answers[1].content).toBe("answer2");
        expect(response.body.answers[1].createdAt).toBe(
          answer2CreatedAt.toISOString()
        );
      });
      it("投稿についた回答の回答者の情報を取得できる", async () => {
        const response = await request(server).get("/posts/post/postId12");

        expect(response.body.answers[0].user.id).toBe("userId1");
        expect(response.body.answers[0].user.username).toBe("user1");
        expect(response.body.answers[0].user.icon_url).toBe("userIcon1");
      });
      it("投稿についた回答にいいねしたユーザーのidを取得できる", async () => {
        const response = await request(server).get("/posts/post/postId12");

        expect(response.body.answers[0].likedBy[0].id).toBe("userId2");
        expect(response.body.answers[1].likedBy[0].id).toBe("userId2");
      });
      it("回答についたコメントをcreatedAtの昇順に取得できる", async () => {
        const response = await request(server).get("/posts/post/postId12");

        expect(response.body.answers[0].comments[0].id).toBe("commentId3");
        expect(response.body.answers[0].comments[0].content).toBe("comment3");
        expect(response.body.answers[0].comments[1].id).toBe("commentId1");
        expect(response.body.answers[0].comments[1].content).toBe("comment1");
        expect(response.body.answers[0].comments[2].id).toBe("commentId2");
        expect(response.body.answers[0].comments[2].content).toBe("comment2");
      });
      it("回答に付いたコメントからコメントの作成者のデータを取得できる", async () => {
        const response = await request(server).get("/posts/post/postId12");

        // コメント1件目
        expect(response.body.answers[0].comments[0].user.id).toBe("userId1");
        expect(response.body.answers[0].comments[0].user.username).toBe(
          "user1"
        );
        expect(response.body.answers[0].comments[0].user.icon_url).toBe(
          "userIcon1"
        );

        // コメント2件目
        expect(response.body.answers[0].comments[1].user.id).toBe("userId2");
        expect(response.body.answers[0].comments[1].user.username).toBe(
          "user2"
        );
        expect(response.body.answers[0].comments[1].user.icon_url).toBe(
          "userIcon2"
        );

        // コメント3件目
        expect(response.body.answers[0].comments[2].user.id).toBe("userId1");
        expect(response.body.answers[0].comments[2].user.username).toBe(
          "user1"
        );
        expect(response.body.answers[0].comments[2].user.icon_url).toBe(
          "userIcon1"
        );
      });
    });
    describe("異常系", () => {
      it("存在しないidが指定された場合ステータスコード404を返す", async () => {
        const response = await request(server).get("/posts/post/notFoundPost");

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Not found");
      });
    });
  });

  describe("POST /posts/post/new のテスト", () => {
    describe("正常系", () => {
      it("投稿を正常に作成できる", async () => {
        const params = {
          id: "postCreate",
          title: "createTitle",
          property: "createProperty",
          text: "createText",
          authorId: "userId1",
          addressId: "addressId1",
        };
        const response = await request(server)
          .post("/posts/post/new")
          .send(params);
        expect(response.statusCode).toBe(201);
        expect(response.body.id).toBe("postCreate");

        const actualPostResponse = await request(server).get(
          "/posts/post/postCreate"
        );
        expect(actualPostResponse.statusCode).toBe(200);
        expect(actualPostResponse.body.id).toBe("postCreate");
        expect(actualPostResponse.body.title).toBe("createTitle");
        expect(actualPostResponse.body.property).toBe("createProperty");
        expect(actualPostResponse.body.text).toBe("createText");
      });
    });
    describe("異常系", () => {
      it("パラメータが不正な場合がエラーが発生する", async () => {
        const params1 = {
          title: 11111,
          property: 22222,
          authorId: 33333,
          addressId: 44444,
        };
        const params2 = {};

        const response1 = await request(server)
          .post("/posts/post/new")
          .send(params1);
        expect(response1.statusCode).toBe(500);

        const response2 = await request(server)
          .post("/posts/post/new")
          .send(params2);
        expect(response2.statusCode).toBe(500);
      });
    });
  });

  describe("PATCH /posts/update/:postId のテスト", () => {
    describe("正常系", () => {
      it("投稿を正常に編集できる", async () => {
        const params = {
          title: "updateTitle",
          property: "updateProperty",
          text: "updateText",
        };
        const response = await request(server)
          .patch("/posts/update/postCreate")
          .send(params);
        expect(response.statusCode).toBe(200);

        const actualPostResponse = await request(server).get(
          "/posts/post/postCreate"
        );
        expect(actualPostResponse.body.title).toBe("updateTitle");
        expect(actualPostResponse.body.property).toBe("updateProperty");
        expect(actualPostResponse.body.text).toBe("updateText");
      });
    });
    describe("異常系", () => {
      it("パラメータが不正な場合エラーが発生する", async () => {
        const params = {
          title: 11111,
          property: 22222,
          authorId: 33333,
          addressId: 44444,
        };

        const response = await request(server)
          .patch("/posts/update/postCreate")
          .send(params);
        expect(response.statusCode).toBe(500);
      });
    });
  });

  describe("DELETE /posts/delete/:postId のテスト", () => {
    describe("正常系", () => {
      it("投稿を正常に削除できる", async () => {
        const response = await request(server).delete(
          "/posts/delete/postCreate"
        );
        expect(response.statusCode).toBe(200);

        const actualPostResponse = await request(server).get(
          "/posts/post/postCreate"
        );
        expect(actualPostResponse.statusCode).toBe(404);
        expect(actualPostResponse.body.message).toBe("Not found");
      });
    });
  });

  describe("POST /posts/create/favorite のテスト", () => {
    describe("正常系", () => {
      it("お気に入りの投稿を正常に作成できる", async () => {
        const params = {
          userId: "userId1",
          postId: "postId1",
        };
        const response = await request(server)
          .post("/posts/create/favorite")
          .send(params);
        expect(response.statusCode).toBe(201);

        const userPostData = await db.UserPost.findAll({
          where: { userId: "userId1", postId: "postId1" },
        });
        expect(userPostData[0].userId).toBe("userId1");
        expect(userPostData[0].postId).toBe("postId1");
      });
    });
  });

  describe("DELETE /posts/remove/favorite/:userId", () => {
    describe("正常系", () => {
      it("お気に入りの投稿を正常に削除できる", async () => {
        const response = await request(server).delete(
          "/posts/postId1/remove/favorite/userId1"
        );
        expect(response.statusCode).toBe(200);
        const userPostData = await db.UserPost.findAll({
          where: { userId: "userId1", postId: "postId1" },
        });
        expect(userPostData).toHaveLength(0);
      });
    });
  });

  describe("POST /posts/set/category", () => {
    describe("正常系", () => {
      it("投稿にカテゴリーを正常にセットできる", async () => {
        const params = {
          postId: "postId1",
          categoryId: "categoryId1",
        };
        const response = await request(server)
          .post("/posts/set/category")
          .send(params);
        expect(response.statusCode).toBe(201);

        const postCategoryData = await db.PostCategory.findAll({
          where: {
            postId: "postId1",
            categoryId: "categoryId1",
          },
        });

        expect(postCategoryData[0].postId).toBe("postId1");
        expect(postCategoryData[0].categoryId).toBe("categoryId1");
      });
    });
  });

  describe("DELETE /posts/remove/categories のテスト", () => {
    describe("正常系", () => {
      it("投稿からカテゴリーを正常に削除できる", async () => {
        const response = await request(server).delete(
          "/posts/postId1/remove/categories"
        );
        expect(response.statusCode).toBe(200);

        const postCategoryData = await db.PostCategory.findAll({
          where: { postId: "postId1" },
        });
        expect(postCategoryData).toHaveLength(0);
      });
    });
  });

  describe("GET /posts/filter/query/page/:page のテスト", () => {
    describe("正常系", () => {
      it("所在地の住所で投稿をフィルタリングできる", async () => {
        const response = await request(server)
          .get("/posts/filter/query/page/1")
          .query(qs.stringify({ categories: [], address: "1111111" }));

        expect(response.statusCode).toBe(200);
        expect(response.body.total).toBe(1);
        expect(response.body.posts).toHaveLength(7);
        expect(response.body.posts[0].id).toBe("postId7");
        expect(response.body.posts[1].id).toBe("postId6");
        expect(response.body.posts[2].id).toBe("postId5");
        expect(response.body.posts[3].id).toBe("postId4");
        expect(response.body.posts[4].id).toBe("postId3");
        expect(response.body.posts[5].id).toBe("postId2");
        expect(response.body.posts[6].id).toBe("postId1");
      });
      it("カテゴリーで投稿をフィルタリングできる", async () => {
        const response = await request(server)
          .get("/posts/filter/query/page/1")
          .query(
            qs.stringify({ categories: ["test-sc1", "test-sc2"], address: "" })
          );

        expect(response.statusCode).toBe(200);
        expect(response.body.total).toBe(1);
        expect(response.body.posts).toHaveLength(1);
        expect(response.body.posts[0].id).toBe("postId12");
      });
      it("所在地の住所とカテゴリーで投稿をフィルタリングできる", async () => {
        const response1 = await request(server)
          .get("/posts/filter/query/page/1")
          .query(
            qs.stringify({ categories: ["test-sc1"], address: "2222222" })
          );
        const response2 = await request(server)
          .get("/posts/filter/query/page/1")
          .query(
            qs.stringify({ categories: ["test-sc1"], address: "1111111" })
          );

        expect(response1.statusCode).toBe(200);
        expect(response1.body.total).toBe(1);
        expect(response1.body.posts).toHaveLength(1);
        expect(response1.body.posts[0].id).toBe("postId12");

        expect(response2.statusCode).toBe(200);
        expect(response2.body.total).toBe(1);
        expect(response2.body.posts).toHaveLength(0);
      });
      it("条件に所在地を指定した場合所在地のデータを取得できる", async () => {
        const response = await request(server)
          .get("/posts/filter/query/page/1")
          .query(qs.stringify({ categories: [], address: "1111111" }));
        expect(response.body.posts[0].address.postalCode).toBe("1111111");
        expect(response.body.posts[0].address.prefecture).toBe("prefecture1");
        expect(response.body.posts[0].address.municipality).toBe(
          "municipality1"
        );
        expect(response.body.posts[0].address.townName).toBe("town1");
        expect(response.body.posts[0].address.buildingName).toBe("building1");
      });
      it("お気に入りの投稿から投稿をフィルタリングできる", async () => {
        const response = await request(server)
          .get("/posts/filter/query/page/1")
          .query(
            qs.stringify({
              categories: ["test-sc1"],
              address: "2222222",
              userId: "userId2",
            })
          );
        expect(response.body.posts).toHaveLength(1);
        expect(response.body.posts[0].id).toBe("postId12");
      });
      it("自分の投稿の中から投稿をフィルタリングできる", async () => {
        const response = await request(server)
          .get("/posts/filter/query/page/1")
          .query(
            qs.stringify({
              categories: ["test-sc1"],
              address: "2222222",
              authorId: "userId2",
            })
          );
        expect(response.body.posts).toHaveLength(1);
        expect(response.body.posts[0].id).toBe("postId12");
      });
      it("フォローしているユーザーの投稿の中から投稿をフィルタリングできる", async () => {
        const response1 = await request(server)
          .get("/posts/filter/query/page/1")
          .query(
            qs.stringify({
              categories: ["test-sc1"],
              address: "2222222",
              authorId: ["userId1"],
            })
          );
        expect(response1.body.posts).toHaveLength(0);

        const response2 = await request(server)
          .get("/posts/filter/query/page/1")
          .query(
            qs.stringify({
              categories: ["test-sc1"],
              address: "2222222",
              authorId: ["userId1", "userId2"],
            })
          );

        expect(response2.body.posts).toHaveLength(1);
        expect(response2.body.posts[0].id).toBe("postId12");
      });
    });
  });

  describe("GET /posts/search/query/page/:page のテスト", () => {
    describe("正常系", () => {
      it("物件名で投稿を検索できる", async () => {
        const response = await request(server)
          .get("/posts/search/query/page/1")
          .query(qs.stringify({ keyword: "test-property12" }));

        expect(response.statusCode).toBe(200);
        expect(response.body.total).toBe(1);
        expect(response.body.posts).toHaveLength(1);
        expect(response.body.posts[0].id).toBe("postId12");
      });
      it("都道府県で投稿を検索できる", async () => {
        const response = await request(server)
          .get("/posts/search/query/page/1")
          .query(qs.stringify({ keyword: "prefecture1" }));

        expect(response.statusCode).toBe(200);
        expect(response.body.total).toBe(1);
        expect(response.body.posts).toHaveLength(7);
        expect(response.body.posts[0].id).toBe("postId7");
        expect(response.body.posts[1].id).toBe("postId6");
        expect(response.body.posts[2].id).toBe("postId5");
        expect(response.body.posts[3].id).toBe("postId4");
        expect(response.body.posts[4].id).toBe("postId3");
        expect(response.body.posts[5].id).toBe("postId2");
        expect(response.body.posts[6].id).toBe("postId1");
      });
      it("市区町村で投稿を検索できる", async () => {
        const response = await request(server)
          .get("/posts/search/query/page/1")
          .query(qs.stringify({ keyword: "municipality2" }));

        expect(response.statusCode).toBe(200);
        expect(response.body.total).toBe(1);
        expect(response.body.posts).toHaveLength(5);
        expect(response.body.posts[0].id).toBe("postId12");
        expect(response.body.posts[1].id).toBe("postId11");
        expect(response.body.posts[2].id).toBe("postId10");
        expect(response.body.posts[3].id).toBe("postId9");
        expect(response.body.posts[4].id).toBe("postId8");
      });
      it("番地・町名で投稿を検索できる", async () => {
        const response = await request(server)
          .get("/posts/search/query/page/1")
          .query(qs.stringify({ keyword: "town2" }));

        expect(response.statusCode).toBe(200);
        expect(response.body.total).toBe(1);
        expect(response.body.posts).toHaveLength(5);
        expect(response.body.posts[0].id).toBe("postId12");
        expect(response.body.posts[1].id).toBe("postId11");
        expect(response.body.posts[2].id).toBe("postId10");
        expect(response.body.posts[3].id).toBe("postId9");
        expect(response.body.posts[4].id).toBe("postId8");
      });
      it("アパート・マンション名で投稿を検索できる", async () => {
        const response = await request(server)
          .get("/posts/search/query/page/1")
          .query(qs.stringify({ keyword: "building2" }));
        expect(response.statusCode).toBe(200);
        expect(response.body.total).toBe(1);
        expect(response.body.posts).toHaveLength(5);
        expect(response.body.posts[0].id).toBe("postId12");
        expect(response.body.posts[1].id).toBe("postId11");
        expect(response.body.posts[2].id).toBe("postId10");
        expect(response.body.posts[3].id).toBe("postId9");
        expect(response.body.posts[4].id).toBe("postId8");
      });
      it("所在地のデータを一緒に取得できる", async () => {
        const response = await request(server)
          .get("/posts/filter/query/page/1")
          .query(qs.stringify({ keyword: "test-property12" }));

        expect(response.body.posts[0].address.postalCode).toBe("2222222");
        expect(response.body.posts[0].address.prefecture).toBe("prefecture2");
        expect(response.body.posts[0].address.municipality).toBe(
          "municipality2"
        );
        expect(response.body.posts[0].address.townName).toBe("town2");
        expect(response.body.posts[0].address.buildingName).toBe("building2");
      });
      it("投稿者のデータを一緒に取得できる", async () => {
        const response = await request(server)
          .get("/posts/filter/query/page/1")
          .query(qs.stringify({ keyword: "test-property12" }));

        expect(response.body.posts[0].user.id).toBe("userId2");
        expect(response.body.posts[0].user.username).toBe("user2");
        expect(response.body.posts[0].user.icon_url).toBe("userIcon2");
      });
      it("お気に入りの投稿から投稿を検索できる", async () => {
        const response1 = await request(server)
          .get("/posts/search/query/page/1")
          .query(qs.stringify({ keyword: "prefecture1", userId: "userId2" }));
        const response2 = await request(server)
          .get("/posts/search/query/page/1")
          .query(qs.stringify({ keyword: "prefecture2", userId: "userId2" }));
        expect(response1.body.posts).toHaveLength(0);

        expect(response2.body.posts).toHaveLength(2);
        expect(response2.body.posts[0].id).toBe("postId12");
        expect(response2.body.posts[1].id).toBe("postId11");
      });
      it("自分の投稿の中から投稿を検索できる", async () => {
        const response1 = await request(server)
          .get("/posts/search/query/page/1")
          .query(qs.stringify({ keyword: "prefecture1", authorId: "userId2" }));
        const response2 = await request(server)
          .get("/posts/search/query/page/1")
          .query(qs.stringify({ keyword: "prefecture2", authorId: "userId2" }));

        expect(response1.body.posts).toHaveLength(0);
        expect(response2.body.posts).toHaveLength(5);
        expect(response2.body.posts[0].id).toBe("postId12");
        expect(response2.body.posts[1].id).toBe("postId11");
        expect(response2.body.posts[2].id).toBe("postId10");
        expect(response2.body.posts[3].id).toBe("postId9");
        expect(response2.body.posts[4].id).toBe("postId8");
      });
      it("フォローしているユーザーの投稿の中から投稿を検索できる", async () => {
        const response1 = await request(server)
          .get("/posts/search/query/page/1")
          .query(
            qs.stringify({ keyword: "prefecture1", authorId: ["userId2"] })
          );
        const response2 = await request(server)
          .get("/posts/search/query/page/1")
          .query(
            qs.stringify({
              keyword: "prefecture1",
              authorId: ["userId1", "userId2"],
            })
          );

        expect(response1.body.posts).toHaveLength(0);
        expect(response2.body.posts).toHaveLength(7);
        expect(response2.body.posts[0].id).toBe("postId7");
        expect(response2.body.posts[1].id).toBe("postId6");
        expect(response2.body.posts[2].id).toBe("postId5");
        expect(response2.body.posts[3].id).toBe("postId4");
        expect(response2.body.posts[4].id).toBe("postId3");
        expect(response2.body.posts[5].id).toBe("postId2");
        expect(response2.body.posts[6].id).toBe("postId1");
      });
    });
  });

  describe("GET /posts/favorite/user/:userId/page/:page のテスト", () => {
    describe("正常系", () => {
      it("ユーザーのお気に入りの投稿を正常に取得できる", async () => {
        const response1 = await request(server).get(
          "/posts/favorite/user/userId1/page/1"
        );
        const response2 = await request(server).get(
          "/posts/favorite/user/userId2/page/1"
        );

        expect(response1.statusCode).toBe(200);
        expect(response1.body.total).toBe(1);
        expect(response1.body.posts).toHaveLength(0);
        expect(response2.statusCode).toBe(200);
        expect(response2.body.total).toBe(1);
        expect(response2.body.posts).toHaveLength(2);
        expect(response2.body.posts[0].id).toBe("postId12");
        expect(response2.body.posts[1].id).toBe("postId11");
      });
      it("投稿モデルのカラムが取得できている", async () => {
        const expectedDateTime = new Date(2021, 12, 1, 0, 0, 0);
        const response = await request(server).get(
          "/posts/favorite/user/userId2/page/1"
        );
        expect(response.body.posts[0].id).toBe("postId12");
        expect(response.body.posts[0].title).toBe("test-post12");
        expect(response.body.posts[0].property).toBe("test-property12");
        expect(response.body.posts[0].text).toBe("text12");
        expect(response.body.posts[0].updatedAt).toBe(
          expectedDateTime.toISOString()
        );
      });
      it("投稿者のデータを一緒に取得できる", async () => {
        const response = await request(server).get(
          "/posts/favorite/user/userId2/page/1"
        );
        expect(response.body.posts[0].user.id).toBe("userId2");
        expect(response.body.posts[0].user.username).toBe("user2");
        expect(response.body.posts[0].user.icon_url).toBe("userIcon2");
      });
      it("住所のデータを一緒に取得できる", async () => {
        const response = await request(server).get(
          "/posts/favorite/user/userId2/page/1"
        );
        expect(response.body.posts[0].address.postalCode).toBe("2222222");
        expect(response.body.posts[0].address.prefecture).toBe("prefecture2");
        expect(response.body.posts[0].address.municipality).toBe(
          "municipality2"
        );
        expect(response.body.posts[0].address.townName).toBe("town2");
        expect(response.body.posts[0].address.buildingName).toBe("building2");
      });
      it("カテゴリーのデータを一緒に取得できる", async () => {
        const response = await request(server).get(
          "/posts/favorite/user/userId2/page/1"
        );
        expect(response.body.posts[0].categories[0].firstCategory).toBe(
          "test-fc1"
        );
        expect(response.body.posts[0].categories[0].secondCategory).toBe(
          "test-sc1"
        );

        expect(response.body.posts[0].categories[1].firstCategory).toBe(
          "test-fc2"
        );
        expect(response.body.posts[0].categories[1].secondCategory).toBe(
          "test-sc2"
        );
      });
    });
  });
});
