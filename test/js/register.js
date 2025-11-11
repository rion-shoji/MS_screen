document.addEventListener('DOMContentLoaded', function() {
    const genderBtns = document.querySelectorAll('.gender-btn');
    const genderInput = document.getElementById('gender');

    // 初期化処理: 全てのボタンから active を削除
    genderBtns.forEach(btn => btn.classList.remove('active'));
    genderInput.value = ''; 

    // クリックイベントの設定
    genderBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 1. 全てのボタンから 'active' クラスを削除
            genderBtns.forEach(b => b.classList.remove('active'));

            // 2. クリックされたボタンに 'active' クラスを追加 
            this.classList.add('active');

            // 3. 隠しフィールドの値を更新
            const selectedValue = this.getAttribute('data-value');
            genderInput.value = selectedValue;
        });
    });
});