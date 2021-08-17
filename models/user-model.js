const bcrypt = require('bcrypt');
const uuid = require('uuid4');
const sendQuery = require('../services/send-query');

// テーブル名
const table = 'user';

userModel = {
  // ユーザー一覧取得
  list() {
    const sql = `select id, username from ${table};`;
    return sendQuery(sql)
      .then(result => Promise.resolve(result))
      .catch(err => Promise.reject(err));
  },
  // ユーザー詳細（プロフィール情報含む）取得
  retrieve(id) {
    // URLからidを取得
    const sql = `select id, username, self_introduction, icon_url 
    from ${table} where id = '${id}';`;

    return sendQuery(sql)
      // resultはArray型
      .then(result => Promise.resolve(result[0]))
      .catch(err => Promise.reject(err));
  },
  // ユーザー作成
  create(data) {
    // パスワードをハッシュ化
    const hashedPassword = bcrypt.hashSync(data.password, 10);

    // UUIDを発行
    const id = uuid();

    // email送信処理を書く

    const sql = `insert into ${table} 
    (id, username, password, email) values 
    ('${id}', '${data.username}', '${hashedPassword}', '${data.email}');`;

    return sendQuery(sql)
      .catch(err => Promise.reject(err));
  },
  // ユーザー情報変更(emailかpasswordのどちらかのみ変更可)
  async partialUpdate(id, data) {
    let sql;

    // パスワード変更
    if (data.newPassword) {
      // 現在のパスワードを取得
      const get_password_sql = `select password from ${table} where id = '${id}';`;

      await sendQuery(get_password_sql)
      .then(result => {
          // 現在のパスワードの検証
          if (!bcrypt.compareSync(data.currentPassword, result[0].password)) {
            // 検証失敗したらthenを終了
            return;
          }

          // 検証成功
          // 新しいパスワードをハッシュ化
          const hashedNewPassword = bcrypt.hashSync(data.newPassword, 10);

          sql = `update ${table}
          set password = '${hashedNewPassword}'
          where id = '${id}';`;
        });
        
      // email変更
    } else {
      sql = `update ${table} 
      set email = '${data.email}' 
      where id = '${id}';`;
    }

    // パスワードの検証に失敗してsqlがundefinedの場合
    if (!sql) {
      return Promise.reject('Invalid current password');
    }
    
    return sendQuery(sql)
      .catch(err => Promise.reject(err));
  },
  // ユーザー削除
  delete(id) {
    const sql = `delete from ${table} where id = '${id}'`;

    return sendQuery(sql)
      .catch(err => Promise.reject(err));
  },
  // ユーザーのプロフィール編集
  partialUpdateProfile(id, req) {
    let sql;
    // アイコン画像に変更がなかった場合
    if (!req.body.icon_url) {
      // 自己紹介とユーザー名のみ編集可
      sql = `update ${table}
      set username = '${req.body.username}', 
      self_introduction = '${req.body.self_introduction}'
      where id = '${id}';`;

      // アイコン画像に変更があった場合
    } else {
      // アイコンURLと自己紹介とユーザー名のみ編集可
      sql = `update ${table}
      set username = '${req.body.username}', 
      icon_url = '${req.body.icon_url}',
      self_introduction = '${req.body.self_introduction}'
      where id = '${id}';`;
    }

    return sendQuery(sql)
      .then(() => Promise.resolve(req.body)) // 登録したプロフィールの情報を返す
      .catch(err => Promise.reject(err));
  }
};

module.exports = userModel;