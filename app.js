var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

// 開発環境の場合ファイルから環境変数を読み込む
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// ルーティングの読み込み
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const followsRouter = require("./routes/follows");
const postsRouter = require("./routes/posts");
const answersRouter = require("./routes/answers");
const addressesRouter = require("./routes/addresses");
const categoriesRouter = require("./routes/categories");
const commentsRouter = require("./routes/comments");

var app = express();

app.use(logger("dev"));
// POST or PUT
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// CORS
app.use(cors());

// ルーティング
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/follows", followsRouter);
app.use("/posts", postsRouter);
app.use("/answers", answersRouter);
app.use("/addresses", addressesRouter);
app.use("/categories", categoriesRouter);
app.use("/comments", commentsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.json({ error: err });
});

module.exports = app;
