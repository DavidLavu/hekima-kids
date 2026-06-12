"use strict";
/* ---------- question flow ---------- */
let roundSeen = new Set(); // question signatures already asked this round — no repeats inside a round
function drawQuestion() {
  const st = topicStat(mode);
  const keys = Object.keys(st.missed).filter(k => !roundSeen.has("k:" + k));
  if (keys.length && Math.random() < 0.34) {
    const k = keys[rnd(0, keys.length - 1)];
    const qq = MODES[mode].gen(st.missed[k].p);
    qq.key = k;
    roundSeen.add("k:" + k);
    return qq;
  }
  let qq;
  for (let i = 0; i < 14; i++) {
    qq = MODES[mode].gen();
    if (!roundSeen.has(qq.text + "|" + qq.correct)) break;
  }
  roundSeen.add(qq.text + "|" + qq.correct);
  qq.key = mode + "|" + JSON.stringify(qq.p);
  return qq;
}
function next() {
  if (qnum >= TOTAL) return end();
  locked = false;
  q = drawQuestion();
  $("qcount").textContent = "Question " + (qnum + 1) + " of " + TOTAL;
  $("msg").textContent = "";
  // golden topics: about half the questions ask her to TYPE the answer on the
  // number pad (recall, like the Y4 tables check) instead of choosing from three.
  // Only after the in-between stages are passed — never in quizzes or column work.
  if (!q.col && !MODES[mode].quiz && topicLvl(mode) >= 3 && /^£?\d+p?$/.test(q.correct) && Math.random() < 0.5)
    q.typed = { v: "", wrongs: 0 };
  $("answers").classList.toggle("pad", !!q.col || !!q.typed);
  if (q.col) {
    $("question").textContent = "";
    renderColumn();
    $("answers").innerHTML = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(d =>
      '<button class="ans-btn" data-v="' + d + '">' + d + "</button>").join("");
    document.querySelectorAll(".ans-btn").forEach(btn => { btn.onclick = () => colTap(btn); });
  } else if (q.typed) {
    $("question").textContent = q.text;
    $("question").classList.toggle("long", q.text.length > 12);
    $("picture").innerHTML = q.picture || "";
    renderTyped();
    q.say = vary("typedLead", [
      "You are so good at this, you can type the answer yourself! ",
      "Star question — tap the answer on the number pad! ",
      "This one you type, like a big mathematician! "
    ]) + q.say;
  } else {
    $("question").textContent = q.text;
    $("question").classList.toggle("long", q.text.length > 12);
    $("picture").innerHTML = q.picture || "";
    $("answers").innerHTML = q.options.map(v =>
      '<button class="ans-btn' + (String(v).length > 6 ? " txt" : "") + '" data-v="' + v + '">' + v + "</button>").join("");
    document.querySelectorAll(".ans-btn").forEach(btn => { btn.onclick = () => pick(btn); });
  }
  speak(questionLead() + q.say, { queue: qnum > 0 });
  armNudge();
}
// a short encouraging bridge before each question is read out
function questionLead() {
  if (qnum === 0) return vary("lead0", ["Here we go! ", "Off we go — butterfly time! ", "Let's catch some butterflies! "]);
  if (qnum === TOTAL - 1) return vary("leadLast", ["The very last one — make it shine! ", "One more for a full meadow! ", "Last question — you can do it! "]);
  if (qnum === TOTAL / 2) return "Halfway there already" + nameBit() + " — wonderful flying! ";
  if (lastGood) return vary("leadGood", [
    "You're on a roll! ", "Let's catch another one! ", "Ready for the next one? ",
    "Another butterfly is waiting! ", "You're doing so well — next one! ", "Keep it up! "
  ]);
  return vary("leadBad", [
    "You've got this one! ", "Here's a fresh one for you! ",
    "A new one — you can do it! ", "Take a deep breath — here we go! "
  ]);
}
function armNudge() {
  clearTimeout(promptT);
  promptT = setTimeout(() => {
    if (!locked) speak(vary("nudge", ["Take your time. ", "No hurry. ", "Have a little think. "]) + q.say, { rate: 0.98 });
  }, 25000);
}

