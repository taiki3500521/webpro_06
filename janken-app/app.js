const express = require("express");
const session = require("express-session");  // express-sessionをインポート
const app = express();

app.set('view engine', 'ejs'); // テンプレートエンジンを設定
app.use("/public", express.static(__dirname + "/public")); // 静的ファイルのルート設定

// セッションミドルウェアの設定
app.use(session({
  secret: 'your-secret-key',  // セッションIDを署名するための秘密鍵
  resave: false,              // セッションが変更されていない場合に再保存しない
  saveUninitialized: true,    // 初期化されていないセッションも保存
  cookie: { secure: false }   // httpのみでのアクセスを許可（本番ではtrueにする）
}));

// トップページ（じゃんけんのフォームを表示）
app.get("/", (req, res) => {
  res.render("index"); // フォームを表示
});

// じゃんけんのルート
app.get("/janken", (req, res) => {
  // セッションから勝ち数と試合数を取得（セッションに保存されていなければ初期値を設定）
  const hand = req.query.hand; // プレイヤーの手
  const win = req.session.win || 0; // 勝利数（セッションから取得）
  const total = req.session.total || 0; // 対戦数（セッションから取得）

  // CPUの手をランダムに決定
  const cpuHand = ["グー", "チョキ", "パー"][Math.floor(Math.random() * 3)];

  // 勝敗判定
  let judgement;
  if (
    (hand === "グー" && cpuHand === "チョキ") ||
    (hand === "チョキ" && cpuHand === "パー") ||
    (hand === "パー" && cpuHand === "グー")
  ) {
    judgement = "勝ち";
    req.session.win = win + 1;  // 勝った場合、勝利数を更新
  } else if (hand === cpuHand) {
    judgement = "引き分け";
    req.session.win = win; // 勝ち数はそのまま
  } else {
    judgement = "負け";
    req.session.win = win; // 勝ち数はそのまま
  }

  // 試合回数を更新
  req.session.total = total + 1;

  // レンダリングして結果を表示
  res.render("janken", {
    your: hand, // ユーザーの手
    cpu: cpuHand, // CPUの手
    judgement: judgement, // 勝敗結果
    win: req.session.win, // 勝利数
    total: req.session.total, // 総試合数
  });
});

// 404エラーハンドリング
app.use((req, res) => {
  res.status(404).send("ページが見つかりません");
});

// サーバー起動
app.listen(8080, () => console.log("Example app listening on port 8080!"));
