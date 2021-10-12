const passportJwt = require('passport-jwt');
const db = require('../models/index');

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const strategy = new JwtStrategy({
  // jsonwebtokenのsign()の第二引数と同じ値
  secretOrKey: process.env.secret,
  // bearerトークンとして認証
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // 以下検証処理
}, (jwtPayload, done) => {
  // jwtPayloadはトークンがデコードされたデータ

  db.user.findByPk(jwtPayload.id)
    .then(user => {
      // ユーザーの検証
      if (user) {
        delete user.password; // passwordはオブジェクトから削除
        done(null, user); // password以外のカラム(id, username, email, self_introduction, icon_url)
      } else {
        done(null, false);
      }
    });
});

module.exports = strategy;