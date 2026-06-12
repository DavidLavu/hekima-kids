"use strict";
/* ---------- catching butterflies ---------- */
// top of the meadow's VISIBLE band in viewBox units (wide screens crop the sky away)
function meadowTop() {
  const el = $("meadow");
  if (!el.clientWidth) return 0;
  return Math.max(0, 170 - el.clientHeight / (el.clientWidth / 680));
}
function addToMeadow(spId, opts = {}) {
  // land inside the visible band, however the meadow is cropped on small/wide screens
  const yMin = Math.max(84, meadowTop() + 10);
  const x = rnd(120, 560), y = rnd(yMin, Math.max(146, yMin + 8)), s = (0.6 + Math.random() * 0.45).toFixed(2), r = rnd(-25, 25);
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.innerHTML = bflySVG(SP[spId]);
  g.classList.add("flying");
  let sx, sy, sr;
  if (opts.fromAlbum) { sx = rnd(620, 740); sy = -60; sr = -35; } // swoop down from the Album button
  else { const fromLeft = x < 340; sx = fromLeft ? -70 : 750; sy = rnd(-15, 25); sr = fromLeft ? 25 : -25; }
  g.style.transform = "translate(" + sx + "px, " + sy + "px) rotate(" + sr + "deg) scale(" + s + ")";
  g.style.transition = "transform " + (opts.fromAlbum ? 1.9 : 1.5) + "s cubic-bezier(.5,.1,.4,1)";
  const f = $("bfield");
  f.appendChild(g);
  while (f.children.length > 24) f.removeChild(f.firstChild);
  setTimeout(() => {
    g.style.transform = "translate(" + x + "px, " + y + "px) rotate(" + r + "deg) scale(" + s + ")";
  }, 40);
  setTimeout(() => g.classList.remove("flying"), opts.fromAlbum ? 2000 : 1600);
}
// treasures appear in the sky (night-sky items) or on the grass (magic items)
function addTreasureToScene(id, opts = {}) {
  const t = TR[id];
  if (!t) return;
  const sky = t.coll === "sky" || t.coll === "legend"; // the Golden Butterfly flies high
  const vt = meadowTop();
  const x = sky ? rnd(70, 610) : rnd(120, 560);
  // sky items float in the upper part of whatever is visible; magic items sit on the grass
  const y = sky ? rnd(vt + 10, Math.max(vt + 34, 58)) : rnd(Math.max(98, vt + 12), 148);
  const s = (sky ? 0.45 : 0.5) + Math.random() * 0.25;
  const f = $("sfield");
  // keep the scene tidy: at most 10 of each kind
  const kin = [...f.children].filter(c => c.dataset.coll === t.coll);
  if (kin.length >= 10) f.removeChild(kin[0]);
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.dataset.coll = t.coll;
  g.innerHTML = '<g class="tbob">' + treasureSVG(t) + '</g>';
  g.style.transform = "translate(" + x + "px, -50px) scale(0.1)";
  g.style.transition = "transform 1.4s cubic-bezier(.45,.1,.35,1.1)";
  f.appendChild(g);
  setTimeout(() => {
    g.style.transform = "translate(" + x + "px, " + y + "px) scale(" + s.toFixed(2) + ")";
  }, 40);
}
function addCaughtToScene(id, opts = {}) {
  if (SP[id]) addToMeadow(id, opts);
  else addTreasureToScene(id, opts);
}
// her learning garden grows in the meadow itself: one flower per topic,
// a petal per 5 right answers; blooming at level 2, golden at level 3
function renderGarden() {
  const g = $("garden");
  const ids = Object.keys(MODES).filter(m => !MODES[m].quiz);
  g.innerHTML = ids.map((m, i) => {
    const st = topicStat(m), lvl = topicLvl(m);
    const petals = Math.min(8, Math.floor(st.correct / 5));
    const x = 42 + i * (596 / (ids.length - 1));
    const y = [130, 142, 136][i % 3];
    const sc = lvl === 3 ? 1.15 : lvl === 2 ? 1 : 0.75;
    const pc = lvl === 3 ? "#e8b73a" : "#e8638c";
    const oc = lvl === 3 ? "#d9a93a" : "#c98ca0";
    let ps = "";
    for (let k = 0; k < 8; k++) {
      ps += '<ellipse cx="0" cy="-8.5" rx="3.2" ry="5.5" transform="rotate(' + k * 45 + ')" fill="' +
            (k < petals ? pc : "none") + '" stroke="' + oc + '" stroke-width="1.2"/>';
    }
    return '<g class="gflower" data-m="' + m + '" transform="translate(' + x.toFixed(1) + ' ' + y + ') scale(' + sc + ')">' +
      '<path d="M0 17 C -1 11 1 6 0 0" stroke="#4e7d3c" stroke-width="2" fill="none"/>' +
      ps + '<circle r="3.4" fill="#e8c84f"/></g>';
  }).join("");
  g.querySelectorAll(".gflower").forEach(f => {
    f.onclick = () => {
      const m = f.dataset.m, st = topicStat(m), lvl = topicLvl(m);
      sTap();
      speak("Your “" + MODES[m].label + "” flower! " + (
        lvl === 3 ? "It is golden — you are a star at this!" :
        lvl === 2 ? "It is blooming beautifully — " + words(st.correct) + " right answers!" :
        st.correct > 0 ? "It is growing — " + words(st.correct) + " right answers so far!" :
        "Help it grow by playing “" + MODES[m].label + "”!"));
    };
  });
}

