"use strict";
/* ---------- the daily friend & quest ---------- */
function dateStr(d = new Date()) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function dateSeed(s) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}
// each morning a friend visits with a quest aimed at her neediest topic
function ensureQuest() {
  const today = dateStr();
  if (S.quest && S.quest.date === today) return;
  const seed = dateSeed(today);
  const all = TREASURES.filter(t => t.coll === "friends");
  const un = all.filter(t => !(S.caught[t.id] > 0));
  const friend = un.length ? un[seed % un.length] : all[seed % all.length];
  const ranked = Object.keys(MODES).filter(m => !MODES[m].quiz).map(m => {
    const st = topicStat(m);
    const acc = st.asked >= 5 ? st.correct / st.asked : -1; // barely-tried topics are neediest
    const fresh = st.last === today ? 0.15 : 0;             // played today already? less needy
    return { m, score: acc + fresh };
  }).sort((a, b) => a.score - b.score);
  S.quest = { date: today, friend: friend.id, topic: ranked[seed % 3].m, need: 6, got: 0, done: false };
  saveState();
}
function renderQuest() {
  const qd = S.quest;
  if (!qd) { $("quest").classList.add("hidden"); return; }
  $("quest").classList.remove("hidden");
  const f = TR[qd.friend];
  const mini = '<svg viewBox="-24 -24 48 48">' + treasureSVG(f) + '</svg>';
  $("quest").classList.toggle("done", qd.done);
  $("quest").innerHTML = mini + "<span>" + (qd.done
    ? "The " + f.name + " is staying! ✓"
    : "The " + f.name + "’s quest: " + (qd.need - qd.got) + " more “" + MODES[qd.topic].label + "”!") + "</span>";
  $("quest").onclick = () => speak(qd.done
    ? "The " + f.name + " finished the quest with you and is staying in your meadow! " + f.fact
    : "Good morning" + nameBit() + "! The " + f.name + " has a quest for you: get " + words(qd.need - qd.got) +
      " more “" + MODES[qd.topic].label + "” questions right, and the " + f.name + " will stay in your meadow!");
}
function questProgress() {
  const qd = S.quest;
  const topic = (q && q.topic) || mode; // quiz questions count for their real topic
  if (!qd || qd.done || qd.date !== dateStr() || topic !== qd.topic) return;
  qd.got++;
  if (qd.got >= qd.need) {
    qd.done = true;
    const f = TR[qd.friend];
    const isNew = !(S.caught[f.id] > 0);
    S.caught[f.id] = (S.caught[f.id] || 0) + 1;
    if (isNew) roundNew.push(f.id);
    addTreasureToScene(f.id);
    celebrate(f);
    setTimeout(() => speak("Quest complete" + nameBit() + "! The " + f.name + " is staying in your meadow! " + f.fact, { queue: true }), 600);
  }
  renderQuest();
}
// once a day a mystery egg appears mid-round and hatches at the end
function maybeEgg() {
  const today = dateStr();
  if (!S.egg || S.egg.date !== today) S.egg = { date: today, state: "none" };
  if (S.egg.state !== "none" || score !== 5) return;
  S.egg.state = "dropped";
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.id = "eggItem";
  g.innerHTML = '<g class="tbob"><path d="M0 -13 C 7 -9 9 -2 9 3 C 9 9 5 13 0 13 C -5 13 -9 9 -9 3 C -9 -2 -7 -9 0 -13 Z" fill="#f7ecd0" stroke="#d9a93a" stroke-width="1.5"/><circle cx="-3" cy="-3" r="1.3" fill="#e8c84f"/><circle cx="3" cy="2" r="1.6" fill="#e8c84f"/><circle cx="-2" cy="6" r="1.1" fill="#e8c84f"/></g>';
  const vt = meadowTop();
  g.style.transform = "translate(" + rnd(150, 530) + "px, " + rnd(Math.max(100, vt + 14), 144) + "px) scale(0.9)";
  $("sfield").appendChild(g);
  speak("Ooh — a mystery egg has appeared in the meadow! Finish the round to see it hatch!", { queue: true });
}
function hatchEgg() {
  if (!S.egg || S.egg.state !== "dropped") return null;
  S.egg.state = "hatched";
  const egg = $("eggItem");
  if (egg) egg.remove();
  S.shiny = S.shiny || {};
  const owned = TREASURES.filter(t => t.coll !== "friends" && S.caught[t.id] > 0 && !S.shiny[t.id]);
  if (owned.length) {
    const t = owned[rnd(0, owned.length - 1)];
    S.shiny[t.id] = true;
    return { text: " 🥚 The mystery egg hatched — your " + t.name + " turned SHINY!",
             say: " And listen — the mystery egg hatched, and your " + t.name + " turned shiny!" };
  }
  const sp = SPECIES[rnd(0, SPECIES.length - 1)];
  S.caught[sp.id] = (S.caught[sp.id] || 0) + 1;
  addToMeadow(sp.id);
  return { text: " 🥚 The mystery egg hatched — a " + sp.name + " flew out!",
           say: " And the mystery egg hatched — a " + sp.name + " flew out! " + sp.fact };
}

