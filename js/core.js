"use strict";
/* ---------- tiny helpers ---------- */
const $ = id => document.getElementById(id);
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) { const j = rnd(0, i); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  return arr;
}
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- numbers to spoken words ---------- */
const W1 = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
const W10 = ["","ten","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
function words(n) {
  n = Math.round(n);
  if (n < 0) return "minus " + words(-n);
  if (n < 20) return W1[n];
  if (n < 100) return W10[Math.floor(n / 10)] + (n % 10 ? "-" + W1[n % 10] : "");
  if (n < 1000) { const h = Math.floor(n / 100), r = n % 100; return W1[h] + " hundred" + (r ? " and " + words(r) : ""); }
  return "one thousand";
}
const SAY_MAP = { "½": "one half", "¼": "one quarter", "⅓": "one third", "¾": "three quarters", "<": "less than", ">": "greater than", "=": "equals" };
const sayVal = v => SAY_MAP[v] || (isNaN(+v) ? v : words(+v));

/* ---------- state ---------- */
function defaultState() {
  return { caught: {}, topics: {}, rounds: 0, bestRound: {}, name: "", legacy: 0, shiny: {},
           settings: { sound: true, voice: true, voiceName: "", voiceStyle: "" } };
}
function loadState() {
  let s = defaultState();
  try {
    const raw = localStorage.getItem("hk_state");
    if (raw) {
      const p = JSON.parse(raw);
      s = Object.assign(s, p);
      s.settings = Object.assign({ sound: true, voice: true, voiceName: "", voiceStyle: "" }, p.settings || {});
    }
  } catch (e) {}
  // migrate the old simple counter from the first version
  const old = parseInt(localStorage.getItem("hk_album") || "0");
  if (old > 0) { s.legacy += old; try { localStorage.removeItem("hk_album"); } catch (e) {} }
  return s;
}
let S = loadState();
function saveState() { try { localStorage.setItem("hk_state", JSON.stringify(S)); } catch (e) {} }
function topicStat(m) {
  if (!S.topics[m]) S.topics[m] = { asked: 0, correct: 0, missed: {} };
  if (!S.topics[m].missed) S.topics[m].missed = {};
  return S.topics[m];
}
function totalCaught() {
  return S.legacy + Object.values(S.caught).reduce((a, b) => a + b, 0);
}

