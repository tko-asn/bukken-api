const sendQuery = require('../services/send-query');
const uuid = require('uuid4');

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
  create(data) {
    // uuidを発行
    const id = uuid();

    const sql = `insert into ${table} 
    (id, user, follow) values 
    ('${id}', '${JSON.stringify(data.user)}', '${JSON.stringify(data.follow)}');`; 
    // userカラムはフォローする側のユーザーのid, username, iconURLのJSONデータ
    // followカラムはフォローされる側のユーザーのid, username, iconURLのJSONデータ

    return sendQuery(sql)
    .then(() => Promise.resolve({ followId: id })) // uuidを返す
    .catch(err => Promise.reject(err));
  },
  // followデータ削除
  delete(followId) {
    const sql = `delete from ${table} 
    where id = '${followId}'`;
    
    return sendQuery(sql)
    .catch(err => Promise.reject(err));
  }
};

module.exports = followModel;