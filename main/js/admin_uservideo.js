document.addEventListener('DOMContentLoaded', function() {
    // === 設定項目 ===
    // 動作させる親コンテナのID
    const containerId = 'master-detail-container';
    // 行をクリックしたときに詳細を表示するテーブルのbody ID
    const tableBodyId = 'video-table-body';
    // 詳細パネルを閉じるボタンのID
    const closeBtnId = 'close-detail-btn';

    // === 要素の取得 ===
    const container = document.getElementById(containerId);
    const tableBody = document.getElementById(tableBodyId);
    const closeBtn = document.getElementById(closeBtnId);

    // 要素が存在しないページでは実行しない（エラー回避）
    if (!container || !tableBody) return;

    // 行（tr）をすべて取得
    const rows = tableBody.querySelectorAll('tr');

    // 詳細パネル内の表示用要素を取得
    const detailTitle = document.getElementById('detail-title');
    const detailStatus = document.getElementById('detail-status');
    const detailDate = document.getElementById('detail-date');
    const detailDuration = document.getElementById('detail-duration');

    // === 1. 行をクリックした時の処理 ===
    rows.forEach(row => {
        row.addEventListener('click', function(e) {
            // アクションボタン（⋮）などをクリックした場合は詳細を開かないようにするならここで判定
            // if (e.target.closest('.action-btn')) return;

            // すべての行から selected クラスを外す
            rows.forEach(r => r.classList.remove('selected'));
            
            // クリックされた行に selected クラスをつける
            this.classList.add('selected');

            // コンテナにクラスを付与してレイアウトを変更（CSSアニメーション開始）
            container.classList.add('details-active');

            // --- データの流し込み処理 ---
            // data-属性から値を取得
            const data = this.dataset;

            // テキストを更新
            if(detailTitle) detailTitle.textContent = data.title;
            if(detailDate) detailDate.textContent = data.date;
            if(detailDuration) detailDuration.textContent = data.duration;
            
            // ステータスの表示切り替え
            if(detailStatus) {
                if (data.status === 'published') {
                    detailStatus.textContent = '公開中';
                    detailStatus.style.color = '#38a169'; // 緑
                } else if (data.status === 'draft') {
                    detailStatus.textContent = '下書き';
                    detailStatus.style.color = '#a0aec0'; // グレー
                } else {
                    detailStatus.textContent = data.status;
                }
            }

            // (オプション) 動画IDを使ってプレーヤーをロードする処理などをここに書く
            // console.log('Video ID:', data.id);
        });
    });

    // === 2. 閉じるボタンをクリックした時の処理 ===
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            // 詳細モード解除
            container.classList.remove('details-active');
            
            // 行の選択状態も解除
            rows.forEach(r => r.classList.remove('selected'));
        });
    }
});