// refeel.js

// ステップバーの状態反映（前画面 → 今画面をなめらかに）
(function () {
  const body = document.body;
  const step = body.dataset.step;
  const fill = document.querySelector(".rf-stepper-fill");
  const dots = document.querySelectorAll(".rf-stepper-dot");

  const indexMap = {
    photo: 0,
    option: 1,
    select: 2,
    preview: 3,
  };

  if (!fill || dots.length !== 4 || !step || !(step in indexMap)) return;

  const currentIndex = indexMap[step];

  // 前回のステップ（なければ今と同じにしておく）
  const prevStored = sessionStorage.getItem("rfCurrentStepIndex");
  const prevIndex =
    prevStored !== null && !Number.isNaN(parseInt(prevStored, 10))
      ? parseInt(prevStored, 10)
      : currentIndex;

  sessionStorage.setItem("rfCurrentStepIndex", String(currentIndex));

  const percentages = [0, 33, 66, 100];
  const startPercent = percentages[Math.max(0, Math.min(prevIndex, 3))];
  const endPercent = percentages[currentIndex];

  // まずは「前の位置」で描画してから、次のフレームで伸ばす
  fill.style.transition = "none";
  fill.style.width = startPercent + "%";

  requestAnimationFrame(() => {
    // reflow を挟んでから transition を戻す
    // eslint-disable-next-line no-unused-expressions
    fill.offsetWidth;

    fill.style.transition = "width 0.6s ease";
    fill.style.width = endPercent + "%";
  });

  // ドットの状態も更新（色変化はCSS側のtransition任せ）
  dots.forEach((dot, i) => {
    dot.classList.remove("is-done", "is-active");
    if (i < currentIndex) {
      dot.classList.add("is-done");
    } else if (i === currentIndex) {
      dot.classList.add("is-active");
    }
  });
})();

// チップの選択（単一・複数両対応）
document.addEventListener("click", function (e) {
  const chip = e.target.closest(".rf-chip");
  if (!chip) return;

  const group = chip.closest(".rf-chip-group");
  if (!group) return;

  const multi = group.dataset.multi === "true";

  if (!multi) {
    group.querySelectorAll(".rf-chip").forEach((c) => c.classList.remove("is-selected"));
    chip.classList.add("is-selected");
  } else {
    chip.classList.toggle("is-selected");
  }
});

// なんちゃってトグルスイッチ
document.addEventListener("click", function (e) {
  const toggle = e.target.closest(".rf-toggle");
  if (!toggle) return;

  toggle.classList.toggle("is-on");
});

// 画面比率ボタン
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".rf-ratio-btn");
  if (!btn) return;

  const group = btn.closest(".rf-ratio-group");
  if (!group) return;

  group.querySelectorAll(".rf-ratio-btn").forEach((b) => b.classList.remove("is-selected"));
  btn.classList.add("is-selected");
});

// 楽曲カードの「この曲を使う」ラジオ風
document.addEventListener("change", function (e) {
  if (!e.target.matches("input[name='bgmChoice']")) return;

  const cards = document.querySelectorAll(".rf-music-card");
  cards.forEach((card) => card.classList.remove("is-selected"));

  const card = e.target.closest(".rf-music-card");
  if (card) card.classList.add("is-selected");
});
