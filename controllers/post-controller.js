const db = require("../models/index");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const attributes = ["id", "title", "property", "text", "updatedAt"];
const userAttributes = ["id", "username", "icon_url"];
const answerAttributes = ["id", "content", "updatedAt"];
const addressAttributes = [
  "postalCode",
  "prefecture",
  "municipality",
  "townName",
  "buildingName",
];
const categoryAttributes = ["firstCategory", "secondCategory"];

const userAssociation = {
  // 投稿者または回答者
  model: db.user,
  attributes: userAttributes,
};

const likedAnswerAssociation = {
  // 投稿にいいねしたユーザーを取得
  model: db.user,
  as: "likedBy",
  attributes: ["id"],
};

const addressAssociation = {
  // 所在地を取得
  model: db.address,
  attributes: addressAttributes,
};

const categoryAssociation = {
  // カテゴリーを取得
  model: db.category,
  attributes: categoryAttributes,
};

const favoritePostsAssociation = {
  // お気に入りの投稿を取得
  model: db.user,
  attributes: [], // 自分の情報は無し
  as: "favoritePosts",
};

const perPage = 10; // 1ページ当たりの投稿数

const postController = {
  // 特定数の投稿を取得
  getPosts(req, res, next) {
    const page = req.params.page;
    db.post
      .findAndCountAll({
        offset: (page - 1) * perPage,
        limit: perPage,
        order: [["updatedAt", "DESC"]],
        attributes,
        include: [
          userAssociation,
          categoryAssociation, // カテゴリー
          addressAssociation, // 住所
        ],
        distinct: true,
      })
      .then((result) => {
        const total = result.count > 0 ? Math.ceil(result.count / perPage) : 1; // 総ページ数を取得
        res.json({ total, posts: result.rows });
      })
      .catch((err) => {
        next(err);
      });
  },
  // 特定のユーザーの投稿一覧を取得
  getUserPosts(req, res, next) {
    const page = req.params.page;
    db.post
      .findAndCountAll({
        offset: (page - 1) * perPage,
        limit: perPage,
        where: { authorId: req.params.userId },
        order: [["updatedAt", "DESC"]],
        attributes,
        include: [
          userAssociation,
          addressAssociation, // 住所
          categoryAssociation, // カテゴリー
        ],
        distinct: true,
      })
      .then((result) => {
        const total = result.count > 0 ? Math.ceil(result.count / perPage) : 1; // 総ページ数を取得
        res.json({ total, posts: result.rows });
      })
      .catch((err) => {
        next(err);
      });
  },
  // フォローしているユーザーの投稿を取得
  getFolloweePosts(req, res, next) {
    const page = req.params.page;
    db.post
      .findAndCountAll({
        offset: (page - 1) * perPage,
        limit: perPage,
        where: { authorId: req.body.followsId }, // req.body.followsIdはユーザーのidのリスト
        order: [["updatedAt", "DESC"]],
        attributes,
        include: [
          userAssociation,
          addressAssociation, // 住所
          categoryAssociation, // カテゴリー
        ],
        distinct: true,
      })
      .then((result) => {
        const total = result.count > 0 ? Math.ceil(result.count / perPage) : 1; // 総ページ数を取得
        res.json({ total, posts: result.rows });
      })
      .catch((err) => {
        next(err);
      });
  },
  // ユーザーのお気に入りの投稿を取得
  getFavoritePosts(req, res, next) {
    const fpa = { ...favoritePostsAssociation };
    fpa.where = { id: req.params.userId };
    const page = req.params.page;
    db.post
      .findAndCountAll({
        offset: (page - 1) * perPage,
        limit: perPage,
        attributes,
        include: [
          fpa, // お気に入りの投稿を取得するため
          userAssociation, // 投稿者の情報を取得
          addressAssociation,
          categoryAssociation,
        ],
        order: [["updatedAt", "DESC"]],
        distinct: true,
      })
      .then((result) => {
        const total = result.count > 0 ? Math.ceil(result.count / perPage) : 1; // 総ページ数を取得
        res.json({ total, posts: result.rows });
      })
      .catch((err) => {
        next(err);
      });
  },
  // 特定の投稿を取得
  getPost(req, res, next) {
    db.post
      .findByPk(req.params.postId, {
        attributes,
        include: [
          userAssociation, // 投稿者
          addressAssociation, // 住所
          {
            model: db.answer, // 投稿に対する回答
            attributes: answerAttributes,
            include: [
              { ...userAssociation }, // 回答者（コピーしたものを使わないとエラー発生）
              likedAnswerAssociation, // いいねしたユーザー
            ],
          },
          categoryAssociation,
        ],
        order: [[db.answer, "updatedAt", "ASC"]],
      })
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        next(err);
      });
  },
  // 投稿を作成
  createPost(req, res, next) {
    db.post
      .create(req.body)
      .then((post) => {
        res.json({ id: post.id }); // カテゴリ登録時に使用するID
      })
      .catch((err) => {
        next(err);
      });
  },
  // 投稿更新
  updatePost(req, res, next) {
    db.post
      .update(req.body, { where: { id: req.params.postId } })
      .then(() => {
        res.end();
      })
      .catch((err) => {
        next(err);
      });
  },
  // 投稿削除
  deletePost(req, res, next) {
    db.post
      .destroy({ where: { id: req.params.postId } })
      .then(() => {
        res.end();
      })
      .catch((err) => {
        next(err);
      });
  },
  // お気に入りの投稿を作成
  setFavoritePost(req, res, next) {
    db.UserPost.create(req.body)
      .then(() => {
        res.end();
      })
      .catch((err) => {
        next(err);
      });
  },
  // お気に入りの投稿を削除
  removeFavoritePost(req, res, next) {
    db.UserPost.destroy({
      where: {
        userId: req.params.userId,
        postId: req.params.postId,
      },
    })
      .then(() => {
        res.end();
      })
      .catch((err) => {
        next(err);
      });
  },
  // 投稿にカテゴリをセット
  setCategory(req, res, next) {
    db.PostCategory.create(req.body)
      .then(() => {
        res.end();
      })
      .catch((err) => {
        next(err);
      });
  },
  // 投稿からカテゴリを削除
  removeCategory(req, res, next) {
    db.PostCategory.destroy({
      where: {
        postId: req.params.postId,
        categoryId: req.params.categoryId,
      },
    })
      .then(() => {
        res.end();
      })
      .catch((err) => {
        next(err);
      });
  },
  // 投稿のフィルタリング
  filterPosts(req, res, next) {
    // 指定のページ
    const page = req.params.page;

    // 絞り込みの設定
    const filterOptions = {
      offset: (page - 1) * perPage,
      limit: perPage,
      attributes,
      order: [["updatedAt", "DESC"]],
      include: [
        userAssociation, // 投稿者
      ],
      distinct: true,
    };

    // カテゴリー
    if (req.query.categories) {
      // categoriesの値が空の配列の場合queryにcategoriesが存在しないのでlengthをつけない
      const ca = { ...categoryAssociation }; // 投稿とカテゴリーの関係をコピー
      ca.where = {
        secondCategory: { [Op.in]: req.query.categories }, // 第二カテゴリーの配列
      };
      filterOptions.include.push(ca); // カテゴリーでの絞り込みの設定を追加
    }

    // 地域
    if (req.query.address) {
      const aa = { ...addressAssociation }; // 投稿と住所との関係をコピー
      aa.where = {
        postalCode: req.query.address, // 郵便番号で絞り込み
      };
      filterOptions.include.push(aa); // 住所での絞り込みの設定を追加

      // 住所のクエリパラメータが存在しない場合
    } else {
      filterOptions.include.push(addressAssociation); // 通常の関係をセット
    }

    // お気に入りの投稿表示中の絞り込み
    if (req.query.userId) {
      const fpa = { ...favoritePostsAssociation };
      fpa.where = { id: req.query.userId };
      filterOptions.include.push(fpa);

      // フォローしているユーザーの投稿or自分の投稿を表示中の絞り込み
    } else if (req.query.authorId) {
      const postConditions = {};
      postConditions.authorId = req.query.authorId;
      filterOptions.where = postConditions;
    }

    db.post
      .findAndCountAll(filterOptions)
      .then((result) => {
        const total = result.count > 0 ? Math.ceil(result.count / perPage) : 1; // 総ページ数を取得
        res.json({ total, posts: result.rows });
      })
      .catch((err) => {
        next(err);
      });
  },
  // 投稿キーワード検索
  searchPosts(req, res, next) {
    const page = req.params.page;

    // 絞り込みの設定
    const searchOptions = {
      offset: (page - 1) * perPage,
      limit: perPage,
      attributes,
      order: [
        ["updatedAt", "DESC"], // 投稿日時が遅い順
      ],
      include: [
        userAssociation, // 投稿者
        addressAssociation, // 住所
      ],
      where: {
        [Op.or]: {
          property: { [Op.like]: "%" + req.query.keyword + "%" },
          "$address.prefecture$": { [Op.like]: "%" + req.query.keyword + "%" },
          "$address.municipality$": {
            [Op.like]: "%" + req.query.keyword + "%",
          },
          "$address.townName$": { [Op.like]: "%" + req.query.keyword + "%" },
          "$address.buildingName$": {
            [Op.like]: "%" + req.query.keyword + "%",
          },
        },
      },
      subQuery: false,
      distinct: true,
    };

    // お気に入りの投稿表示中の絞り込み
    if (req.query.userId) {
      const fpa = { ...favoritePostsAssociation };
      fpa.where = { id: req.query.userId };
      searchOptions.include.push(fpa);

      // フォローしているユーザーの投稿or自分の投稿を表示中の絞り込み
    } else if (req.query.authorId) {
      searchOptions.where.authorId = req.query.authorId;
    }

    db.post
      .findAndCountAll(searchOptions)
      .then((result) => {
        const total = result.count > 0 ? Math.ceil(result.count / perPage) : 1; // 総ページ数を取得
        res.json({ total, posts: result.rows });
      })
      .catch((err) => {
        next(err);
      });
  },
  // エラーハンドリング
  errorHandling(err, req, res, next) {
    if (err) {
      console.log(err);
      res.status(500).json({ message: err });
    }
  },
};

module.exports = postController;
