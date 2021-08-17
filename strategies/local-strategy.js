const passportLocal = require('passport-local');
const sendQuery = require('../services/send-query');
const bcrypt = require('bcrypt');

// ログイン処理(loginのStrategy)
const LocalStrategy = passportLocal.Strategy;

const strategy = new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false,
}, (username, password, done) => {
  // ユーザー名かメールアドレスでログイン
  const sql = `select * from user 
  where username = '${username}' or email = '${username}';`

  // 合致するデータをDBから取得
  sendQuery(sql).then(result => {
    const user = result[0];

    // パスワードの検証
    if (user && bcrypt.compareSync(password, user.password)) {
      // passwordは削除
      delete user.password;
      done(null, user) // req.userにはpasswordとemail以外の情報を指定
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