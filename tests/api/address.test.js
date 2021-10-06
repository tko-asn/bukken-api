const { expectation } = require("sinon");
const request = require("supertest");
const server = require("../../app");
const db = require("../../models/index");

const addressData = {
  id: "addressId1",
  postalCode: "1111111",
  prefecture: "prefecture1",
  municipality: "municipality1",
  townName: "town1",
  buildingName: "building1",
};

describe("addressAPIのテスト", () => {
  beforeAll(async () => {
    await db.address.create(addressData);
  });

  afterAll(async () => {
    await db.address.destroy({ where: {} });
  });

  describe("POST /addresses/find/or/create", () => {
    describe("正常系", () => {
      it("所在地のデータが既に存在する場合そのidを取得できる", async () => {
        const params = {
          postalCode: "1111111",
          prefecture: "prefecture1",
          municipality: "municipality1",
          townName: "town1",
          buildingName: "building1",
        };
        const response = await request(server)
          .post("/addresses/find/or/create")
          .send(params);
        expect(response.statusCode).toBe(200);

        const addressData = await db.address.findAll({
          where: params,
        });
        expect(response.body.addressId).toBe(addressData[0].id);
      });
      it("所在地のデータが存在しない場合新しくデータを作成し、そのidを取得できる", async () => {
        const params = {
          postalCode: "2222222",
          prefecture: "prefecture2",
          municipality: "municipality2",
          townName: "town2",
          buildingName: "building2",
        };
        const response = await request(server)
          .post("/addresses/find/or/create")
          .send(params);
        expect(response.statusCode).toBe(201);

        const addressData = await db.address.findAll({
          where: params,
        });
        expect(response.body.addressId).toBe(addressData[0].id);
      });
    });
  });
});
