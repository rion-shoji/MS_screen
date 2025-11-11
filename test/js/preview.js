/* add.js
   - 再生ボタンのトグル
   - 音楽シークバー（musicBar）のドラッグ操作
   - 動画長/音楽長は固定値: 動画=2分(基準1.0)、音楽=1分30秒(=0.75)
*/

(function(){
  // 動画と音楽の長さ（現在は固定値）
  // 音楽の長さは動画を1とした場合の比率で計算
  const videoLengthSec = 120; // 動画時間（秒数表記）
  const musicLengthSec = 40;  // 音楽時間（秒数表記）
  const musicRatio = musicLengthSec / videoLengthSec; // 音楽のスクロールバーの長さ

  // DOM
  const playBtn = document.getElementById('playBtn');
  const musicBar = document.getElementById('musicBar');
  const musicTrack = document.getElementById('musicTrack');
  const musicContainer = document.getElementById('musicSeekbarContainer');
  const menuBtn = document.getElementById('menuBtn');
  const menuDropdown = document.getElementById('menuDropdown');

  // 初期セット: musicBar の幅はコンテナ幅 * musicRatio
  function setInitialMusicBarWidth(){
    const trackWidth = musicTrack.clientWidth;
    const width = Math.max(24, Math.round(trackWidth * musicRatio));
    musicBar.style.width = width + 'px';
    musicBar.style.left = '0px';
  }

  // 再生ボタンのトグル
  if(playBtn){
    playBtn.addEventListener('click', function(){
      const isPlaying = playBtn.classList.toggle('playing');
      playBtn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
      playBtn.setAttribute('aria-label', isPlaying ? '停止' : '再生');
      // ここで将来 video.play() / video.pause() を呼ぶ
    });
  }

  // ハンバーガーメニューの開閉
  if(menuBtn && menuDropdown){
    menuBtn.addEventListener('click', function(e){
      e.stopPropagation();
      const open = menuDropdown.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuDropdown.setAttribute('aria-hidden', open ? 'false' : 'true');
    });
    // クリック外で閉じる
    document.addEventListener('click', function(){
      if(menuDropdown.classList.contains('open')){
        menuDropdown.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuDropdown.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // 音楽バーのドラッグ
  let dragging = false;
  let startX = 0;
  let startLeft = 0;

  function onPointerDown(e){
    e.preventDefault();
    dragging = true;
    musicBar.setPointerCapture?.(e.pointerId);
    startX = e.clientX;
    startLeft = parseInt(musicBar.style.left || '0', 10);
    musicBar.classList.add('dragging');
  }

  function onPointerMove(e){
    if(!dragging) return;
    const dx = e.clientX - startX;
    const trackRect = musicTrack.getBoundingClientRect();
    const maxLeft = Math.max(0, trackRect.width - musicBar.offsetWidth);
    let newLeft = startLeft + dx;
    newLeft = Math.max(0, Math.min(maxLeft, newLeft));
    musicBar.style.left = newLeft + 'px';
  }

  function onPointerUp(e){
    if(!dragging) return;
    dragging = false;
    musicBar.classList.remove('dragging');
    try{ musicBar.releasePointerCapture?.(e.pointerId); }catch(e){}
  }

  // attach pointer events
  musicBar.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);

  // ウィンドウリサイズでバーの幅を再計算
  window.addEventListener('resize', setInitialMusicBarWidth);

  // 初期化
  window.addEventListener('DOMContentLoaded', function(){
    if(!musicBar || !musicTrack) return;
    setInitialMusicBarWidth();
  });

})();
