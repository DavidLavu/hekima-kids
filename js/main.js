"use strict";
/* ---------- toggles & repeat ---------- */
function applySettings() {
  $("soundBtn").textContent = "Sound: " + (S.settings.sound ? "on" : "off");
  $("soundBtn").setAttribute("aria-pressed", String(S.settings.sound));
  $("voiceBtn").textContent = "Voice: " + (S.settings.voice ? "on" : "off");
  $("voiceBtn").setAttribute("aria-pressed", String(S.settings.voice));
}
$("soundBtn").onclick = () => {
  S.settings.sound = !S.settings.sound;
  saveState(); applySettings();
  if (S.settings.sound) sTap();
};
$("voiceBtn").onclick = () => {
  S.settings.voice = !S.settings.voice;
  saveState(); applySettings();
  if (S.settings.voice) speak("Voice on!");
  else { try { speechSynthesis.cancel(); } catch (e) {} }
};
const repeatQ = () => { if (q && !locked) speak(q.say); };
$("question").onclick = repeatQ;
$("picture").onclick = repeatQ;

/* ---------- go ---------- */
ensureQuest();
renderQuest();
dressMeadow();
renderGarden();
buildModes();
setStars();
setFooter();
applySettings();
populateMeadow();
next();
// offline copy for the iPad home-screen app (only on https hosting; harmless elsewhere)
if ("serviceWorker" in navigator && location.protocol === "https:") {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
