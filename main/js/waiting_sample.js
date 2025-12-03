document.addEventListener('DOMContentLoaded', () => {
    // 1. 文字列として保存されたデータを取得
    const storedString = sessionStorage.getItem('selectedImagesString');
    let images = [];

    if (storedString) {
        
        images = storedString.split('|||');
    } else {
        // データがない場合のダミー画像（テスト用）
        images = ['../img/test_img_01.jpg', '../img/test_img_02.jpg'];
    }

    const container = document.getElementById('floatingPhotos');
    
    // --- 以下、アニメーション生成ロジック（変更なし） ---
    function spawnPhoto() {
        if (images.length === 0) return;

        // ランダムな画像を1つ選ぶ
        const randomSrc = images[Math.floor(Math.random() * images.length)];

        const div = document.createElement('div');
        div.classList.add('float-item');
        
        const img = document.createElement('img');
        img.src = randomSrc;
        div.appendChild(img);

        // ランダムな見た目設定
        const size = Math.floor(Math.random() * 120) + 100; // 100~220px
        div.style.width = `${size}px`;
        div.style.left = `${Math.floor(Math.random() * 90) + 5}%`; // 横位置
        
        const duration = Math.random() * 9 + 6; // 6~15秒
        div.style.animationDuration = `${duration}s`;

        const rotateEnd = Math.floor(Math.random() * 90) - 45; // -45~45度
        div.style.setProperty('--rotate-end', `${rotateEnd}deg`);

        // 要素を追加
        container.appendChild(div);

        // アニメーション終了後に消す
        setTimeout(() => {
            div.remove();
        }, duration * 1000);
    }

    // 生成ループ開始
    setInterval(spawnPhoto, 800);
    // 最初の数枚を一気に出す
    for(let i=0; i<5; i++) setTimeout(spawnPhoto, i * 300);

    
    // ---------------------------------------------------------
    // ▼ （サーバー通信用）
    // ---------------------------------------------------------



    //1. サーバーに作成開始を依頼
    fetch('/YOUR_APP_NAME/createVideo', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        // ここで上の storedString をそのまま使う
        body: 'images=' + encodeURIComponent(storedString) 
    })
    .then(response => {
        console.log('動画作成を開始しました');
        startPolling(); 
    })
    .catch(error => {
        console.error('作成開始エラー:', error);
        // エラーでも一旦モックとして進めたい場合はここで startPolling() を呼ぶ手もあります
    });


    // 2. 監視用関数
    function startPolling() {
        const checkInterval = 3000; 

        const poller = setInterval(() => {
            console.log('完了確認中...');

            fetch('/YOUR_APP_NAME/checkStatus') 
                .then(response => response.text())
                .then(statusText => {
                    const status = statusText.trim();
                    if (status === 'completed') {
                        clearInterval(poller);
                        window.location.href = '../html/newproject_musicoption03.html';
                    }
                })
                .catch(err => console.error(err));

        }, checkInterval);
    }

});
