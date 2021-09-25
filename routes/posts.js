const express = require('express');
const router = express.Router();
const postController = require('../controllers/post-controller');

// 特定数の投稿を取得
router.get(
  '/page/:page',
  postController.getPosts,
  postController.errorHandling
);

// 特定のユーザーの投稿一覧を取得
router.get(
  '/:userId/page/:page',
  postController.getUserPosts,
  postController.errorHandling
);

// フォローしているユーザーたちの投稿一覧を取得
router.post(
  '/followee/page/:page',
  postController.getFolloweePosts,
  postController.errorHandling
);

// 特定の投稿を取得
router.get(
  '/post/:postId',
  postController.getPost,
  postController.errorHandling
);

// 投稿を作成
router.post(
  '/post/new',
  postController.createPost,
  postController.errorHandling
);

// 投稿を編集
router.patch(
  '/update/:postId',
  postController.updatePost,
  postController.errorHandling
);

// 投稿を削除
router.delete(
  '/delete/:postId',
  postController.deletePost,
  postController.errorHandling
);

// お気に入りの投稿を作成
router.post(
  '/create/favorite',
  postController.setFavoritePost,
  postController.errorHandling
);

// お気に入りの投稿を削除
router.delete(
  '/:postId/remove/favorite/:userId',
  postController.removeFavoritePost,
  postController.errorHandling
);

// 投稿にカテゴリーをセット
router.post(
  '/set/category',
  postController.setCategory,
  postController.errorHandling,
);

// 投稿からカテゴリーを外す
router.delete(
  '/:postId/remove/category/:categoryId',
  postController.removeCategory,
  postController.errorHandling,
);

// 投稿フィルタリング
router.get(
  '/filter/query/page/:page',
  postController.filterPosts,
  postController.errorHandling,
);

// 投稿キーワード検索
router.get(
  '/search/query/page/:page',
  postController.searchPosts,
  postController.errorHandling,
)

router.get(
  '/favorite/user/:userId/page/:page',
  postController.getFavoritePosts
)

module.exports = router;