/* ---------- school-style column working ---------- */
function colSay(i) {
  const { a, b, op } = q.col;
  const oa = a % 10, ob = b % 10, ta = Math.floor(a / 10), tb = Math.floor(b / 10);
  if (op === "+") {
    if (i === 0) return "Ones first! What is " + words(oa) + " add " + words(ob) + "?";
    return "Now the tens! What is " + words(ta) + " add " + words(tb) +
           (oa + ob >= 10 ? ", add the little one we carried?" : "?");
  }
  if (i === 0) {
    if (oa < ob) return cap(words(oa)) + " is smaller than " + words(ob) +
      ", so we exchange a ten. Now: what is " + words(oa + 10) + " take away " + words(ob) + "?";
    return "Ones first! What is " + words(oa) + " take away " + words(ob) + "?";
  }
  return "Now the tens! What is " + words(ta - (oa < ob ? 1 : 0)) + " take away " + words(tb) + "?";
}
function renderColumn() {
  const { a, b, op } = q.col;
  const cs = q.correct, n = 2;
  const da = String(a).split(""), db = String(b).split("");
  const exch = op === "−" && (a % 10) < (b % 10);
  let g = '<div class="colgrid" style="grid-template-columns: repeat(' + (n + 1) + ', auto)">';
  g += '<div class="ccell"></div>';
  da.forEach((d, i) => {
    if (exch && i === 0) g += '<div class="ccell"><span class="xed">' + d + '</span><span class="newdig">' + (parseInt(d) - 1) + '</span></div>';
    else if (exch && i === 1) g += '<div class="ccell"><span class="borrow">1</span>' + d + '</div>';
    else g += '<div class="ccell">' + d + '</div>';
  });
  g += '<div class="ccell op">' + op + '</div>';
  db.forEach(d => { g += '<div class="ccell">' + d + '</div>'; });
  g += '<div class="cline"></div>';
  g += '<div class="ccell"></div>';
  for (let i = 0; i < n; i++) g += '<div class="ccell slot' + (n - 1 - i === 0 ? " active" : "") + '" id="slot-' + (n - 1 - i) + '"></div>';
  g += '<div class="cline2"></div></div>';
  $("picture").innerHTML = '<div id="colwork">' + g + '</div>';
  q.w = { i: 0, colWrongs: 0, any: false, cs };
  q.say = vary("colIntro", ["Let us write it in columns, like at school! ", "Column time — just like in your book! ", "Let us do the working out! "]) + colSay(0);
}
function colAdvance(given) {
  const w = q.w, exp = w.cs[w.cs.length - 1 - w.i];
  const slot = $("slot-" + w.i);
  slot.classList.remove("active");
  slot.classList.add(given ? "given" : "done");
  slot.insertAdjacentHTML("beforeend", "<span>" + exp + "</span>");
  if (q.col.op === "+" && w.i === 0 && (q.col.a % 10 + q.col.b % 10) >= 10)
    $("slot-1").insertAdjacentHTML("beforeend", '<span class="carry">1</span>');
  w.i++;
  w.colWrongs = 0;
  if (w.i >= w.cs.length) {
    locked = true;
    clearTimeout(promptT);
    topicStat(mode).asked++;
    if (w.any) {
      resolveBad({
        text: "You worked it out — " + q.col.a + " " + q.col.op + " " + q.col.b + " = " + q.correct + "! We’ll practise that one again.",
        say: "You worked it out" + nameBit() + "! The answer is " + sayVal(q.correct) + ". We will practise that one again soon."
      });
    } else resolveGood();
    return;
  }
  $("slot-" + w.i).classList.add("active");
  q.say = colSay(w.i);
  const carryBit = q.col.op === "+" && (q.col.a % 10 + q.col.b % 10) >= 10 && !given ? "Carry the one! " : "";
  speak((given ? "" : vary("colStep", ["Yes! ", "Lovely! ", "That's it! "]) + carryBit) + q.say);
  armNudge();
}
function colTap(btn) {
  if (locked || !q.col || !q.w) return;
  const w = q.w, exp = w.cs[w.cs.length - 1 - w.i];
  if (btn.dataset.v === exp) {
    play([[700, 0.09], [880, 0.12]]);
    colAdvance(false);
  } else {
    w.colWrongs++;
    w.any = true;
    btn.classList.add("bad");
    setTimeout(() => btn.classList.remove("bad"), 600);
    sWrong();
    if (w.colWrongs >= 2) {
      speak("It is " + words(parseInt(exp)) + ". ");
      setTimeout(() => colAdvance(true), 900);
    } else {
      speak(vary("tryAgain", ["Not quite — try again!", "Almost! Have another go.", "Hmm — try once more!"]));
    }
  }
}

