const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const secret = requier('../config/secret');

const localStrategy = require('../strategies/local-strategy');
const jwtStrategy = require('../strategies/jwt-strategy');

// ログイン
router.post('/login',
  // 認証ミドルウェア
  passport.authenticate('local', {
    session: false, // セッションを無効化
    failWithError: true, // エラーハンドラーを自作できるようにする
  }), (req, res) => {
    // トークン取得ミドルウェア

    const user = req.user; // authenticate()でセットされたユーザー情報

    // ユーザー情報(id, usernameのみ)をもとにトークンを作成
    const token = jwt.sign(
      { id: user.id, username: user.username }, 
      secret, 
      { expiresIn: '30m' },
    );

    res.json(
      {
        token,
        // ユーザーのpassword以外のカラム
        id: user.id,
        email: user.email,
        username: user.username,
        self_introduction: user.self_introduction,
        icon_url: user.icon_url,
      }
    );
  }, (err, req, res, next) => {
    // エラー処理ミドルウェア

    if (err || !req.user) {
      // 認証エラー 401
      res.status(401).json({ message: 'Unauthorized' });
    }
  },
);

// トークン検証
router.get('/verify',
  passport.authenticate('jwt', {
    session: false,
    failWithError: true,
  }), (req, res) => {
    // id, email, username, self_introduction, icon_urlを返す
    res.json(req.user);
  }, (err, req, res, next) => {
    if (err) {
      res.status(401).json({ message: 'Unauthorized' });
    }
  },
);

// ログアウト
router.get('/logout', (req, res) => {
  // req.userプロパティを削除
  req.logout();
  res.end();
});

// ログイン用Strategy
passport.use('local', localStrategy);
// ログイン状態確認用Strategy
passport.use('jwt', jwtStrategy);

module.exports = router;