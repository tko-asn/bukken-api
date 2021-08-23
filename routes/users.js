const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const upload = require('../services/s3');

// ユーザー一覧取得
router.get('/', userController.getUsers, userController.errorHandling);
// ユーザー詳細取得
router.get('/:userId', userController.getUser, userController.errorHandling);
// ユーザー作成
router.post('/register', userController.postUser, userController.errorHandling);
// ユーザー情報更新
router.patch('/change/:userId', userController.patchUser, userController.errorHandling);
// ユーザー削除
router.delete('/delete/:userId', userController.deleteUser, userController.errorHandling);

// プロフィール編集（アイコン画像あり）
router.patch(
  '/profile/:userId/edit',
  upload.single('iconFile'), // 一時ディレクトリにアイコン画像を保存
  userController.patchProfile, // 画像ファイル以外のデータをDBに保存
  userController.errorHandling
);
// プロフィール編集（アイコン画像なし）
router.patch(
  '/profile/:userId/edit/noicon',
  userController.patchProfile, // ユーザー名、自己紹介のみ編集
  userController.errorHandling
)

module.exports = router;
