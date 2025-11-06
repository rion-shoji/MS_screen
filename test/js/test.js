// DOM要素の取得
const modal = document.getElementById('promptModal');
const openButton = document.getElementById('openModalButton');
const closeButtonCancel = document.getElementById('closeModalCancel');
const closeButtonOk = document.getElementById('closeModalOk');

// 「プロンプト」ボタンクリックでモーダル表示
openButton.addEventListener('click', () => {
    modal.showModal(); // モーダルを表示
});

// 「キャンセル」ボタンクリックでモーダル非表示
closeButtonCancel.addEventListener('click', () => {
    modal.close(); // モーダルを閉じる
});

// 「OK」ボタンクリックでモーダル非表示
closeButtonOk.addEventListener('click', () => {
    modal.close(); // モーダルを閉じる
});

// モーダルの外側（背景）をクリックしたときに閉じる
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.close();
    }
});