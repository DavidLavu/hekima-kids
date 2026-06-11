"use strict";
/* ---------- sounds (Web Audio, synthesized) ---------- */
let actx = null;
function play(notes) {
  if (!S.settings.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === "suspended") actx.resume();
    let t = actx.currentTime;
    for (const [freq, dur] of notes) {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.2, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(actx.destination);
      o.start(t);
      o.stop(t + dur + 0.05);
      t += dur * 0.85;
    }
  } catch (e) {}
}
const sCorrect = () => play([[660, 0.13], [880, 0.22]]);
const sWrong = () => play([[200, 0.25]]);
const sTap = () => play([[440, 0.06]]);
const sFanfare = () => play([[523, 0.14], [659, 0.14], [784, 0.14], [1047, 0.4]]);
const sUnlock = () => play([[523, 0.12], [659, 0.12], [784, 0.12], [988, 0.12], [1319, 0.5]]);

/* ---------- voice (Web Speech API, British English) ---------- */
let voiceObj = null;
// Apple's "novelty" voices sound robotic — never auto-pick them
const NOVELTY = /eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley|albert|bad news|bahh|bells|boing|bubbles|cellos|fred|good news|jester|junior|kathy|organ|ralph|superstar|trinoids|whisper|wobble|zarvox/i;
function scoreVoice(v) {
  const n = v.name.toLowerCase(), gb = /en[-_]gb/i.test(v.lang);
  if (gb && /serena|kate|martha|stephanie/.test(n)) return 100; // natural female GB (iPad)
  if (/google uk english female/.test(n)) return 95;            // Chrome
  if (/sonia|libby|maisie/.test(n)) return 90;                  // Edge natural GB female
  if (/moira/.test(n)) return 80;                               // natural female en-IE
  if (/karen/.test(n)) return 75;                               // natural female en-AU
  if (/tessa/.test(n)) return 70;                               // natural female en-ZA
  if (gb && /daniel/.test(n)) return 65;                        // natural GB male beats robots
  if (/google uk english male/.test(n)) return 60;
  if (gb && !NOVELTY.test(n)) return 50;
  if (/samantha/.test(n)) return 45;                            // natural female en-US
  if (!NOVELTY.test(n)) return 20;
  return gb ? 10 : 0;
}
// "characters" — tuned pitch/rate presets applied to the best lady voice on the device
const PERSONAS = [
  { id: "sunny",  label: "🌼 Sunny",  pitch: 1.18, rate: 1.08 },
  { id: "fairy",  label: "🧚 Fairy",  pitch: 1.32, rate: 1.1 },
  { id: "gentle", label: "🌙 Gentle", pitch: 1.05, rate: 0.98 }
];
const FEMALE = /kate|serena|martha|stephanie|samantha|allison|ava|susan|zoe|nicky|joelle|sonia|libby|maisie|aria|jenny|michelle|female/i;
function bestFemaleVoice() {
  try {
    return speechSynthesis.getVoices()
      .filter(v => /en[-_](GB|US)/i.test(v.lang) && !NOVELTY.test(v.name) && FEMALE.test(v.name))
      .sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] || null;
  } catch (e) { return null; }
}
function pickVoice() {
  try {
    const vs = speechSynthesis.getVoices().filter(v => /en[-_](GB|US)/i.test(v.lang));
    if (S.settings.voiceName) {
      const v = vs.find(x => x.name === S.settings.voiceName);
      if (v) { voiceObj = v; return; }
    }
    voiceObj = vs.sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] || null;
  } catch (e) {}
}
if ("speechSynthesis" in window) {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
  // iPadOS only reveals newly-downloaded voices after the app returns to the
  // foreground (or relaunches) — re-scan whenever that happens
  document.addEventListener("visibilitychange", () => { if (!document.hidden) pickVoice(); });
  window.addEventListener("pageshow", pickVoice);
}
function speak(text, opts = {}) {
  if (!S.settings.voice || !("speechSynthesis" in window) || !text) return;
  try {
    if (!opts.queue) speechSynthesis.cancel(); // queued utterances wait politely for the current one
    const u = new SpeechSynthesisUtterance(text);
    if (voiceObj) { u.voice = voiceObj; u.lang = voiceObj.lang; }
    else u.lang = "en-GB";
    const per = PERSONAS.find(p => p.id === S.settings.voiceStyle);
    u.rate = opts.rate || (per ? per.rate : 1.06);
    u.pitch = opts.pitch || (per ? per.pitch : 1.1);
    // small delay: Safari can swallow an utterance queued right after cancel()
    setTimeout(() => { try { speechSynthesis.speak(u); } catch (e) {} }, 40);
  } catch (e) {}
}
const nameBit = () => (S.name ? ", " + S.name : "");

