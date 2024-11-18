const express = require("express");
const session = require("express-session");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true })); // POSTリクエストを扱うため

// セッションの設定
app.use(session({
  secret: 'your-secret-key', // セッションIDを署名するための秘密鍵
  resave: false, // セッションが変更されなくても保存するか
  saveUninitialized: true, // 初期化されていないセッションも保存するか
  cookie: { secure: false } // 本番環境でHTTPSを使用する場合は、secure: true に設定
}));

// じゃんけん
app.get("/janken", (req, res) => {
  // 総試行回数がセッションに保存されていなければ初期化
  if (!req.session.total) {
    req.session.total = 0;
    req.session.win = 0;
  }

  // セッションから win と total を取得して渡す
  res.render('janken', {
    win: req.session.win,
    total: req.session.total
  });
});

app.post("/janken", (req, res) => {
  let hand = req.body.hand;
  let win = req.session.win;
  let total = req.session.total;

  // ユーザーが手を選んだ場合のみ実行
  if (!hand) {
    return res.send("手を選んでください！");
  }

  const num = Math.floor(Math.random() * 3 + 1);
  let cpu = '';
  if (num === 1) cpu = 'グー';
  else if (num === 2) cpu = 'チョキ';
  else cpu = 'パー';

  let judgement = '';
  if (
    (hand === 'グー' && cpu === 'チョキ') ||
    (hand === 'チョキ' && cpu === 'パー') ||
    (hand === 'パー' && cpu === 'グー')
  ) {
    judgement = '勝ち';
    win += 1;
  } else if (hand === cpu) {
    judgement = '引き分け';
  } else {
    judgement = '負け';
  }

  total += 1;

  // セッションに勝ちと試行回数を保存
  req.session.win = win;
  req.session.total = total;

  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  };

  res.render('jankenResult', display);
});

// BMI計算
app.get("/bmi", (req, res) => {
  res.render('bmi');
});

app.post("/bmi", (req, res) => {
  let height = Number(req.body.height);  // 身長（cm）
  let weight = Number(req.body.weight);  // 体重（kg）

  if (!height || !weight) {
    return res.send("身長と体重を入力してください！");
  }

  let bmi = weight / ((height / 100) ** 2);
  let result = '';
  if (bmi < 18.5) {
    result = "低体重";
  } else if (bmi < 24.9) {
    result = "正常体重";
  } else if (bmi < 29.9) {
    result = "肥満（1度）";
  } else if (bmi < 34.9) {
    result = "肥満（2度）";
  } else if (bmi < 39.9) {
    result = "肥満（3度）";
  } else {
    result = "肥満（4度）";
  }

  const display = {
    bmi: bmi.toFixed(2),
    result: result
  };

  res.render('bmiResult', display);
});

// 占い
app.get("/fortune", (req, res) => {
  res.render('fortune');
});

app.post("/fortune", (req, res) => {
  let name = req.body.name;

  if (!name) {
    return res.send("名前を入力してください！");
  }

  let fortunes = [
    "今日はとてもラッキーな日です！",
    "ちょっとした困難が待っているかもしれません。",
    "素晴らしいチャンスが訪れる予感！",
    "慎重に行動することが大切な日です。",
    "身近な人とコミュニケーションを大切にして！"
  ];

  let randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];

  const display = {
    name: name,
    fortune: randomFortune
  };

  res.render('fortuneResult', display);
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
