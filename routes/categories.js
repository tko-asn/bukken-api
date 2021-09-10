const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category-controller');

// カテゴリーの取得または作成
router.post(
  '/find/or/create', 
  categoryController.gerOrCreateCategorys, 
  categoryController.errorHandling,
);

module.exports = router;