const express = require("express");
const router = express.Router();
const followController = require("../controllers/follow-controller");

// 特定のユーザーのfollowデータのリスト取得
router.get(
  "/follow/:userId",
  followController.getFollow,
  followController.errorHandling
);

// 特定のユーザーのフォロワーのリスト取得
router.get(
  "/follower/:followId",
  followController.getFollower,
  followController.errorHandling
);

// followデータ作成
router.post(
  "/create",
  followController.postFollow,
  followController.errorHandling
);

// followデータ削除
router.delete(
  "/delete/:followId",
  followController.deleteFollow,
  followController.errorHandling
);

module.exports = router;
