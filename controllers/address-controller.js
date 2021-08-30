const db = require('../models/index');

const addressController = {
  // 住所データの取得または作成
  getOrCreateAddress(req, res, next) {
    db.address.findOrCreate({
      where: { 
        postalCode: req.body.postalCode, // 郵便番号
        townName: req.body.townName, // 町名・番地
        buildingName: req.body.buildingName // アパート・マンション名
      },
      defaults: { // 新規登録するデータ
        postalCode: req.body.postalCode,
        prefecture: req.body.prefecture,
        municipality: req.body.municipality,
        townName: req.body.townName,
        buildingName: req.body.buildingName
      }
    }).then(([address, created]) => {
      res.json({ addressId: address.id }); // 住所のidのみ返す
    }).catch(err => {
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

module.exports = addressController;