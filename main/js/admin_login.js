document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // **Replace with your actual authentication logic**
        if (username === 'Refeel01' && password === 'hal217') {
            // Redirect to the admin home page on successful login
            window.location.href = '../admin/admin_home.html';
        } else {
            // Display an error message if login fails
            alert('ログインに失敗しました。アカウント名とパスワードを確認してください。');
        }
    });
});