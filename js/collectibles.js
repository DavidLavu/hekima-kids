"use strict";
/* ---------- butterfly species ---------- */
const FW = "M1 -5 C 6 -19 23 -28 30 -24 C 34 -20 29 -9 19 -3 C 12 0 5 1 2 -2 Z";
const HW = "M2 0 C 9 1 18 6 20 12 C 20 18 14 21 8 19 C 4 17 1 10 1 4 Z";
const SPECIES = [
  { id: "large_white", name: "Large White", topic: "x2", t: "c", fw: "#f7f3e8", hw: "#efe9d6",
    deco: [{ t: "tip", f: "#4a473f" }, { t: "dot", x: 13, y: -12, r: 2.4, f: "#4a473f" }],
    fact: "Its caterpillars simply love munching cabbages!" },
  { id: "common_blue", name: "Common Blue", topic: "x5", t: "c", fw: "#6b7fdd", hw: "#8b9ae8",
    deco: [{ t: "dot", x: 8, y: 13, r: 1.4, f: "#fff" }, { t: "dot", x: 13, y: 10, r: 1.4, f: "#fff" }, { t: "dot", x: 17, y: -15, r: 1.5, f: "#fff" }],
    fact: "On sunny days the males sparkle like little pieces of sky." },
  { id: "brimstone", name: "Brimstone", topic: "x10", t: "c", fw: "#e9e163", hw: "#dde07c",
    deco: [{ t: "dot", x: 15, y: -13, r: 1.8, f: "#d98a2b" }, { t: "dot", x: 10, y: 11, r: 1.8, f: "#d98a2b" }],
    fact: "Some say the word butterfly comes from its butter-yellow wings!" },
  { id: "red_admiral", name: "Red Admiral", topic: "add", t: "c", fw: "#2f2a26", hw: "#3a332b",
    deco: [{ t: "band", f: "#d8402c" }, { t: "hband", f: "#d8402c" }, { t: "dot", x: 23, y: -21, r: 1.6, f: "#fff" }, { t: "dot", x: 26, y: -17, r: 1.3, f: "#fff" }],
    fact: "A bold flyer that travels here all the way from Africa!" },
  { id: "tortoiseshell", name: "Small Tortoiseshell", topic: "sub", t: "c", fw: "#e07b2a", hw: "#d96f28",
    deco: [{ t: "tip", f: "#3a3026" }, { t: "dot", x: 9, y: -9, r: 2.2, f: "#33291f" }, { t: "dot", x: 16, y: -15, r: 2, f: "#33291f" }, { t: "dot", x: 6, y: 15, r: 1.3, f: "#4f74d8" }, { t: "dot", x: 11, y: 16, r: 1.3, f: "#4f74d8" }, { t: "dot", x: 15, y: 13, r: 1.3, f: "#4f74d8" }],
    fact: "It loves sunbathing on warm garden walls." },
  { id: "orange_tip", name: "Orange-tip", topic: "div", t: "c", fw: "#f5f1e4", hw: "#edefdc",
    deco: [{ t: "tip", f: "#e8852b" }, { t: "dot", x: 12, y: -11, r: 1.8, f: "#3a3026" }],
    fact: "Only the boys wear the bright orange wing tips!" },
  { id: "peacock", name: "Peacock", topic: "miss", t: "c", fw: "#b03a2e", hw: "#a33529",
    deco: [{ t: "eye", x: 20, y: -18, r: 4.5, c1: "#e8c84f", c2: "#4f74d8" }, { t: "eye", x: 10, y: 11, r: 3.5, c1: "#e8c84f", c2: "#4f74d8" }],
    fact: "Its eyespots trick birds into thinking it is much bigger!" },
  { id: "holly_blue", name: "Holly Blue", topic: "pv", t: "c", fw: "#a6bfec", hw: "#b9cdf2",
    deco: [{ t: "dot", x: 11, y: -11, r: 1.1, f: "#4a4a55" }, { t: "dot", x: 16, y: -15, r: 1.1, f: "#4a4a55" }, { t: "dot", x: 9, y: 12, r: 1.1, f: "#4a4a55" }],
    fact: "Look up! It flutters high around holly and ivy." },
  { id: "comma", name: "Comma", topic: "frac", t: "c", fw: "#d8842f", hw: "#cc7a2a",
    deco: [{ t: "dot", x: 9, y: -9, r: 1.8, f: "#5a3a1a" }, { t: "dot", x: 16, y: -15, r: 1.6, f: "#5a3a1a" }, { t: "dot", x: 21, y: -19, r: 1.4, f: "#5a3a1a" }, { t: "dot", x: 9, y: 12, r: 1.6, f: "#fff" }],
    fact: "It carries a tiny white comma written on its wing!" },
  { id: "painted_lady", name: "Painted Lady", topic: "x3", t: "c", fw: "#e0945a", hw: "#daa05e",
    deco: [{ t: "tip", f: "#3a3026" }, { t: "dot", x: 23, y: -21, r: 1.5, f: "#fff" }, { t: "dot", x: 10, y: -9, r: 1.8, f: "#6b4a2a" }, { t: "dot", x: 10, y: 13, r: 1.5, f: "#6b4a2a" }],
    fact: "One of the greatest travellers in the whole butterfly world." },
  { id: "speckled_wood", name: "Speckled Wood", topic: "x4", t: "c", fw: "#6b5535", hw: "#74603c",
    deco: [{ t: "dot", x: 11, y: -11, r: 2, f: "#e8dca8" }, { t: "dot", x: 18, y: -17, r: 1.8, f: "#e8dca8" }, { t: "dot", x: 24, y: -21, r: 1.5, f: "#e8dca8" }, { t: "eye", x: 11, y: 12, r: 2.6, c1: "#e8dca8", c2: "#3a2f1f", c3: "#fff" }],
    fact: "It dances in the sunny spots between the trees." },
  { id: "gatekeeper", name: "Gatekeeper", topic: "x8", t: "c", fw: "#e0913a", hw: "#d4863a",
    deco: [{ t: "tip", f: "#6b4f2a" }, { t: "eye", x: 20, y: -18, r: 3.5, c1: "#33291f", c2: "#fff", c3: "#33291f" }, { t: "hband", f: "#6b4f2a" }],
    fact: "It guards the hedgerows and country gates in high summer." },
  { id: "swallowtail", name: "Swallowtail", topic: "add2", t: "c", fw: "#efe18a", hw: "#e8da7e",
    deco: [{ t: "tip", f: "#2c2a20" }, { t: "band", f: "#2c2a20" }, { t: "dot", x: 12, y: 14, r: 1.8, f: "#4f74d8" }, { t: "dot", x: 7, y: 16, r: 1.5, f: "#d8402c" }],
    fact: "Britain's biggest butterfly — it lives in the Norfolk Broads!" },
  { id: "fritillary", name: "Silver-washed Fritillary", topic: "sub2", t: "c", fw: "#de8c33", hw: "#d28430",
    deco: [{ t: "dot", x: 9, y: -8, r: 1.6, f: "#4a3a20" }, { t: "dot", x: 14, y: -12, r: 1.6, f: "#4a3a20" }, { t: "dot", x: 19, y: -16, r: 1.6, f: "#4a3a20" }, { t: "dot", x: 24, y: -20, r: 1.4, f: "#4a3a20" }, { t: "dot", x: 10, y: 12, r: 1.5, f: "#4a3a20" }],
    fact: "Streaks of silver shimmer underneath its wings." },
  { id: "green_veined", name: "Green-veined White", topic: "money", t: "c", fw: "#f2efe2", hw: "#e8ead8",
    deco: [{ t: "tip", f: "#8a9a6a" }, { t: "dot", x: 12, y: -11, r: 1.8, f: "#6b7a4a" }, { t: "dot", x: 8, y: 12, r: 1.5, f: "#6b7a4a" }, { t: "hband", f: "#a8b88a" }],
    fact: "Look closely — her wings have little green stripes, like leaf veins!" },
  { id: "ringlet", name: "Ringlet", topic: "time", t: "c", fw: "#4a3f33", hw: "#544838",
    deco: [{ t: "eye", x: 18, y: -16, r: 3, c1: "#e8dca8", c2: "#33291f", c3: "#e8dca8" }, { t: "eye", x: 10, y: 12, r: 2.4, c1: "#e8dca8", c2: "#33291f", c3: "#e8dca8" }],
    fact: "He wears tiny golden rings on his velvet wings — like little clock faces!" },
  { id: "chalkhill_blue", name: "Chalkhill Blue", topic: "nw", t: "c", fw: "#b8d4e8", hw: "#c8def0",
    deco: [{ t: "tip", f: "#5a6a7a" }, { t: "dot", x: 10, y: -10, r: 1.3, f: "#4a5a66" }, { t: "dot", x: 16, y: -14, r: 1.3, f: "#4a5a66" }, { t: "dot", x: 9, y: 12, r: 1.2, f: "#4a5a66" }],
    fact: "A silvery-blue gentleman who only lives on chalky hills!" },
  { id: "small_heath", name: "Small Heath", topic: "oe", t: "c", fw: "#dba858", hw: "#cf9c50",
    deco: [{ t: "eye", x: 19, y: -17, r: 2.6, c1: "#5a4a30", c2: "#fff" }, { t: "hband", f: "#b8884a" }],
    fact: "One of our tiniest butterflies — it never opens its wings while resting!" },
  { id: "wall_brown", name: "Wall Brown", topic: "shp", t: "c", fw: "#d8923a", hw: "#cc8836",
    deco: [{ t: "tip", f: "#5a4528" }, { t: "eye", x: 20, y: -18, r: 3.2, c1: "#33291f", c2: "#fff", c3: "#33291f" }, { t: "band", f: "#8a6a3a" }, { t: "dot", x: 10, y: 13, r: 1.6, f: "#5a4528" }],
    fact: "It loves basking on sunny walls and stony paths — just like its name says!" },
  { id: "meadow_brown", name: "Meadow Brown", topic: null, t: "u", fw: "#7a5c38", hw: "#86663e",
    deco: [{ t: "dot", x: 18, y: -16, r: 4, f: "#d8893a" }, { t: "eye", x: 19, y: -17, r: 2.2, c1: "#33291f", c2: "#fff", c3: "#33291f" }],
    fact: "The quiet queen of every English meadow." },
  { id: "small_copper", name: "Small Copper", topic: null, t: "u", fw: "#e0762d", hw: "#6b5535",
    deco: [{ t: "dot", x: 10, y: -9, r: 1.6, f: "#3a2f1f" }, { t: "dot", x: 15, y: -13, r: 1.6, f: "#3a2f1f" }, { t: "dot", x: 20, y: -17, r: 1.4, f: "#3a2f1f" }, { t: "hband", f: "#e0762d" }],
    fact: "A tiny spark of copper darting over the grass." },
  { id: "purple_emperor", name: "Purple Emperor", topic: null, t: "r", fw: "#5a4bb8", hw: "#4f43a8",
    deco: [{ t: "band", f: "#fff" }, { t: "dot", x: 8, y: 13, r: 1.6, f: "#fff" }, { t: "eye", x: 12, y: 16, r: 2, c1: "#d8893a", c2: "#33291f" }],
    fact: "His Majesty lives at the very tops of oak trees and is terribly hard to spot!" },
  { id: "adonis_blue", name: "Adonis Blue", topic: null, t: "r", fw: "#3f8fe8", hw: "#58a0ec",
    deco: [{ t: "dot", x: 6, y: 16, r: 1.2, f: "#fff" }, { t: "dot", x: 11, y: 16, r: 1.2, f: "#fff" }, { t: "dot", x: 15, y: 13, r: 1.2, f: "#fff" }, { t: "dot", x: 19, y: -17, r: 1.3, f: "#fff" }],
    fact: "The brightest, most dazzling blue in all of Britain." },
  { id: "clouded_yellow", name: "Clouded Yellow", topic: null, t: "r", fw: "#e8b73a", hw: "#ddb24a",
    deco: [{ t: "tip", f: "#7a5a22" }, { t: "dot", x: 14, y: -13, r: 2, f: "#7a5a22" }, { t: "dot", x: 10, y: 11, r: 2, f: "#d98a2b" }],
    fact: "A golden visitor that sails across the sea to see us." },
  { id: "marbled_white", name: "Marbled White", topic: null, t: "r", fw: "#f0ece0", hw: "#e9e5d6",
    deco: [{ t: "tip", f: "#3a3a35" }, { t: "dot", x: 8, y: -8, r: 2.4, f: "#3a3a35" }, { t: "dot", x: 15, y: -13, r: 2.4, f: "#3a3a35" }, { t: "dot", x: 11, y: -17, r: 2, f: "#3a3a35" }, { t: "dot", x: 9, y: 13, r: 2, f: "#3a3a35" }, { t: "dot", x: 15, y: 10, r: 1.6, f: "#3a3a35" }],
    fact: "Not marbled, not just white — a flying chessboard!" }
];
const SP = {};
SPECIES.forEach(sp => SP[sp.id] = sp);
const WANDERERS = ["meadow_brown", "small_copper"];
const RARES = ["purple_emperor", "adonis_blue", "clouded_yellow", "marbled_white"];

