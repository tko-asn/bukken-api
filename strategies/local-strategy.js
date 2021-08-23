const passportLocal = require('passport-local');
const db = require('../models/index');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

// ログイン処理(loginのStrategy)
const LocalStrategy = passportLocal.Strategy;

const strategy = new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false,
}, (username, password, done) => {
  db.user.findOne({
    where: {
      [Sequelize.Op.or]: {
        username: username,
        email: username,
      }
    }
  }).then(user => {
    // パスワードの検証
    if (user && bcrypt.compareSync(password, user.password)) {
      // passwordは削除
      delete user.password;
      done(null, user) // req.userにはpassword以外の情報を指定

      // ログイン情報が正しくない場合
    } else {
      done(
        null,
        false,
      );
    };
  });
});

module.exports = strategy;