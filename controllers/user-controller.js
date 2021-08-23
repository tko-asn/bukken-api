const db = require('../models/index');
const bcrypt = require('bcrypt');

const userController = {
  // ユーザー一覧取得
  getUsers(req, res, next) {
    db.user.findAll()
      .then(users => {
        res.json(users);
      }).catch(err => {
        next(err);
      });
  },
  // ユーザー詳細取得
  getUser(req, res, next) {
    db.user.findByPk(req.params.userId)
      .then(user => {
        if (!user) {
          // 存在しない場合は404
          res.status(404).json({ massage: 'Not found' });
        } else {
          res.json(user);
        }
      }).catch(err => {
        next(err);
      });
  },
  // ユーザー作成
  postUser(req, res, next) {
    req.body.password = bcrypt.hashSync(req.body.password, 10);

    // req.bodyはpostデータ
    db.user.create(req.body)
      .then(() => {
        res.end();
      }).catch(err => {
        next(err);
      });
  },
  // ユーザー情報変更(Email or password)
  async patchUser(req, res, next) {
    // ユーザーの情報を取得
    const user = await db.user.findByPk(req.params.userId).catch(err => next(err));

    // パスワードの場合
    if (req.body.newPassword) {
      // 現在のパスワードの検証
      if (!bcrypt.compareSync(req.body.currentPassword, user.password)) {
        // エラーメッセージ
        res.status(400).json({ massage: 'Invalid current password' });
        return;
      }
      // 新しいパスワードをハッシュ化
      user.password = bcrypt.hashSync(req.body.newPassword, 10);

      // Emailの場合
    } else {
      user.email = req.body.email;
    }

    // 保存
    user.save();

    res.end()
  },
  // ユーザー削除
  deleteUser(req, res, next) {
    db.user.destroy({ where: { id: req.params.userId } })
      .then(() => {
        res.end();
      })
      .catch(err => {
        next(err);
      })
  },
  // ユーザーのプロフィールのカラムを編集
  patchProfile(req, res, next) {
    // iconFileもreq.bodyに含まれるかもしれないのでparamsに必要な情報のみ追加
    const params = {
      username: req.body.username,
      self_introduction: req.body.self_introduction
    }

    // 画像に変更があった場合
    if (req.body.icon_url) {
      params.icon_url = req.body.icon_url;
    }

    db.user.update(params, { where: { id: req.params.userId } })
      .then(() => {
        res.json(params);
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