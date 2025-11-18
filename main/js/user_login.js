
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // **固定値のユーザー情報**
    const FIXED_EMAIL = "test@example.com";
    const FIXED_PASSWORD = "password123";
    const FIXED_USER_NAME = "春太郎"; // ホーム画面に表示するユーザー名

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const inputEmail = emailInput.value;
        const inputPassword = passwordInput.value;

        // 簡易的なログインチェック（固定値との比較）
        if (inputEmail === FIXED_EMAIL && inputPassword === FIXED_PASSWORD) {
            
            // ログイン成功時
            // ユーザー名を文字列としてセッションストレージに直接保存
            sessionStorage.setItem('userName', FIXED_USER_NAME);

            // ホーム画面へ遷移
            window.location.href = "../html/home.html";

        } else {
            // ログイン失敗時
            alert("メールアドレスまたはパスワードが間違っています。");
        }
    });
});