const request = require("supertest");
const server = require("../../app");
const db = require("../../models/index");

const categoryData = [
  { firstCategory: "firstCategory1", secondCategory: "secondCategory1" },
  { firstCategory: "firstCategory2", secondCategory: "secondCategory2" },
];

describe("categoryAPIのテスト", () => {
  beforeAll(async () => {
    await db.category.bulkCreate(categoryData);
  });

  afterAll(async () => {
    await db.category.destroy({ where: {} });
  });

  describe("POST /categories/find/or/create のテスト", () => {
    describe("正常系", () => {
      it("カテゴリーが既に存在している場合そのカテゴリーのidのリストを取得できる", async () => {
        const params = [
          { firstCategory: "firstCategory1", secondCategory: "secondCategory1" },
          { firstCategory: "firstCategory2", secondCategory: "secondCategory2" },
        ];

        const response = await request(server)
          .post("/categories/find/or/create")
          .send(params);
        expect(response.status).toBe(200);

        const category1 = await db.category.findAll({
          where: categoryData[0],
        });
        const category2 = await db.category.findAll({
          where: categoryData[1],
        });
        expect(response.body[0]).toBe(category1[0].dataValues.id);
        expect(response.body[1]).toBe(category2[0].dataValues.id);
      });
      it("カテゴリーが存在しない場合新しく作成して、そのidのリストを取得できる", async () => {
        const params = [
          { firstCategory: "firstCategory1", secondCategory: "secondCategory2" },
          { firstCategory: "firstCategory2", secondCategory: "secondCategory1" },
        ];
        const response = await request(server)
          .post("/categories/find/or/create")
          .send(params);
        expect(response.status).toBe(200);

        const categories = await db.category.findAll();
        expect(categories).toHaveLength(4); // 新規で2件作成されていることを確認

        const category1 = await db.category.findAll({
          where: {
            firstCategory: "firstCategory1",
            secondCategory: "secondCategory2",
          },
        });
        const category2 = await db.category.findAll({
          where: {
            firstCategory: "firstCategory2",
            secondCategory: "secondCategory1",
          },
        });
        expect(response.body[0]).toBe(category1[0].dataValues.id);
        expect(response.body[1]).toBe(category2[0].dataValues.id);
      });
    });
  });
});
