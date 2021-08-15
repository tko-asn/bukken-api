const Users = require('../models/user-model');

const userController = {
  // ユーザー一覧取得
  getUsers(req, res) {
    Users.list()
    .then(result => {
      // JSONレスポンス
      res.json(result);
    }).catch(err => {
      next(err);
    });
  },
  // ユーザー詳細取得
  getUser(req, res) {
    Users.retrieve(req.params.userId)
    .then(result => {
      res.json(result);
    }).catch(err => {
      next(err);
    });
  },
  // ユーザー作成
  postUser(req, res) {
    // req.bodyはpostデータ
    Users.create(req.body)
    .then(() => {
      res.end();
    }).catch(err => {
      next(err);
    });
  },
  // ユーザー情報変更(email or password)
  patchUser(req, res, next) {
    Users.partialUpdate(req.params.userId, req.body)
    .then(() => {
      res.end();
    })
    .catch(err => {
      next(err);
    });
  },
  // ユーザー削除
  deleteUser(req, res) {
    Users.delete(req.params.userId)
    .then(() => {
      res.end();
    })
    .catch(err => {
      next(err);
    })
  },
  // ユーザーのプロフィールのカラムを取得
  getProfile(req, res) {
    Users.retrieveProfile(req.params.userId)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    })
  },
  // ユーザーのプロフィールのカラムを編集
  patchProfile(req, res) {
    // req.bodyは画像ファイル以外のデータ
    Users.partialUpdateProfile(req.params.userId, req)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    });
  },
  errorHandling(err, req, res, next) {
    if (err) {
      res.status(500).json({ message: err });
    }
  }
};

module.exports = userController;