// the meadow dresses for the season (date-based, no network)
function dressMeadow() {
  const m = new Date().getMonth();
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  let inner = "";
  if (m >= 2 && m <= 4) { // spring: daffodils
    [[120, 118], [395, 124], [598, 120]].forEach(([x, y]) => {
      inner += '<g transform="translate(' + x + " " + y + ')"><path d="M0 14 C -1 6 1 2 0 -2" stroke="#4e7d3c" stroke-width="2.5" fill="none"/>' +
        '<circle cx="0" cy="-6" r="3" fill="#f2c84b"/><circle cx="-4.6" cy="-3.4" r="3" fill="#f7d154"/><circle cx="4.6" cy="-3.4" r="3" fill="#f7d154"/><circle cx="-2.9" cy="1.9" r="3" fill="#f7d154"/><circle cx="2.9" cy="1.9" r="3" fill="#f7d154"/><circle cy="-2" r="2.4" fill="#e8923a"/></g>';
    });
  } else if (m >= 5 && m <= 7) { // summer: poppies
    [[150, 122], [340, 128], [565, 118]].forEach(([x, y]) => {
      inner += '<g transform="translate(' + x + " " + y + ')"><path d="M0 14 C -1 8 1 4 0 0" stroke="#4e7d3c" stroke-width="2.5" fill="none"/>' +
        '<circle cx="-3.2" cy="-3" r="3.6" fill="#d8402c"/><circle cx="3.2" cy="-3" r="3.6" fill="#e0512f"/><circle cx="0" cy="1" r="3.6" fill="#d8402c"/><circle cy="-1.5" r="1.8" fill="#3a3026"/></g>';
    });
  } else if (m >= 8 && m <= 10) { // autumn: drifting leaves
    [[140, -2, "#d8842f"], [330, -4.5, "#c46a2a"], [520, -7.5, "#e0a13a"]].forEach(([x, d, c]) => {
      inner += '<g class="fall" style="animation-delay:' + d + 's"><path transform="translate(' + x + ' 0) rotate(30)" d="M0 -6 C 4 -3 4 3 0 6 C -4 3 -4 -3 0 -6 Z" fill="' + c + '"/></g>';
    });
  } else { // winter: falling snow + a snowy patch
    [[110, 0], [250, -3], [410, -6], [580, -8]].forEach(([x, d]) => {
      inner += '<g class="fall" style="animation-delay:' + d + 's"><circle cx="' + x + '" cy="0" r="3" fill="#fff" opacity="0.9"/></g>';
    });
    inner += '<path d="M210 104 C 260 96 330 108 380 102 C 350 112 250 114 210 104 Z" fill="#f6f4ef" opacity="0.8"/>';
  }
  g.innerHTML = inner;
  $("meadow").insertBefore(g, $("sfield"));
}
// her collection flies out of the album into the field
let populateTimers = [];
function populateMeadow() {
  populateTimers.forEach(clearTimeout);
  populateTimers = [];
  $("sfield").innerHTML = "";
  const owned = Object.keys(S.caught).filter(id => S.caught[id] > 0 && ITEM(id));
  const bflies = shuffle(owned.filter(id => SP[id]));
  const treasures = shuffle(owned.filter(id => TR[id])).slice(0, 12);
  if (!bflies.length && !treasures.length) return;
  const total = Object.values(S.caught).reduce((a, b) => a + b, 0);
  const picks = bflies.slice(0, 20);
  while (bflies.length && picks.length < Math.min(6, total)) picks.push(bflies[picks.length % bflies.length]);
  picks.forEach((id, i) => populateTimers.push(setTimeout(() => addToMeadow(id, { fromAlbum: true }), 150 + i * 280)));
  treasures.forEach((id, i) => populateTimers.push(setTimeout(() => addTreasureToScene(id), 400 + i * 340)));
}
// every few seconds one resting butterfly flutters its wings
setInterval(() => {
  const bs = $("bfield").children;
  if (!bs.length) return;
  const b = bs[rnd(0, bs.length - 1)];
  if (b.classList.contains("flying")) return;
  b.classList.add("flap");
  setTimeout(() => b.classList.remove("flap"), 2100);
}, 5000);
function celebrate(item) {
  const old = $("flyer");
  if (old) old.remove();
  const d = document.createElement("div");
  d.id = "flyer";
  const inner = SP[item.id] ? bflySVG(item) : treasureSVG(item);
  d.innerHTML = '<span class="bob"><svg class="flying" width="90" viewBox="-32 -32 64 58">' + inner + '</svg></span>';
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 4200);
  sUnlock();
}
// 8+ stars: her own caught butterflies rise from the meadow, swirl up and settle back
function flypast() {
  const owned = SPECIES.filter(s => S.caught[s.id] > 0);
  if (!owned.length) return;
  const n = Math.min(12, Math.max(6, owned.length));
  for (let i = 0; i < n; i++) {
    const sp = owned[i % owned.length];
    const d = document.createElement("div");
    d.className = "fpb";
    d.style.left = rnd(3, 88) + "vw";
    d.style.setProperty("--d", (2.1 + Math.random() * 1.1).toFixed(2) + "s");
    d.style.setProperty("--peak", rnd(-6, 16) + "vh");
    d.style.animationDelay = (Math.random() * 0.6).toFixed(2) + "s";
    d.innerHTML = '<span class="sway" style="animation-delay:-' + (Math.random() * 1.5).toFixed(2) +
      's"><svg class="flying" width="' + rnd(34, 58) + '" viewBox="-32 -32 64 58">' + bflySVG(sp) + '</svg></span>';
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 4400);
  }
}
// soft firework blooms in the sky for the rare moments — slow dot-rings, no flashing
function sparkleBursts(big) {
  const cols = ["#e8b73a", "#e8638c", "#7bc47f", "#6fa8dc", "#e6a4b8"];
  for (let i = 0; i < (big ? 5 : 3); i++) {
    setTimeout(() => {
      const d = document.createElement("div");
      d.className = "burst";
      d.style.left = rnd(10, 78) + "vw";
      d.style.top = rnd(6, 36) + "vh";
      const c = cols[rnd(0, cols.length - 1)], r = rnd(32, 54);
      let dots = "";
      for (let k = 0; k < 10; k++) {
        const a = k * Math.PI / 5;
        dots += '<circle cx="' + (60 + r * Math.cos(a)).toFixed(1) + '" cy="' + (60 + r * Math.sin(a)).toFixed(1) +
                '" r="' + (k % 2 ? 3 : 4.5) + '" fill="' + c + '"/>';
      }
      d.innerHTML = '<svg width="120" height="120" viewBox="0 0 120 120">' + dots + '</svg>';
      document.body.appendChild(d);
      play([[760 + rnd(0, 4) * 110, 0.09], [1280, 0.14]]);
      setTimeout(() => d.remove(), 1700);
    }, i * 360);
  }
}
// returns the items caught this answer (new discoveries only)
function awardCatch() {
  const coll = activeColl();
  const ids = [];
  // in a quiz, the catch belongs to the topic the question came from
  const topic = (q && q.topic) || mode;
  if (coll === "bfly") {
    ids.push(MODES[topic].sp);
    const st = topicStat(topic);
    if (st.correct >= 15 && Math.random() < 0.25) ids.push(WANDERERS[rnd(0, 1)]);
  } else {
    // treasures arrive IN ORDER, each tied to a topic; the final three of a page
    // also need a blooming flower (level 2+) in their topic — better ones cost more
    const nt = nextTreasure(coll);
    const idx = nt ? TREASURES.filter(t => t.coll === coll && t.t === "c").indexOf(nt) : -1;
    const gated = nt && idx >= 4 && topicLvl(nt.topic) < 2;
    const owned = TREASURES.filter(t => t.coll === coll && S.caught[t.id] > 0);
    if (nt && nt.topic === topic && !gated && Math.random() < 0.4) ids.push(nt.id);
    else if (owned.length && Math.random() < 0.5) ids.push(owned[rnd(0, owned.length - 1)].id);
    else ids.push(SPECIES[rnd(0, SPECIES.length - 1)].id); // an old butterfly friend visits
  }
  // caught at a golden flower (level 3)? it becomes a shiny
  S.shiny = S.shiny || {};
  if (TR[ids[0]] && !(S.caught[ids[0]] > 0) && topicLvl(topic) >= 3) S.shiny[ids[0]] = true;
  const news = [];
  for (const id of ids) {
    const isNew = !(S.caught[id] > 0);
    S.caught[id] = (S.caught[id] || 0) + 1;
    roundIds.push(id);
    addCaughtToScene(id);
    if (isNew) { roundNew.push(id); news.push(id); }
  }
  return news;
}
function unlockRare() {
  const coll = activeColl();
  const pool = coll === "bfly" ? RARES : TREASURES.filter(t => t.coll === coll && t.t === "r").map(t => t.id);
  const id = pool.find(r => !(S.caught[r] > 0));
  if (!id) return null;
  S.caught[id] = 1;
  roundNew.push(id);
  addCaughtToScene(id);
  celebrate(ITEM(id));
  return ITEM(id);
}

