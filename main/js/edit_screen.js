// --- 1. モーダル関連のロジック (プロンプト用) ---
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

// --- 2. メインプレビュー画像関連 ---
const image = document.getElementById('previewImage');
// const thumbnails = document.querySelectorAll('.thumbnail'); // (セクション4で動的に扱うため、ここでは不要)
let currentImageUrl = '';

// --- 3. トリミングモーダル関連 ---
const trimModal = document.getElementById('trimModal');
const trimButton = document.getElementById('trimButton');
const trimModalImage = document.getElementById('trimModalImage');
const trimCancelButton = document.getElementById('trimCancelButton');
const trimApplyButton = document.getElementById('trimApplyButton');
const trimRotateLeft = document.getElementById('trimRotateLeft');
const trimRotateRight = document.getElementById('trimRotateRight');

let cropper = null; 

// トリミングボタン（✂️）クリック時の処理
if (trimButton) {
    trimButton.addEventListener('click', () => {
        if (!currentImageUrl) {
            alert('画像が選択されていません。');
            return;
        }
        trimModalImage.src = currentImageUrl;
        trimModal.showModal(); 
        if (cropper) {
            cropper.destroy();
        }
        cropper = new Cropper(trimModalImage, {
            aspectRatio: 16 / 9,
            viewMode: 1,
            autoCropArea: 1,
            guides: false,
            center: false,
            highlight: false,
            background: false,
            movable: true,
            zoomable: true,
            rotatable: true,
            dragMode: 'move',
            cropBoxMovable: false,
            cropBoxResizable: false,
        });
    });
}

// 回転ボタンのロジック
if (trimRotateLeft) {
    trimRotateLeft.addEventListener('click', () => cropper?.rotate(-90));
}
if (trimRotateRight) {
    trimRotateRight.addEventListener('click', () => cropper?.rotate(90));
}

// トリミングモーダル「キャンセル」ボタン
if (trimCancelButton) {
    trimCancelButton.addEventListener('click', () => {
        trimModal.close(); 
        cropper?.destroy(); 
        cropper = null;
    });
}

// トリミングモーダル「適用」ボタン
if (trimApplyButton) {
    trimApplyButton.addEventListener('click', () => {
        if (!cropper) return;
        const canvas = cropper.getCroppedCanvas({ width: 1920, height: 1080 });
        const croppedImageUrl = canvas.toDataURL('image/jpeg');

        image.src = croppedImageUrl;
        currentImageUrl = croppedImageUrl;

        const activeThumbnail = document.querySelector('.thumbnail.active');
        if (activeThumbnail) {
            activeThumbnail.dataset.src = croppedImageUrl;
            activeThumbnail.style.backgroundImage = `url(${croppedImageUrl})`;
        }
        trimModal.close();
        cropper?.destroy();
        cropper = null;
    });
}


// --- 4. サムネイル選択機能 (イベントデリゲーション) ---
const photoStrip = document.querySelector('.photo-strip'); // 親コンテナを取得

if (photoStrip) {
    
    // 4a. サムネイルクリック処理 (親コンテナで監視)
    photoStrip.addEventListener('click', (event) => {
        // クリックされたのが .thumbnail かどうかをチェック
        if (event.target.classList.contains('thumbnail')) {
            const clickedThumbnail = event.target;
            
            // すべての .thumbnail から active を削除
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            
            // クリックされたものに active を追加
            clickedThumbnail.classList.add('active');
            
            // メイン画像を更新
            const newImageUrl = clickedThumbnail.dataset.src;
            if (newImageUrl) {
                image.src = newImageUrl;
                currentImageUrl = newImageUrl; 
            }
        }
    });

    // 4b. ページ読み込み時の初期設定 (既存のサムネイルの背景画像を設定)
    document.querySelectorAll('.thumbnail').forEach(thumbnail => {
        const imgUrl = thumbnail.dataset.src;
        if (imgUrl) {
            thumbnail.style.backgroundImage = `url(${imgUrl})`;
        }
    });

    // 4c. ページ読み込み時の初期選択
    const firstThumbnail = document.querySelector('.thumbnail'); // 最初のサムネイル
    if (firstThumbnail) {
        firstThumbnail.classList.add('active');
        const firstImageUrl = firstThumbnail.dataset.src;
        image.src = firstImageUrl;
        currentImageUrl = firstImageUrl; 
    }
}


// --- 5. サムネイル並び替え機能 (Sortable.js) ---
if (photoStrip) { // photoStrip はセクション4で取得済み
    new Sortable(photoStrip, {
        animation: 150,
        filter: '.add-photo-button',
        preventOnFilter: true,
        onEnd: (evt) => {
            console.log('写真の順番が変更されました。');
        }
    });
}

// --- 6. 写真追加ボタンのロジック ---
const addPhotoButton = document.querySelector('.add-photo-button');
const imageUpload = document.getElementById('imageUpload'); // HTMLで追加したinput

if (addPhotoButton && imageUpload) {
    // 「+」ボタンが押されたら、隠しinputをクリックする
    addPhotoButton.addEventListener('click', () => {
        imageUpload.click();
    });

    // ファイルが選択されたら (changeイベント)
    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            // ファイルの読み込みが完了したら
            reader.onload = (e) => {
                const imageUrl = e.target.result; // DataURL
                
                const newThumbnail = document.createElement('div');
                newThumbnail.className = 'thumbnail';
                newThumbnail.dataset.src = imageUrl;
                newThumbnail.style.backgroundImage = `url(${imageUrl})`;
                
                photoStrip.insertBefore(newThumbnail, addPhotoButton);
                
                // (セクション4のデリゲーションがクリックを処理するため、ここで手動でactiveにする必要はありません)
                // (もし追加した画像を即時アクティブにしたい場合は以下のコードのコメントを外します)
                /*
                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                newThumbnail.classList.add('active');
                image.src = imageUrl;
                currentImageUrl = imageUrl;
                */
            };
            
            reader.readAsDataURL(file);
        }
        event.target.value = null;
    });
}

// ▼▼▼ 7. 削除ボタンのロジック (新規追加) ▼▼▼
const deleteButton = document.querySelector('.delete-button');

if (deleteButton) {
    deleteButton.addEventListener('click', () => {
        // 1. アクティブなサムネイルを探す
        const activeThumbnail = document.querySelector('.thumbnail.active');

        if (!activeThumbnail) {
            alert('削除する写真が選択されていません。');
            return;
        }

        // 2. ユーザーに削除を確認する (任意)
        if (!confirm('この写真を削除しますか？\n(トリミングした内容もリセットされます)')) {
            return;
        }

        // 3. 次にアクティブにする要素を探す (兄弟要素)
        let nextActive = activeThumbnail.nextElementSibling;
        
        // もし右隣が「+」ボタンなら、何もないのと同じ
        if (nextActive && nextActive.classList.contains('add-photo-button')) {
            nextActive = null; 
        }

        // もし右になければ、左を探す
        if (!nextActive) {
            nextActive = activeThumbnail.previousElementSibling;
        }
        
        // 4. サムネイルをDOMから削除
        activeThumbnail.remove();
        
        // 5. プレビューを更新
        if (nextActive && nextActive.classList.contains('thumbnail')) {
            // 新しいサムネイルを選択状態にする
            nextActive.classList.add('active');
            const newImageUrl = nextActive.dataset.src;
            image.src = newImageUrl;
            currentImageUrl = newImageUrl;
        } else {
            // 削除後、サムネイルが1枚もなくなった場合
            image.src = ''; // メインプレビューを空にする
            currentImageUrl = ''; // 現在のURLも空にする
        }
    });
}