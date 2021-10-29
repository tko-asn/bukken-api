const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment-controller");

// コメント作成
router.post(
  "/create",
  commentController.createComment,
  commentController.errorHandling
);

// コメント編集
router.patch(
  "/update/:commentId",
  commentController.updateComment,
  commentController.errorHandling
);

// コメント削除
router.delete(
  "/delete/:commentId",
  commentController.deleteComment,
  commentController.errorHandling
);

module.exports = router;
