const express = require('express');
const router = express.Router();
const postController = require('../controllers/post-controller');

// 投稿一覧を取得
router.get('/', postController.getPosts, postController.errorHandling);

// 特定のユーザーの投稿一覧を取得
router.get('/:userId', postController.getUserPosts, postController.errorHandling);

// 特定の投稿を取得
router.get('/post/:postId', postController.getPost, postController.errorHandling);

// 投稿を作成
router.post('/post/new', postController.postPost, postController.errorHandling);

// 投稿を編集
router.patch('/update/:postId', postController.updatePost, postController.errorHandling);

// 投稿を削除
router.delete('/delete/:postId', postController.deletePost, postController.errorHandling);

module.exports = router;