/* preview.js
   - GCS動画をデフォルト再生（再生エラー修正済み）
   - エクスポート: ダウンロード開始後に home.html へ遷移
   - QR: GCSリンク共有
*/

(function(){
  // ===============================================
  //  設定値 & URL取得ロジック
  // ===============================================

  const DEFAULT_VIDEO_URL = 'https://storage.googleapis.com/refeel-demo-video/refeel_demo.mp4';

  const urlParams = new URLSearchParams(window.location.search);
  const paramUrl = urlParams.get('video'); 
  const TARGET_URL = paramUrl ? paramUrl : DEFAULT_VIDEO_URL;
  
  // --- DOM要素取得 ---
  const video = document.getElementById('mainVideo'); 
  const playBtn = document.getElementById('playBtn');
  const exportBtn = document.getElementById('exportBtn');
  
  // PCプレビュー設定
  if (TARGET_URL && video) {
      video.src = TARGET_URL;
  }

  // 共有用URL
  const SHARE_URL = TARGET_URL;


  // --------------------------------------------------
  //  UI要素（変更なし）
  // --------------------------------------------------
  const seekTrack = document.getElementById('videoSeekbarTrack');
  const seekFill = document.getElementById('videoProgressFill');
  const seekThumb = document.getElementById('videoThumb');
  const shareBtn = document.getElementById('shareBtn');
  const shareModal = document.getElementById('shareModal');
  const shareCloseBtn = document.getElementById('shareCloseBtn');
  const shareCancelBtn = document.getElementById('shareCancelBtn');
  const shareTitle = document.getElementById('shareTitle');
  const shareList = document.getElementById('shareList');
  const shareItems = document.querySelectorAll('.share-item');
  const qrDisplayArea = document.getElementById('qrDisplayArea');
  const qrCodeDiv = document.getElementById('qrcode');
  const qrBackBtn = document.getElementById('qrBackBtn');


  // ===============================================
  //  1. 動画プレーヤー制御
  // ===============================================

  function updateSeekbarUI(percent) {
    const p = Math.max(0, Math.min(100, percent));
    if(seekFill) seekFill.style.width = p + '%';
    if(seekThumb) seekThumb.style.left = p + '%';
  }

  if(video) {
    video.addEventListener('timeupdate', function() {
      if(!isDragging && video.duration) { 
        const percent = (video.currentTime / video.duration) * 100;
        updateSeekbarUI(percent);
      }
    });

    video.addEventListener('ended', function() {
      updatePlayButtonUI(false);
    });
    
    function updatePlayButtonUI(isPlaying) {
      if(!playBtn) return;
      playBtn.classList.toggle('playing', isPlaying);
      playBtn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
      playBtn.setAttribute('aria-label', isPlaying ? '停止' : '再生');
    }

    if(playBtn){
      playBtn.addEventListener('click', function(){
        if(video.paused) {
          video.play();
          updatePlayButtonUI(true);
        } else {
          video.pause();
          updatePlayButtonUI(false);
        }
      });
    }

    video.addEventListener('click', function(){
        if(video.paused) { video.play(); updatePlayButtonUI(true); }
        else { video.pause(); updatePlayButtonUI(false); }
    });
  }


  // ===============================================
  //  2. 動画シークバーの操作
  // ===============================================
  let isDragging = false;

  function handleSeek(clientX) {
    if(!seekTrack || !video) return;
    const rect = seekTrack.getBoundingClientRect();
    const x = clientX - rect.left;
    let percent = (x / rect.width) * 100;
    
    updateSeekbarUI(percent);
    
    if(video.duration) {
       const time = video.duration * (percent / 100);
       video.currentTime = time;
    }
  }

  if(seekTrack) {
    seekTrack.addEventListener('pointerdown', function(e) {
      e.preventDefault();
      isDragging = true;
      seekTrack.setPointerCapture(e.pointerId);
      seekTrack.classList.add('active');
      handleSeek(e.clientX);
    });

    seekTrack.addEventListener('pointermove', function(e) {
      if(!isDragging) return;
      handleSeek(e.clientX);
    });

    seekTrack.addEventListener('pointerup', function(e) {
      if(!isDragging) return;
      isDragging = false;
      seekTrack.classList.remove('active');
      seekTrack.releasePointerCapture(e.pointerId);
      handleSeek(e.clientX);
    });
    
    seekTrack.addEventListener('pointercancel', function(e) {
      isDragging = false;
      seekTrack.classList.remove('active');
    });
  }


  // ===============================================
  //  3. エクスポート機能 (ダウンロード後に遷移)
  // ===============================================
  if(exportBtn){
    exportBtn.addEventListener('click', function(e){
      e.preventDefault();
      
      // 連打防止
      this.style.pointerEvents = 'none';
      this.style.opacity = '0.7';

      //変数化して実戦よう
      const movie_name = 'refeel_demo.mp4'

      const downloadUrl = video.src;
      const fetchUrl = downloadUrl + '?t=' + new Date().getTime();
      const fileName = downloadUrl.split('/').pop() || movie_name;

      // Fetch APIでダウンロード
      fetch(fetchUrl)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            
            a.click(); // ダウンロード開始
            
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            // ★ここが変更点: 1秒後に画面遷移
            setTimeout(() => {
                window.location.href = '../html/home.html';
            }, 1000);
        })
        .catch(err => {
            console.warn('Fetch failed, falling back to new tab:', err);
            
            const confirmMsg = 'セキュリティ制限のため、別タブで動画を開きます。\n開いた画面で「右クリック保存」してください。';
            if(confirm(confirmMsg)) {
                window.open(downloadUrl, '_blank');
            }
            
            // エラー時はボタンを戻す（遷移しないので）
            this.style.pointerEvents = 'auto';
            this.style.opacity = '1';
        });
    });
  }


  // ===============================================
  //  4. 共有機能
  // ===============================================
  function openShareModal() {
    if(!shareModal) return;
    shareModal.style.display = 'flex';
    resetShareView();
    setTimeout(() => {
      shareModal.classList.add('active');
      shareModal.setAttribute('aria-hidden', 'false');
    }, 10);
  }

  function closeShareModal() {
    if(!shareModal) return;
    shareModal.classList.remove('active');
    shareModal.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      shareModal.style.display = 'none';
      resetShareView();
    }, 300);
  }

  function resetShareView() {
    if(shareList) shareList.style.display = '';
    if(qrDisplayArea) qrDisplayArea.style.display = 'none';
    if(shareCancelBtn) shareCancelBtn.style.display = 'block';
    if(shareTitle) shareTitle.innerText = '共有';
  }

  if(shareBtn) shareBtn.addEventListener('click', openShareModal);
  if(shareCloseBtn) shareCloseBtn.addEventListener('click', closeShareModal);
  if(shareCancelBtn) shareCancelBtn.addEventListener('click', closeShareModal);
  if(shareModal){
    shareModal.addEventListener('click', function(e){
      if(e.target === shareModal) closeShareModal();
    });
  }

  shareItems.forEach(item => {
    item.addEventListener('click', function(){
      const action = this.getAttribute('data-action');
      if (action === 'mail') {
        const subject = encodeURIComponent('動画を作成しました [ReFeel]');
        const body = encodeURIComponent(`作成した動画を共有します。\n${SHARE_URL}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
        setTimeout(closeShareModal, 500);
      } else if (action === 'copy') {
        navigator.clipboard.writeText(SHARE_URL)
          .then(() => alert('リンクをコピーしました！'));
        closeShareModal();
      } else if (action === 'qr') {
        showQrView();
      }
    });
  });

  function showQrView() {
    shareList.style.display = 'none';
    shareCancelBtn.style.display = 'none';
    shareTitle.innerText = 'QRコード';
    qrDisplayArea.style.display = 'flex';
    qrCodeDiv.innerHTML = '';
    if (typeof QRCode !== 'undefined') {
      new QRCode(qrCodeDiv, {
        text: SHARE_URL,
        width: 160,
        height: 160,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
      });
    } else {
      qrCodeDiv.innerHTML = 'QRライブラリ読込エラー';
    }
  }

  if(qrBackBtn) {
    qrBackBtn.addEventListener('click', resetShareView);
  }

})();