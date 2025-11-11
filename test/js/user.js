document.addEventListener('DOMContentLoaded', function() {
    // 編集ボタン（モーダルを開くボタン）を全て取得
    const openModalBtns = document.querySelectorAll('.btn-edit');
    // 閉じるボタン（×ボタン）を全て取得
    const closeModalBtns = document.querySelectorAll('.close-btn');
    // モーダル内の保存ボタンを全て取得
    const saveBtns = document.querySelectorAll('.btn-save');
    // 性別選択ボタンを全て取得
    const genderBtns = document.querySelectorAll('#modal-gender .gender-btn');

    // --- 1. モーダルを開く処理 ---
    openModalBtns.forEach(button => {
        button.addEventListener('click', function() {
            // data-modal-target属性から対象のモーダルのIDを取得
            const modalId = this.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'block';
            }
        });
    });

    // --- 2. モーダルを閉じる処理 (×ボタン) ---
    closeModalBtns.forEach(button => {
        button.addEventListener('click', function() {
            // 親要素の .modal を探して非表示にする
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // --- 3. モーダルの外側をクリックで閉じる処理 ---
    window.addEventListener('click', function(event) {
        // クリックされた要素が .modal クラスを持ち、かつ .modal-content でない場合
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // --- 4. 性別ボタンの active 制御と値の取得 ---
    genderBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 全てのボタンから active クラスを削除
            genderBtns.forEach(b => b.classList.remove('active'));
            // クリックされたボタンに active クラスを追加
            this.classList.add('active');
        });
    });

    // --- 5. 保存ボタンをクリックした時の処理（仮のデータ更新） ---
    saveBtns.forEach(button => {
        button.addEventListener('click', function() {
            const confirmId = this.getAttribute('data-confirm-id');
            const confirmElement = document.getElementById(confirmId);
            const modal = this.closest('.modal');

            let newValue = '';

            // モーダルIDに基づいて処理を分岐
            switch (confirmId) {
                case 'confirm-name':
                case 'confirm-email':
                    // 名前/メールアドレス
                    const inputElement = modal.querySelector('input[type="text"], input[type="email"]');
                    newValue = inputElement.value;
                    break;
                case 'confirm-gender':
                    // 性別
                    const activeGenderBtn = modal.querySelector('.gender-btn.active');
                    newValue = activeGenderBtn ? activeGenderBtn.getAttribute('data-value') : confirmElement.textContent;
                    break;
                case 'confirm-birth':
                    // 生年月日
                    const year = modal.querySelector('#edit-birth-year').value;
                    const month = modal.querySelector('#edit-birth-month').value;
                    const day = modal.querySelector('#edit-birth-day').value;
                    if (year && month && day) {
                        newValue = `${year}年 ${month}月 ${day}日`;
                    }
                    break;
                case 'confirm-password':
                    // パスワード（ここでは単純に「変更済み」と表示を更新するのみ）
                    const passwordInput = modal.querySelector('#edit-password');
                    const passwordConfirmInput = modal.querySelector('#edit-password-confirm');
                    if (passwordInput.value && passwordInput.value === passwordConfirmInput.value) {
                        newValue = '***'; // 変更が完了したとして非表示のまま
                        alert('パスワードを変更しました！');
                    } else {
                        alert('パスワードが一致しません。');
                        return; // 処理を中断
                    }
                    break;
            }

            // 確認テキストを更新
            if (confirmElement && newValue) {
                confirmElement.textContent = newValue;
            }

            // モーダルを閉じる
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
});
