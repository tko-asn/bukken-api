const db = require("../models/index");

const commentController = {
  // コメント作成
  createComment(req, res, next) {
    db.comment
      .create(req.body)
      .then(() => {
        res.status(201).end();
      })
      .catch((err) => {
        next(err);
      });
  },
  // コメント編集
  updateComment(req, res, next) {
    db.comment
      .update(req.body, { where: { id: req.params.commentId } })
      .then(() => {
        res.end();
      })
      .catch((err) => {
        next(err);
      });
  },
  // コメント削除
  deleteComment(req, res, next) {
    db.comment
      .destroy({ where: { id: req.params.commentId } })
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

module.exports = commentController;
