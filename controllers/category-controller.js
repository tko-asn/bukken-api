const db = require('../models/index');


const findOrCreateCategory = categoryObj => {
  // カテゴリーのID取得または新規取得
  return db.category.findOrCreate({
    where: {
      firstCategory: categoryObj.first,
      secondCategory: categoryObj.second,
    },
    defaults: {
      firstCategory: categoryObj.first,
      secondCategory: categoryObj.second,
    }
  })
    .then(([category, created]) => Promise.resolve(category.id)) // カテゴリーのIDのみ返す
    .catch(err => Promise.reject(err));
};

const categoryController = {
  // 複数のカテゴリーデータを取得・作成しそのIDの配列を作成
  gerOrCreateCategorys(req, res, next) {
    Promise.all( // 非同期処理の配列をPromise.all()で実行
      req.body.map(async categoryObj => await findOrCreateCategory(categoryObj))
    )
      .then(values => {
        res.json(values); // カテゴリーのIDのリストを返す
      })
      .catch(err => {
        next(err);
      });
  },
  // エラーハンドリング
  errorHandling(err, req, res, next) {
    if (err) {
      console.log(err);
      res.status(500).json({ message: err })
    }
  }
};

module.exports = categoryController;