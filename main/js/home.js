

document.addEventListener('DOMContentLoaded', () => {
    // ユーザー名を表示する要素を取得（HTML側でID: 'userNameDisplay' を設定済み）
    const userNameDisplay = document.getElementById('userNameDisplay');

    // セッションストレージからユーザー名（文字列）を直接取得
    const userName = sessionStorage.getItem('userName');

    // ユーザー名が存在する場合、画面を更新
    if (userName && userNameDisplay) {
        userNameDisplay.textContent = userName;
    } else {
        // ユーザー名がない場合
        if (userNameDisplay) {
        userNameDisplay.textContent = 'ゲスト'; 
        }
    }
});