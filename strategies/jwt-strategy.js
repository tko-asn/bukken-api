const passportJwt = require('passport-jwt');
const userModel = require('../models/user-model');
const secret = require('../config/secret');

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const strategy = new JwtStrategy({
  // jsonwebtokenのsign()の第二引数と同じ値
  secretOrKey: secret,
  // bearerトークンとして認証
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // 以下検証処理
}, (jwtPayload, done) => {
  // jwtPayloadはトークンがデコードされたデータ

  const sql = `select * from user where id = '${jwtPayload.id}'`;

  userModel.sendQuery(sql).then(result => {
    const user = result[0];

    // ユーザーの検証
    if (user) {
      // passwordはオブジェクトから削除
      delete user.password;
      // 成功
      done(null, user); // emailとpassword以外のカラム(id, username, self_introduction, icon_url)
    } else {
      // 失敗
      done(null, false);
    };
  });
});

module.exports = strategy;