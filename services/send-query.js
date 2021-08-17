const mysql = require('mysql');
const dbConf = require('../config/db');

// DBへクエリを送る関数
const sendQuery = (sql) => {
  // DB接続設定
  const con = mysql.createConnection(dbConf);
  // DB接続
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
    // 接続終了
    con.end();
  });
};

module.exports = sendQuery;