/* ---------- typed answers (golden topics): recall it, don't recognise it ---------- */
function renderTyped() {
  const m = /^(£?)(\d+)(p?)$/.exec(q.correct);
  q.typed.pre = m[1];
  q.typed.suf = m[3];
  $("answers").innerHTML =
    '<div class="tline">' + q.typed.pre + '<span class="tbox" id="tbox">&nbsp;</span>' + q.typed.suf + '</div>' +
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(d =>
      '<button class="ans-btn" data-v="' + d + '">' + d + "</button>").join("") +
    '<button class="ans-btn tback" id="tback">⌫</button><button class="ans-btn tok" id="tok">✓</button>';
  document.querySelectorAll("#answers .ans-btn[data-v]").forEach(b => { b.onclick = () => typedTap(b.dataset.v); });
  $("tback").onclick = () => {
    if (locked || !q.typed.v) return;
    sTap();
    q.typed.v = q.typed.v.slice(0, -1);
    $("tbox").textContent = q.typed.v || " ";
  };
  $("tok").onclick = typedSubmit;
}
function typedTap(d) {
  if (locked || q.typed.v.length >= 3) return;
  sTap();
  q.typed.v += d;
  $("tbox").textContent = q.typed.v;
}
function typedSubmit() {
  if (locked) return;
  if (!q.typed.v) { speak("Tap the numbers to type your answer first!"); return; }
  const given = q.typed.pre + parseInt(q.typed.v, 10) + q.typed.suf;
  if (given === q.correct) {
    locked = true;
    clearTimeout(promptT);
    topicStat(mode).asked++;
    resolveGood();
    return;
  }
  // two tries, like column working; then the familiar three choices appear —
  // help means a kind word and spaced repetition, but no butterfly
  sWrong();
  q.typed.wrongs++;
  const tb = $("tbox");
  tb.classList.add("bad");
  setTimeout(() => tb.classList.remove("bad"), 600);
  if (q.typed.wrongs >= 2) {
    q.helped = true;
    $("msg").textContent = "Tricky one — here are some ideas!";
    $("msg").style.color = "#5a4a2f";
    $("answers").classList.remove("pad");
    $("answers").innerHTML = q.options.map(v =>
      '<button class="ans-btn' + (String(v).length > 6 ? " txt" : "") + '" data-v="' + v + '">' + v + "</button>").join("");
    document.querySelectorAll(".ans-btn").forEach(btn => { btn.onclick = () => pick(btn); });
    speak(vary("typedHelp", [
      "Tricky one! Here are some ideas — pick the right answer.",
      "Let me help. One of these is the answer!",
      "Have a look at these three — which one is it?"
    ]));
    armNudge();
  } else {
    q.typed.v = "";
    tb.innerHTML = "&nbsp;";
    speak(vary("tryAgain", ["Not quite — try again!", "Almost! Have another go.", "Hmm — try once more!"]));
  }
}

