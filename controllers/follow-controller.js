const { sequelize } = require("../models/index");
const db = require("../models/index");

const followController = {
  // 特定のユーザーのfollowデータ取得
  getFollow(req, res, next) {
    db.follow
      .findAll({
        // userカラムのidにuserIdが含まれるデータを取得
        where: sequelize.fn(
          "JSON_CONTAINS",
          sequelize.col("user"),
          sequelize.literal(`'"${req.params.userId}"'`),
          sequelize.literal('"$.id"')
        ),
        attributes: ["id", "follow"], // カラムはidとfollowを取得
        order: [["updatedAt", "ASC"]],
      })
      .then((follows) => {
        res.json(follows);
      })
      .catch((err) => {
        next(err);
      });
  },
  // 特定のユーザーのフォロワーデータを取得
  getFollower(req, res, next) {
    db.follow
      .findAll({
        // userカラムのidにfollowIdが含まれるデータを取得
        where: sequelize.fn(
          "JSON_CONTAINS",
          sequelize.col("follow"),
          sequelize.literal(`'"${req.params.followId}"'`),
          sequelize.literal('"$.id"')
        ),
        attributes: ["id", "user"], // カラムはidとfollowを取得
        order: [["updatedAt", "ASC"]],
      })
      .then((followers) => {
        res.json(followers);
      })
      .catch((err) => {
        next(err);
      });
  },
  // followデータ作成
  postFollow(req, res, next) {
    db.follow
      .create(req.body) // オブジェクト型のuserとfollow
      .then((follow) => {
        res.status(201).json({ followId: follow.id }); // 作成したデータのIDを返す
      })
      .catch((err) => {
        next(err);
      });
  },
  // followデータ削除
  deleteFollow(req, res, next) {
    db.follow
      .destroy({ where: { id: req.params.followId } })
      .then(() => {
        res.end();
      })
      .catch((err) => {
        next(err);
      });
  },
  // エラーハンドリング
  errorHandling(err, req, res, next) {
    if (err) {
      res.status(500).json({ message: err });
    }
  },
};

module.exports = followController;
