const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answer-controller');

// 回答を作成
router.post(
  '/create', 
  answerController.createAnswer, 
  answerController.errorHandling
);

// 回答を更新
router.patch(
  '/update/:answerId', 
  answerController.updateAnswer, 
  answerController.errorHandling
);

// 回答を削除
router.delete(
  '/destroy/:answerId', 
  answerController.destroyAnswer, 
  answerController.errorHandling
);

module.exports = router;