function decoSVG(d) {
  if (d.t === "dot") return '<circle cx="' + d.x + '" cy="' + d.y + '" r="' + d.r + '" fill="' + d.f + '"/>';
  if (d.t === "tip") return '<path d="M15 -21 C 20 -26 26 -28 30 -24 C 33 -20 31 -13 27 -10 C 26 -16 21 -19 15 -21 Z" fill="' + d.f + '"/>';
  if (d.t === "band") return '<path d="M7 -7 C 13 -13 19 -17 26 -20 L 28 -16 C 21 -13 14 -9 10 -4 Z" fill="' + d.f + '"/>';
  if (d.t === "hband") return '<path d="M4 14 C 8 19 14 20 19 13 L 16 10 C 12 15 8 15 6 12 Z" fill="' + d.f + '"/>';
  if (d.t === "eye") {
    return '<circle cx="' + d.x + '" cy="' + d.y + '" r="' + d.r + '" fill="' + d.c1 + '"/>' +
           '<circle cx="' + d.x + '" cy="' + d.y + '" r="' + (d.r * 0.55).toFixed(1) + '" fill="' + d.c2 + '"/>' +
           '<circle cx="' + d.x + '" cy="' + d.y + '" r="' + (d.r * 0.28).toFixed(1) + '" fill="' + (d.c3 || "#2c2420") + '"/>';
  }
  return "";
}
function bflySVG(sp, opts = {}) {
  const sil = opts.silhouette;
  const fw = sil ? "#6a6254" : sp.fw, hw = sil ? "#7a7263" : sp.hw, body = sil ? "#4a4338" : "#3a3026";
  const deco = sil ? "" : (sp.deco || []).map(decoSVG).join("");
  const wing = '<path d="' + FW + '" fill="' + fw + '"/><path d="' + HW + '" fill="' + hw + '" opacity="0.85"/>' + deco;
  return '<g class="bfly">' +
    '<g class="wl">' + wing + '</g>' +
    '<g class="wr">' + wing + '</g>' +
    '<ellipse rx="2.5" ry="10" fill="' + body + '"/><circle cy="-12" r="2.6" fill="' + body + '"/>' +
    '<path d="M-1 -13 C -4 -18 -6 -20 -8 -21 M1 -13 C 4 -18 6 -20 8 -21" stroke="' + body + '" stroke-width="1" fill="none"/></g>';
}
function cardSVG(sp, sil) {
  return '<svg viewBox="-32 -32 64 58">' + bflySVG(sp, { silhouette: sil }) + '</svg>';
}

