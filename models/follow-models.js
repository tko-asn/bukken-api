const sendQuery = require('../services/send-query');

const table = 'follows';

const followModel = {
  // followデータ取得
  listFollow(userId) {
    // フォローしているユーザーのリストを取得
    const sql = `select id, follow from ${table} 
    where json_contains(user, '"${userId}"', '$.id')`;
    
    return sendQuery(sql)
    .then(result => Promise.resolve(result))
    .catch(err => Promise.reject(err));
  },
  listFollower(followId) {
    // フォロワーのリストを取得
    const sql = `select id, user from ${table} 
    where json_contains(follow, '"${followId}"', '$.id')`;
    
    return sendQuery(sql)
    .then(result => Promise.resolve(result))
    .catch(err => Promise.reject(err));
  },
  // followデータ作成
  create(user, follow) {
    const sql = `insert into ${table} 
    (user, follow) values 
    ('${JSON.stringify(user)}', '${JSON.stringify(follow)}');`; 
    // userカラムはフォローする側のユーザーのid, username, iconURLのJSONデータ
    // followカラムはフォローされる側のユーザーのid, username, iconURLのJSONデータ

    return sendQuery(sql)
    .catch(err => Promise.reject(err));
  },
  // followデータ削除
  delete(followId) {
    const sql = `delete from ${table} 
    where id = ${followId}`;
    
    return sendQuery(sql)
    .catch(err => Promise.reject(err));
  }
};

module.exports = followModel;