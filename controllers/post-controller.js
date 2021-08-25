const db = require('../models/index');

const attributes = ['id', 'title', 'text', 'updatedAt'];
const userAttributes = ['username', 'icon_url']

const postController = {
  // 投稿一覧取得
  getPosts(req, res, next) {
    db.post.findAll({
      order: [
        ['updatedAt', 'DESC'], // 投稿日時が遅い順
      ],
      attributes,
      include: { model: db.user, attributes: userAttributes }
    })
      .then(posts => {
        res.json(posts);
      })
      .catch(err => {
        next(err);
      });
  },
  // 特定のユーザーの投稿一覧を取得
  getUserPosts(req, res, next) {
    db.post.findAll({
      where: { authorId: req.params.userId },
      order: [
        ['updatedAt', 'DESC'],
      ],
      attributes,
      include: { model: db.user, attributes: userAttributes }
    })
      .then(posts => {
        res.json(posts);
      })
      .catch(err => {
        next(err);
      });
  },
  // フォローしているユーザーの投稿を取得
  getFolloweePosts(req, res, next) {
    db.post.findAll({
      where: { authorId: req.body.followsId }, // req.body.followsIdはユーザーのidのリスト
      order: [
        ['updatedAt', 'DESC']
      ],
      attributes,
      include: { model: db.user, attributes: userAttributes }
    })
      .then(posts => {
        res.json(posts);
      })
      .catch(err => {
        next(err);
      })
  },
  // 特定の投稿を取得
  getPost(req, res, next) {
    db.post.findByPk(req.params.postId, {
      attributes,
      include: { model: db.user, attributes: userAttributes }
    })
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        next(err);
      });
  },
  // 投稿を作成
  createPost(req, res, next) {
    db.post.create(req.body)
      .then(() => {
        res.end();
      })
      .catch(err => {
        next(err);
      })
  },
  // 投稿更新
  updatePost(req, res, next) {
    db.post.update(req.body, { where: { id: req.params.postId } })
      .then(() => {
        res.end();
      })
      .catch(err => {
        next(err);
      })
  },
  // 投稿削除
  deletePost(req, res, next) {
    db.post.destroy({ where: { id: req.params.postId } })
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