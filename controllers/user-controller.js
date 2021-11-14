const db = require("../models/index");
const bcryptjs = require("bcryptjs");

const userAttributes = ["id", "username", "icon_url", "self_introduction"];
const postAttributes = ["id", "title", "property"];
const answerAttributes = [
  "id",
  "content",
  "evaluation",
  "createdAt",
  "updatedAt",
];

const perPage = 15;

const userController = {
  // ユーザー一覧取得
  getUsers(req, res, next) {
    db.user
      .findAll({
        attributes: userAttributes,
        order: [["updatedAt", "DESC"]],
      })
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        next(err);
      });
  },
  // ユーザーのフォローしているユーザーのidのリストを取得
  async getFollowIdList(req, res, next) {
    const idList = await getFollowUserIdList(req.params.userId);

    const userIdList = await db.user
      .findAll({
        where: {
          id: idList,
        },
        attributes: ["id", "createdAt"],
        order: [["createdAt", "DESC"]],
      })
      .catch((err) => {
        next(err);
      });
    res.json(userIdList);
  },
  // ユーザーのフォローしているユーザーのリストを取得
  async getFollow(req, res, next) {
    const idList = await getFollowUserIdList(req.params.userId);
    const page = req.params.page;

    const follows = await db.user
      .findAndCountAll({
        offset: (page - 1) * perPage,
        limit: perPage,
        where: {
          id: idList,
        },
        attributes: ["id", "username", "icon_url", "createdAt"],
        order: [["createdAt", "DESC"]],
      })
      .catch((err) => {
        next(err);
      });
    const total = follows.count > 0 ? Math.ceil(follows.count / perPage) : 1;
    res.json({ total, users: follows.rows });
  },
  // ユーザーのフォロワーのリストを取得
  async getFollower(req, res, next) {
    const userIdList = await db.follow
      .findAll({
        where: {
          followId: req.params.userId,
        },
        attributes: ["userId"],
      })
      .catch((err) => {
        next(err);
      });

    const idList = userIdList.map((item) => item.userId);
    const page = req.params.page;

    const followers = await db.user
      .findAndCountAll({
        offset: (page - 1) * perPage,
        limit: perPage,
        where: {
          id: idList,
        },
        attributes: ["id", "username", "icon_url", "createdAt"],
        order: [["createdAt", "DESC"]],
      })
      .catch((err) => {
        next(err);
      });

    const total =
      followers.count > 0 ? Math.ceil(followers.count / perPage) : 1;
    res.json({ total, users: followers.rows });
  },
  // ユーザー詳細取得
  getUser(req, res, next) {
    db.user
      .findByPk(req.params.userId, {
        attributes: userAttributes,
        include: [
          {
            model: db.answer, // ユーザーの回答一覧
            attributes: answerAttributes,
            include: {
              model: db.post, // 回答の対象となる投稿
              attributes: postAttributes,
            },
          },
        ],
        order: [[db.answer, "createdAt", "DESC"]],
      })
      .then((user) => {
        if (!user) {
          // 存在しない場合は404
          res.status(404).json({ message: "Not found" });
        } else {
          res.json(user);
        }
      })
      .catch((err) => {
        next(err);
      });
  },
  // ユーザー作成
  postUser(req, res, next) {
    req.body.password = bcryptjs.hashSync(req.body.password, 10);

    // req.bodyはpostデータ
    db.user
      .create(req.body)
      .then(() => {
        res.status(201).end();
      })
      .catch((err) => {
        next(err);
      });
  },
  // ユーザー情報変更(Email or password)
  async patchUser(req, res, next) {
    // ユーザーの情報を取得
    const user = await db.user
      .findByPk(req.params.userId)
      .catch((err) => next(err));

    // パスワードの場合
    if (req.body.newPassword) {
      // 現在のパスワードの検証
      if (!bcryptjs.compareSync(req.body.currentPassword, user.password)) {
        // エラーメッセージ
        res.status(400).json({ message: "Invalid current password" });
        return;
      }
      // 新しいパスワードをハッシュ化
      user.password = bcryptjs.hashSync(req.body.newPassword, 10);

      // Emailの場合
    } else {
      user.email = req.body.email;
    }

    // 保存
    await user.save().catch((err) => {
      next(err);
    });

    res.end();
  },
  // ユーザー削除
  deleteUser(req, res, next) {
    db.user
      .destroy({ where: { id: req.params.userId } })
      .then(() => {
        res.end();
      })
      .catch((err) => {
        next(err);
      });
  },
  // ユーザーのプロフィールのカラムを編集
  patchProfile(req, res, next) {
    // iconFileもreq.bodyに含まれるかもしれないのでparamsに必要な情報のみ追加
    const params = {
      username: req.body.username,
      self_introduction: req.body.self_introduction,
    };

    // 画像に変更があった場合
    if (req.body.icon_url) {
      params.icon_url = req.body.icon_url;
    }

    db.user
      .update(params, { where: { id: req.params.userId } })
      .then(() => {
        res.json(params);
      })
      .catch((err) => {
        next(err);
      });
  },
  // エラーハンドリング
  errorHandling(err, req, res, next) {
    // 重複エラー(username or email)
    if (err.original.errno === 1062) {
      res
        .status(500)
        .json({ message: "Duplicate", fields: Object.keys(err.fields) });
    } else {
      res.status(500).json({ message: err });
    }
  },
};

const getFollowUserIdList = async (userId) => {
  const followIdList = await db.follow
    .findAll({
      where: {
        userId,
      },
      attributes: ["followId"],
    })
    .catch((err) => {
      next(err);
    });

  return followIdList.map((item) => item.followId);
};

module.exports = userController;
