

document.addEventListener('DOMContentLoaded', () => {
    // ユーザー名を表示する要素を取得
    const userNameDisplay = document.getElementById('userNameDisplay');

    // セッションストレージから情報を取得
    const userName = sessionStorage.getItem('userName');
    const userId = sessionStorage.getItem('userId'); 

    // 確認用：
    if (userId) {
        console.log("現在のユーザーID:", userId);
        // 今後、データベースからデータを取得する際などにこの userId を使います
        // 例: fetch(`api/projects?userId=${userId}`) ...
    }

    // ユーザー名の表示処理
    if (userName && userNameDisplay) {
        userNameDisplay.textContent = userName;
    } else {
        if (userNameDisplay) {
            userNameDisplay.textContent = 'ゲスト'; 
        }
    }
});