const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
AWS.config.update({ region: 'ap-northeast-1' });

// S3インスタンス作成
const s3 = new AWS.S3();

// 画像ファイルをS3に保存
module.exports = multer({
  storage: multerS3({
    s3,
    bucket: 'yobo-development',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname }); // fieldnameはiconFile
    },
    key: (req, file, cb) => {
      const fileKey = 'icon/' + Date.now() + file.originalname;
      // DBのカラム名に合わせてスネークケース
      req.body.icon_url = process.env.s3BucketURL + fileKey;
      cb(null, fileKey); // 一意のキーを作成
    },
  })
});



