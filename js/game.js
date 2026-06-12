"use strict";
/* ---------- game state ---------- */
const TOTAL = 10;
const PRAISE = ["Brilliant!", "Well done!", "Super!", "Amazing!", "Lovely work!", "Beautiful!", "You star!", "Fantastic!", "Hooray!", "Splendid!"];
// pick from arr without repeats until the whole bag is used, never the same twice running
const bags = {}, lastPick = {};
function vary(key, arr) {
  let b = bags[key];
  if (!b || !b.length) {
    b = bags[key] = shuffle(arr.slice());
    if (arr.length > 1 && b[0] === lastPick[key]) b.push(b.shift());
  }
  const v = b.shift();
  lastPick[key] = v;
  return v;
}
let mode = "x2", qnum = 0, score = 0, locked = false, q = null;
let roundNew = [], roundIds = [], promptT = null, lastGood = null;

/* ---------- stars & footer ---------- */
function starSVG(filled) {
  const c = filled ? "#EF9F27" : "#d8cdb4";
  return '<svg class="star" viewBox="0 0 24 24"><path d="M12 2.5 L14.6 9 L21.5 9.4 L16.2 13.8 L18 20.5 L12 16.8 L6 20.5 L7.8 13.8 L2.5 9.4 L9.4 9 Z" fill="' + (filled ? c : "none") + '" stroke="' + c + '" stroke-width="1.6" stroke-linejoin="round"/></svg>';
}
function setStars() {
  let h = "";
  for (let i = 0; i < TOTAL; i++) h += starSVG(i < score);
  $("stars").innerHTML = h;
}
function setFooter() {
  const n = totalCaught();
  $("totalCaught").textContent = n > 0 ? "🦋 " + n + " caught altogether" : "";
}

/* ---------- mode picker ---------- */
const MODE_ICONS = { x2: "🐞", x5: "⭐", x10: "🌼", add: "🍎", sub: "🍪", div: "🍓", miss: "🕵️", pv: "🐊", frac: "🍰", money: "💰", time: "⏰", x3: "🎈", x4: "🍀", x8: "🕷️", add2: "🚀", sub2: "🎢", nw: "🔤", oe: "🧦", shp: "🔷", quiz1: "🥉", quiz2: "🥈", quiz3: "🥇" };
// quizzes open one at a time: clear a quiz (8+ stars in a round) to open the next
function quizCleared(id) { return (S.bestRound[id] || 0) >= 8; }
function quizLocked(id) {
  return id === "quiz2" ? !quizCleared("quiz1") : id === "quiz3" ? !quizCleared("quiz2") : false;
}
function buildModes() {
  const groups = { 2: [], q: [], 3: [] };
  for (const [id, m] of Object.entries(MODES)) groups[m.year].push([id, m]);
  $("modes").innerHTML = [2, "q", 3].filter(y => groups[y].length).map(y =>
    '<div class="ygroup"><div class="ylabel">' + (y === 2 ? "Year 2" : y === "q" ? "Y2 Quiz 🏅" : "Year 3 ✨") + '</div><div class="chips">' +
    groups[y].map(([id, m]) => {
      const locked = m.quiz && quizLocked(id);
      return '<button class="mode-btn' + (id === mode ? " on" : "") + (y === 3 ? " y3" : "") + (y === "q" ? " yq" : "") + (locked ? " locked" : "") + '" data-m="' + id + '">' +
      '<span class="ic">' + (MODE_ICONS[id] || "🦋") + '</span>' +
      m.label + (m.quiz && quizCleared(id) ? " ✓" : "") +
      (locked ? '<span class="lock">🔒</span>' : '<span class="prog" id="dot-' + id + '"><span class="fill"></span></span>') + '</button>';
    }).join("") +
    '</div></div>').join("");
  document.querySelectorAll(".mode-btn").forEach(b => {
    b.onclick = () => {
      sTap();
      if (b.classList.contains("locked")) {
        const prev = b.dataset.m === "quiz3" ? "Quiz 2" : "Quiz 1";
        speak("This quiz is still locked! Clear " + prev + " first — catch eight stars or more in one round.");
        return;
      }
      document.querySelectorAll(".mode-btn").forEach(x => x.classList.remove("on"));
      b.classList.add("on");
      mode = b.dataset.m;
      restart();
    };
  });
  const on = document.querySelector(".mode-btn.on");
  if (on && on.scrollIntoView) on.scrollIntoView({ inline: "center", block: "nearest" });
  document.querySelectorAll(".chips").forEach(el => {
    el.addEventListener("scroll", () => updateChipFades(), { passive: true });
  });
  updateChipFades();
  updateDots();
}
function updateChipFades() {
  document.querySelectorAll(".chips").forEach(el => {
    el.classList.toggle("moreR", el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    el.classList.toggle("moreL", el.scrollLeft > 4);
  });
}
window.addEventListener("resize", updateChipFades);
// each chip wears a tiny progress bar: it fills toward golden (half-way = level 2,
// matching topicLvl's fast track) and turns gold when the topic is golden
function updateDots() {
  for (const id of Object.keys(MODES)) {
    const el = $("dot-" + id);
    if (!el) continue;
    const c = (S.topics[id] || {}).correct || 0;
    const lvl = topicLvl(id);
    const fill = lvl >= 3 ? 1
               : lvl === 2 ? 0.5 + 0.5 * Math.min(1, Math.max(0, (c - 15) / 25))
               : 0.5 * Math.min(1, c / 15);
    const bar = el.firstElementChild;
    bar.style.width = Math.round(fill * 100) + "%";
    bar.style.background = lvl >= 3 ? "#e8b73a" : c >= 1 ? "#6aa84f" : "transparent";
  }
}