function pick(btn) {
  if (locked) return;
  locked = true;
  clearTimeout(promptT);
  const v = btn.dataset.v;
  const st = topicStat(mode);
  st.asked++;
  if (v === q.correct) {
    btn.classList.add("good");
    if (q.helped) {
      resolveBad({
        text: "You found it — the answer is " + q.correct + "! We’ll practise that one again.",
        say: "You found it" + nameBit() + "! " + cap(q.sayExplain || ("The answer is " + sayVal(q.correct))) + ". We will practise that one again soon."
      });
    } else resolveGood();
  } else {
    btn.classList.add("bad");
    document.querySelectorAll(".ans-btn").forEach(b => { if (b.dataset.v === q.correct) b.classList.add("good"); });
    resolveBad();
  }
}
function resolveGood() {
  const st = topicStat(mode);
  lastGood = true;
  {
    score++;
    st.correct++;
    delete topicStat((q && q.topic) || mode).missed[missKey()];
    const news = awardCatch();
    const lastId = roundIds[roundIds.length - 1];
    const caughtItem = ITEM(lastId);
    const isTreasure = !!TR[lastId];
    const spName = caughtItem.name;
    if (news.length) {
      const nsp = ITEM(news[news.length - 1]);
      celebrate(nsp);
      $("msg").textContent = (TR[nsp.id]
        ? vary("newTMsg", ["✨ NEW treasure! You found the {s}!", "✨ A sparkling discovery — the {s}!", "✨ Your very own {s}!"])
        : vary("newMsg", ["✨ NEW butterfly! You caught a {s}!", "✨ A brand new species — the {s}!", "✨ Your first ever {s}!"])
      ).replace("{s}", nsp.name);
      speak((TR[nsp.id]
        ? vary("newTSay", [
            "A new treasure for your album{n}! The {s}!",
            "Ooh, how magical{n}! You found the {s}!",
            "Look{n}! The {s} — a brand new treasure!"
          ])
        : vary("newSay", [
            "A new butterfly for your album{n}! The {s}!",
            "Ooh, a brand new visitor{n}! It is the {s}!",
            "Look{n}! A {s} — the very first one for your album!"
          ])
      ).replace("{n}", nameBit()).replace("{s}", nsp.name));
    } else if (isTreasure) {
      const pr = vary("praise", PRAISE);
      $("msg").textContent = pr + " " + vary("tLanded", [
        "Another {s} sparkles!", "A {s} appears!", "The {s} shines for you!"
      ]).replace("{s}", spName);
      speak(vary("tPraiseSay", [
        "{p}{n}! A {s} appears!",
        "{p}{n}! More sparkle for your meadow.",
        "{p}{n}!"
      ]).replace("{p}", pr.replace("!", "")).replace("{n}", nameBit()).replace("{s}", spName));
    } else {
      const pr = vary("praise", PRAISE);
      $("msg").textContent = pr + " " + vary("landed", [
        "A {s} landed!", "Here comes a {s}!", "A {s} fluttered down!",
        "You caught a {s}!", "A {s} joins your meadow!"
      ]).replace("{s}", spName);
      speak(vary("praiseSay", [
        "{p}{n}! You caught a {s}.",
        "{p}{n}! Here comes a {s}.",
        "{p} A {s} has fluttered down.",
        "{p}{n}!",
        "{p} Another {s} for your meadow."
      ]).replace("{p}", pr.replace("!", "")).replace("{n}", nameBit()).replace("{s}", spName));
    }
    $("msg").style.color = "#2c6b44";
    sCorrect();
    questProgress();
    maybeEgg();
  }
  finishQ();
}
// a quiz miss is filed under its real topic, so practising Money re-asks that exact question
function missKey() { return q.topic ? q.topic + "|" + JSON.stringify(q.p.p) : q.key; }
function resolveBad(custom) {
  const st = topicStat((q && q.topic) || mode);
  lastGood = false;
  const k = missKey();
  st.missed[k] = { p: q.topic ? q.p.p : q.p, t: q.text, n: ((st.missed[k] || {}).n || 0) + 1 };
  if (custom) {
    $("msg").textContent = custom.text;
    $("msg").style.color = "#5a4a2f";
    speak(custom.say);
  } else {
    const ex = q.explain || ("the answer is " + q.correct);
    $("msg").textContent = vary("wrongLead", ["Not quite — ", "Good try — ", "Almost — ", "Nearly — "]) + ex + ". " +
      vary("wrongTail", ["Next one!", "On we go!", "Let's try another!"]);
    $("msg").style.color = "#5a4a2f";
    speak(vary("wrongSayLead", ["Not quite. ", "Good try. ", "Almost. ", "Never mind. "]) +
      cap(q.sayExplain || ("The answer is " + sayVal(q.correct))) + ". " +
      vary("wrongSayTail", ["On to the next one!", "Here comes another one!", "You'll get the next one!", "Let's try another."]));
    sWrong();
  }
  finishQ();
}
function finishQ() {
  const st = topicStat(mode);
  st.last = dateStr();
  // per-day counters (kept 14 days) so the grown-ups page can show trends
  st.days = st.days || {};
  const d = st.days[st.last] || { a: 0, c: 0 };
  d.a++;
  if (lastGood) d.c++;
  st.days[st.last] = d;
  const cutoff = Date.now() - 14 * 86400000;
  for (const k of Object.keys(st.days)) if (new Date(k).getTime() < cutoff) delete st.days[k];
  renderGarden();
  saveState();
  setStars();
  setFooter();
  qnum++;
  advPending = true;
  advT = setTimeout(() => { advPending = false; next(); }, q.col ? 2600 : 2000);
}
/* ---------- pausing: the Album and Grown-ups pages stop the round politely ---------- */
function pauseRound() {
  clearTimeout(promptT);          // no 25-second re-read while she browses
  if (advPending) clearTimeout(advT); // hold the next question until the page closes
  try { if ("speechSynthesis" in window) speechSynthesis.cancel(); } catch (e) {}
}
function resumeRound() {
  try { if ("speechSynthesis" in window) speechSynthesis.cancel(); } catch (e) {}
  if (advPending) {
    advT = setTimeout(() => { advPending = false; next(); }, 700);
  } else if (q && !locked && qnum < TOTAL) {
    armNudge();
  }
}
function end() {
  clearTimeout(promptT);
  S.rounds++;
  const firstClear = !!MODES[mode].quiz && score >= 8 && !quizCleared(mode);
  if (score > (S.bestRound[mode] || 0)) S.bestRound[mode] = score;
  let rare = null;
  if (score >= 9) rare = unlockRare();
  saveState();
  updateDots();
  $("qcount").textContent = "";
  $("picture").innerHTML = "";
  const head = score >= 8 ? vary("head8", ["Wonderful!", "Magnificent!", "Splendid!", "Marvellous!"])
             : score >= 5 ? vary("head5", ["Great trying!", "Well flown!", "Lovely effort!"])
             : vary("head0", ["Good practice!", "Keep going!", "Every try helps!"]);
  $("question").textContent = head;
  $("question").classList.remove("long");
  $("msg").textContent = "";
  const coll = activeColl();
  let catchLine = coll === "bfly"
    ? "You caught " + score + (score === 1 ? " butterfly" : " butterflies") + " out of " + TOTAL + "!"
    : "You caught " + score + (score === 1 ? " star" : " stars") + " out of " + TOTAL + " — treasure hunting!";
  if (rare) catchLine += " ✨ A rare " + rare.name + " has appeared!";
  const uniq = [...new Set(roundIds)];
  let say = coll === "bfly"
    ? "You caught " + words(score) + (score === 1 ? " butterfly" : " butterflies") + nameBit() + "!"
    : "You caught " + words(score) + (score === 1 ? " star" : " stars") + nameBit() + "!";
  const newNames = roundNew.map(id => ITEM(id).name);
  if (rare) say += " And something very rare has appeared: the " + rare.name + "!";
  else if (newNames.length) say += " You discovered the " + newNames.join(" and the ") + "!";
  const hatch = hatchEgg();
  if (hatch) { catchLine += hatch.text; say += hatch.say; }
  // first time a collection page opens: make it a moment
  S.collSeen = S.collSeen || {};
  const newPage = coll !== "bfly" && !S.collSeen[coll];
  if (newPage) {
    S.collSeen[coll] = true;
    saveState();
    catchLine += " 🌟 You have found EVERY butterfly — a secret new page has appeared in your album: " + COLL_NAME[coll] + "!";
    say += " And something AMAZING has happened" + nameBit() + ". You have found every single butterfly! So a secret new page has appeared in your album: " + COLL_NAME[coll] + "! Keep answering questions to fill it with wonders.";
  }
  if (!MODES[mode].quiz && topicLvl(mode) > roundStartLvl) {
    catchLine += " 🌸 Your “" + MODES[mode].label + "” flower has grown!";
    say += " And listen to this: your " + MODES[mode].label + " flower has grown a whole new ring of petals" + nameBit() + " — you are getting stronger and stronger!";
  }
  if (firstClear) {
    const nxt = mode === "quiz1" ? "quiz2" : mode === "quiz2" ? "quiz3" : null;
    catchLine += " 🏅 You cleared " + MODES[mode].label + "!" + (nxt ? " " + MODES[nxt].label + " is now open!" : " You are a Year 2 champion!");
    say += " And the most wonderful news" + nameBit() + ": you cleared " + MODES[mode].label + "!" +
      (nxt ? " " + MODES[nxt].label + " is now open for you!" : " You have finished every quiz — you are a true Year 2 champion!");
    buildModes();
  }
  // the crowning moment: every butterfly and every treasure has been found
  let legend = false;
  if (!(S.caught.t_legend > 0) && ["bfly", "sky", "magic", "sea", "wood", "dino", "friends"].every(collComplete)) {
    legend = true;
    S.caught.t_legend = 1;
    roundNew.push("t_legend");
    roundIds.push("t_legend");
    addCaughtToScene("t_legend");
    saveState();
    catchLine += " 🏆 The GOLDEN BUTTERFLY has appeared — you have found absolutely everything!";
    say += " And now, the most magical thing of all" + nameBit() + ". You have found every butterfly and every treasure in the whole meadow. So the legendary Golden Butterfly has flown down, just for you. You are a true meadow legend!";
  }
  speak(say);
  if (score >= 5) sFanfare();
  if (score >= 8 || legend) flypast();
  if (firstClear || newPage || rare || legend) sparkleBursts(firstClear || newPage || legend);
  $("answers").innerHTML =
    '<div class="endmsg">' + catchLine + '</div>' +
    (uniq.length ? '<div class="endsummary">' + uniq.map(id => {
      const isNew = roundNew.includes(id);
      return '<div class="mini">' + anyCardSVG(id) + '<br>' + (isNew ? "✨ NEW!<br>" : "") + ITEM(id).name + '</div>';
    }).join("") + '</div>' : '') +
    '<button class="ans-btn wide" id="again">Play again</button>' +
    '<button class="ans-btn wide" id="toAlbum">🦋 Open your album</button>';
  $("again").onclick = () => { sTap(); restart(); };
  $("toAlbum").onclick = () => { sTap(); openAlbum(); };
}
let roundStartLvl = 1;
function restart() {
  qnum = 0; score = 0; roundNew = []; roundIds = [];
  roundSeen = new Set();
  quizBag = []; // each quiz round samples a fresh spread of topics
  roundStartLvl = topicLvl(mode);
  ensureQuest();
  renderQuest();
  $("bfield").innerHTML = "";
  populateMeadow();
  setStars();
  next();
}

