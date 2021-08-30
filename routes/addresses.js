const express = require('express');
const router = express.Router();
const addressController = require('../controllers/address-controller');

// 住所の取得または作成
router.post(
  '/find/or/create', 
  addressController.getOrCreateAddress, 
  addressController.errorHandling,
);

module.exports = router;
