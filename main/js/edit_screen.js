// --- 0. プロンプト管理用のデータ構造とDOM要素 ---
// 画像URLをキーとしてプロンプトを保存するオブジェクト
let imagePrompts = {}; 
const promptTextarea = document.getElementById('promptTextarea');
// -------------------------------------------------------------

// --- 1. モーダル関連のロジック (プロンプト用) ---
const modal = document.getElementById('promptModal');
const openButton = document.getElementById('openModalButton');
const closeButtonCancel = document.getElementById('closeModalCancel');
const closeButtonOk = document.getElementById('closeModalOk');

if (modal && openButton && closeButtonCancel && closeButtonOk) {
    openButton.addEventListener('click', () => modal.showModal());
    closeButtonCancel.addEventListener('click', () => modal.close());
    
    // 修正点: OKボタンクリック時にプロンプトを保存
    closeButtonOk.addEventListener('click', () => {
        saveCurrentPrompt();
        modal.close();
    });
    
    modal.addEventListener('click', (event) => {
        if (event.target === modal) modal.close();
    });
}

// --- 2. メインプレビュー画像関連とプロンプト管理関数 ---
const image = document.getElementById('previewImage');
let currentImageUrl = ''; 

// 新規追加: 現在の画像のプロンプトを保存する関数
function saveCurrentPrompt() {
    if (currentImageUrl && promptTextarea) {
        // 現在のテキストエリアの内容を、現在の画像URLに紐づけて保存
        imagePrompts[currentImageUrl] = promptTextarea.value.trim();
        console.log(`プロンプトを保存しました: ${currentImageUrl}`);
    }
}

// 新規追加: 選択された画像のプロンプトを読み込む関数
function loadPromptForImage(imageUrl) {
    if (promptTextarea) {
        const savedPrompt = imagePrompts[imageUrl] || ''; // 保存されていなければ空文字列
        promptTextarea.value = savedPrompt;
        currentImageUrl = imageUrl; // currentImageUrlを更新
        console.log(`プロンプトをロードしました: ${imageUrl}`);
    }
}


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

// トリミングモーダル「適用」ボタン (修正点: プロンプトデータのキー更新)
if (trimApplyButton) {
    trimApplyButton.addEventListener('click', () => {
        if (!cropper) return;
        const canvas = cropper.getCroppedCanvas({ width: 1920, height: 1080 });
        const croppedImageUrl = canvas.toDataURL('image/jpeg');

        image.src = croppedImageUrl;

        const activeThumbnail = document.querySelector('.thumbnail.active');
        if (activeThumbnail) {
            // 古いURLのプロンプトを新しいURLに引き継ぐ
            const oldUrl = currentImageUrl;
            if (imagePrompts[oldUrl] !== undefined) {
                imagePrompts[croppedImageUrl] = imagePrompts[oldUrl];
                delete imagePrompts[oldUrl]; 
            }

            activeThumbnail.dataset.src = croppedImageUrl;
            activeThumbnail.style.backgroundImage = `url(${croppedImageUrl})`;
            
            // currentImageUrl を新しいものに更新
            currentImageUrl = croppedImageUrl;
        }

        trimModal.close();
        cropper?.destroy();
        cropper = null;
    });
}


// --- 4. サムネイル選択機能 (イベントデリゲーション) ---
const photoStrip = document.querySelector('.photo-strip'); // 親コンテナを取得

if (photoStrip) {
    
    // 新規追加: テキストエリアの内容変更時にプロンプトを保存
    if (promptTextarea) {
        promptTextarea.addEventListener('input', saveCurrentPrompt);
    }

    // 4a. サムネイルクリック処理 (親コンテナで監視) (修正点: プロンプトのロード)
    photoStrip.addEventListener('click', (event) => {
        // クリックされたのが .thumbnail かどうかをチェック
        if (event.target.classList.contains('thumbnail')) {
            const clickedThumbnail = event.target;
            
            // 切り替える前に現在のプロンプトを保存
            saveCurrentPrompt(); 
            
            // すべての .thumbnail から active を削除
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            
            // クリックされたものに active を追加
            clickedThumbnail.classList.add('active');
            
            // メイン画像とプロンプトを更新
            const newImageUrl = clickedThumbnail.dataset.src;
            if (newImageUrl) {
                loadPromptForImage(newImageUrl); // プロンプトをロード
                image.src = newImageUrl;
            }
        }
    });

    // 4b. ページ読み込み時の初期設定 (既存のサムネイルの背景画像を設定) (修正点: プロンプトの初期化)
    document.querySelectorAll('.thumbnail').forEach(thumbnail => {
        const imgUrl = thumbnail.dataset.src;
        if (imgUrl) {
            thumbnail.style.backgroundImage = `url(${imgUrl})`;
            // 新規追加: 初期プロンプトを空で初期化
            if (imagePrompts[imgUrl] === undefined) {
                imagePrompts[imgUrl] = '';
            }
        }
    });

    // 4c. ページ読み込み時の初期選択 (修正点: プロンプトのロード)
    const firstThumbnail = document.querySelector('.thumbnail'); // 最初のサムネイル
    if (firstThumbnail) {
        firstThumbnail.classList.add('active');
        const firstImageUrl = firstThumbnail.dataset.src;
        loadPromptForImage(firstImageUrl); // 初期のプロンプトをロード
        image.src = firstImageUrl; // 画像のロード
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
        // 現在編集中のプロンプトを保存してから、新しい画像を追加
        saveCurrentPrompt(); 
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
                
                // 新規追加: 新しい画像のプロンプトを空で初期化
                imagePrompts[imageUrl] = ''; 

                // 新規追加: 新しい画像をアクティブにしてプロンプトをロード
                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                newThumbnail.classList.add('active');
                
                loadPromptForImage(imageUrl); // 新しい画像のプロンプトをロード
                image.src = imageUrl; // 画像のロード
            };
            
            reader.readAsDataURL(file);
        }
        event.target.value = null;
    });
}

// --- 7. 削除ボタンのロジック ---
const deleteButton = document.querySelector('.delete-button');

if (deleteButton) {
    deleteButton.addEventListener('click', () => {
        const activeThumbnail = document.querySelector('.thumbnail.active');

        if (!activeThumbnail) {
            alert('削除する写真が選択されていません。');
            return;
        }

        if (!confirm('この写真を削除しますか？\n(プロンプトデータも削除されます)')) {
            return;
        }
        
        // 修正点: 削除する画像のプロンプトデータを削除
        const deletedUrl = activeThumbnail.dataset.src;
        if (imagePrompts[deletedUrl] !== undefined) {
            delete imagePrompts[deletedUrl];
            console.log(`プロンプトデータを削除しました: ${deletedUrl}`);
        }
        
        // 次にアクティブにする要素を探す
        let nextActive = activeThumbnail.nextElementSibling;
        
        if (nextActive && nextActive.classList.contains('add-photo-button')) {
            nextActive = null; 
        }

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
            
            loadPromptForImage(newImageUrl); // 新しい画像のプロンプトをロード
            image.src = newImageUrl;
        } else {
            // 削除後、サムネイルが1枚もなくなった場合
            image.src = ''; 
            currentImageUrl = ''; 
            
            // 新規追加: プロンプトエリアもクリア
            if (promptTextarea) {
                promptTextarea.value = '';
            }
        }
    });
}