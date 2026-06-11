"use strict";
/* ---------- question generators ---------- */
// invisible difficulty 0 (gentle) → 1 (full stretch): grows with topic mastery,
// ramps up through the round, and quietly eases after a miss. Never shown to the child.
let quizH = null; // during a quiz question, difficulty is pinned by the quiz level
function hardness() {
  if (quizH != null) return quizH;
  const st = topicStat(mode);
  let mastery = Math.min(1, st.correct / 40);
  // a sharp child shouldn't grind 40 answers before a stretch:
  // near-perfect accuracy fast-tracks her up the difficulty curve
  if (st.asked >= 8) {
    const acc = st.correct / st.asked;
    if (acc >= 0.9) mastery = Math.max(mastery, Math.min(1, st.correct / 15));
    else if (acc >= 0.75) mastery = Math.max(mastery, Math.min(1, st.correct / 25));
  }
  const ramp = Math.min(1, qnum / (TOTAL - 1));
  let h = mastery * 0.65 + ramp * 0.35;
  if (lastGood === false) h *= 0.6;
  return Math.max(0, Math.min(1, h));
}
// random integer in a range that slides from [lo0,hi0] (easy) to [lo1,hi1] (hard)
function hrnd(h, lo0, hi0, lo1, hi1) {
  return rnd(Math.round(lo0 + (lo1 - lo0) * h), Math.round(hi0 + (hi1 - hi0) * h));
}
// mastery level per topic: 1 budding, 2 blooming (15+ correct), 3 golden (40+)
function topicLvl(m) {
  const c = topicStat(m).correct;
  return c >= 40 ? 3 : c >= 15 ? 2 : 1;
}
function numOptions(correct, pool) {
  const opts = [String(correct)];
  const cand = shuffle(pool.filter(v => v > 0 && v !== correct));
  for (const v of cand) { const s = String(v); if (opts.length < 3 && !opts.includes(s)) opts.push(s); }
  let k = 2;
  while (opts.length < 3) { const v = correct + k; if (v > 0 && !opts.includes(String(v))) opts.push(String(v)); k++; }
  return shuffle(opts);
}
function tableMode(n, year, sp, label) {
  return { label, year, sp, gen(p) {
    // easy facts (×1–9) first; the tricky ×10–12 arrive as she grows.
    // the band stays ≥10 wide so a full round never has to repeat a fact
    const a = p ? p.a : hrnd(hardness(), 1, 9, 3, 12);
    const c = a * n;
    return { p: { a }, text: a + " × " + n + " = ?", say: "What is " + words(a) + " times " + words(n) + "?",
             correct: String(c), options: numOptions(c, [c - n, c + n, c - 1, c + 1, c + 10]) };
  } };
}
// end-of-Year-2 quizzes: every question is borrowed from a Year 2 topic at a fixed
// difficulty, so a round works like a friendly end-of-year check-up. A round visits
// ten different topics (shuffled bag); 8+ stars clears the quiz and opens the next.
const QUIZ_POOL = ["x2", "x5", "x10", "add", "sub", "div", "miss", "pv", "frac", "money", "time", "nw", "oe", "shp", "add2", "sub2"];
let quizBag = [];
function quizMode(n, h) {
  return { label: "Quiz " + n, year: "q", quiz: true, gen(p) {
    if (!p && !quizBag.length) quizBag = shuffle(QUIZ_POOL.slice());
    const sub = p ? p.m : quizBag.pop();
    quizH = h;
    let qq;
    try { qq = MODES[sub].gen(p ? p.p : undefined); } finally { quizH = null; }
    qq.p = { m: sub, p: qq.p };
    qq.topic = sub; // the butterfly, quest credit and shiny check follow the real topic
    return qq;
  } };
}
const MODES = {
  x2: tableMode(2, 2, "large_white", "2 times"),
  x5: tableMode(5, 2, "common_blue", "5 times"),
  x10: tableMode(10, 2, "brimstone", "10 times"),
  x3: tableMode(3, 2, "painted_lady", "3 times"),
  x4: tableMode(4, 2, "speckled_wood", "4 times"),
  x8: tableMode(8, 2, "gatekeeper", "8 times"),
  add: { label: "Adding", year: 2, sp: "red_admiral", gen(p) {
    const kind = p ? p.kind : (r => r < 0.35 ? "pic" : r < 0.55 ? "tens" : "ones")(Math.random());
    const h = hardness();
    if (kind === "pic") {
      const a = p ? p.a : hrnd(h, 2, 6, 4, 10), b = p ? p.b : hrnd(h, 2, 4, 3, 10);
      const c = a + b;
      return { p: { kind, a, b }, text: a + " + " + b + " = ?",
               say: "Count the apples! " + cap(words(a)) + " red apples add " + words(b) + " green apples. How many apples altogether?",
               correct: String(c), options: numOptions(c, [c - 1, c + 1, c + 2, c - 2, a, b]),
               picture: addPicSVG(a, b) };
    }
    let a = p ? p.a : (kind === "tens" ? hrnd(h, 11, 39, 21, 69) : hrnd(h, 11, 49, 21, 89));
    let b = p ? p.b : 0;
    if (!p) {
      if (kind === "tens") b = rnd(1, Math.floor((99 - a) / 10)) * 10;
      else if (h < 0.4) {
        // gentle: stay inside the ten (nudge the ones digit so there is room)
        if (a % 10 > 7) a = a - a % 10 + rnd(1, 7);
        b = rnd(2, 9 - a % 10);
      } else if (h >= 0.7) {
        // stretch: always cross the ten (47 + 8 style, never 43 + 4)
        if (a % 10 < 2) a = a - a % 10 + rnd(2, 8);
        b = rnd(11 - a % 10, 9);
      } else b = rnd(2, 9);
    }
    const c = a + b;
    return { p: { kind, a, b }, text: a + " + " + b + " = ?", say: "What is " + words(a) + " add " + words(b) + "?",
             correct: String(c), options: numOptions(c, [c - 1, c + 1, c + 10, c - 10, c + 2]) };
  } },
  sub: { label: "Taking away", year: 2, sp: "tortoiseshell", gen(p) {
    const kind = p ? p.kind : (r => r < 0.35 ? "pic" : r < 0.55 ? "tens" : "ones")(Math.random());
    const h = hardness();
    if (kind === "pic") {
      const a = p ? p.a : hrnd(h, 4, 8, 7, 12);
      const b = p ? p.b : rnd(2, Math.max(2, h < 0.4 ? Math.min(4, a - 2) : a - 2));
      const c = a - b;
      return { p: { kind, a, b }, text: a + " − " + b + " = ?",
               say: "There were " + words(a) + " biscuits, and " + words(b) + " got nibbled! How many biscuits are left?",
               correct: String(c), options: numOptions(c, [c - 1, c + 1, c + 2, b, a]),
               picture: subPicSVG(a, b) };
    }
    let a = p ? p.a : (kind === "tens" ? hrnd(h, 31, 69, 41, 99) : hrnd(h, 11, 49, 21, 99));
    let b = p ? p.b : 0;
    if (!p) {
      if (kind === "tens") b = rnd(1, Math.min(3, Math.floor((a - 1) / 10))) * 10;
      else {
        let o = a % 10;
        // gentle: no borrowing needed; stretch: always cross under the ten (52 − 7 style)
        if (h >= 0.7 && o > 6) { a = a - o + rnd(0, 6); o = a % 10; }
        b = (h < 0.4 && o >= 2) ? rnd(2, o) : h >= 0.7 ? rnd(Math.max(2, o + 1), 9) : rnd(2, 9);
      }
    }
    const c = a - b;
    return { p: { kind, a, b }, text: a + " − " + b + " = ?", say: "What is " + words(a) + " take away " + words(b) + "?",
             correct: String(c), options: numOptions(c, [c - 1, c + 1, c + 10, c - 10, c - 2]) };
  } },
  div: { label: "Sharing", year: 2, sp: "orange_tip", gen(p) {
    const h = hardness();
    const n = p ? p.n : (h < 0.35 ? [2, 5][rnd(0, 1)] : [2, 5, 10][rnd(0, 2)]);
    const q = p ? p.q : hrnd(h, 1, 5, 2, 10);
    const a = n * q;
    return { p: { n, q }, text: a + " ÷ " + n + " = ?",
             say: "Share " + words(a) + " berries between " + words(n) + " flowers. How many berries does each flower get?",
             correct: String(q), options: numOptions(q, [q - 1, q + 1, q + 2, n, q + 10]),
             picture: shareSVG(a, n) };
  } },
  miss: { label: "Mystery number", year: 2, sp: "peacock", gen(p) {
    const h = hardness();
    // friendly "something more" puzzles first; take-away and times mysteries later
    const forms = h < 0.35 ? ["a+?", "?+b"] : ["a+?", "?+b", "a-?", "?-b", "n×?"];
    const f = p ? p.f : forms[rnd(0, forms.length - 1)];
    let text, say, x, pp;
    if (f === "a+?") {
      const a = p ? p.a : hrnd(h, 3, 9, 5, 15); x = p ? p.x : hrnd(h, 2, 5, 3, 9);
      text = a + " + ? = " + (a + x);
      say = cap(words(a)) + " add the mystery number makes " + words(a + x) + ". What is the mystery number?";
      pp = { f, a, x };
    } else if (f === "?+b") {
      const b = p ? p.b : hrnd(h, 2, 5, 3, 9); x = p ? p.x : hrnd(h, 3, 9, 5, 15);
      text = "? + " + b + " = " + (x + b);
      say = "The mystery number add " + words(b) + " makes " + words(x + b) + ". What is the mystery number?";
      pp = { f, b, x };
    } else if (f === "a-?") {
      const a = p ? p.a : rnd(8, 20); x = p ? p.x : rnd(2, a - 2);
      text = a + " − ? = " + (a - x);
      say = cap(words(a)) + " take away the mystery number leaves " + words(a - x) + ". What is the mystery number?";
      pp = { f, a, x };
    } else if (f === "?-b") {
      const b = p ? p.b : rnd(2, 9); x = p ? p.x : rnd(b + 2, 20);
      text = "? − " + b + " = " + (x - b);
      say = "The mystery number take away " + words(b) + " leaves " + words(x - b) + ". What is the mystery number?";
      pp = { f, b, x };
    } else {
      const n = p ? p.n : [2, 5, 10][rnd(0, 2)]; x = p ? p.x : rnd(2, 10);
      text = n + " × ? = " + (n * x);
      say = cap(words(n)) + " times the mystery number makes " + words(n * x) + ". What is the mystery number?";
      pp = { f, n, x };
    }
    return { p: pp, text, say, correct: String(x), options: numOptions(x, [x - 1, x + 1, x + 2, x - 2, x + 10]) };
  } },
  pv: { label: "Tens & ones", year: 2, sp: "holly_blue", gen(p) {
    const h = hardness();
    const kind = p ? p.kind : (Math.random() < 0.5 ? "make" : "compare");
    if (kind === "make") {
      const t = p ? p.t : hrnd(h, 2, 5, 3, 9), o = p ? p.o : rnd(1, 9);
      const c = t * 10 + o;
      return { p: { kind, t, o }, text: t + " tens and " + o + " ones = ?",
               say: "What number is " + words(t) + " tens and " + words(o) + " ones?",
               correct: String(c), options: numOptions(c, [t + o, o * 10 + t, c + 10, c - 10, c + 1]) };
    }
    let a = p ? p.a : rnd(10, 99), b;
    if (p) { b = p.b; }
    else if (Math.random() < 0.18) { b = a; }
    else if (h >= 0.6) {
      // sneaky comparisons: same tens digit, only the ones differ (47 ▢ 43)
      do { b = Math.floor(a / 10) * 10 + rnd(0, 9); } while (b === a);
    }
    else { do { b = rnd(10, 99); } while (b === a || Math.abs(a - b) < (h < 0.3 ? 20 : 1)); }
    const correct = a < b ? "<" : a > b ? ">" : "=";
    return { p: { kind, a, b }, text: a + " ▢ " + b,
             say: "Which sign goes in the middle? Is " + words(a) + " less than, greater than, or equal to " + words(b) + "?",
             correct, options: shuffle(["<", ">", "="]),
             explain: a + " " + correct + " " + b + " — the crocodile mouth always eats the bigger number",
             sayExplain: words(a) + " is " + sayVal(correct) + " " + words(b) + ". The crocodile mouth always eats the bigger number" };
  } },
  frac: { label: "Fractions", year: 2, sp: "comma", gen(p) {
    const h = hardness();
    const kind = p ? p.kind : (Math.random() < 0.5 ? "pie" : "of");
    if (kind === "pie") {
      const PIES = [{ parts: 2, shaded: 1, f: "½" }, { parts: 3, shaded: 1, f: "⅓" }, { parts: 4, shaded: 1, f: "¼" }, { parts: 4, shaded: 3, f: "¾" }];
      // halves and quarters first; thirds and three-quarters as she grows
      const i = p ? p.i : (h < 0.35 ? [0, 2][rnd(0, 1)] : rnd(0, 3));
      const v = PIES[i];
      const others = shuffle(PIES.map(x => x.f).filter(f => f !== v.f)).slice(0, 2);
      return { p: { kind, i }, text: "What fraction is coloured in?",
               say: "Look at the circle. What fraction is coloured in?",
               correct: v.f, options: shuffle([v.f, ...others]),
               explain: "it is " + v.f + ", " + sayVal(v.f),
               sayExplain: "it is " + sayVal(v.f),
               picture: pieSVG(v.parts, v.shaded) };
    }
    const FRACS = [{ d: 2, w: "one half", sym: "½" }, { d: 4, w: "one quarter", sym: "¼" }, { d: 3, w: "one third", sym: "⅓" }];
    const fi = p ? p.fi : (h < 0.35 ? 0 : rnd(0, 2));
    const fr = FRACS[fi];
    const m = p ? p.m : hrnd(h, 1, 3, 2, 6);
    const n = fr.d * m;
    return { p: { kind, fi, m }, text: fr.sym + " of " + n + " = ?",
             say: "What is " + fr.w + " of " + words(n) + "?",
             correct: String(m), options: numOptions(m, [m + 1, m - 1, n - m, 2 * m, m + 2]),
             picture: berriesSVG(n) };
  } },
  money: { label: "Money", year: 2, sp: "green_veined", gen(p) {
    const h = hardness();
    const fmt = v => v >= 100 ? "£" + v / 100 : v + "p";
    const sayAmt = v => v >= 100 ? words(v / 100) + " pounds" : words(v) + " pence";
    const mop = (c, pool) => {
      const o = [fmt(c)];
      for (const v of shuffle(pool)) if (o.length < 3 && v > 0 && v !== c && !o.includes(fmt(v))) o.push(fmt(v));
      return shuffle(o);
    };
    const kinds = h < 0.4 ? ["coinvalue", "count"] : h < 0.6 ? ["coinvalue", "count", "change"] : ["count", "change", "pounds", "enough"];
    const kind = p ? p.kind : kinds[rnd(0, kinds.length - 1)];
    if (kind === "coinvalue") {
      // recognise the coin by its look — no numbers printed on it
      const denoms = [1, 2, 5, 10, 20, 50, 100, 200];
      const v = p ? p.v : denoms[rnd(0, h < 0.5 ? 5 : 7)];
      const wrong = shuffle(denoms.filter(d => d !== v)).slice(0, 2);
      return { p: { kind, v }, text: "How much is this coin worth?",
               say: "Look at this coin very carefully — its shape, its colour, its size. How much is it worth?",
               correct: fmt(v), options: shuffle([fmt(v), ...wrong.map(fmt)]),
               explain: "that is the " + COIN_DESC[v],
               sayExplain: "that one is the " + COIN_DESC[v],
               picture: moneySVG([v]) };
    }
    if (kind === "pounds") {
      // count £ coins and notes, whole pounds only (Y2 keeps £ and p separate)
      const pool = [100, 200, 500, 500, 1000, 2000];
      const items = p ? p.items : Array.from({ length: rnd(2, 3) }, () => pool[rnd(0, pool.length - 1)]).sort((a, b) => b - a);
      const c = items.reduce((a, b) => a + b, 0);
      return { p: { kind, items }, text: "How much money?",
               say: "Count the pounds! How much money is this altogether?",
               correct: fmt(c), options: mop(c, [c - 100, c + 100, c + 200, c - 200, c + 500]),
               explain: "it makes " + fmt(c) + " altogether", sayExplain: "it makes " + sayAmt(c) + " altogether",
               picture: moneySVG(items) };
    }
    if (kind === "enough") {
      // do you have enough money? (purchases up to £1)
      const coins = p ? p.coins : [[10, 20, 20, 50][rnd(0, 3)], [1, 2, 5, 10][rnd(0, 3)]].sort((a, b) => b - a);
      const have = coins.reduce((a, b) => a + b, 0);
      const price = p ? p.price : (Math.random() < 0.5 ? have - rnd(1, Math.min(9, have - 1)) : have + rnd(1, 9));
      const c = have >= price;
      return { p: { kind, coins, price }, text: "A toy costs " + fmt(price) + ". Enough?",
               say: "A little toy costs " + sayAmt(price) + ". Here is your money — have you got enough to buy it?",
               correct: c ? "Yes" : "No", options: shuffle(["Yes", "No"]),
               explain: "you have " + fmt(have) + ", so the answer is " + (c ? "yes" : "no"),
               sayExplain: "you have " + sayAmt(have) + ", so " + (c ? "yes — you have enough!" : "no — not quite enough this time"),
               picture: moneySVG(coins) };
    }
    if (kind === "count") {
      const pool = h < 0.4 ? [1, 2, 5, 10] : h < 0.75 ? [1, 2, 5, 10, 20] : [2, 5, 10, 20, 50];
      const n = h < 0.4 ? 2 : h < 0.75 ? 3 : rnd(3, 4);
      const coins = p ? p.coins : Array.from({ length: n }, () => pool[rnd(0, pool.length - 1)]).sort((a, b) => b - a);
      const c = coins.reduce((a, b) => a + b, 0);
      return { p: { kind, coins }, text: "How much money?",
               say: "Count the coins! How much money is this altogether?",
               correct: fmt(c), options: mop(c, [c - 1, c + 1, c - 5, c + 5, c + 10]),
               explain: "it makes " + fmt(c) + " altogether", sayExplain: "it makes " + words(c) + " pence altogether",
               picture: moneySVG(coins) };
    }
    const a = p ? p.a : [10, 20, 20, 50][rnd(0, h < 0.7 ? 2 : 3)];
    const b = p ? p.b : rnd(2, Math.min(9, a - 2));
    const c = a - b;
    return { p: { kind, a, b }, text: a + "p − " + b + "p = ?",
             say: "You have " + words(a) + " pence and you spend " + words(b) + " pence on a sweetie. How much is left?",
             correct: c + "p", options: mop(c, [c - 1, c + 1, c + 2, c - 2, c + 10]),
             explain: "you would have " + c + "p left", sayExplain: "you would have " + words(c) + " pence left",
             picture: moneySVG([a]) };
  } },
  time: { label: "Time", year: 2, sp: "ringlet", gen(p) {
    const h = hardness();
    const forms = h < 0.35 ? ["o"] : h < 0.7 ? ["o", "half"] : ["o", "half", "qpast", "qto"];
    const f = p ? p.f : forms[rnd(0, forms.length - 1)];
    const hr = p ? p.hr : rnd(1, 12);
    const mm = f === "o" ? 0 : f === "half" ? 30 : f === "qpast" ? 15 : 45;
    const nm = t => f === "o" ? t + " o’clock" : f === "half" ? "half past " + t
              : f === "qpast" ? "quarter past " + t : "quarter to " + (t % 12 + 1);
    const correct = nm(hr);
    const w1 = nm(hr % 12 + 1);
    const w2 = f === "o" ? "half past " + hr : hr + " o’clock";
    return { p: { f, hr }, text: "What time is it?",
             say: "Look at the clock! What time does it say?",
             correct, options: shuffle([correct, w1, w2]),
             explain: "the clock says " + correct, sayExplain: "the clock says " + correct,
             picture: clockSVG(hr, mm) };
  } },
  nw: { label: "Number words", year: 2, sp: "chalkhill_blue", gen(p) {
    const h = hardness();
    const v = p ? p.v : hrnd(h, 3, 20, 21, 99);
    const dir = p ? p.dir : (Math.random() < 0.5 ? "w2n" : "n2w");
    // the classic traps: digit swap (47/74) and teen/ty mix-ups (14/40)
    const rev = v > 12 && v < 100 && v % 11 !== 0 ? parseInt(String(v).split("").reverse().join("")) : v + 2;
    const pool = [rev, v + 1, v - 1, v + 10, v - 10].filter(x => x > 0 && x < 100 && x !== v);
    if (dir === "w2n") {
      return { p: { v, dir }, text: "“" + words(v) + "”", say: "Which number says " + words(v) + "?",
               correct: String(v), options: numOptions(v, pool),
               explain: "“" + words(v) + "” is written " + v, sayExplain: words(v) + " is written with a " +
                 (v >= 10 ? words(Math.floor(v / 10)) + " and a " + words(v % 10 || 0) : words(v)) };
    }
    const opts = shuffle([v, ...shuffle(pool).slice(0, 2)]).map(x => words(x));
    return { p: { v, dir }, text: "Which says " + v + "?", say: "Find the words that say " + words(v) + ".",
             correct: words(v), options: opts,
             explain: v + " says “" + words(v) + "”", sayExplain: v + " says " + words(v) };
  } },
  oe: { label: "Odd & even", year: 2, sp: "small_heath", gen(p) {
    const h = hardness();
    const f = p ? p.f : (Math.random() < 0.55 ? "is" : "find");
    if (f === "is") {
      const v = p ? p.v : hrnd(h, 1, 10, 11, 99);
      const odd = v % 2 === 1;
      return { p: { f, v }, text: "Is " + v + " odd or even?",
               say: "Is " + words(v) + " an odd number, or an even number?" + (v <= 20 ? " Try putting the counters into pairs!" : " Look at the last digit!"),
               correct: odd ? "odd" : "even", options: ["odd", "even"],
               explain: v + " is " + (odd ? "odd — one counter is left without a pair" : "even — every counter has a pair"),
               sayExplain: words(v) + " is " + (odd ? "an odd number — when you make pairs, one is always left over" : "an even number — everything pairs up perfectly"),
               picture: h < 0.6 && v <= 20 ? pairsSVG(v) : "" };
    }
    const wantOdd = p ? p.w : Math.random() < 0.5;
    let a = p ? p.a : null;
    if (!a) {
      const base = hrnd(h, 2, 12, 10, 90);
      const match = Math.max(1, base - (base % 2) + (wantOdd ? 1 : 0));
      const others = [];
      while (others.length < 2) {
        const c = match + [1, 3, -1, -3, 5][rnd(0, 4)];
        if (c > 0 && !others.includes(c)) others.push(c);
      }
      a = shuffle([match, ...others]);
    }
    const correct = a.find(x => (x % 2 === 1) === wantOdd);
    return { p: { f, w: wantOdd, a }, text: "Which is " + (wantOdd ? "odd" : "even") + "?",
             say: "Which of these numbers is " + (wantOdd ? "odd" : "even") + "? " + a.map(words).join(", "),
             correct: String(correct), options: a.map(String),
             explain: correct + " is the " + (wantOdd ? "odd" : "even") + " one",
             sayExplain: words(correct) + " is the " + (wantOdd ? "odd" : "even") + " one" };
  } },
  shp: { label: "Shapes", year: 2, sp: "wall_brown", gen(p) {
    const h = hardness();
    const avail = SHAPES.filter(s => s.lvl <= (h < 0.35 ? 0 : h < 0.7 ? 1 : 2));
    const s = p ? SHAPES.find(x => x.id === p.s) : avail[rnd(0, avail.length - 1)];
    const f = p ? p.f : (s.id === "circle" ? "name" : ["name", "sides", "corners"][rnd(0, 2)]);
    if (f === "name") {
      const others = shuffle(SHAPES.filter(x => x.id !== s.id)).slice(0, 2).map(x => x.name);
      return { p: { f, s: s.id }, text: "What shape is this?", say: "What is this shape called?",
               correct: s.name, options: shuffle([s.name, ...others]),
               explain: "it is a " + s.name,
               sayExplain: "it is a " + s.name + (s.sides ? " — it has " + words(s.sides) + " sides" : " — perfectly round, with no corners at all"),
               picture: shapePic(s.id) };
    }
    const n = f === "sides" ? s.sides : s.corners;
    const what = f === "sides" ? "sides" : "corners";
    return { p: { f, s: s.id }, text: "How many " + what + "?",
             say: "Look at the " + s.name + ". How many " + (f === "sides" ? "sides" : "corners — teachers call them vertices —") + " does it have?",
             correct: String(n), options: numOptions(n, [n - 1, n + 1, n + 2, n - 2]),
             explain: "a " + s.name + " has " + words(n) + " " + what,
             sayExplain: "a " + s.name + " has " + words(n) + " " + what,
             picture: shapePic(s.id) };
  } },
  add2: { label: "Big adding", year: 2, sp: "swallowtail", gen(p) {
    const h = hardness();
    let a = p ? p.a : rnd(12, 79), b = p ? p.b : rnd(11, 99 - a);
    // gentle: no carrying; from mid-level up: always a carry to practise
    for (let i = 0; !p && i < 25; i++) {
      const carry = (a % 10) + (b % 10) >= 10;
      if (h < 0.3 ? !carry : (h >= 0.55 ? carry : true)) break;
      a = rnd(12, 79); b = rnd(11, 99 - a);
    }
    const c = a + b;
    return { p: { a, b }, col: { a, b, op: "+" }, text: a + " + " + b + " = ?",
             say: "What is " + words(a) + " add " + words(b) + "?",
             correct: String(c), options: numOptions(c, [c - 1, c + 1, c + 10, c - 10, c + 2]) };
  } },
  sub2: { label: "Big taking away", year: 2, sp: "fritillary", gen(p) {
    const h = hardness();
    let a = p ? p.a : rnd(25, 99), b = p ? p.b : rnd(11, a - 12);
    // gentle: no exchanging; from mid-level up: always an exchange to practise
    for (let i = 0; !p && i < 25; i++) {
      const exch = (a % 10) < (b % 10);
      if (h < 0.3 ? !exch : (h >= 0.55 ? exch : true)) break;
      a = rnd(25, 99); b = rnd(11, a - 12);
    }
    const c = a - b;
    return { p: { a, b }, col: { a, b, op: "−" }, text: a + " − " + b + " = ?",
             say: "What is " + words(a) + " take away " + words(b) + "?",
             correct: String(c), options: numOptions(c, [c - 1, c + 1, c + 10, c - 10, c - 2]) };
  } },
  quiz1: quizMode(1, 0.12),
  quiz2: quizMode(2, 0.5),
  quiz3: quizMode(3, 0.85)
};

