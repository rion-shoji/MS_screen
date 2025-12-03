document.addEventListener('DOMContentLoaded', () => {
    // 初期状態を「未選択」（空文字列）に設定 (HTMLのis-activeに対応)
    const selection = {
        mood: "", 
        genre: ""
    };

    const generateButton = document.getElementById('generate-button');
    const moodSelection = document.getElementById('mood-selection');
    const genreSelection = document.getElementById('genre-selection');

    // **変更点 1: checkSelection関数を削除し、ボタンを常に有効化**
    // HTML側で disabled 属性を削除するか、ここでボタンを有効化します。
    generateButton.disabled = false;

    // 選択処理を行う汎用関数
    const handleSelection = (event) => {
        const button = event.target;
        // チップ自体がクリックされたことを確認
        if (!button.classList.contains('chip')) return;

        const type = button.dataset.type;
        const value = button.dataset.value;
        const parent = button.parentNode;

        // 既に選択されているボタンのハイライトを解除 (is-activeを削除)
        parent.querySelectorAll('.chip').forEach(btn => {
            btn.classList.remove('is-active');
        });

        // 現在のボタンをハイライト
        button.classList.add('is-active');

        // 選択状態を更新
        selection[type] = value;
    };

    // イベントリスナーの設定
    moodSelection.addEventListener('click', handleSelection);
    genreSelection.addEventListener('click', handleSelection);

    // 音楽を生成ボタンの処理
    generateButton.addEventListener('click', () => {
        // **変更点 2: 値が空文字列 ("") の場合、渡す値を null に変換する**
        const moodValueToSend = selection.mood === "" ? null : selection.mood;
        const genreValueToSend = selection.genre === "" ? null : selection.genre;
        
        console.log('--- 音楽生成リクエスト ---');
        console.log('APIに渡すムード (Mood):', moodValueToSend); // "" の場合は null が表示される
        console.log('APIに渡すジャンル (Genre):', genreValueToSend); // "" の場合は null が表示される
        
        // ユーザー向けコンソールログ (確認用)
        const selectedMood = selection.mood === "" ? "未選択 (nullとして送信)" : selection.mood;
        const selectedGenre = selection.genre === "" ? "未選択 (nullとして送信)" : selection.genre;
        console.log(`選択: ムード: ${selectedMood}, ジャンル: ${selectedGenre}`);

        // ここに、moodValueToSend と genreValueToSend を使用した API 呼び出しロジックが入ります。
    });

    // 戻るボタンの処理
    document.getElementById('back-button').addEventListener('click', () => {
        console.log('戻るボタンが押されました。');
    });

    // 閉じるボタンの処理 (元のコードに残っていたものを維持)
    const closeButton = document.querySelector('.music__close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            console.log('閉じるボタンが押されました。');
            // alert('画面を閉じる処理を実行します。');
        });
    }

    

    // 初期状態のチェック
    checkSelection();
});