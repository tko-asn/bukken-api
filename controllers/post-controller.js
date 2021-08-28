const db = require('../models/index');

const attributes = ['id', 'title', 'text', 'updatedAt'];
const userAttributes = ['id', 'username', 'icon_url'];
const answerAttributes = ['id', 'content', 'updatedAt'];

const likedAnswerAssociation = { // 投稿にいいねしたユーザーを取得
  model: db.user,
  as: 'likedBy',
  attributes: ['id'],
};

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
      include: [
        { model: db.user, attributes: userAttributes }, // 投稿者
        { 
          model: db.answer, // 投稿に対する回答
          attributes: answerAttributes, 
          include: [
            { model: db.user, attributes: userAttributes }, // 回答者
            likedAnswerAssociation, // いいねしたユーザー
          ], 
        },
      ]
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
  // お気に入りの投稿を作成
  setFavoritePost(req, res, next) {
    db.UserPost.create(req.body)
      .then(() => {
        res.end();
      })
      .catch(err => {
        next(err);
      });
  },
  // お気に入りの投稿を削除
  removeFavoritePost(req, res, next) {
    db.UserPost.destroy({
      where: {
        userId: req.params.userId,
        postId: req.params.postId,
      }
    }).then(() => {
      res.end();
    }).catch(err => {
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