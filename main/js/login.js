// Get form element
const loginForm = document.getElementById('loginForm');

// Add event listener for form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get input values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!username || !password) {
        alert('アカウント名とパスワードを入力してください。');
        return;
    }
    
    // Log the login attempt (for development)
    console.log('Login attempt:', {
        username: username,
        password: password,
        timestamp: new Date().toISOString()
    });
    
    // Here you would typically send the credentials to your server
    // Example using fetch API:
    /*
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/dashboard';
        } else {
            alert('ログインに失敗しました。');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('エラーが発生しました。');
    });
    */
    
    // Temporary success message (remove in production)
    alert('ログイン処理を実行中...');
    
    // Uncomment to redirect after successful login:
    // window.location.href = '/dashboard.html';
});

// Optional: Add input validation on blur
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            this.style.borderColor = '#ff0000';
        } else {
            this.style.borderColor = '#d0d0d0';
        }
    });
});