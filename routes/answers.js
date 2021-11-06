const express = require("express");
const router = express.Router();
const answerController = require("../controllers/answer-controller");

// ユーザーの回答を取得
router.get(
  "/user/:id/:page",
  answerController.getUserAnswers,
  answerController.errorHandling
);

// いいねした回答を取得
router.get(
  "/liked/answer/:id/:page",
  answerController.getLikedAnswers,
  answerController.errorHandling
);

// 回答を作成
router.post(
  "/create",
  answerController.createAnswer,
  answerController.errorHandling
);

// 回答を更新
router.patch(
  "/update/:answerId",
  answerController.updateAnswer,
  answerController.errorHandling
);

// 回答を削除
router.delete(
  "/destroy/:answerId",
  answerController.destroyAnswer,
  answerController.errorHandling
);

// いいねを追加
router.post(
  "/add/like",
  answerController.addLikes,
  answerController.errorHandling
);

// いいねを解除
router.delete(
  "/remove/like/:answerId/user/:userId",
  answerController.removeLikes,
  answerController.errorHandling
);

module.exports = router;
