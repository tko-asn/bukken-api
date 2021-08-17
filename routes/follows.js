const express = require('express');
const router = express.Router();
const followController = require('../controllers/follow-controller');

// 特定のユーザーのfollowデータのリスト取得
router.get('/follow/:userId', followController.getMyFollow);

// 特定のユーザーのフォロワーのリスト取得
router.get('/follower/:followId', followController.getMyFollower);

// followデータ作成
router.post('/create', followController.postFollow);

// followデータ削除
router.delete('/delete/:followId', followController.deleteFollow);

module.exports = router;