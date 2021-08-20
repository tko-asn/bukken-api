const Posts = require('../models/post-model');

const postController = {
  // 投稿一覧取得
  getPosts(req, res, next) {
    Posts.list()
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    });
  },
  // 特定のユーザーの投稿一覧を取得
  getUserPosts(req, res, next) {
    Posts.listUserPosts(req.params.userId)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    });
  },
  // 特定の投稿を取得
  getPost(req, res, next) {
    Posts.retrieve(req.params.postId)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    });
  },
  // 投稿を作成
  postPost(req, res, next) {
    Posts.create(req.body)
    .then(() => {
      res.end();
    })
    .catch(err => {
      next(err);
    })
  },
  // 投稿更新
  updatePost(req, res, next) {
    Posts.partialUpdate(req.params.postId, req.body)
    .then(() => {
      res.end();
    })
    .catch(err => {
      next(err);
    })
  },
  // 投稿削除
  deletePost(req, res, next) {
    Posts.delete(req.params.postId)
    .then(() => {
      res.end();
    })
    .catch(err => {
      next(err);
    })
  },
  // エラーハンドリング
  errorHandling(err, req, res, next) {
    if (err) {
      console.log(err);
      res.status(500).json({ message: err })
    }
  }
};

module.exports = postController;