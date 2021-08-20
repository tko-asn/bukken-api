const sendQuery = require('../services/send-query');
const uuid = require('uuid4');

const table = 'post';

const postModel = {
  // 投稿一覧取得
  list() {
    // 更新日時の降順に取得
    const sql = `select * from ${table} order by updated_at desc;`;

    return sendQuery(sql)
      .then(result => Promise.resolve(result))
      .catch(err => Promise.reject(err));
  },
  // 特定のユーザーの投稿一取得
  listUserPosts(userId) {
    // 更新日時の降順に取得
    const sql = `select * from ${table} where author_id = '${userId}'
      order by updated_at desc;`;

    return sendQuery(sql)
      .then(result => Promise.resolve(result))
      .catch(err => Promise.reject(err));
  },
  // 投稿詳細取得
  retrieve(postId) {
    const sql = `select * from ${table} where id = '${postId}';`;

    return sendQuery(sql)
      .then(result => Promise.resolve(result[0]))
      .catch(err => Promise.reject(err));
  },
  // 投稿作成
  create(data) {
    // dataの要素 => title, text, userId

    // UUIDを発行
    const id = uuid();

    const sql = `insert into ${table} (id, title, text, author_id) 
      values ('${id}', '${data.title}', '${data.text}', '${data.authorId}');`;

    return sendQuery(sql)
      .catch(err => Promise.reject(err));
  },
  // 投稿更新
  partialUpdate(postId, data) {
    const sql = `update ${table}
      set title = '${data.title}', text = '${data.text}' where id = '${postId}'`;

    return sendQuery(sql)
      .catch(err => Promise.reject(err));
  },
  // 投稿削除
  delete(postId) {
    const sql = `delete from ${table} where id = '${postId}';`;

    return sendQuery(sql)
      .catch(err => Promise.reject(err));
  },
};

module.exports = postModel;