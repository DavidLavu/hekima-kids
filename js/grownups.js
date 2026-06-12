"use strict";
/* ---------- grown-ups ---------- */
// School-report areas: the DfE Year 2 programme of study, each evidenced by the
// app topics that practise it. "can" lines borrow the programme's own wording so
// the report reads like the teacher-assessment framework, not a game score.
const REPORT_AREAS = [
  { name: "Number and place value", ids: ["pv", "nw"],
    can: "read, write and compare numbers to 100 — in numerals and in words — using the <, > and = symbols" },
  { name: "Addition and subtraction", ids: ["add", "sub", "add2", "sub2", "miss"],
    can: "add and subtract numbers mentally and with column working, including two two-digit numbers, and solve missing-number problems" },
  { name: "Multiplication and division", ids: ["x2", "x5", "x10", "div", "oe"],
    can: "recall and use multiplication and division facts for the 2, 5 and 10 multiplication tables, recognise odd and even numbers, and share into equal groups" },
  { name: "Fractions", ids: ["frac"],
    can: "recognise, find, name and write fractions ⅓, ¼, ½ and ¾ of a shape, set of objects or quantity" },
  { name: "Measurement — money", ids: ["money"],
    can: "recognise and use symbols for pounds (£) and pence (p), combine amounts to make a value and work out change" },
  { name: "Measurement — time", ids: ["time"],
    can: "tell the time to o’clock, half past and quarter past/to the hour" },
  { name: "Geometry", ids: ["shp"],
    can: "identify and describe the properties of 2-D shapes, including the number of sides and vertices" },
  { name: "Year 3 head start", ids: ["x3", "x4", "x8"], y3: true,
    can: "recall and use multiplication facts for the 3, 4 and 8 multiplication tables (Year 3 programme)" },
];
const TAF = ["working towards the expected standard", "working at the expected standard", "working at greater depth"];
// teacher-style judgement from evidence: needs at least 6 answers to say anything,
// at least 12 before "greater depth" is credible
function areaJudge(asked, correct) {
  if (asked < 6) return -1;
  const acc = correct / asked;
  return acc >= 0.88 && asked >= 12 ? 2 : acc >= 0.72 ? 1 : 0;
}
function schoolReport() {
  const kid = S.name || "Your child";
  const areas = REPORT_AREAS.map(ar => {
    let a = 0, c = 0;
    for (const id of ar.ids) { const st = S.topics[id]; if (st) { a += st.asked; c += st.correct; } }
    return Object.assign({ a, c, j: areaJudge(a, c) }, ar);
  });
  const judged = areas.filter(x => !x.y3 && x.j >= 0);
  const gd = judged.filter(x => x.j === 2), wt = judged.filter(x => x.j === 0);
  let overall = "Not enough questions answered yet for an overall judgement — a picture forms after a few rounds in each topic.";
  if (judged.length >= 4) {
    if (!wt.length && gd.length >= Math.ceil(judged.length * 0.6))
      overall = kid + " is " + TAF[2] + " within the expected standard for Year 2 mathematics.";
    else if (!wt.length)
      overall = kid + " is " + TAF[1] + " for Year 2 mathematics" +
        (gd.length ? ", with greater depth in " + gd.map(x => x.name.toLowerCase()).join("; ") + "." : ".");
    else
      overall = kid + " is " + TAF[1] + " in most areas, and still " + TAF[0] + " in " +
        wt.map(x => x.name.toLowerCase()).join("; ") + ".";
  }
  const lines = areas.map(x => {
    const ev = Math.round(100 * x.c / Math.max(1, x.a)) + "% of " + x.a + " questions";
    const body = x.j === 2 ? "can " + x.can + " — confidently and accurately (" + ev + ")."
               : x.j === 1 ? "can " + x.can + " securely (" + ev + ")."
               : x.j === 0 ? "is still developing this: " + x.can + " (" + ev + ")."
               : "not enough evidence yet — fewer than 6 questions answered.";
    const chip = x.j >= 0 ? '<span class="tj tj' + x.j + '">' + (x.j === 2 ? "greater depth" : x.j === 1 ? "expected standard" : "working towards") + "</span> " : '<span class="tj tjx">no judgement yet</span> ';
    return "<li><strong>" + x.name + "</strong> " + chip + body + "</li>";
  });
  return '<h3 class="sect">School report — Year 2 mathematics</h3>' +
    '<p>' + overall + '</p><ul class="taf">' + lines.join("") + '</ul>' +
    '<p class="note">Judgements use the wording of the DfE programme of study and teacher assessment framework, from her answers in this app only. A school judgement would also draw on measures (length, mass, capacity, temperature), statistics, 3-D shapes and position &amp; turns — not in the app yet.</p>';
}
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
    const lvl = m.quiz ? "—" : ["", "🌱 budding", "🌼 blooming", "⭐ golden"][topicLvl(id)];
    return "<tr><td>" + m.label + (m.quiz ? " (Y2 quiz)" : " (Y" + m.year + ")") + "</td><td>" + st.asked + "</td><td>" + st.correct + "</td><td>" + pct + "%</td><td>" + wTxt + "</td><td>" + lvl + "</td></tr>";
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
    schoolReport() +
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
    (rows ? '<table class="stats"><tr><th>Topic</th><th>Answered</th><th>Correct</th><th>Accuracy</th><th>This week</th><th>Level</th></tr>' + rows + '</table>' +
            '<p class="note">Level sets how hard her questions are: 🌼 blooming topics start every round mid-stretch, ⭐ golden ones stay near full stretch (times tables add missing-number and division forms). High accuracy moves a topic up quickly — no grinding needed.</p>'
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

