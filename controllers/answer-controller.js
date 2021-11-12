const db = require("../models/index");

const perPage = 10;
const attributes = ["id", "content", "evaluation", "createdAt"];
const postAssociation = {
  // 投稿
  model: db.post,
  attributes: ["id", "title"],
};
const respondentAssociation = {
  // 回答者
  model: db.user,
  attributes: ["id", "username", "icon_url"],
};

const answerController = {
  // ユーザーの回答取得
  getUserAnswers(req, res, next) {
    const ra = { ...respondentAssociation };
    ra.where = { id: req.params.id };
    const page = req.params.page;

    db.answer
      .findAndCountAll({
        offset: (page - 1) * perPage,
        limit: perPage,
        attributes,
        order: [["createdAt", "DESC"]],
        include: [ra, postAssociation],
        distinct: true,
      })
      .then((result) => {
        const total = result.count > 0 ? Math.ceil(result.count / perPage) : 1; // 総ページ数を取得
        res.json({ total, answers: result.rows });
      })
      .catch((err) => {
        next(err);
      });
  },
  // いいねした回答取得
  getLikedAnswers(req, res, next) {
    const page = req.params.page;
    db.answer
      .findAndCountAll({
        offset: (page - 1) * perPage,
        limit: perPage,
        attributes,
        order: [["createdAt", "DESC"]],
        include: [
          postAssociation,
          respondentAssociation,
          {
            model: db.user,
            where: {
              id: req.params.id,
            },
            as: "likedBy", // いいねしたユーザーの関係
          },
        ],
        distinct: true,
      })
      .then((result) => {
        const total = result.count > 0 ? Math.ceil(result.count / perPage) : 1; // 総ページ数を取得
        res.json({ total, answers: result.rows });
      })
      .catch((err) => {
        next(err);
      });
  },
  // 回答作成
  async createAnswer(req, res, next) {
    // ユーザーが既に投稿に回答しているか確認
    const result = await db.answer.findAll({
      where: {
        respondentId: req.body.respondentId,
        questionId: req.body.questionId,
      },
    });

    if (result.length) {
      res.status(403).end();
    } else {
      db.answer
        .create(req.body)
        .then(() => {
          res.status(201).end();
        })
        .catch((err) => {
          next(err);
        });
    }
  },
  // 回答更新
  updateAnswer(req, res, next) {
    db.answer
      .update(req.body, { where: { id: req.params.answerId } })
      .then(() => {
        res.end();
      })
      .catch((err) => {
        next(err);
      });
  },
  // 回答削除
  destroyAnswer(req, res, next) {
    db.answer
      .destroy({ where: { id: req.params.answerId } })
      .then(() => {
        res.end();
      })
      .catch((err) => {
        next(err);
      });
  },
  // いいねを追加
  addLikes(req, res, next) {
    db.UserAnswer.create(req.body)
      .then(() => {
        res.status(201).end();
      })
      .catch((err) => {
        next(err);
      });
  },
  // いいねを解除
  removeLikes(req, res, next) {
    db.UserAnswer.destroy({
      where: { answerId: req.params.answerId, userId: req.params.userId },
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

module.exports = answerController;
