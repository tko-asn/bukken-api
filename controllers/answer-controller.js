const db = require("../models/index");

const answerController = {
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
