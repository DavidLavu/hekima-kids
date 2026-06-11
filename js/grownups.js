"use strict";
/* ---------- grown-ups ---------- */
function renderGrown() {
  const today = dateStr();
  const week = st => {  // last-7-day tallies from the daily counters
    let a = 0, c = 0;
    for (const [k, v] of Object.entries(st.days || {})) {
      if (Date.now() - new Date(k).getTime() < 7 * 86400000) { a += v.a; c += v.c; }
    }
    return { a, c };
  };
  const rows = Object.entries(MODES).map(([id, m]) => {
    const st = S.topics[id];
    if (!st || !st.asked) return "";
    const pct = Math.round(100 * st.correct / st.asked);
    const w = week(st);
    const wTxt = w.a ? Math.round(100 * w.c / w.a) + "% (" + w.a + ")" : "—";
    return "<tr><td>" + m.label + (m.quiz ? " (Y2 quiz)" : " (Y" + m.year + ")") + "</td><td>" + st.asked + "</td><td>" + st.correct + "</td><td>" + pct + "%</td><td>" + wTxt + "</td></tr>";
  }).join("");
  // needs-practice radar: weak accuracy, gone stale, or never tried
  const radar = Object.entries(MODES).filter(([, m]) => !m.quiz).map(([id, m]) => {
    const st = S.topics[id];
    if (!st || st.asked < 6) return { label: m.label, why: "barely tried yet", pri: 0 };
    const pct = Math.round(100 * st.correct / st.asked);
    if (pct < 70) return { label: m.label, why: pct + "% accuracy", pri: 1 };
    const ago = st.last ? Math.floor((Date.now() - new Date(st.last).getTime()) / 86400000) : 99;
    if (ago >= 7) return { label: m.label, why: "not played for " + ago + " days", pri: 2 };
    return null;
  }).filter(Boolean).sort((a, b) => a.pri - b.pri).slice(0, 5);
  // tomorrow's quest, computed the same way the morning will
  const tom = new Date(Date.now() + 86400000);
  const tomSeed = dateSeed(dateStr(tom));
  const allF = TREASURES.filter(t => t.coll === "friends");
  const unF = allF.filter(t => !(S.caught[t.id] > 0));
  const tomFriend = unF.length ? unF[tomSeed % unF.length] : allF[tomSeed % allF.length];
  const ranked = Object.keys(MODES).filter(m => !MODES[m].quiz).map(m => {
    const st = topicStat(m);
    const acc = st.asked >= 5 ? st.correct / st.asked : -1;
    return { m, score: acc };
  }).sort((a, b) => a.score - b.score);
  const tomTopic = MODES[ranked[tomSeed % 3].m].label;
  const missed = [];
  for (const [id, st] of Object.entries(S.topics)) {
    for (const k of Object.keys(st.missed || {})) {
      missed.push({ t: st.missed[k].t, n: st.missed[k].n, m: MODES[id] ? MODES[id].label : id });
    }
  }
  missed.sort((a, b) => b.n - a.n);
  $("grownContent").innerHTML =
    '<p>Rounds played: <strong>' + S.rounds + '</strong> · Butterflies caught: <strong>' + totalCaught() + '</strong></p>' +
    '<h3 class="sect">Needs practice</h3>' +
    (radar.length ? '<ul>' + radar.map(r => "<li><strong>" + r.label + "</strong> — " + r.why + "</li>").join("") + '</ul>'
                  : '<p class="note">Nothing flagged — lovely balanced practice!</p>') +
    '<p class="note">🐾 Tomorrow the <strong>' + tomFriend.name + '</strong> will visit and ask for <strong>' + tomTopic +
    '</strong> — the daily quest always aims at the topics that need love.</p>' +
    '<h3 class="sect">Y2 Quiz check-up</h3>' +
    '<ul>' + ["quiz1", "quiz2", "quiz3"].map(id => {
      const best = S.bestRound[id] || 0;
      const status = quizLocked(id) ? "🔒 locked — clear the one before to open it"
                   : quizCleared(id) ? "✓ cleared (best " + best + "/10)"
                   : best ? "best so far " + best + "/10 — 8 needed to clear"
                   : "open, not tried yet";
      return "<li><strong>" + MODES[id].label + "</strong> — " + status + "</li>";
    }).join("") + '</ul>' +
    '<p class="note">The quizzes sample every topic in the app — the DfE Year 2 work: 2/5/10 (and 3/4/8) times tables, adding &amp; taking away including two-digit column sums, missing numbers, tens &amp; ones with &lt; &gt; =, numbers in words, odd &amp; even, fractions, sharing, money, time and 2-D shapes. Questions missed in a quiz are re-asked in that topic’s own practice. Not in the app yet (so not tested): 3-D solids, measuring, statistics and turns.</p>' +
    '<h3 class="sect">Accuracy by topic</h3>' +
    (rows ? '<table class="stats"><tr><th>Topic</th><th>Answered</th><th>Correct</th><th>Accuracy</th><th>This week</th></tr>' + rows + '</table>'
          : '<p class="note">No questions answered yet.</p>') +
    '<h3 class="sect">Tricky questions (asked again until she gets them right)</h3>' +
    (missed.length ? '<ul>' + missed.slice(0, 8).map(x => "<li><strong>" + x.t + "</strong> (" + x.m + ") — missed " + x.n + "×</li>").join("") + '</ul>'
                   : '<p class="note">Nothing outstanding — all caught up!</p>') +
    '<h3 class="sect">Child’s name (used in spoken praise)</h3>' +
    '<input id="grownName" maxlength="20" placeholder="e.g. Amara"> <button class="gbtn" id="nameSave">Save</button>' +
    '<h3 class="sect">Voice</h3>' +
    '<div id="voiceQuick"></div>' +
    '<select id="voiceSel"></select> <button class="gbtn" id="voiceTest">Hear it</button>' +
    '<p class="note">Voices come from the device itself. On an iPad you can install much nicer ones first: Settings → Accessibility → Spoken Content → Voices → English (UK) — “Kate”, “Serena” or “Martha” are lovely. They appear in this list once downloaded.</p>' +
    '<h3 class="sect">Data</h3>' +
    '<p class="note">Everything is stored only on this device (localStorage). No accounts, no internet, nothing leaves the tablet.</p>' +
    '<button class="gbtn danger" id="resetBtn">Start completely fresh…</button>';
  $("grownName").value = S.name || "";
  $("nameSave").onclick = () => {
    S.name = $("grownName").value.trim();
    saveState();
    speak(S.name ? "Hello, " + S.name + "!" : "Name cleared.");
  };
  const voices = ("speechSynthesis" in window)
    ? speechSynthesis.getVoices().filter(v => /en[-_](GB|US)/i.test(v.lang)).sort((a, b) => scoreVoice(b) - scoreVoice(a))
    : [];
  const markQuick = () => document.querySelectorAll(".vq").forEach(x => {
    const on = S.settings.voiceName
      ? x.dataset.v === S.settings.voiceName && x.dataset.s === (S.settings.voiceStyle || "")
      : !!voiceObj && x.dataset.v === voiceObj.name && !x.dataset.s;
    x.classList.toggle("on", on);
  });
  const fem = bestFemaleVoice();
  const pills = (fem ? PERSONAS.map(p => ({ v: fem.name, s: p.id, label: p.label })) : [])
    .concat(voices.filter(v => !NOVELTY.test(v.name)).slice(0, 4)
      .map(v => ({ v: v.name, s: "", label: v.name + " · " + v.lang })));
  $("voiceQuick").innerHTML = pills.map(pl =>
    '<button class="vq" data-v="' + pl.v.replace(/"/g, "&quot;") + '" data-s="' + pl.s + '">' + pl.label + "</button>").join("");
  document.querySelectorAll(".vq").forEach(b => b.onclick = () => {
    S.settings.voiceName = b.dataset.v;
    S.settings.voiceStyle = b.dataset.s;
    saveState();
    pickVoice();
    markQuick();
    $("voiceSel").value = b.dataset.v;
    speak(vary("vqSample", ["Hello{n}! What is two add three?", "Hello{n}! Brilliant! You caught a Peacock.", "Well done{n}! Shall we catch some butterflies?"]).replace("{n}", nameBit()));
  });
  markQuick();
  $("voiceSel").innerHTML =
    '<option value="">Automatic (best available)</option>' +
    voices.map(v => '<option value="' + v.name.replace(/"/g, "&quot;") + '"' +
      (S.settings.voiceName === v.name ? " selected" : "") + '>' +
      v.name + " — " + v.lang + (NOVELTY.test(v.name) ? " (robot!)" : "") + '</option>').join("");
  $("voiceSel").onchange = () => {
    S.settings.voiceName = $("voiceSel").value;
    S.settings.voiceStyle = "";
    saveState();
    pickVoice();
    markQuick();
    speak("Hello" + nameBit() + "! What is two add three?");
  };
  $("voiceTest").onclick = () => speak("Hello" + nameBit() + "! Brilliant! You caught a Red Admiral.");
  $("resetBtn").onclick = () => {
    if (confirm("Erase the whole album, all progress and the name? This cannot be undone.")) {
      try { localStorage.removeItem("hk_state"); } catch (e) {}
      location.reload();
    }
  };
}
$("grownLink").onclick = () => {
  $("gateIn").value = "";
  $("gateMsg").textContent = "";
  $("gate").style.display = "";
  $("grownContent").style.display = "none";
  $("grownPage").classList.remove("hidden");
};
$("gateBtn").onclick = () => {
  if (+$("gateIn").value === 56) {
    $("gate").style.display = "none";
    renderGrown();
    $("grownContent").style.display = "";
  } else {
    $("gateMsg").textContent = "Not quite — try again.";
  }
};
$("grownClose").onclick = () => $("grownPage").classList.add("hidden");

