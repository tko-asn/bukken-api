const db = require("../models/index");

const followController = {
  // followデータ作成
  postFollow(req, res, next) {
    db.follow
      .create(req.body)
      .then(() => {
        res.status(201).end();
      })
      .catch((err) => {
        next(err);
      });
  },
  // followデータ削除
  deleteFollow(req, res, next) {
    db.follow
      .destroy({
        where: { followId: req.params.followId, userId: req.params.userId },
      })
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