/* ---------- treasure collections (unlock after all the butterflies) ---------- */
const STARP = "M0 -16 L4.7 -4.9 L16.5 -4.2 L7.4 3.4 L10.2 14.8 L0 8.4 L-10.2 14.8 L-7.4 3.4 L-16.5 -4.2 L-4.7 -4.9 Z";
const TREASURES = [
  // commons are listed in their unlock order: plainer first, the most charming last
  { id: "t_star", name: "Twinkle Star", coll: "sky", t: "c", topic: "x5", fact: "Stars twinkle because their light wibbles and wobbles through the air." },
  { id: "t_moon", name: "Smiling Moon", coll: "sky", t: "c", topic: "x2", fact: "The Moon tugs the sea to make the tides dance!" },
  { id: "t_venus", name: "Venus", coll: "sky", t: "c", topic: "sub", fact: "The hottest planet of all — hotter than any oven!" },
  { id: "t_mars", name: "Mars", coll: "sky", t: "c", topic: "miss", fact: "The red planet has the biggest volcano in the whole solar system." },
  { id: "t_comet", name: "Comet", coll: "sky", t: "c", topic: "add", fact: "A giant snowball in space with a tail a million miles long!" },
  { id: "t_earth", name: "Earth", coll: "sky", t: "c", topic: "div", fact: "Our home — the only planet with butterflies!" },
  { id: "t_shooting", name: "Shooting Star", coll: "sky", t: "c", topic: "x10", fact: "Quick — make a wish!" },
  { id: "t_saturn", name: "Saturn", coll: "sky", t: "r", fact: "Saturn's beautiful rings are made of sparkling ice!" },
  { id: "t_jupiter", name: "Jupiter", coll: "sky", t: "r", fact: "So big that one thousand Earths could fit inside!" },
  { id: "t_rocket", name: "Rocket", coll: "sky", t: "r", fact: "Three… two… one… BLAST OFF!" },
  { id: "t_toadstool", name: "Fairy Toadstool", coll: "magic", t: "c", topic: "x4", fact: "Fairies use them as little red umbrellas." },
  { id: "t_crown", name: "Golden Crown", coll: "magic", t: "c", topic: "frac", fact: "Fit for the queen of the meadow — that's you!" },
  { id: "t_wand", name: "Magic Wand", coll: "magic", t: "c", topic: "x3", fact: "Swish and flick! Every good spell starts with maths." },
  { id: "t_potion", name: "Magic Potion", coll: "magic", t: "c", topic: "x8", fact: "A fizzy potion of moonlight and berry juice!" },
  { id: "t_hat", name: "Wizard's Hat", coll: "magic", t: "c", topic: "add2", fact: "A pointy hat simply full of star secrets." },
  { id: "t_egg", name: "Dragon Egg", coll: "magic", t: "c", topic: "sub2", fact: "Shhh… something magical is sleeping inside." },
  { id: "t_rainbow", name: "Rainbow", coll: "magic", t: "c", topic: "pv", fact: "Sunshine and rain together make a bridge of colours." },
  // meadow friends: one visits each morning with a quest (date-seeded, t:"f")
  { id: "f_ladybird", name: "Ladybird", coll: "friends", t: "f", fact: "Count her spots — a seven-spot ladybird is Britain's favourite!" },
  { id: "f_bee", name: "Bumblebee", coll: "friends", t: "f", fact: "Bees dance to tell their friends where the flowers are!" },
  { id: "f_snail", name: "Snail", coll: "friends", t: "f", fact: "He carries his house everywhere, so he is never late home." },
  { id: "f_frog", name: "Frog", coll: "friends", t: "f", fact: "He started life as a tiny wriggly tadpole." },
  { id: "f_robin", name: "Robin", coll: "friends", t: "f", fact: "Robins sing all winter — even on Christmas morning." },
  { id: "f_duckling", name: "Duckling", coll: "friends", t: "f", fact: "She follows her mum everywhere — in a perfectly straight line!" },
  { id: "f_hedgehog", name: "Hedgehog", coll: "friends", t: "f", fact: "He snuffles through the hedge at night, counting his steps!" },
  { id: "f_owl", name: "Owl", coll: "friends", t: "f", fact: "Owls can turn their heads almost all the way round!" },
  { id: "f_fox", name: "Fox", coll: "friends", t: "f", fact: "Her bushy tail has its own special name — a brush!" },
  { id: "f_squirrel", name: "Red Squirrel", coll: "friends", t: "f", fact: "She hides acorns everywhere and remembers where they all are!" },
  { id: "t_unicorn", name: "Unicorn", coll: "magic", t: "r", fact: "The rarest friend of all — she only visits the cleverest mathematicians!" },
  { id: "t_fairy", name: "Fairy", coll: "magic", t: "r", fact: "She sprinkles sparkle dust on children who keep on trying." },
  { id: "t_chest", name: "Treasure Chest", coll: "magic", t: "r", fact: "Full of golden coins — and golden answers!" },
  // rock pool: unlocks after Magic Meadow; money & time live here
  { id: "s_pebble", name: "Smooth Pebble", coll: "sea", t: "c", topic: "money", fact: "The sea rolled it for a hundred years to make it this smooth." },
  { id: "s_seaweed", name: "Seaweed", coll: "sea", t: "c", topic: "time", fact: "It sways with the waves like it is dancing." },
  { id: "s_shell", name: "Seashell", coll: "sea", t: "c", topic: "add", fact: "Hold it to your ear — can you hear the sea?" },
  { id: "s_crab", name: "Crab", coll: "sea", t: "c", topic: "sub", fact: "He always walks sideways — even when he is in a hurry!" },
  { id: "s_starfish", name: "Starfish", coll: "sea", t: "c", topic: "x5", fact: "Five arms — and if he loses one, he grows it back!" },
  { id: "s_jellyfish", name: "Jellyfish", coll: "sea", t: "c", topic: "frac", fact: "She has no brain at all — yet she has glided for millions of years." },
  { id: "s_seahorse", name: "Seahorse", coll: "sea", t: "c", topic: "x8", fact: "Seahorse daddies carry the babies in a little pouch!" },
  { id: "s_pearl", name: "Pearl", coll: "sea", t: "r", fact: "An oyster's secret treasure, grown one shimmering layer at a time." },
  { id: "s_dolphin", name: "Dolphin", coll: "sea", t: "r", fact: "Dolphins call each other by name with special whistles!" },
  { id: "s_whale", name: "Whale", coll: "sea", t: "r", fact: "The biggest animal that has EVER lived — bigger than any dinosaur!" },
  // woodland: unlocks after Rock Pool; the June 2026 topics live here
  { id: "w_acorn", name: "Little Acorn", coll: "wood", t: "c", topic: "x2", fact: "Inside this tiny acorn sleeps a whole oak tree." },
  { id: "w_conker", name: "Shiny Conker", coll: "wood", t: "c", topic: "nw", fact: "Polished by its spiky green case — the shiniest thing in the woods!" },
  { id: "w_berry", name: "Blackberries", coll: "wood", t: "c", topic: "add", fact: "Every blackberry is really lots of tiny berries holding hands." },
  { id: "w_fern", name: "Curly Fern", coll: "wood", t: "c", topic: "oe", fact: "Ferns grew here before there were any flowers at all." },
  { id: "w_cone", name: "Pine Cone", coll: "wood", t: "c", topic: "x10", fact: "It closes up tight when rain is coming — a woodland weather forecaster!" },
  { id: "w_wpecker", name: "Woodpecker", coll: "wood", t: "c", topic: "shp", fact: "He drums on trees twenty times a second — and never gets a headache!" },
  { id: "w_badger", name: "Badger", coll: "wood", t: "c", topic: "time", fact: "He keeps his underground home spotless and changes his bedding every day." },
  { id: "w_fawn", name: "Fawn", coll: "wood", t: "r", fact: "Her white spots are dapples of sunlight, so she can hide in the ferns." },
  { id: "w_otter", name: "Otter", coll: "wood", t: "r", fact: "Otters hold hands while they sleep, so they never float apart." },
  { id: "w_oak", name: "Wise Old Oak", coll: "wood", t: "r", fact: "Five hundred years old — and once a tiny acorn, just like yours." },
  // dinosaurs: unlocks after Woodland — something ROARS from long, long ago
  { id: "d_print", name: "Dino Footprint", coll: "dino", t: "c", topic: "x5", fact: "A footprint so big you could sit in it like a bathtub!" },
  { id: "d_fossil", name: "Ammonite Fossil", coll: "dino", t: "c", topic: "miss", fact: "A sea creature's shell, turned to stone over millions of years." },
  { id: "d_tric", name: "Triceratops", coll: "dino", t: "c", topic: "sub", fact: "Three horns and a giant frill — but she only ate plants!" },
  { id: "d_steg", name: "Stegosaurus", coll: "dino", t: "c", topic: "money", fact: "Plates on his back like rooftop tiles — and a brain the size of a plum." },
  { id: "d_dipl", name: "Diplodocus", coll: "dino", t: "c", topic: "add2", fact: "Longer than three buses — most of it neck and tail!" },
  { id: "d_ptero", name: "Pterodactyl", coll: "dino", t: "c", topic: "frac", fact: "Not a dinosaur at all — a flying cousin with wings of skin!" },
  { id: "d_baby", name: "Baby Dino", coll: "dino", t: "c", topic: "sub2", fact: "Just hatched — and already bigger than a cat!" },
  { id: "d_trex", name: "T. rex", coll: "dino", t: "r", fact: "The king of the dinosaurs — with teeth as long as bananas!" },
  { id: "d_mammoth", name: "Woolly Mammoth", coll: "dino", t: "r", fact: "A fuzzy elephant from the ice age, with tusks like giant curls." },
  { id: "d_volcano", name: "Rumbling Volcano", coll: "dino", t: "r", fact: "RUMBLE… the dinosaurs' world was full of fire mountains like this one." },
  // the legend: appears only when every butterfly and every treasure has been found
  { id: "t_legend", name: "Golden Butterfly", coll: "legend", t: "l", fact: "The rarest creature in the whole meadow — she only ever visits a child who has found absolutely everything." }
];
const TR = {};
TREASURES.forEach(t => TR[t.id] = t);
const ITEM = id => SP[id] || TR[id];
const COLL_NAME = { sky: "Night Sky treasures", magic: "Magic Meadow treasures", sea: "Rock Pool treasures",
                    wood: "Woodland treasures", dino: "Dinosaur treasures" };
