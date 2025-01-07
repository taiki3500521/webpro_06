"use strict";

let number = 0;
const bbs = document.querySelector('#bbs');
const postButton = document.querySelector('#post');

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
            bbs.innerHTML = ''; 
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
            bbs.innerHTML = ''; 
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

if (postButton) {
    postButton.addEventListener('click', () => {
        const name = document.querySelector('#name').value;
        const message = document.querySelector('#message').value;

        
        if (message.length > 200) {
            alert('メッセージが200文字を超えています。短くしてください。');
            return;
        }

        
        const params = {
            method: "POST",
            body: `name=${encodeURIComponent(name)}&message=${encodeURIComponent(message)}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

       
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
