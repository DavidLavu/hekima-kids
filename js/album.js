"use strict";
/* ---------- album ---------- */
function lockedHint(sp) {
  if (sp.topic) return "Practise “" + MODES[sp.topic].label + "” to find this one!";
  if (sp.t === "u") return "It visits children who keep practising…";
  return "Catch 9 stars in one round to find this one!";
}
function flowerSVG(filled) {
  let p = "";
  for (let i = 0; i < 8; i++) {
    p += '<ellipse cx="30" cy="13" rx="6.5" ry="11" transform="rotate(' + i * 45 + ' 30 30)" fill="' +
         (i < filled ? "#e8638c" : "none") + '" stroke="#c98ca0" stroke-width="1.5"/>';
  }
  return '<svg viewBox="0 0 60 60">' + p + '<circle cx="30" cy="30" r="7" fill="#e8c84f"/></svg>';
}
function renderAlbum() {
  const tFound = TREASURES.filter(t => S.caught[t.id] > 0).length;
  $("albumTotal").textContent = totalCaught() + (tFound ? " catches altogether · " : " butterflies caught altogether · ") +
    SPECIES.filter(sp => S.caught[sp.id] > 0).length + " of " + SPECIES.length + " species" +
    (tFound ? " · " + tFound + " of " + TREASURES.length + " treasures" : " discovered");
  $("albumGrid").innerHTML = SPECIES.map(sp => {
    const n = S.caught[sp.id] || 0;
    if (n > 0) {
      return '<div class="card" data-sp="' + sp.id + '">' + cardSVG(sp) +
        (sp.t === "r" ? '<div class="badge">★ RARE</div>' : "") +
        '<div class="nm">' + sp.name + '</div><div class="ct">caught ×' + n + '</div></div>';
    }
    return '<div class="card locked" data-sp="' + sp.id + '">' + cardSVG(sp, true) +
      '<div class="nm">???</div><div class="ct">' + lockedHint(sp) + '</div></div>';
  }).join("");
  document.querySelectorAll("#albumGrid .card").forEach(c => {
    c.onclick = () => {
      const sp = SP[c.dataset.sp];
      const svg = c.querySelector("svg");
      svg.classList.remove("flap");
      void svg.getBoundingClientRect();
      svg.classList.add("flap");
      if (S.caught[sp.id] > 0) { sTap(); speak("The " + sp.name + ". " + sp.fact); }
      else { sTap(); speak("A mystery butterfly! " + lockedHint(sp)); }
    };
  });
  // treasure pages: visible once the previous collection is complete, teased before
  const tHint = t => {
    if (t.t === "f") return "A new friend visits every morning — finish their quest to keep them!";
    if (t.t === "r") return "Catch 9 stars in one round to find this one!";
    const nt = nextTreasure(t.coll);
    if (!nt || nt.id !== t.id) return "Find the treasures before this one first…";
    const idx = TREASURES.filter(x => x.coll === t.coll && x.t === "c").indexOf(t);
    if (idx >= 4 && topicLvl(t.topic) < 2)
      return "Get even better at “" + MODES[t.topic].label + "” to find this one — grow its flower!";
    return "Practise “" + MODES[t.topic].label + "” to find this one!";
  };
  const ticon = { sky: "🌙", magic: "🦄", sea: "🦀" };
  const teaserFor = { bfly: "Find every butterfly to discover a secret new page…",
                      sky: "Finish the Night Sky page to discover what comes next…",
                      magic: "Finish the Magic Meadow page — something is waiting by the sea…" };
  let th = "";
  for (const [cid, prev] of [["sky", "bfly"], ["magic", "sky"], ["sea", "magic"]]) {
    if (!collComplete(prev)) {
      th += '<h3 class="sect">🔒 ???</h3><p class="note">' + teaserFor[prev] + '</p>';
      break;
    }
    const items = TREASURES.filter(t => t.coll === cid);
    const found = items.filter(t => S.caught[t.id] > 0).length;
    th += '<h3 class="sect">' + ticon[cid] + " " + COLL_NAME[cid] + " · " + found + " of " + items.length + '</h3><div class="tgrid">' +
      items.map(t => {
        const n = S.caught[t.id] || 0;
        if (n > 0) {
          const shiny = S.shiny && S.shiny[t.id];
          return '<div class="card' + (shiny ? " shiny" : "") + '" data-t="' + t.id + '">' + anyCardSVG(t.id) +
            (t.t === "r" ? '<div class="badge">★ RARE</div>' : shiny ? '<div class="badge">✨ SHINY</div>' : "") +
            '<div class="nm">' + t.name + '</div><div class="ct">found ×' + n + '</div></div>';
        }
        return '<div class="card locked" data-t="' + t.id + '">' + anyCardSVG(t.id, true) +
          '<div class="nm">???</div><div class="ct">' + tHint(t) + '</div></div>';
      }).join("") + '</div>';
  }
  // meadow friends page: independent of the treasure progression, fills via daily quests
  const frs = TREASURES.filter(t => t.coll === "friends");
  const ffound = frs.filter(t => S.caught[t.id] > 0).length;
  th += '<h3 class="sect">🐾 Meadow friends · ' + ffound + " of " + frs.length + '</h3><div class="tgrid">' +
    frs.map(t => {
      const n = S.caught[t.id] || 0;
      if (n > 0) {
        return '<div class="card" data-t="' + t.id + '">' + anyCardSVG(t.id) +
          '<div class="nm">' + t.name + '</div><div class="ct">quest friend</div></div>';
      }
      return '<div class="card locked" data-t="' + t.id + '">' + anyCardSVG(t.id, true) +
        '<div class="nm">???</div><div class="ct">' + tHint(t) + '</div></div>';
    }).join("") + '</div>';
  $("treasureSects").innerHTML = th;
  document.querySelectorAll("#treasureSects .card").forEach(c => {
    c.onclick = () => {
      const t = TR[c.dataset.t];
      const svg = c.querySelector("svg");
      svg.classList.remove("wig");
      void svg.getBoundingClientRect();
      svg.classList.add("wig");
      if (S.caught[t.id] > 0) { sTap(); speak("The " + t.name + ". " + t.fact); }
      else { sTap(); speak("A mystery treasure! " + tHint(t)); }
    };
  });
  $("meters").innerHTML = Object.entries(MODES).filter(([, m]) => !m.quiz).map(([id, m]) => {
    const c = (S.topics[id] || {}).correct || 0;
    return '<div class="meter">' + flowerSVG(Math.min(8, Math.floor(c / 5))) + '<br>' + m.label + '</div>';
  }).join("");
}
function openAlbum() {
  renderAlbum();
  $("albumPage").classList.remove("hidden");
}
$("albumBtn").onclick = () => { sTap(); openAlbum(); };
$("albumClose").onclick = () => { sTap(); $("albumPage").classList.add("hidden"); };