const TREASURE_DRAW = {
  t_moon: '<circle r="15" fill="#f2d984" stroke="#d9b95a" stroke-width="2"/><circle cx="-6" cy="-7" r="2.6" fill="#e3c468"/><circle cx="8" cy="-4" r="1.9" fill="#e3c468"/><circle cx="6" cy="8" r="2.3" fill="#e3c468"/><circle cx="-5" cy="1" r="1.4" fill="#5a4a2f"/><circle cx="1" cy="1" r="1.4" fill="#5a4a2f"/><path d="M-4 6 Q -1.5 9 1 6" stroke="#5a4a2f" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
  t_star: '<circle r="20" fill="#f7d154" opacity="0.15"/><path d="' + STARP + '" fill="#f7d154" stroke="#d9a93a" stroke-width="1.5" stroke-linejoin="round"/><circle cx="-3" cy="-1" r="1.2" fill="#5a4a2f"/><circle cx="3" cy="-1" r="1.2" fill="#5a4a2f"/><path d="M-2.5 3 Q 0 5.5 2.5 3" stroke="#5a4a2f" stroke-width="1.4" fill="none" stroke-linecap="round"/>',
  t_shooting: '<path d="M-6 0 L-26 10 M-4 -6 L-27 0 M-2 -12 L-24 -12" stroke="#f2d984" stroke-width="3" stroke-linecap="round" opacity="0.75"/><g transform="translate(8 -2) scale(0.85)"><path d="' + STARP + '" fill="#f7d154" stroke="#d9a93a" stroke-width="1.5" stroke-linejoin="round"/></g>',
  t_comet: '<path d="M2 -1 C -8 6 -18 12 -26 14 C -16 6 -10 2 -1 -5 Z" fill="#bcd8f0" opacity="0.6"/><path d="M6 2 C -2 8 -12 14 -20 18 C -12 10 -6 6 1 0 Z" fill="#dcebf7" opacity="0.5"/><circle cx="8" cy="-6" r="8" fill="#bcd8f0" stroke="#8fb8dd" stroke-width="2"/>',
  t_venus: '<circle r="13" fill="#e8c27a" stroke="#d9a95a" stroke-width="1.5"/><path d="M-12 -4 C -4 -7 4 -2 12 -5" stroke="#d9a95a" stroke-width="2.5" fill="none" opacity="0.8"/><path d="M-11 5 C -3 2 5 8 11 4" stroke="#d9a95a" stroke-width="2.5" fill="none" opacity="0.8"/>',
  t_earth: '<circle r="14" fill="#5b9bd5" stroke="#447ab0" stroke-width="1.5"/><path d="M-10 -8 C -4 -10 -2 -4 -6 -1 C -10 0 -13 -4 -10 -8 Z" fill="#6fae62"/><path d="M2 -3 C 8 -6 12 -1 9 3 C 5 7 0 5 2 -3 Z" fill="#6fae62"/><path d="M-6 7 C -2 5 2 8 -1 10 C -4 12 -8 9 -6 7 Z" fill="#6fae62"/><ellipse cx="6" cy="-9" rx="4" ry="1.6" fill="#fff" opacity="0.85"/>',
  t_mars: '<circle r="12" fill="#d96f3f" stroke="#b85530" stroke-width="1.5"/><circle cx="-4" cy="2" r="2.6" fill="#b85a30"/><circle cx="5" cy="-3" r="2" fill="#b85a30"/><circle cx="2" cy="7" r="1.6" fill="#b85a30"/><ellipse cy="-10.5" rx="4.5" ry="1.8" fill="#f4eedd"/>',
  t_saturn: '<circle r="11" fill="#e8c884" stroke="#d9b06a" stroke-width="1.5"/><path d="M-9 -4 C -2 -6 4 -3 9 -5" stroke="#d9b06a" stroke-width="2" fill="none" opacity="0.7"/><ellipse rx="20" ry="5.5" fill="none" stroke="#d9a93a" stroke-width="3" transform="rotate(-18)" opacity="0.9"/>',
  t_jupiter: '<circle r="15" fill="#e0a86c" stroke="#c98c4f" stroke-width="1.5"/><path d="M-14 -5 C -6 -8 6 -3 14 -6" stroke="#c98c4f" stroke-width="3" fill="none" opacity="0.7"/><path d="M-14 2 C -6 0 6 4 14 1" stroke="#f2dcc0" stroke-width="3" fill="none" opacity="0.8"/><path d="M-13 8 C -5 6 5 10 13 7" stroke="#c98c4f" stroke-width="2.5" fill="none" opacity="0.6"/><ellipse cx="5" cy="5" rx="3.5" ry="2.2" fill="#c4563a"/>',
  t_rocket: '<path d="M0 -20 C 7 -13 8 -4 8 4 L-8 4 C -8 -4 -7 -13 0 -20 Z" fill="#eee9dd" stroke="#b8ad98" stroke-width="1.5"/><path d="M0 -20 C 3.5 -16.5 5.5 -13 6.5 -9 L-6.5 -9 C -5.5 -13 -3.5 -16.5 0 -20 Z" fill="#d8402c"/><circle cy="-3" r="3.8" fill="#9cc4e4" stroke="#5b87aa" stroke-width="1.5"/><path d="M-8 -2 L-14 10 L-8 8 Z" fill="#d8402c"/><path d="M8 -2 L14 10 L8 8 Z" fill="#d8402c"/><path d="M-4 4 L-3 9 L3 9 L4 4 Z" fill="#b8ad98"/><path d="M-3 9 C -3 14 -1.5 16 0 19 C 1.5 16 3 14 3 9 Z" fill="#f2a13a"/><path d="M-1.5 9 C -1.5 12 0 14 0 16 C 0 14 1.5 12 1.5 9 Z" fill="#f7d154"/>',
  t_rainbow: '<path d="M-19 12 A 19 19 0 0 1 19 12" stroke="#d8402c" stroke-width="4.5" fill="none"/><path d="M-14.5 12 A 14.5 14.5 0 0 1 14.5 12" stroke="#f2a13a" stroke-width="4.5" fill="none"/><path d="M-10 12 A 10 10 0 0 1 10 12" stroke="#f7d154" stroke-width="4.5" fill="none"/><path d="M-5.5 12 A 5.5 5.5 0 0 1 5.5 12" stroke="#7fb163" stroke-width="4.5" fill="none"/><ellipse cx="-19" cy="12" rx="7" ry="5" fill="#fff"/><ellipse cx="19" cy="12" rx="7" ry="5" fill="#fff"/>',
  t_crown: '<path d="M-16 8 L-16 -4 L-8 2 L0 -10 L8 2 L16 -4 L16 8 Z" fill="#f2c84b" stroke="#d9a93a" stroke-width="2" stroke-linejoin="round"/><rect x="-16" y="8" width="32" height="5" rx="2" fill="#e8b73a" stroke="#d9a93a" stroke-width="1.5"/><circle cx="-8" cy="4" r="2" fill="#d8402c"/><circle cx="0" cy="1" r="2.2" fill="#4f74d8"/><circle cx="8" cy="4" r="2" fill="#1d9e75"/>',
  t_wand: '<g transform="rotate(-35)"><rect x="-1.8" y="-6" width="3.6" height="24" rx="1.8" fill="#8a5a2e" stroke="#6f4a24" stroke-width="1"/><g transform="translate(0 -12) scale(0.55)"><path d="' + STARP + '" fill="#f2c84b" stroke="#d9a93a" stroke-width="2" stroke-linejoin="round"/></g></g><circle cx="10" cy="-14" r="1.4" fill="#f2c84b"/><circle cx="-14" cy="-6" r="1.2" fill="#f2c84b"/><circle cx="13" cy="2" r="1.1" fill="#f2c84b"/>',
  t_toadstool: '<rect x="-4.5" y="-1" width="9" height="13" rx="3" fill="#f4eedd" stroke="#d8cdb4" stroke-width="1.5"/><path d="M-15 0 C -15 -14 15 -14 15 0 Z" fill="#d8402c" stroke="#b03226" stroke-width="1.5"/><circle cx="-7" cy="-6" r="2.2" fill="#fff"/><circle cx="2" cy="-9" r="1.8" fill="#fff"/><circle cx="9" cy="-4" r="1.6" fill="#fff"/>',
  t_potion: '<path d="M-3 -16 L3 -16 L3 -8 C 9 -5 12 1 12 6 C 12 13 7 17 0 17 C -7 17 -12 13 -12 6 C -12 1 -9 -5 -3 -8 Z" fill="#eee6f5" stroke="#9a8fb0" stroke-width="1.5"/><path d="M-10.5 6 C -10.5 12 -6 15.5 0 15.5 C 6 15.5 10.5 12 10.5 6 C 10.5 2.5 8 -1 4 -3 L-4 -3 C -8 -1 -10.5 2.5 -10.5 6 Z" fill="#a85fd0" opacity="0.85"/><circle cx="-3" cy="6" r="1.5" fill="#fff" opacity="0.8"/><circle cx="3" cy="9" r="1.1" fill="#fff" opacity="0.8"/><circle cx="1" cy="2" r="1" fill="#fff" opacity="0.7"/><rect x="-3.5" y="-20" width="7" height="5" rx="1.5" fill="#8a5a2e"/>',
  t_hat: '<ellipse cy="10" rx="17" ry="4.5" fill="#4a3d9e" stroke="#3a2f80" stroke-width="1.5"/><path d="M0 -19 C 5 -9 9 0 11 10 L-11 10 C -9 0 -5 -9 0 -19 Z" fill="#5b4bb8" stroke="#3a2f80" stroke-width="1.5"/><path d="M-9 4 L9 4" stroke="#f2c84b" stroke-width="3"/><g transform="translate(2 -6) scale(0.22)"><path d="' + STARP + '" fill="#f2c84b"/></g><g transform="translate(-5 0) scale(0.16)"><path d="' + STARP + '" fill="#f2c84b"/></g>',
  t_egg: '<path d="M0 -17 C 9 -12 12 -2 12 4 C 12 12 7 18 0 18 C -7 18 -12 12 -12 4 C -12 -2 -9 -12 0 -17 Z" fill="#6fc2b4" stroke="#4f9a8c" stroke-width="1.5"/><circle cx="-4" cy="-4" r="2.4" fill="#4f9a8c"/><circle cx="5" cy="2" r="2" fill="#4f9a8c"/><circle cx="-2" cy="8" r="1.7" fill="#4f9a8c"/><circle cx="4" cy="-9" r="1.5" fill="#4f9a8c"/><path d="M-6 -10 C -4 -12 -1 -13 1 -13" stroke="#fff" stroke-width="2" opacity="0.7" fill="none" stroke-linecap="round"/>',
  t_unicorn: '<path d="M-15 4 C -20 6 -21 12 -18 16" stroke="#e6a4b8" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="-11" y="10" width="3.5" height="9" rx="1.5" fill="#f7f3ee" stroke="#ded5c6" stroke-width="1"/><rect x="-4" y="11" width="3.5" height="8" rx="1.5" fill="#f7f3ee" stroke="#ded5c6" stroke-width="1"/><rect x="3" y="10" width="3.5" height="9" rx="1.5" fill="#f7f3ee" stroke="#ded5c6" stroke-width="1"/><ellipse cx="-3" cy="6" rx="12" ry="8" fill="#f7f3ee" stroke="#ded5c6" stroke-width="1.5"/><path d="M5 -11 L2 -16 L0.5 -9 Z" fill="#f7f3ee" stroke="#ded5c6" stroke-width="1"/><circle cx="9" cy="-5" r="7" fill="#f7f3ee" stroke="#ded5c6" stroke-width="1.5"/><path d="M13 -10 L15.5 -21 L17.5 -9 Z" fill="#f2c84b" stroke="#d9a93a" stroke-width="1"/><circle cx="3" cy="-9" r="3" fill="#e6a4b8"/><circle cx="0" cy="-5" r="3" fill="#d4537e"/><circle cx="-1" cy="-1" r="3" fill="#e6a4b8"/><circle cx="11" cy="-6" r="1.2" fill="#3a3026"/>',
  t_fairy: '<ellipse cx="-7" cy="-4" rx="7" ry="10" fill="#cfe4f7" opacity="0.85" transform="rotate(20 -7 -4)"/><ellipse cx="7" cy="-4" rx="7" ry="10" fill="#cfe4f7" opacity="0.85" transform="rotate(-20 7 -4)"/><ellipse cx="-6" cy="6" rx="5" ry="7" fill="#e3f0fa" opacity="0.8" transform="rotate(35 -6 6)"/><ellipse cx="6" cy="6" rx="5" ry="7" fill="#e3f0fa" opacity="0.8" transform="rotate(-35 6 6)"/><path d="M0 -3 L7 13 L-7 13 Z" fill="#d4537e"/><path d="M-2 13 L-2 18 M2 13 L2 18" stroke="#f2d6c2" stroke-width="2" stroke-linecap="round"/><circle cy="-9" r="5" fill="#f2d6c2"/><path d="M-5 -11 A 5.5 5.5 0 0 1 5 -11" fill="#8a5a2e"/><circle cx="-12" cy="-14" r="1.3" fill="#f2c84b"/><circle cx="13" cy="-10" r="1.1" fill="#f2c84b"/><circle cx="10" cy="-18" r="1.4" fill="#f2c84b"/>',
  t_chest: '<rect x="-15" y="-1" width="30" height="15" rx="2" fill="#9a6a3a" stroke="#6f4a24" stroke-width="1.5"/><path d="M-15 -1 C -15 -12 15 -12 15 -1 Z" fill="#b07a42" stroke="#6f4a24" stroke-width="1.5"/><circle cx="-9" cy="-13" r="3" fill="#f2c84b" stroke="#d9a93a" stroke-width="1"/><circle cx="9" cy="-14" r="2.6" fill="#f2c84b" stroke="#d9a93a" stroke-width="1"/><circle cx="0" cy="-16" r="2.8" fill="#f2c84b" stroke="#d9a93a" stroke-width="1"/><rect x="-3" y="-11" width="6" height="25" fill="#f2c84b" stroke="#d9a93a" stroke-width="1"/><circle cy="3" r="2.2" fill="#8a5a2e"/>',
  f_ladybird: '<circle cy="-13" r="4.5" fill="#3a3026"/><circle cx="-2" cy="-14" r="0.9" fill="#fff"/><circle cx="2" cy="-14" r="0.9" fill="#fff"/><ellipse rx="13" ry="11" fill="#d8402c" stroke="#a32a1c" stroke-width="1.5"/><path d="M0 -11 L0 11" stroke="#3a3026" stroke-width="2"/><circle cx="-6" cy="-3" r="2.2" fill="#3a3026"/><circle cx="6" cy="-2" r="2" fill="#3a3026"/><circle cx="-4" cy="5" r="1.8" fill="#3a3026"/><circle cx="5" cy="5" r="1.7" fill="#3a3026"/>',
  f_bee: '<ellipse cx="-4" cy="-11" rx="7" ry="5" fill="#dcebf7" opacity="0.85" transform="rotate(-22 -4 -11)"/><ellipse cx="6" cy="-11" rx="6" ry="4.5" fill="#dcebf7" opacity="0.85" transform="rotate(18 6 -11)"/><ellipse rx="12" ry="9" fill="#f2c84b" stroke="#b8932f" stroke-width="1.2"/><path d="M-4 -9 C -5 -3 -5 3 -4 9 M3 -9 C 2 -3 2 3 3 9" stroke="#3a3026" stroke-width="3.5" fill="none"/><circle cx="11" cy="-1" r="4.5" fill="#3a3026"/><circle cx="10" cy="-2" r="1" fill="#fff"/>',
  f_snail: '<path d="M-16 12 C -10 14 8 14 14 12 C 18 11 18 7 14 7 L-10 7 Z" fill="#c9a06a"/><circle cx="3" cy="-2" r="10" fill="#b07a42" stroke="#8a5a2e" stroke-width="1.5"/><path d="M3 -2 C 8 -2 8 3 3 3 C -2 3 -2 -5 4 -6" stroke="#8a5a2e" stroke-width="1.5" fill="none"/><circle cx="-13" cy="4" r="4.5" fill="#c9a06a"/><path d="M-15 1 L-17 -5 M-11 1 L-10 -5" stroke="#c9a06a" stroke-width="1.8" stroke-linecap="round"/><circle cx="-17" cy="-6" r="1.4" fill="#c9a06a"/><circle cx="-10" cy="-6" r="1.4" fill="#c9a06a"/><circle cx="-14" cy="3" r="0.9" fill="#3a3026"/>',
  f_frog: '<circle cx="-6" cy="-8" r="5" fill="#6aa84f" stroke="#4e7d3c" stroke-width="1.5"/><circle cx="6" cy="-8" r="5" fill="#6aa84f" stroke="#4e7d3c" stroke-width="1.5"/><ellipse cy="4" rx="13" ry="9" fill="#6aa84f" stroke="#4e7d3c" stroke-width="1.5"/><circle cx="-6" cy="-9" r="2.2" fill="#fff"/><circle cx="6" cy="-9" r="2.2" fill="#fff"/><circle cx="-6" cy="-9" r="1.1" fill="#3a3026"/><circle cx="6" cy="-9" r="1.1" fill="#3a3026"/><path d="M-5 4 Q 0 8 5 4" stroke="#3a5a2c" stroke-width="1.6" fill="none" stroke-linecap="round"/><ellipse cx="-9" cy="12" rx="4" ry="2" fill="#5d9148"/><ellipse cx="9" cy="12" rx="4" ry="2" fill="#5d9148"/>',
  f_robin: '<path d="M6 -2 C 13 0 14 7 9 10 C 8 6 7 2 6 -2 Z" fill="#7a5e42"/><circle r="11" fill="#9a7a5a"/><ellipse cx="-3" cy="3" rx="6.5" ry="7" fill="#d8642c"/><circle cx="-5" cy="-4" r="1.4" fill="#3a3026"/><path d="M-11 -2 L-16 -1 L-11 1 Z" fill="#e8b73a"/><path d="M-2 11 L-2 16 M3 11 L3 16" stroke="#8a5a2e" stroke-width="1.6"/>',
  f_duckling: '<ellipse cx="2" cy="5" rx="11" ry="8" fill="#f2d154" stroke="#d9b13a" stroke-width="1.2"/><path d="M7 1 C 13 0 14 5 11 8 C 9 6 8 3 7 1 Z" fill="#e3bd3f"/><circle cx="-8" cy="-6" r="6.5" fill="#f2d154" stroke="#d9b13a" stroke-width="1.2"/><circle cx="-10" cy="-7" r="1.3" fill="#3a3026"/><path d="M-14 -5 L-19 -4 L-14 -2 Z" fill="#e8923a"/><path d="M0 13 L0 17 M5 13 L5 17" stroke="#e8923a" stroke-width="1.8"/>',
  f_hedgehog: '<path d="M-13 14 L-14 2 L-10 -2 L-10 -8 L-5 -6 L-3 -12 L2 -8 L6 -12 L8 -6 L13 -7 L12 -1 L16 2 L15 14 Z" fill="#7a5a3c"/><path d="M-13 14 C -17 14 -21 12 -22 14 L-8 14 C -9 11 -11 10 -13 14 Z" fill="#c9a06a"/><path d="M-13 10 C -17 10 -21 12 -22 14 L-9 14 C -10 11 -11 10 -13 10 Z" fill="#c9a06a"/><circle cx="-21" cy="13" r="1.6" fill="#3a3026"/><circle cx="-13" cy="10.5" r="1.1" fill="#3a3026"/><path d="M-4 14 L-4 16.5 M4 14 L4 16.5 M10 14 L10 16.5" stroke="#5a4a2f" stroke-width="1.6"/>',
  f_owl: '<path d="M-9 -10 L-12 -17 L-4 -12 Z" fill="#7a5e42"/><path d="M9 -10 L12 -17 L4 -12 Z" fill="#7a5e42"/><ellipse rx="11" ry="13" fill="#9a7a5a" stroke="#7a5e42" stroke-width="1.2"/><circle cx="-4.5" cy="-4" r="4.5" fill="#f2e6c9"/><circle cx="4.5" cy="-4" r="4.5" fill="#f2e6c9"/><circle cx="-4.5" cy="-4" r="2" fill="#3a3026"/><circle cx="4.5" cy="-4" r="2" fill="#3a3026"/><path d="M0 -1 L-2 3 L2 3 Z" fill="#e8b73a"/><ellipse cy="8" rx="6" ry="4.5" fill="#c9b08a" opacity="0.6"/><path d="M-3 13 L-3 16 M3 13 L3 16" stroke="#e8b73a" stroke-width="1.6"/>',
  f_fox: '<path d="M-12 -6 L-16 -16 L-6 -11 Z" fill="#d8642c"/><path d="M12 -6 L16 -16 L6 -11 Z" fill="#d8642c"/><path d="M0 14 C -10 12 -14 4 -13 -6 C -8 -10 8 -10 13 -6 C 14 4 10 12 0 14 Z" fill="#d8642c"/><path d="M0 14 C -7 13 -10 8 -10 4 C -6 7 -2 8 0 8 C 2 8 6 7 10 4 C 10 8 7 13 0 14 Z" fill="#f4eedd"/><circle cx="-5" cy="-2" r="1.6" fill="#3a3026"/><circle cx="5" cy="-2" r="1.6" fill="#3a3026"/><circle cy="9" r="2" fill="#3a3026"/>',
  f_squirrel: '<path d="M8 12 C 18 12 20 0 16 -8 C 22 -4 24 8 18 14 C 14 17 10 16 8 12 Z" fill="#c4563a"/><ellipse cx="-2" cy="6" rx="9" ry="8" fill="#d8642c"/><ellipse cx="-4" cy="8" rx="4" ry="5" fill="#f2dcc0"/><path d="M-11 -9 L-12 -15 L-7 -11 Z" fill="#c4563a"/><circle cx="-8" cy="-5" r="6" fill="#d8642c"/><circle cx="-10" cy="-6" r="1.3" fill="#3a3026"/><circle cx="-13" cy="-3" r="1.1" fill="#7a3a28"/><path d="M-6 13 L-6 16 M0 13 L0 16" stroke="#a3492e" stroke-width="1.6"/>',
  s_pebble: '<ellipse cy="4" rx="13" ry="9.5" fill="#b8b2a6" stroke="#948e82" stroke-width="1.5"/><ellipse cx="-4" cy="0" rx="4.5" ry="2.5" fill="#cfc9bd" opacity="0.8"/><circle cx="-3" cy="4" r="1" fill="#5a544a"/><circle cx="3" cy="4" r="1" fill="#5a544a"/><path d="M-2 8 Q 0 9.5 2 8" stroke="#5a544a" stroke-width="1.2" fill="none" stroke-linecap="round"/>',
  s_seaweed: '<path d="M0 16 C -4 8 4 2 0 -6 C -3 -12 2 -16 0 -19" stroke="#3f8f6a" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M-7 16 C -10 8 -4 2 -8 -5" stroke="#5aa87f" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M7 16 C 10 10 5 3 8 -3" stroke="#5aa87f" stroke-width="3" fill="none" stroke-linecap="round"/>',
  s_shell: '<path d="M-14 0 C -14 -12 14 -12 14 0 L 0 13 Z" fill="#e8c0a8" stroke="#c4906e" stroke-width="1.5" stroke-linejoin="round"/><path d="M0 13 L-9 -7 M0 13 L0 -9 M0 13 L9 -7" stroke="#c4906e" stroke-width="1.2"/>',
  s_crab: '<circle cx="-12" cy="-7" r="4" fill="#d8642c" stroke="#b34a1c" stroke-width="1.2"/><circle cx="12" cy="-7" r="4" fill="#d8642c" stroke="#b34a1c" stroke-width="1.2"/><path d="M-10 2 L-16 7 M-8 5 L-13 10 M10 2 L16 7 M8 5 L13 10" stroke="#b34a1c" stroke-width="2" stroke-linecap="round"/><ellipse rx="11" ry="7.5" fill="#d8642c" stroke="#b34a1c" stroke-width="1.5"/><circle cx="-4" cy="-2" r="1.5" fill="#3a3026"/><circle cx="4" cy="-2" r="1.5" fill="#3a3026"/><path d="M-2 2 Q 0 3.5 2 2" stroke="#7a3018" stroke-width="1.2" fill="none" stroke-linecap="round"/>',
  s_starfish: '<g transform="scale(0.95)"><path d="' + STARP + '" fill="#e8923a" stroke="#c4702a" stroke-width="1.5" stroke-linejoin="round"/></g><circle cx="0" cy="-7" r="1.2" fill="#c4702a"/><circle cx="-4" cy="1" r="1.2" fill="#c4702a"/><circle cx="4" cy="1" r="1.2" fill="#c4702a"/><circle cx="-1.5" cy="-2.5" r="1" fill="#3a3026"/><circle cx="1.5" cy="-2.5" r="1" fill="#3a3026"/>',
  s_jellyfish: '<path d="M-12 2 C -12 -13 12 -13 12 2 Z" fill="#d8a8e0" stroke="#b07fc4" stroke-width="1.5" opacity="0.92"/><path d="M-9 3 C -10 8 -8 12 -9 16 M-3 3 C -4 9 -2 13 -3 17 M3 3 C 2 9 4 13 3 17 M9 3 C 8 8 10 12 9 16" stroke="#c490d4" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="-4" cy="-4" r="1.2" fill="#7a5a8c"/><circle cx="4" cy="-4" r="1.2" fill="#7a5a8c"/>',
  s_seahorse: '<path d="M2 -14 C 10 -12 11 -3 4 0 C 11 3 10 11 4 14 C 0 17 -6 16 -6 12 C -2 14 2 12 2 9 C 2 6 -4 6 -4 2 C -4 -2 0 -2 0 -6 C 0 -9 -3 -10 -5 -8 C -6 -12 -2 -15 2 -14 Z" fill="#e8b73a" stroke="#c4912a" stroke-width="1.2"/><path d="M-5 -8 L-10 -6" stroke="#c4912a" stroke-width="2.5" stroke-linecap="round"/><circle cx="-1" cy="-11" r="1.2" fill="#3a3026"/><path d="M4 2 C 8 1 9 4 6 6" fill="none" stroke="#c4912a" stroke-width="1.2"/>',
  s_pearl: '<path d="M-14 4 C -14 12 14 12 14 4 L 0 14 Z" fill="#d8a888" stroke="#b08060" stroke-width="1.5"/><path d="M-14 4 C -14 -8 14 -8 14 4" fill="#e8c0a8" stroke="#c4906e" stroke-width="1.5"/><circle cy="1" r="6" fill="#f4f0f7" stroke="#cfc4d8" stroke-width="1"/><circle cx="-2" cy="-1" r="1.8" fill="#fff"/>',
  s_dolphin: '<path d="M-17 8 C -12 -4 2 -13 12 -8 C 17 -5 17 1 13 2 C 6 0 -2 2 -7 6 C -10 9 -14 10 -17 8 Z" fill="#84aece" stroke="#5d87a8" stroke-width="1.2"/><path d="M-2 -8 L2 -15 L6 -7 Z" fill="#84aece" stroke="#5d87a8" stroke-width="1"/><path d="M-17 8 L-22 3 L-19 10 L-23 14 Z" fill="#84aece" stroke="#5d87a8" stroke-width="1"/><circle cx="9" cy="-4" r="1.3" fill="#2c3a4a"/><path d="M13 -1 C 15 0 16 1 16 2" stroke="#5d87a8" stroke-width="1.2" fill="none" stroke-linecap="round"/>',
  s_whale: '<path d="M-8 -13 C -9 -17 -7 -19 -8 -21 M-4 -13 C -3 -17 -5 -19 -4 -21" stroke="#9cc4e4" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M-18 4 C -18 -8 -2 -15 8 -9 C 16 -5 17 4 11 8 L-12 8 C -16 8 -18 7 -18 4 Z" fill="#6f8fc4" stroke="#51699a" stroke-width="1.2"/><path d="M11 8 L17 1 L19 8 L23 3 L21 11 L13 11 Z" fill="#6f8fc4" stroke="#51699a" stroke-width="1"/><circle cx="2" cy="-2" r="1.4" fill="#2c3a4a"/><path d="M-14 3 Q -8 6 -2 4" stroke="#51699a" stroke-width="1.2" fill="none" stroke-linecap="round"/>',
  w_acorn: '<path d="M-8 -3 C -8 9 8 9 8 -3 Z" fill="#c9a06a" stroke="#8a5a2e" stroke-width="1.5"/><path d="M-10 -3 C -10 -11 10 -11 10 -3 Z" fill="#8a5a2e" stroke="#6f4a24" stroke-width="1.2"/><path d="M0 -10 C 0 -13 2 -15 4 -16" stroke="#6f4a24" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="-3" cy="0" r="1.1" fill="#5a4a2f"/><circle cx="3" cy="0" r="1.1" fill="#5a4a2f"/><path d="M-2 4 Q 0 5.5 2 4" stroke="#5a4a2f" stroke-width="1.2" fill="none" stroke-linecap="round"/>',
  w_conker: '<circle r="11" fill="#7a4a26" stroke="#5a3519" stroke-width="1.5"/><path d="M-7 7 A 11 11 0 0 0 7 7 C 4 3.5 -4 3.5 -7 7 Z" fill="#e8d8b8"/><ellipse cx="-3.5" cy="-4.5" rx="4" ry="2.6" fill="#a06a3a" opacity="0.9" transform="rotate(-20 -3.5 -4.5)"/><circle cx="4" cy="-6" r="1.2" fill="#a06a3a"/>',
  w_berry: '<path d="M5 -9 C 9 -16 17 -16 19 -11 C 14 -8 9 -8 5 -9 Z" fill="#5d9148" stroke="#4e7d3c" stroke-width="1"/><path d="M2 -7 C 3 -10 4 -12 6 -13" stroke="#4e7d3c" stroke-width="1.5" fill="none"/><g fill="#4a2a5a" stroke="#33203f" stroke-width="0.8"><circle cx="-4" cy="-4" r="3.6"/><circle cx="3" cy="-4" r="3.6"/><circle cx="-8" cy="2" r="3.6"/><circle cx="-1" cy="2" r="3.8"/><circle cx="6" cy="2" r="3.6"/><circle cx="-4" cy="8" r="3.6"/><circle cx="3" cy="8" r="3.6"/></g><circle cx="-2" cy="0" r="1" fill="#7a5a8c"/><circle cx="4" cy="-5" r="1" fill="#7a5a8c"/>',
  w_fern: '<path d="M0 17 C -2 7 2 -5 0 -16" stroke="#3f7d4a" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M0 11 C -5 10 -8 7 -9 4 M0 11 C 5 10 8 7 9 4 M0 5 C -5 4 -8 1 -9 -2 M0 5 C 5 4 8 1 9 -2 M0 -1 C -4 -2 -6 -4 -7 -7 M0 -1 C 4 -2 6 -4 7 -7 M0 -7 C -3 -8 -4 -10 -5 -12 M0 -7 C 3 -8 4 -10 5 -12" stroke="#5aa85f" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M0 -16 C 2 -17 3 -16 3 -14" stroke="#5aa85f" stroke-width="2" fill="none" stroke-linecap="round"/>',
  w_cone: '<ellipse cy="3" rx="9" ry="13" fill="#8a5a2e" stroke="#6f4a24" stroke-width="1.2"/><path d="M-5 -8 C -2 -6 2 -6 5 -8 M-8 -3 C -4 0 4 0 8 -3 M-9 3 C -4 6 4 6 9 3 M-8 9 C -4 12 4 12 8 9" stroke="#5a3a1c" stroke-width="1.5" fill="none"/><path d="M0 -14 C -1 -16 -3 -17 -5 -17" stroke="#4e7d3c" stroke-width="2" fill="none" stroke-linecap="round"/>',
  w_wpecker: '<rect x="4" y="-19" width="10" height="38" rx="3" fill="#a07a4a" stroke="#7a5a32" stroke-width="1.2"/><path d="M7 -12 C 9 -11 9 -9 7 -8 M10 2 C 12 3 12 5 10 6" stroke="#7a5a32" stroke-width="1.2" fill="none"/><ellipse cx="-4" cy="3" rx="8" ry="6.5" fill="#3a3a35" transform="rotate(-18 -4 3)"/><ellipse cx="-7" cy="6" rx="4.5" ry="3" fill="#f4eedd" transform="rotate(-18 -7 6)"/><path d="M-9 1 L-2 5" stroke="#f4eedd" stroke-width="2" stroke-linecap="round"/><circle cx="-7" cy="-6" r="4.5" fill="#3a3a35"/><path d="M-11 -8 A 4.5 4.5 0 0 1 -3 -8 Z" fill="#d8402c"/><circle cx="-6" cy="-7" r="1.1" fill="#fff"/><path d="M-3 -6 L4 -5 L-3 -3.5 Z" fill="#5a4a2f"/><path d="M-6 9 L2 11" stroke="#5a4a2f" stroke-width="1.5" stroke-linecap="round"/>',
  w_badger: '<circle cx="-10" cy="-9" r="3" fill="#3a3a35"/><circle cx="10" cy="-9" r="3" fill="#3a3a35"/><ellipse rx="13" ry="11" fill="#e8e2d4" stroke="#b8b2a2" stroke-width="1.2"/><path d="M-9 -10 C -5 -4 -5 4 -7 9 C -11 6 -12 -3 -9 -10 Z" fill="#3a3a35"/><path d="M9 -10 C 5 -4 5 4 7 9 C 11 6 12 -3 9 -10 Z" fill="#3a3a35"/><circle cx="-7" cy="-1" r="1.3" fill="#fff"/><circle cx="7" cy="-1" r="1.3" fill="#fff"/><ellipse cy="7" rx="2.6" ry="2" fill="#3a3026"/><path d="M-2 10 Q 0 11 2 10" stroke="#5a544a" stroke-width="1.2" fill="none" stroke-linecap="round"/>',
  w_fawn: '<ellipse cx="-2" cy="7" rx="13" ry="7" fill="#c9874a" stroke="#a3692f" stroke-width="1.2"/><path d="M7 4 C 9 -1 9 -7 10 -10" stroke="#c9874a" stroke-width="6" stroke-linecap="round" fill="none"/><circle cx="10" cy="-12" r="5" fill="#c9874a" stroke="#a3692f" stroke-width="1"/><path d="M6 -15 L3 -20 L8 -17 Z" fill="#c9874a" stroke="#a3692f" stroke-width="1"/><path d="M14 -15 L17 -20 L12 -17 Z" fill="#c9874a" stroke="#a3692f" stroke-width="1"/><circle cx="8.5" cy="-12.5" r="1.6" fill="#3a3026"/><ellipse cx="12" cy="-9.5" rx="1.6" ry="1.2" fill="#3a3026"/><g fill="#f4eedd"><circle cx="-8" cy="4" r="1.2"/><circle cx="-3" cy="3" r="1.2"/><circle cx="-10" cy="8" r="1.2"/><circle cx="-5" cy="7" r="1.1"/><circle cx="0" cy="6" r="1.1"/></g><path d="M-9 13 C -5 14.5 1 14.5 5 13" stroke="#a3692f" stroke-width="1.2" fill="none"/>',
  w_otter: '<path d="M-22 9 Q -12 6 -2 9 T 18 9 T 26 9" stroke="#84aece" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="1" cy="2" rx="13" ry="6.5" fill="#8a5a3c" stroke="#6f4a2e" stroke-width="1.2"/><ellipse cx="1" cy="0.5" rx="9" ry="4" fill="#c9a06a"/><path d="M13 4 C 19 4 21 7 21 10" stroke="#8a5a3c" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="-13" cy="-4" r="5.5" fill="#8a5a3c" stroke="#6f4a2e" stroke-width="1"/><circle cx="-17" cy="-8" r="1.8" fill="#8a5a3c"/><circle cx="-9" cy="-8" r="1.8" fill="#8a5a3c"/><ellipse cx="-14" cy="-2" rx="3" ry="2.2" fill="#c9a06a"/><circle cx="-15" cy="-6" r="1.2" fill="#3a3026"/><circle cx="-11" cy="-6" r="1.2" fill="#3a3026"/><ellipse cx="-14" cy="-3.5" rx="1.3" ry="1" fill="#3a3026"/><circle cx="-1" cy="-3" r="2.6" fill="#b8b2a6" stroke="#948e82" stroke-width="0.8"/><path d="M-5 -1 L-2 -4 M3 -1 L0 -4" stroke="#6f4a2e" stroke-width="2" stroke-linecap="round"/>',
  w_oak: '<path d="M-4 19 C -3 9 -5 3 -6 -2 L6 -2 C 5 3 3 9 4 19 Z" fill="#8a5a2e" stroke="#6f4a24" stroke-width="1.2"/><circle cx="-10" cy="-8" r="8" fill="#5d9148"/><circle cx="10" cy="-8" r="8" fill="#5d9148"/><circle cx="0" cy="-14" r="9" fill="#6aa84f"/><circle cx="0" cy="-6" r="8" fill="#6aa84f"/><circle cx="-2" cy="4" r="1" fill="#3a3026"/><circle cx="2" cy="4" r="1" fill="#3a3026"/><path d="M-2 8 Q 0 9.5 2 8" stroke="#3a3026" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M-10 19 L14 19" stroke="#4e7d3c" stroke-width="1.5" stroke-linecap="round"/>',
  d_print: '<ellipse cy="2" rx="14" ry="12" fill="#c9b08a" stroke="#a8906a" stroke-width="1.5"/><g fill="#7a5e42"><ellipse cx="0" cy="5" rx="5" ry="4.5"/><ellipse cx="-6.5" cy="-3" rx="2.4" ry="4.2" transform="rotate(22 -6.5 -3)"/><ellipse cx="0" cy="-5" rx="2.4" ry="4.6"/><ellipse cx="6.5" cy="-3" rx="2.4" ry="4.2" transform="rotate(-22 6.5 -3)"/></g>',
  d_fossil: '<circle r="13" fill="#d8cdb4" stroke="#b8ad94" stroke-width="1.5"/><path d="M0 0 C 4 0 6 3 5 6 C 3 10 -3 10 -6 6 C -9 1 -6 -6 0 -8 C 8 -10 13 -3 11 5" stroke="#8a7a5e" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M-6 0 L-9 0 M-3 -7 L-5 -9 M4 -8 L5 -11 M10 -2 L13 -3" stroke="#8a7a5e" stroke-width="1.2" stroke-linecap="round"/>',
  d_tric: '<path d="M0 -16 C 12 -16 18 -6 16 4 L-16 4 C -18 -6 -12 -16 0 -16 Z" fill="#7fa86a" stroke="#5d8148" stroke-width="1.5"/><path d="M-7 -12 L-10 -20 L-3 -14 Z" fill="#f4eedd" stroke="#d8cdb4" stroke-width="1"/><path d="M7 -12 L10 -20 L3 -14 Z" fill="#f4eedd" stroke="#d8cdb4" stroke-width="1"/><ellipse cy="5" rx="10" ry="8.5" fill="#9cc488" stroke="#6d9458" stroke-width="1.2"/><path d="M-1.8 0 L0 -7 L1.8 0 Z" fill="#f4eedd" stroke="#d8cdb4" stroke-width="1"/><circle cx="-4.5" cy="3" r="1.5" fill="#3a3026"/><circle cx="4.5" cy="3" r="1.5" fill="#3a3026"/><path d="M-3 9 Q 0 11 3 9" stroke="#3a5a2c" stroke-width="1.4" fill="none" stroke-linecap="round"/>',
  d_steg: '<g fill="#e8923a" stroke="#c4702a" stroke-width="1"><path d="M-13 -3 L-10 -12 L-6 -3 Z"/><path d="M-5 -5 L-1 -15 L3 -5 Z"/><path d="M4 -4 L8 -12 L11 -4 Z"/></g><path d="M-19 3 C -15 -3 -6 -6 2 -5 C 10 -4 16 0 17 5 C 12 10 -8 11 -15 8 C -17 7 -19 5 -19 3 Z" fill="#7fa86a" stroke="#5d8148" stroke-width="1.2"/><circle cx="-17" cy="0" r="4.2" fill="#9cc488" stroke="#6d9458" stroke-width="1"/><circle cx="-18" cy="-1" r="1.2" fill="#3a3026"/><path d="M17 5 L23 1 M17 7 L24 6" stroke="#c4702a" stroke-width="2" stroke-linecap="round"/><path d="M-8 10 L-8 15 M0 11 L0 16 M8 10 L8 15" stroke="#5d8148" stroke-width="3" stroke-linecap="round"/>',
  d_dipl: '<ellipse cx="5" cy="6" rx="11" ry="6.5" fill="#84aece" stroke="#5d87a8" stroke-width="1.2"/><path d="M-4 4 C -8 0 -10 -7 -12 -12" stroke="#84aece" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="-13" cy="-14" r="3.4" fill="#84aece" stroke="#5d87a8" stroke-width="1"/><circle cx="-14" cy="-15" r="1" fill="#2c3a4a"/><path d="M-16 -13 Q -15 -12 -13.5 -12" stroke="#3d5a73" stroke-width="1" fill="none" stroke-linecap="round"/><path d="M15 8 C 20 8 23 11 24 13" stroke="#84aece" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M0 12 L0 17 M9 12 L9 17" stroke="#5d87a8" stroke-width="3.5" stroke-linecap="round"/>',
  d_ptero: '<path d="M-2 1 L-24 -9 C -15 -2 -10 3 -7 8 Z" fill="#d8a86c" stroke="#b08850" stroke-width="1.2" stroke-linejoin="round"/><path d="M2 1 L24 -9 C 15 -2 10 3 7 8 Z" fill="#d8a86c" stroke="#b08850" stroke-width="1.2" stroke-linejoin="round"/><ellipse cy="5" rx="4" ry="6.5" fill="#e8c08a" stroke="#b08850" stroke-width="1"/><circle cy="-4" r="3.6" fill="#e8c08a" stroke="#b08850" stroke-width="1"/><path d="M2 -7 L9 -13 L3 -3 Z" fill="#d8642c"/><path d="M-3 -5 L-11 -3 L-3 -1.5 Z" fill="#e8923a"/><circle cx="-1" cy="-5" r="1" fill="#3a3026"/>',
  d_baby: '<path d="M-10 1 C -10 12 10 12 10 1 L7 -1 L4.5 2 L1.5 -1 L-1.5 2 L-4.5 -1 L-7 2 Z" fill="#f4eedd" stroke="#d8cdb4" stroke-width="1.2" stroke-linejoin="round"/><circle cy="-6" r="6.5" fill="#9cc488" stroke="#6d9458" stroke-width="1.2"/><circle cx="-2.5" cy="-7" r="1.4" fill="#3a3026"/><circle cx="2.5" cy="-7" r="1.4" fill="#3a3026"/><path d="M-2 -3.5 Q 0 -2 2 -3.5" stroke="#3a5a2c" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M-4 -12 L0 -14.5 L4 -12 L0 -10 Z" fill="#f4eedd" stroke="#d8cdb4" stroke-width="1"/>',
  d_trex: '<path d="M11 6 C 17 5 21 8 23 11" stroke="#7fa86a" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M3 -6 C 10 -4 13 2 12 8 C 10 13 2 15 -3 13 C 2 8 3 2 1 -3 Z" fill="#7fa86a" stroke="#5d8148" stroke-width="1.2"/><path d="M-16 -8 C -16 -15 -5 -17 1 -13 C 5 -10 5 -5 3 -3 C -1 0 -10 0 -14 -2 Z" fill="#7fa86a" stroke="#5d8148" stroke-width="1.2"/><path d="M-15 -3.5 C -10 -1.5 -4 -1.5 1 -3.5" stroke="#3a5a2c" stroke-width="1.2" fill="none"/><path d="M-12 -3 L-11 -1 L-10 -3.2 M-7 -2.5 L-6 -0.8 L-5 -2.7" stroke="#fff" stroke-width="1.3" fill="none" stroke-linejoin="round"/><circle cx="-9" cy="-9" r="1.7" fill="#3a3026"/><path d="M5 1 L2 4 M7 4 L4 6" stroke="#5d8148" stroke-width="2" stroke-linecap="round"/><path d="M3 14 L3 18 M9 12 L10 17" stroke="#5d8148" stroke-width="3.5" stroke-linecap="round"/>',
  d_mammoth: '<ellipse cx="3" cy="0" rx="13" ry="10" fill="#a3692f" stroke="#7a4e22" stroke-width="1.2"/><path d="M-3 -9 C -1 -11 1 -11 3 -9 M6 -8 C 8 -10 10 -10 12 -8 M0 -4 C 2 -6 4 -6 6 -4" stroke="#7a4e22" stroke-width="1.2" fill="none" stroke-linecap="round"/><circle cx="-10" cy="-4" r="6.5" fill="#a3692f" stroke="#7a4e22" stroke-width="1"/><path d="M-15 0 C -19 4 -20 9 -17 13" stroke="#a3692f" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M-12 2 C -17 5 -22 4 -24 0" stroke="#f4eedd" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="-11" cy="-6" r="1.3" fill="#3a3026"/><path d="M-3 9 L-3 15 M7 9 L7 15" stroke="#7a4e22" stroke-width="4" stroke-linecap="round"/>',
  d_volcano: '<circle cx="1" cy="-17" r="4.5" fill="#cfc9bd" opacity="0.85"/><circle cx="7" cy="-20" r="3.2" fill="#dcd6ca" opacity="0.75"/><circle cx="-5" cy="-20" r="2.6" fill="#dcd6ca" opacity="0.7"/><path d="M-6 -10 L-16 15 L16 15 L6 -10 Z" fill="#8a6a4a" stroke="#6f4e30" stroke-width="1.5" stroke-linejoin="round"/><path d="M-6 -10 C -3 -8 3 -8 6 -10 L4 -3 L1 -7 L-2 -2 L-4 -7 Z" fill="#e0512f" stroke="#b03226" stroke-width="1"/><path d="M-6 -10 C -8 -2 -7 4 -9 9" stroke="#e0512f" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="10" cy="-13" r="1.2" fill="#f2a13a"/><circle cx="-9" cy="-14" r="1" fill="#f2a13a"/>',
  t_legend: '<g transform="translate(0 2) scale(0.72)"><g transform="scale(-1 1)"><path d="' + FW + '" fill="#f7d154" stroke="#d9a93a" stroke-width="1.5"/><path d="' + HW + '" fill="#e8b73a" stroke="#d9a93a" stroke-width="1.5" opacity="0.9"/></g><path d="' + FW + '" fill="#f7d154" stroke="#d9a93a" stroke-width="1.5"/><path d="' + HW + '" fill="#e8b73a" stroke="#d9a93a" stroke-width="1.5" opacity="0.9"/><ellipse rx="2.5" ry="10" fill="#a87b1a"/><circle cy="-12" r="2.6" fill="#a87b1a"/><path d="M-1 -13 C -4 -18 -6 -20 -8 -21 M1 -13 C 4 -18 6 -20 8 -21" stroke="#a87b1a" stroke-width="1" fill="none"/></g><circle cx="-19" cy="-12" r="1.4" fill="#f2c84b"/><circle cx="20" cy="-8" r="1.2" fill="#f2c84b"/><circle cx="15" cy="14" r="1.3" fill="#f2c84b"/><circle cx="-16" cy="11" r="1.1" fill="#f2c84b"/>'
};
function treasureSVG(t) {
  return '<g class="treasure">' + (TREASURE_DRAW[t.id] || "") + '</g>';
}
function anyCardSVG(id, sil) {
  if (SP[id]) return cardSVG(SP[id], sil);
  return '<svg viewBox="-28 -28 56 56"' + (sil ? ' class="silh"' : "") + '>' + treasureSVG(TR[id]) + '</svg>';
}
function collComplete(cid) {
  if (cid === "bfly") return SPECIES.every(sp => S.caught[sp.id] > 0);
  return TREASURES.filter(t => t.coll === cid).every(t => S.caught[t.id] > 0);
}
function activeColl() {
  if (!collComplete("bfly")) return "bfly";
  if (!collComplete("sky")) return "sky";
  if (!collComplete("magic")) return "magic";
  if (!collComplete("sea")) return "sea";
  if (!collComplete("wood")) return "wood";
  if (!collComplete("dino")) return "dino";
  return "bfly"; // everything found: the meadow keeps filling with old friends
}
// the next common treasure waiting to be discovered, in album order
function nextTreasure(coll) {
  return TREASURES.find(t => t.coll === coll && t.t === "c" && !(S.caught[t.id] > 0)) || null;
}

