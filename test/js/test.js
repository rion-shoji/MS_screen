// --- 1. モーダル関連のロジック ---
const modal = document.getElementById('promptModal');
const openButton = document.getElementById('openModalButton');
const closeButtonCancel = document.getElementById('closeModalCancel');
const closeButtonOk = document.getElementById('closeModalOk');

if (modal && openButton && closeButtonCancel && closeButtonOk) {
    openButton.addEventListener('click', () => modal.showModal());
    closeButtonCancel.addEventListener('click', () => modal.close());
    closeButtonOk.addEventListener('click', () => modal.close());
    modal.addEventListener('click', (event) => {
        if (event.target === modal) modal.close();
    });
}

// --- 2. Cropper.js (トリミング機能) 関連 ---
const image = document.getElementById('previewImage');
const trimButton = document.getElementById('trimButton');
const thumbnails = document.querySelectorAll('.thumbnail');

// Cropper.js のインスタンスを保持する変数
let cropper = null; 

// Cropperを初期化する関数
function initializeCropper(imageUrl) {
    if (!image) return;

    // 既存のCropperインスタンスがあれば破棄
    if (cropper) {
        cropper.destroy();
    }
    
    // 画像のURLをセット
    image.src = imageUrl;
    
    // Cropper.js を初期化
    cropper = new Cropper(image, {
        // --- オプション (例: アスペクト比を16:9に固定) ---
        aspectRatio: 16 / 9, 
        
        viewMode: 1, // 枠内でのみトリミング
        autoCropArea: 1, // 自動で90%の領域を選択

        // ▼▼▼ 以下のオプションを追加 ▼▼▼
        guides: false,     // グリッド線を非表示
        center: false,     // 中央の十字を非表示
        highlight: false,  // 切り抜き枠の外側を暗くしない (CSSで制御)
        background: false, // Cropperの背景を非表示
        
        // 動作モード
        dragMode: 'none',       // 画像自体のドラッグを無効化 (切り抜き枠のみ操作)
        movable:false,
        zoomable: false,
        cropBoxMovable: true,   // 切り抜き枠の移動を許可
        cropBoxResizable: true, // 切り抜き枠のリサイズを許可
        // ▲▲▲ オプション追加ここまで ▲▲▲

        ready: () => {
            // 画像の読み込みが完了したら表示
            image.style.opacity = 1;
        }
    });
}

// トリミング実行ボタンの処理
if (trimButton) {
    trimButton.addEventListener('click', () => {
        if (!cropper) return;

        // トリミングされたCanvasを取得
        const canvas = cropper.getCroppedCanvas({
            width: 800, // トリミング後の幅を指定
            // height: 450, // (アスペクト比固定なら不要)
        });

        // Canvasを画像データ(DataURL)に変換
        const croppedImageUrl = canvas.toDataURL('image/jpeg');

        // (デモ用) 結果をコンソールに出力
        console.log('トリミング結果 (DataURL):', croppedImageUrl);
        
        // (デモ用) 新しいタブで開く
        window.open(croppedImageUrl);

        // ※実際にはここでサーバーにアップロードしたり、
        // 別の<img>にセットしたりします。
    });
}

// --- 3. サムネイル選択機能 ---
if (thumbnails.length > 0) {
    
    // 各サムネイルにクリックイベントを設定
    thumbnails.forEach(thumbnail => {
        
        // サムネイルに背景画像を設定
        const imgUrl = thumbnail.dataset.src;
        if (imgUrl) {
            thumbnail.style.backgroundImage = `url(${imgUrl})`;
        }

        // クリック時の処理
        thumbnail.addEventListener('click', () => {
            // すべてのサムネイルから 'active' クラスを削除
            thumbnails.forEach(t => t.classList.remove('active'));
            // クリックされたサムネイルに 'active' クラスを追加
            thumbnail.classList.add('active');

            // メインのプレビュー画像を切り替える (Cropperを再初期化)
            const newImageUrl = thumbnail.dataset.src;
            if (newImageUrl) {
                // 画像の読み込みが始まるまで非表示
                image.style.opacity = 0; 
                initializeCropper(newImageUrl);
            }
        });
    });

    // 初期選択 (最初のサムネイルをアクティブにし、Cropperを初期化)
    const firstThumbnail = thumbnails[0];
    if (firstThumbnail) {
        firstThumbnail.classList.add('active');
        initializeCropper(firstThumbnail.dataset.src);
    }
}
const photoStrip = document.querySelector('.photo-strip');
if (photoStrip) {
    new Sortable(photoStrip, {
        animation: 150, // ドラッグのアニメーション速度
        filter: '.add-photo-button', // 「+」ボタンはドラッグ対象外にする
        preventOnFilter: true, // filterで指定した要素はドラッグを開始しない
        
        onEnd: (evt) => {
            // (オプション) 並び替えが完了したときに実行される
            console.log('写真の順番が変更されました。');
            // evt.oldIndex (移動元のインデックス)
            // evt.newIndex (移動先のインデックス)
        }
    });
}
