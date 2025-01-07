"use strict";

let number = 0;
const bbs = document.querySelector('#bbs');
const postButton = document.querySelector('#post');

// リセットボタンを生成または取得し、イベントリスナーを確実に登録
let resetButton = document.querySelector('#reset');
if (!resetButton) {
    resetButton = document.createElement('button');
    resetButton.id = 'reset';
    resetButton.innerText = 'リセット';
    document.body.appendChild(resetButton);
}
resetButton.addEventListener('click', () => {
    document.querySelector('#name').value = "";
    document.querySelector('#message').value = "";
    document.querySelector('#charCount').innerText = '0/200';
});

// 文字数カウントの設定
let charCount = document.querySelector('#charCount');
if (!charCount) {
    charCount = document.createElement('span');
    charCount.id = 'charCount';
    charCount.innerText = '0/200';
    document.querySelector('#message').parentElement.appendChild(charCount);
}
document.querySelector('#message').addEventListener('input', () => {
    const message = document.querySelector('#message').value;
    charCount.innerText = `${message.length}/200`;
    charCount.style.color = message.length > 200 ? 'red' : 'black';
});

// "すべての投稿を見る" ボタンの生成または取得とイベントリスナー設定
let viewAllButton = document.querySelector('#viewAll');
if (!viewAllButton) {
    viewAllButton = document.createElement('button');
    viewAllButton.id = 'viewAll';
    viewAllButton.innerText = 'すべての投稿を見る';
    document.body.appendChild(viewAllButton);
}
viewAllButton.addEventListener('click', () => {
    fetch("/read", {
        method: "POST",
        body: '',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
        .then(response => {
            if (!response.ok) throw new Error('Error');
            return response.json();
        })
        .then(response => {
            bbs.innerHTML = ''; // 現在の投稿をクリア
            response.messages.forEach(mes => {
                const cover = document.createElement('div');
                cover.className = 'cover';
                const nameArea = document.createElement('span');
                nameArea.className = 'name';
                nameArea.innerText = mes.name;
                const mesArea = document.createElement('span');
                mesArea.className = 'mes';
                mesArea.innerText = mes.message;
                cover.appendChild(nameArea);
                cover.appendChild(mesArea);
                bbs.appendChild(cover);
            });
        });
});

// "名前順でソート" ボタンの生成または取得とイベントリスナー設定
let sortButton = document.querySelector('#sort');
if (!sortButton) {
    sortButton = document.createElement('button');
    sortButton.id = 'sort';
    sortButton.innerText = '名前順でソート';
    document.body.appendChild(sortButton);
}
sortButton.addEventListener('click', () => {
    fetch("/read", {
        method: "POST",
        body: '',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
        .then(response => {
            if (!response.ok) throw new Error('Error');
            return response.json();
        })
        .then(response => {
            const sortedMessages = response.messages.sort((a, b) => a.name.localeCompare(b.name));
            bbs.innerHTML = ''; // 現在の投稿をクリア
            sortedMessages.forEach(mes => {
                const cover = document.createElement('div');
                cover.className = 'cover';
                const nameArea = document.createElement('span');
                nameArea.className = 'name';
                nameArea.innerText = mes.name;
                const mesArea = document.createElement('span');
                mesArea.className = 'mes';
                mesArea.innerText = mes.message;
                cover.appendChild(nameArea);
                cover.appendChild(mesArea);
                bbs.appendChild(cover);
            });
        });
});

// 投稿ボタンの取得とクリックイベントリスナーの登録
if (postButton) {
    postButton.addEventListener('click', () => {
        const name = document.querySelector('#name').value;
        const message = document.querySelector('#message').value;

        // メッセージが200文字を超えている場合のバリデーション
        if (message.length > 200) {
            alert('メッセージが200文字を超えています。短くしてください。');
            return;
        }

        // サーバーに送信するデータの準備
        const params = {
            method: "POST",
            body: `name=${encodeURIComponent(name)}&message=${encodeURIComponent(message)}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        // サーバーに投稿を送信
        fetch("/post", params)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('投稿に失敗しました');
                }
                return response.json();
            })
            .then(() => {
                document.querySelector('#message').value = "";
                document.querySelector('#charCount').innerText = '0/200';
                alert('投稿が成功しました！');
            })
            .catch((error) => {
                console.error(error);
                alert('投稿中にエラーが発生しました。');
            });
    });
} else {
    console.error("投稿ボタンが見つかりませんでした。");
}
