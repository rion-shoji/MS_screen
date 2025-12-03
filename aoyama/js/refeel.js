// refeel.js

// ステップバーの状態反映
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

  if (fill && dots.length === 4 && step && step in indexMap) {
    const idx = indexMap[step];

    dots.forEach((dot, i) => {
      if (i < idx) dot.classList.add("is-done");
      if (i === idx) dot.classList.add("is-active");
    });

    const percentages = [0, 33, 66, 100];
    fill.style.width = percentages[idx] + "%";
  }
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
