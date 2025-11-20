
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // **固定値のユーザー情報**
    const FIXED_EMAIL = "test@example.com";
    const FIXED_PASSWORD = "password123";
    const FIXED_USER_ID = "user_0001"; // ★追加: ユーザーID（裏で使う用）
    const FIXED_USER_NAME = "春太郎"; 

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const inputEmail = emailInput.value;
        const inputPassword = passwordInput.value;

        // 簡易的なログインチェック
        if (inputEmail === FIXED_EMAIL && inputPassword === FIXED_PASSWORD) {
            
            // ログイン成功時
            // ★追加: ユーザーIDを保存（これは画面には出ない）
            sessionStorage.setItem('userId', FIXED_USER_ID);

            // ユーザー名を保存
            sessionStorage.setItem('userName', FIXED_USER_NAME);

            // ホーム画面へ遷移
            window.location.href = "../html/home.html";

        } else {
            alert("メールアドレスまたはパスワードが間違っています。");
        }
    });
});