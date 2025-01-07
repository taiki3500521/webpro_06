"use strict";
const express = require("express");
const app = express();

let bbs = []; 

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.get("/count", (req, res) => {
    res.json({ count: bbs.length });
});

app.delete("/clear", (req, res) => {
    bbs = [];
    res.json({ message: "入力内容を削除しました。" });
});

app.post("/read", (req, res) => {
    const start = Number(req.body.start);
    console.log("read -> " + start);

    const sortedBbs = [...bbs].reverse(); 

    if (start === 0) {
        res.json({ messages: sortedBbs });
    } else {
        res.json({ messages: sortedBbs.slice(start) });
    }
});

app.post("/post", (req, res) => {
    const name = req.body.name;
    const message = req.body.message;
    const date = new Date();

    console.log([name, message, date]);
    bbs.push({ name: name, message: message, date: date });
    res.json({ number: bbs.length });
});

app.get("/hello1", (req, res) => {
    const message1 = "Hello world";
    const message2 = "Bon jour";
    res.render('show', { greet1: message1, greet2: message2 });
});

app.get("/hello2", (req, res) => {
    res.render('show', { greet1: "Hello world", greet2: "Bon jour" });
});

app.get("/icon", (req, res) => {
    res.render('icon', { filename: "./public/Apple_logo_black.svg", alt: "Apple Logo" });
});

app.get("/luck", (req, res) => {
    const num = Math.floor(Math.random() * 6 + 1);
    let luck = '';
    if (num == 1) luck = '大吉';
    else if (num == 2) luck = '中吉';
    console.log('あなたの運勢は' + luck + 'です');
    res.render('luck', { number: num, luck: luck });
});

app.get("/janken", (req, res) => {
    let hand = req.query.hand;
    let win = Number(req.query.win);
    let total = Number(req.query.total);
    console.log({ hand, win, total });
    const num = Math.floor(Math.random() * 3 + 1);
    let cpu = '';
    if (num == 1) cpu = 'グー';
    else if (num == 2) cpu = 'チョキ';
    else cpu = 'パー';
    let judgement = '勝ち';
    win += 1;
    total += 1;
    const display = {
        your: hand,
        cpu: cpu,
        judgement: judgement,
        win: win,
        total: total
    };
    res.render('janken', display);
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
