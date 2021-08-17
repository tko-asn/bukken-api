const Follows = require('../models/follow-models');

const followController = {
  // 特定のユーザーのfollowデータ取得
  getMyFollow(req, res) {
    Follows.listFollow(req.params.userId) // userIdは特定のユーザーのID
    .then(result => {
      res.json(result);
    })
    .catch(err => {
    });
  },
  // 特定のユーザーのフォロワーデータを取得
  getMyFollower(req, res) {
    Follows.listFollower(req.params.followId) // userIdは特定のユーザーのID
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    });
  },
  // followデータ作成
  postFollow(req, res) {
    Follows.create(req.body) // id, username, iconURLを持ったデータ
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    });
  },
  // followデータ削除
  deleteFollow(req, res) {
    Follows.delete(req.params.followId)
    .then(() => {
      res.end();
    })
    .catch(err => {
      next(err);
    });
  }
};

module.exports = followController;