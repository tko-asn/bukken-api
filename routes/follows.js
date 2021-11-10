const express = require("express");
const router = express.Router();
const followController = require("../controllers/follow-controller");

// followデータ作成
router.post(
  "/create",
  followController.postFollow,
  followController.errorHandling
);

// followデータ削除
router.delete(
  "/delete/:followId/:userId",
  followController.deleteFollow,
  followController.errorHandling
);

module.exports = router;
