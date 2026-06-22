import React, { useState } from "react";

// Neutral dark UI — color lives ONLY on flags
const C = {
  bg: "#0B0E0F",
  surface: "#16191A",
  surfaceRaised: "#1E2223",
  border: "#2F3435",
  signal: "#5BA878",      // muted, accessible green (toned down from neon)
  signalDeep: "#3D7D55",  // deeper green for fills behind dark text
  gold: "#E0BC5A",        // slightly brighter gold for contrast on dark
  food: "#E8915B",        // warm paprika/terracotta accent for dish names
  white: "#F4F6F5",
  muted: "#A8B0AE",       // brighter than before for readability (was #8A9290)
  mutedDark: "#7B8482",   // brighter than before (was #5C6361)
  live: "#FF6B6B",
};

// ISO 3166-1 alpha-2 codes per team, used to load flat circular flags from flagcdn.
const FLAG_ISO = {
  Mexico: "mx", "South Africa": "za", "South Korea": "kr", Czechia: "cz",
  Canada: "ca", "Bosnia and Herzegovina": "ba", Qatar: "qa", Switzerland: "ch",
  Brazil: "br", Morocco: "ma", Haiti: "ht",
  "United States": "us", Paraguay: "py", Australia: "au", Turkiye: "tr",
  Germany: "de", Curacao: "cw", "Ivory Coast": "ci", Ecuador: "ec",
  Netherlands: "nl", Japan: "jp", Sweden: "se", Tunisia: "tn",
  Belgium: "be", Egypt: "eg", Iran: "ir", "New Zealand": "nz",
  Spain: "es", "Cape Verde": "cv", "Saudi Arabia": "sa", Uruguay: "uy",
  France: "fr", Senegal: "sn", Iraq: "iq", Norway: "no",
  Argentina: "ar", Algeria: "dz", Austria: "at", Jordan: "jo",
  Portugal: "pt", "DR Congo": "cd", Uzbekistan: "uz", Colombia: "co",
  Croatia: "hr", Ghana: "gh", Panama: "pa",
  // Scotland and England have no ISO country code — flagcdn serves them under gb-sct / gb-eng
  Scotland: "gb-sct", England: "gb-eng",
};

const FLAG_SVG = {
  "Netherlands": '<rect width="60" height="20" y="0" fill="#AE1C28"/><rect width="60" height="20" y="20" fill="#FFFFFF"/><rect width="60" height="20" y="40" fill="#21468B"/>',
  "France": '<rect width="20" height="60" x="0" fill="#0055A4"/><rect width="20" height="60" x="20" fill="#FFFFFF"/><rect width="20" height="60" x="40" fill="#EF4135"/>',
  "Belgium": '<rect width="20" height="60" x="0" fill="#000000"/><rect width="20" height="60" x="20" fill="#FAE042"/><rect width="20" height="60" x="40" fill="#ED2939"/>',
  "Ivory Coast": '<rect width="20" height="60" x="0" fill="#FF8200"/><rect width="20" height="60" x="20" fill="#FFFFFF"/><rect width="20" height="60" x="40" fill="#009A44"/>',
  "Ireland": '<rect width="20" height="60" x="0" fill="#169B62"/><rect width="20" height="60" x="20" fill="#FFFFFF"/><rect width="20" height="60" x="40" fill="#FF883E"/>',
  "Germany": '<rect width="60" height="20" y="0" fill="#000000"/><rect width="60" height="20" y="20" fill="#DD0000"/><rect width="60" height="20" y="40" fill="#FFCE00"/>',
  "Austria": '<rect width="60" height="20" y="0" fill="#ED2939"/><rect width="60" height="20" y="20" fill="#FFFFFF"/><rect width="60" height="20" y="40" fill="#ED2939"/>',
  "Egypt": '<rect width="60" height="20" y="0" fill="#CE1126"/><rect width="60" height="20" y="20" fill="#FFFFFF"/><rect width="60" height="20" y="40" fill="#000000"/>',
  "Iraq": '<rect width="60" height="20" y="0" fill="#CE1126"/><rect width="60" height="20" y="20" fill="#FFFFFF"/><rect width="60" height="20" y="40" fill="#000000"/>',
  "Bulgaria": '<rect width="60" height="20" y="0" fill="#FFFFFF"/><rect width="60" height="20" y="20" fill="#00966E"/><rect width="60" height="20" y="40" fill="#D62612"/>',
  "Mexico": '<rect width="20" height="60" x="0" fill="#006847"/><rect width="20" height="60" x="20" fill="#FFFFFF"/><rect width="20" height="60" x="40" fill="#CE1126"/><circle cx="30" cy="30" r="5" fill="#8B5A2B"/>',
  "South Korea": '<rect width="60" height="60" fill="#FFFFFF"/><g transform="rotate(-33.69 30 30)"><circle cx="30" cy="30" r="11" fill="#CD2E3A"/><path d="M30 19 a11 11 0 0 1 0 22 a5.5 5.5 0 0 1 0 -11 a5.5 5.5 0 0 0 0 -11" fill="#0047A0"/></g><g fill="#000000"><g transform="rotate(33.69 30 30)"><rect x="8" y="28.2" width="9" height="1.4"/><rect x="8" y="30.4" width="9" height="1.4"/><rect x="43" y="28.2" width="9" height="1.4"/><rect x="43" y="30.4" width="9" height="1.4"/></g></g>',
  "Czechia": '<rect width="60" height="30" y="0" fill="#FFFFFF"/><rect width="60" height="30" y="30" fill="#D7141A"/><path d="M0 0 L30 30 L0 60 Z" fill="#11457E"/>',
  "Canada": '<rect width="15" height="60" x="0" fill="#FF0000"/><rect width="30" height="60" x="15" fill="#FFFFFF"/><rect width="15" height="60" x="45" fill="#FF0000"/><path d="M30 20 l2 6 l6 -2 l-3 6 l5 3 l-6 1 l1 6 l-5 -4 l-5 4 l1 -6 l-6 -1 l5 -3 l-3 -6 l6 2 z" fill="#FF0000"/>',
  "Switzerland": '<rect width="60" height="60" fill="#D52B1E"/><rect x="26" y="14" width="8" height="32" fill="#FFFFFF"/><rect x="14" y="26" width="32" height="8" fill="#FFFFFF"/>',
  "Brazil": '<rect width="60" height="60" fill="#009C3B"/><path d="M30 8 L54 30 L30 52 L6 30 Z" fill="#FFDF00"/><circle cx="30" cy="30" r="10" fill="#002776"/>',
  "Morocco": '<rect width="60" height="60" fill="#C1272D"/><path d="M30 20 l3 9 h9 l-7 6 l3 9 l-8 -6 l-8 6 l3 -9 l-7 -6 h9 z" fill="none" stroke="#006233" stroke-width="1.5"/>',
  "Haiti": '<rect width="60" height="30" y="0" fill="#00209F"/><rect width="60" height="30" y="30" fill="#D21034"/><rect x="22" y="22" width="16" height="16" fill="#FFFFFF"/>',
  "South Africa": '<rect width="60" height="60" fill="#FFFFFF"/><path d="M0 0 H60 V20 H20 Z" fill="#DE3831"/><path d="M0 60 H60 V40 H20 Z" fill="#002395"/><path d="M0 12 L24 30 L0 48 Z" fill="#007A4D"/><path d="M0 18 L18 30 L0 42 Z" fill="#FFB915"/><path d="M0 22 L12 30 L0 38 Z" fill="#000000"/>',
  "United States": '<rect width="60" height="60" fill="#FFFFFF"/><rect width="60" height="4.6" y="0.0" fill="#B22234"/><rect width="60" height="4.6" y="9.2" fill="#B22234"/><rect width="60" height="4.6" y="18.4" fill="#B22234"/><rect width="60" height="4.6" y="27.599999999999998" fill="#B22234"/><rect width="60" height="4.6" y="36.8" fill="#B22234"/><rect width="60" height="4.6" y="46.0" fill="#B22234"/><rect width="60" height="4.6" y="55.199999999999996" fill="#B22234"/><rect width="28" height="32" fill="#3C3B6E"/>',
  "Paraguay": '<rect width="60" height="20" y="0" fill="#D52B1E"/><rect width="60" height="20" y="20" fill="#FFFFFF"/><rect width="60" height="20" y="40" fill="#0038A8"/>',
  "Australia": '<rect width="60" height="60" fill="#00008B"/><rect width="30" height="30" fill="#012169"/><path d="M0 0 L30 30 M30 0 L0 30" stroke="#FFFFFF" stroke-width="6"/><path d="M0 0 L30 30 M30 0 L0 30" stroke="#E4002B" stroke-width="3"/><path d="M15 2 v26 M2 15 h26" stroke="#FFFFFF" stroke-width="7"/><path d="M15 2 v26 M2 15 h26" stroke="#E4002B" stroke-width="4"/><circle cx="45" cy="45" r="3" fill="#FFFFFF"/>',
  "Turkiye": '<rect width="60" height="60" fill="#E30A17"/><circle cx="26" cy="30" r="11" fill="#FFFFFF"/><circle cx="30" cy="30" r="9" fill="#E30A17"/><path d="M40 30 l-6 -2 l4 5 l0 -6 l-4 5 z" fill="#FFFFFF"/>',
  "Curacao": '<rect width="60" height="60" fill="#002B7F"/><rect width="60" height="8" y="42" fill="#F9E814"/><path d="M14 16 l2 5 h5 l-4 3 l2 5 l-5 -3 l-5 3 l2 -5 l-4 -3 h5 z" fill="#FFFFFF"/>',
  "Ecuador": '<rect width="60" height="30" y="0" fill="#FFDD00"/><rect width="60" height="15" y="30" fill="#034EA2"/><rect width="60" height="15" y="45" fill="#ED1C24"/><circle cx="30" cy="30" r="5" fill="#8B7500"/>',
  "Japan": '<rect width="60" height="60" fill="#FFFFFF"/><circle cx="30" cy="30" r="12" fill="#BC002D"/>',
  "Sweden": '<rect width="60" height="60" fill="#006AA7"/><rect x="18" y="0" width="8" height="60" fill="#FECC00"/><rect x="0" y="26" width="60" height="8" fill="#FECC00"/>',
  "Tunisia": '<rect width="60" height="60" fill="#E70013"/><circle cx="30" cy="30" r="12" fill="#FFFFFF"/><circle cx="32" cy="30" r="9" fill="#E70013"/><circle cx="35" cy="30" r="7" fill="#FFFFFF"/><circle cx="37" cy="30" r="5.5" fill="#E70013"/>',
  "Iran": '<rect width="60" height="20" y="0" fill="#239F40"/><rect width="60" height="20" y="20" fill="#FFFFFF"/><rect width="60" height="20" y="40" fill="#DA0000"/>',
  "New Zealand": '<rect width="60" height="60" fill="#00247D"/><path d="M0 0 L30 30 M30 0 L0 30" stroke="#FFFFFF" stroke-width="6"/><path d="M0 0 L30 30 M30 0 L0 30" stroke="#CC142B" stroke-width="3"/><path d="M15 2 v26 M2 15 h26" stroke="#FFFFFF" stroke-width="7"/><path d="M15 2 v26 M2 15 h26" stroke="#CC142B" stroke-width="4"/><circle cx="46" cy="20" r="2.5" fill="#CC142B"/><circle cx="50" cy="38" r="2.5" fill="#CC142B"/>',
  "Spain": '<rect width="60" height="60" fill="#AA151B"/><rect width="60" height="30" y="15" fill="#F1BF00"/>',
  "Cape Verde": '<rect width="60" height="60" fill="#003893"/><rect width="60" height="6" y="30" fill="#FFFFFF"/><rect width="60" height="4" y="36" fill="#CF2027"/><rect width="60" height="6" y="40" fill="#FFFFFF"/><circle cx="22" cy="35" r="3" fill="#F7D116"/>',
  "Saudi Arabia": '<rect width="60" height="60" fill="#006C35"/><rect x="12" y="34" width="36" height="3" fill="#FFFFFF"/><rect x="12" y="24" width="28" height="5" fill="#FFFFFF" rx="1"/>',
  "Uruguay": '<rect width="60" height="60" fill="#FFFFFF"/><rect width="60" height="6.6" y="13.3" fill="#0038A8"/><rect width="60" height="6.6" y="26.6" fill="#0038A8"/><rect width="60" height="6.6" y="39.900000000000006" fill="#0038A8"/><rect width="60" height="6.6" y="53.2" fill="#0038A8"/><rect width="30" height="33" fill="#FFFFFF"/><circle cx="15" cy="16" r="6" fill="#FCD116"/>',
  "Senegal": '<rect width="20" height="60" x="0" fill="#00853F"/><rect width="20" height="60" x="20" fill="#FDEF42"/><rect width="20" height="60" x="40" fill="#E31B23"/><path d="M30 22 l2 6 h6 l-5 4 l2 6 l-5 -4 l-5 4 l2 -6 l-5 -4 h6 z" fill="#00853F"/>',
  "Norway": '<rect width="60" height="60" fill="#BA0C2F"/><rect x="16" y="0" width="10" height="60" fill="#FFFFFF"/><rect x="0" y="25" width="60" height="10" fill="#FFFFFF"/><rect x="19" y="0" width="4" height="60" fill="#00205B"/><rect x="0" y="28" width="60" height="4" fill="#00205B"/>',
  "Argentina": '<rect width="60" height="20" y="0" fill="#74ACDF"/><rect width="60" height="20" y="20" fill="#FFFFFF"/><rect width="60" height="20" y="40" fill="#74ACDF"/><circle cx="30" cy="30" r="4" fill="#F6B40E"/>',
  "Algeria": '<rect width="30" height="60" x="0" fill="#006233"/><rect width="30" height="60" x="30" fill="#FFFFFF"/><circle cx="28" cy="30" r="9" fill="#D21034"/><circle cx="31" cy="30" r="7.5" fill="#FFFFFF"/><path d="M40 30 l-6 -2 l4 5 l0 -6 l-4 5 z" fill="#D21034"/>',
  "Jordan": '<rect width="60" height="20" y="0" fill="#000000"/><rect width="60" height="20" y="20" fill="#FFFFFF"/><rect width="60" height="20" y="40" fill="#007A3D"/><path d="M0 0 L24 30 L0 60 Z" fill="#CE1126"/>',
  "Portugal": '<rect width="24" height="60" x="0" fill="#006600"/><rect width="36" height="60" x="24" fill="#FF0000"/><circle cx="24" cy="30" r="6" fill="#FFFF00"/><circle cx="24" cy="30" r="4" fill="#FF0000"/>',
  "DR Congo": '<rect width="60" height="60" fill="#007FFF"/><path d="M0 50 L50 0 H60 V10 L10 60 H0 Z" fill="#F7D618"/><path d="M0 48 L48 0 H52 L0 52 Z" fill="#CE1021"/><path d="M10 8 l2 5 h5 l-4 3 l1.5 5 l-4.5 -3 l-4.5 3 l1.5 -5 l-4 -3 h5 z" fill="#F7D618"/>',
  "Colombia": '<rect width="60" height="30" y="0" fill="#FCD116"/><rect width="60" height="15" y="30" fill="#003893"/><rect width="60" height="15" y="45" fill="#CE1126"/>',
  "Croatia": '<rect width="60" height="20" y="0" fill="#FF0000"/><rect width="60" height="20" y="20" fill="#FFFFFF"/><rect width="60" height="20" y="40" fill="#171796"/><rect x="24" y="22" width="12" height="12" fill="#FF0000"/>',
  "Ghana": '<rect width="60" height="20" y="0" fill="#CE1126"/><rect width="60" height="20" y="20" fill="#FCD116"/><rect width="60" height="20" y="40" fill="#006B3F"/><path d="M30 24 l2 6 h6 l-5 4 l2 6 l-5 -4 l-5 4 l2 -6 l-5 -4 h6 z" fill="#000000"/>',
  "Panama": '<rect width="60" height="60" fill="#FFFFFF"/><rect width="30" height="30" x="0" y="0" fill="#FFFFFF"/><rect width="30" height="30" x="30" y="0" fill="#DA121A"/><rect width="30" height="30" x="0" y="30" fill="#072357"/><rect width="30" height="30" x="30" y="30" fill="#FFFFFF"/><path d="M15 8 l2 5 h5 l-4 3 l1.5 5 l-4.5 -3 l-4.5 3 l1.5 -5 l-4 -3 h5 z" fill="#072357"/><path d="M45 38 l2 5 h5 l-4 3 l1.5 5 l-4.5 -3 l-4.5 3 l1.5 -5 l-4 -3 h5 z" fill="#DA121A"/>',
  "Bosnia and Herzegovina": '<rect width="60" height="60" fill="#002395"/><path d="M20 5 L40 5 L20 55 Z" fill="#FECB00"/><path d="M28 8 l1 3 l3 0 l-2.5 2 l1 3 l-2.5 -2 l-2.5 2 l1 -3 l-2.5 -2 l3 0 z" fill="#FFFFFF"/><path d="M32 13 l1 3 l3 0 l-2.5 2 l1 3 l-2.5 -2 l-2.5 2 l1 -3 l-2.5 -2 l3 0 z" fill="#FFFFFF"/><path d="M36 18 l1 3 l3 0 l-2.5 2 l1 3 l-2.5 -2 l-2.5 2 l1 -3 l-2.5 -2 l3 0 z" fill="#FFFFFF"/><path d="M40 23 l1 3 l3 0 l-2.5 2 l1 3 l-2.5 -2 l-2.5 2 l1 -3 l-2.5 -2 l3 0 z" fill="#FFFFFF"/><path d="M44 28 l1 3 l3 0 l-2.5 2 l1 3 l-2.5 -2 l-2.5 2 l1 -3 l-2.5 -2 l3 0 z" fill="#FFFFFF"/><path d="M48 33 l1 3 l3 0 l-2.5 2 l1 3 l-2.5 -2 l-2.5 2 l1 -3 l-2.5 -2 l3 0 z" fill="#FFFFFF"/>',
  "Qatar": '<rect width="60" height="60" fill="#FFFFFF"/><path d="M22 0 H60 V60 H22 L34 54 L22 48 L34 42 L22 36 L34 30 L22 24 L34 18 L22 12 L34 6 Z" fill="#8A1538"/>',
  "Scotland": '<rect width="60" height="60" fill="#0065BF"/><path d="M0 0 L60 60 M60 0 L0 60" stroke="#FFFFFF" stroke-width="8"/>',
  "England": '<rect width="60" height="60" fill="#FFFFFF"/><rect x="25" y="0" width="10" height="60" fill="#CE1124"/><rect x="0" y="25" width="60" height="10" fill="#CE1124"/>',
  "Uzbekistan": '<rect width="60" height="20" y="0" fill="#1EB53A"/><rect width="60" height="20" y="20" fill="#FFFFFF"/><rect width="60" height="20" y="40" fill="#0099B5"/><rect width="60" height="2" y="19" fill="#CE1126"/><rect width="60" height="2" y="39" fill="#CE1126"/>',
};

function flagSvg(team) {
  return FLAG_SVG[team] || null;
}

// Full confirmed 48-team, 12-group roster from FIFA's official draw
const GROUPS_FULL = {
  A: ["Mexico", "South Africa", "South Korea", "Czechia"],
  B: ["Canada", "Bosnia and Herzegovina", "Qatar", "Switzerland"],
  C: ["Brazil", "Morocco", "Haiti", "Scotland"],
  D: ["United States", "Paraguay", "Australia", "Turkiye"],
  E: ["Germany", "Curacao", "Ivory Coast", "Ecuador"],
  F: ["Netherlands", "Japan", "Sweden", "Tunisia"],
  G: ["Belgium", "Egypt", "Iran", "New Zealand"],
  H: ["Spain", "Cape Verde", "Saudi Arabia", "Uruguay"],
  I: ["France", "Senegal", "Iraq", "Norway"],
  J: ["Argentina", "Algeria", "Austria", "Jordan"],
  K: ["Portugal", "DR Congo", "Uzbekistan", "Colombia"],
  L: ["England", "Croatia", "Ghana", "Panama"],
};


const KICK_TIMES = ["12:00pm EST", "2:00pm EST", "5:00pm EST", "8:00pm EST"];

// The 3 round-robin "rounds" for a 4-team group: each round has 2 games,
// pairing indices so every team plays once per round.
const ROUND_PAIRS = [
  [[0, 1], [2, 3]],
  [[0, 2], [1, 3]],
  [[0, 3], [1, 2]],
];

// TODAY anchors "played" status and the schedule's today badge.
const TODAY = new Date();

function mdFromDate(dt) { return `${dt.getMonth() + 1}/${dt.getDate()}`; }

// The real group stage starts June 11, 2026. Day 0 of our schedule = that date,
// and games run continuously from there. "Today" is just whichever real date matches.
const SCHEDULE_START = new Date(2026, 5, 11); // June 11, 2026 (month is 0-indexed)

function dateForDayIndex(dayIndex) {
  const dt = new Date(SCHEDULE_START);
  dt.setDate(dt.getDate() + dayIndex);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

// Group stage spans June 11–27 (17 days, day indices 0–16). Three rounds of
// fixtures are spread across that window so games fill the whole period:
//   Round 1 → days 0–5, Round 2 → days 6–11, Round 3 → days 12–16.
// Within a round, the 12 groups are distributed across that round's days.
const ROUND_DAY_RANGES = {
  1: [0, 1, 2, 3, 4, 5],
  2: [6, 7, 8, 9, 10, 11],
  3: [12, 13, 14, 15, 16],
};

// Build the group-stage schedule, spread across the full 6/11–6/27 window.
function buildSchedule() {
  const groupIds = Object.keys(GROUPS_FULL);
  const games = [];
  groupIds.forEach((gid, gIndex) => {
    const teams = GROUPS_FULL[gid];
    ROUND_PAIRS.forEach((pairs, roundIdx) => {
      const round = roundIdx + 1;
      const days = ROUND_DAY_RANGES[round];
      // Distribute the 12 groups evenly across this round's available days
      const dayIndex = days[Math.floor(gIndex * days.length / groupIds.length)];
      const dt = dateForDayIndex(dayIndex);
      const dateStr = mdFromDate(dt);
      const dayValue = dt.getTime();
      pairs.forEach(([i, j], pairIdx) => {
        const teamA = teams[i];
        const teamB = teams[j];
        const time = KICK_TIMES[(gIndex + pairIdx) % KICK_TIMES.length];
        const sortKey = dayIndex * 1000 + gIndex * 10 + pairIdx;
        games.push({
          id: `${gid.toLowerCase()}-r${round}-${pairIdx}`,
          group: gid,
          round,
          teamA,
          teamB,
          date: dateStr,
          dayValue,
          time,
          sortKey,
          played: dayValue < new Date(TODAY).setHours(0, 0, 0, 0),
        });
      });
    });
  });
  return games.sort((a, b) => a.sortKey - b.sortKey);
}

const SCHEDULE = buildSchedule();

// Weekday name from a stored timestamp.
function weekdayFromValue(ts) {
  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date(ts).getDay()];
}

// Start-of-today timestamp for comparisons.
function startOfToday() {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t.getTime();
}

// True once every group-stage date has passed (so Bracket becomes the default).
function groupStageOver() {
  const last = SCHEDULE.reduce((mx, g) => Math.max(mx, g.dayValue), 0);
  return last < startOfToday();
}

// Group the schedule by date for date-header rendering, preserving order.
function scheduleByDate() {
  const byDate = [];
  const seen = {};
  const today = startOfToday();
  SCHEDULE.forEach((g) => {
    if (!seen[g.date]) {
      seen[g.date] = {
        date: g.date,
        weekday: weekdayFromValue(g.dayValue),
        games: [],
        past: g.dayValue < today,
        isToday: g.dayValue === today,
      };
      byDate.push(seen[g.date]);
    }
    seen[g.date].games.push(g);
  });
  return byDate;
}

// Curated content keyed by "TeamA|TeamB". Falls back to a generic pairing
// generator (still static, no network) for matchups without bespoke content.
const PAIRING_CONTENT = {
  "Mexico|South Korea": {
    menu: {
      bites: [
        {
          name: "Kimchi Quesadillas",
          description: "Crispy tortillas folded over melted Oaxaca cheese and tangy kimchi \u2014 taco night meets Korean fermentation.",
          serves: "Serves 4", time: "15 min",
          ingredients: ["4 flour tortillas", "2 cups shredded Oaxaca or mozzarella", "1 cup chopped kimchi, drained", "2 scallions, sliced", "1 tbsp butter"],
          steps: ["Butter a skillet over medium heat.", "Lay a tortilla down, cover half with cheese, kimchi, and scallions, then fold.", "Cook 2-3 min per side until golden and melty.", "Slice into wedges and serve hot."],
        },
        {
          name: "Bulgogi Street Tacos",
          description: "Marinated Korean bulgogi beef on warm corn tortillas with cilantro, onion, and a gochujang-lime crema.",
          serves: "Serves 4", time: "30 min",
          ingredients: ["1 lb thinly sliced ribeye", "3 tbsp soy sauce", "2 tbsp brown sugar", "1 tbsp sesame oil", "8 corn tortillas", "1/4 cup sour cream + 1 tbsp gochujang + lime"],
          steps: ["Marinate beef in soy, sugar, and sesame oil 20 min.", "Sear in a hot pan 3-4 min until caramelized.", "Stir gochujang and lime into sour cream for the crema.", "Fill warm tortillas with beef, crema, cilantro, and onion."],
        },
        {
          name: "Elote Corn Cheese",
          description: "Mexican street corn meets Korean corn cheese \u2014 charred kernels, mayo, cotija, and a bubbly mozzarella top.",
          serves: "Serves 6", time: "20 min",
          ingredients: ["3 cups corn kernels", "1/4 cup mayo", "1/2 cup shredded mozzarella", "1/4 cup cotija", "1 tsp chili powder", "lime"],
          steps: ["Char corn in a hot dry skillet a few minutes.", "Stir in mayo and mozzarella, spread into an oven dish.", "Broil until the top is bubbly and golden.", "Finish with cotija, chili powder, and a squeeze of lime."],
        },
      ],
      drink: {
        name: "Michelada Soju Spritz",
        description: "A spicy, citrusy michelada base lightened with soju and a chili-salt rim.",
        serves: "Serves 1", time: "5 min",
        ingredients: ["1 oz soju", "Mexican lager", "1 oz lime juice", "dash hot sauce", "Tajin or chili salt for the rim"],
        steps: ["Rim a glass with lime and chili salt.", "Add ice, soju, lime juice, and hot sauce.", "Top with cold lager and stir gently."],
      },
    },
    common: {
      intro: "Mexico and South Korea sit on opposite sides of the planet, yet both built entire cuisines around fermentation, fire, and the comfort of sharing small plates.",
      connections: [
        { title: "Fermentation runs deep", description: "Korea has kimchi; Mexico has its escabeche and fermented salsas and drinks like tepache and pulque. Both cultures treat fermentation as a way to preserve harvests and build bold, sour, funky flavor that defines the national palate." },
        { title: "Heat as a love language", description: "Gochujang and chili paste in Korea, dried chiles and salsas in Mexico \u2014 both cuisines layer chili heat into nearly everything, not to overwhelm but to add depth, warmth, and identity to a dish." },
        { title: "The table is communal", description: "Korean banchan and Mexican botanas share the same spirit: lots of small dishes spread across the table, meant to be picked at slowly while people talk, argue, and linger together for hours." },
      ],
    },
  },
  "Mexico|South Africa": {
    menu: {
      bites: [
        {
          name: "Boerewors Tacos",
          description: "South Africa's coiled boerewors sausage grilled and tucked into warm corn tortillas with a charred tomato salsa.",
          serves: "Serves 4", time: "25 min",
          ingredients: ["1 lb boerewors (or any coarse beef sausage)", "8 corn tortillas", "2 tomatoes, charred and chopped", "1/2 onion, diced", "cilantro", "lime"],
          steps: ["Grill the boerewors whole until browned, 12-15 min.", "Char tomatoes in a dry pan, then chop with onion for salsa.", "Slice sausage into pieces.", "Fill tortillas with sausage, salsa, cilantro, and lime."],
        },
        {
          name: "Chakalaka Nachos",
          description: "South African chakalaka relish spooned over tortilla chips with melted cheese \u2014 spicy, beany, and built for sharing.",
          serves: "Serves 6", time: "20 min",
          ingredients: ["1 bag tortilla chips", "1 can chakalaka (or spiced beans + peppers)", "2 cups shredded cheese", "jalapeños", "sour cream"],
          steps: ["Spread chips on a baking tray.", "Spoon chakalaka over the top, then cover with cheese.", "Broil until cheese bubbles, 3-4 min.", "Finish with jalapeños and sour cream."],
        },
        {
          name: "Malva-Churro Bites",
          description: "Mexican churros paired with South Africa's caramelly malva pudding flavors \u2014 cinnamon sugar meets apricot caramel dip.",
          serves: "Serves 6", time: "30 min",
          ingredients: ["1 cup flour", "1 cup water", "2 tbsp butter", "cinnamon sugar", "1/4 cup apricot jam + 2 tbsp cream for dip"],
          steps: ["Boil water and butter, stir in flour to form a dough.", "Pipe into hot oil and fry until golden.", "Roll in cinnamon sugar.", "Warm jam with cream and serve as a caramel dip."],
        },
      ],
      drink: {
        name: "Rooibos Paloma",
        description: "A grapefruit paloma built on chilled South African rooibos tea instead of soda.",
        serves: "Serves 1", time: "5 min",
        ingredients: ["1 oz tequila", "2 oz chilled rooibos tea", "2 oz grapefruit juice", "lime", "salt rim"],
        steps: ["Salt the rim of a glass.", "Add ice, tequila, rooibos, and grapefruit juice.", "Stir and finish with a lime squeeze."],
      },
    },
    common: {
      intro: "Mexico and South Africa are both nations where open-fire cooking and bold, layered spice turn everyday meals into a gathering.",
      connections: [
        { title: "Fire is the heart of the meal", description: "The South African braai and the Mexican grill are more than cooking methods \u2014 they're social events. In both cultures, gathering around live fire to cook meat is the default way to bring family and friends together on a weekend." },
        { title: "Relishes and salsas everywhere", description: "Chakalaka in South Africa and salsa in Mexico play the same role: a bright, spicy, vegetable-forward condiment that lands on nearly every plate and wakes up whatever it touches." },
        { title: "Maize as a staple", description: "Mexico has masa, tortillas, and tamales; South Africa has pap and mealie. Both built their daily eating on ground maize, shaped into the comforting base that anchors the rest of the meal." },
      ],
    },
  },
  "Czechia|Mexico": {
    menu: {
      bites: [
        {
          name: "Svíčková Tinga Tostadas",
          description: "Mexican tostadas topped with Czech-style braised beef in a creamy root-vegetable sauce, shredded tinga-style.",
          serves: "Serves 4", time: "40 min",
          ingredients: ["1 lb beef chuck", "1 carrot + 1 parsnip, grated", "1/2 cup cream", "8 tostada shells", "1 chipotle in adobo", "pickled onion"],
          steps: ["Braise beef with grated root veg until tender, 30 min.", "Shred beef, stir in cream and minced chipotle.", "Pile onto tostada shells.", "Top with pickled onion."],
        },
        {
          name: "Smažený Sýr Quesadilla",
          description: "A mashup of Czech fried cheese and the quesadilla \u2014 crispy breaded cheese folded into a tortilla with salsa verde.",
          serves: "Serves 4", time: "20 min",
          ingredients: ["4 flour tortillas", "8 oz Edam or gouda, sliced thick", "1 egg", "1 cup breadcrumbs", "salsa verde"],
          steps: ["Bread the cheese slices in egg then breadcrumbs.", "Fry until golden and just melting.", "Tuck inside tortillas with salsa verde and fold.", "Crisp the folded tortilla in the pan briefly."],
        },
        {
          name: "Kolache Conchas",
          description: "Czech kolaches meet Mexican conchas \u2014 sweet buns with a fruit-filled center and a crackly cinnamon top.",
          serves: "Serves 8", time: "45 min",
          ingredients: ["1 tube biscuit dough", "1/4 cup fruit jam", "1/4 cup sugar + 2 tbsp butter + flour for topping", "cinnamon"],
          steps: ["Flatten each biscuit, press a well in the center.", "Spoon jam into the well.", "Mix topping and crumble over each bun.", "Bake at 375°F for 15 min until golden."],
        },
      ],
      drink: {
        name: "Pilsner Michelada",
        description: "A Czech pilsner gives this Mexican michelada a crisp, hoppy backbone.",
        serves: "Serves 1", time: "5 min",
        ingredients: ["1 Czech pilsner", "1 oz lime juice", "dash hot sauce", "dash Worcestershire", "chili salt rim"],
        steps: ["Rim the glass with chili salt.", "Add lime, hot sauce, and Worcestershire over ice.", "Top with cold pilsner."],
      },
    },
    common: {
      intro: "Czechia and Mexico may not share a border or a climate, but both treat hearty comfort food and a cold beer as a way of life.",
      connections: [
        { title: "Serious beer cultures", description: "Czechia drinks more beer per person than any country on earth, and Mexico's lagers travel the globe. In both, beer isn't fancy \u2014 it's the everyday drink that belongs with food, friends, and a match on screen." },
        { title: "Comfort starch on every plate", description: "Czech dumplings (knedlíky) and Mexican tortillas serve the same purpose: a soft, starchy companion that soaks up sauce and makes a meal feel complete and filling." },
        { title: "Sweet baked traditions", description: "The Czech kolache and the Mexican concha both come from deep baking traditions where sweet, soft, lightly enriched breads are a daily pleasure, often shared at the table with coffee." },
      ],
    },
  },
  "South Africa|South Korea": {
    menu: {
      bites: [
        {
          name: "Bunny Chow Bao",
          description: "The flavors of South African bunny chow \u2014 spiced curry \u2014 stuffed into soft Korean-style steamed bao buns.",
          serves: "Serves 4", time: "30 min",
          ingredients: ["8 store-bought bao buns", "1 lb lamb or chicken, cubed", "2 tbsp curry powder", "1 onion", "1 can chopped tomato"],
          steps: ["Cook onion, add meat and curry powder.", "Add tomato and simmer until thick, 20 min.", "Steam the bao buns until fluffy.", "Spoon curry into each bun."],
        },
        {
          name: "Gochujang Boerewors Skewers",
          description: "Grilled South African sausage glazed with Korean gochujang for a sweet-spicy lacquer.",
          serves: "Serves 4", time: "25 min",
          ingredients: ["1 lb boerewors", "2 tbsp gochujang", "1 tbsp honey", "1 tsp sesame oil", "sesame seeds", "skewers"],
          steps: ["Cut sausage into chunks and skewer.", "Mix gochujang, honey, and sesame oil.", "Grill skewers, brushing with glaze, 12 min.", "Finish with sesame seeds."],
        },
        {
          name: "Milk Tart Hotteok",
          description: "Korean sweet pancakes filled with the cinnamon-custard flavor of South African melktert.",
          serves: "Serves 6", time: "30 min",
          ingredients: ["1 pack pancake mix or dough", "1/2 cup custard", "1 tsp cinnamon", "2 tbsp sugar", "butter"],
          steps: ["Form dough into discs, spoon custard into the center.", "Seal into filled rounds.", "Fry in butter until golden on both sides.", "Dust with cinnamon sugar."],
        },
      ],
      drink: {
        name: "Rooibos Soju Cooler",
        description: "Chilled rooibos tea lengthened with soju and a touch of honey.",
        serves: "Serves 1", time: "5 min",
        ingredients: ["1 oz soju", "3 oz chilled rooibos tea", "1 tsp honey", "lemon"],
        steps: ["Stir honey into warm rooibos, then chill.", "Pour over ice with soju.", "Finish with a lemon squeeze."],
      },
    },
    common: {
      intro: "South Africa and South Korea both turn fire, fermentation, and a crowded table into the center of social life.",
      connections: [
        { title: "Grilled meat brings people together", description: "The South African braai and the Korean barbecue are nearly the same ritual at heart: meat cooked over fire, in company, slowly, with everyone gathered around and no rush to finish." },
        { title: "Fermentation for flavor and keeping", description: "Korea's kimchi and South Africa's preserved and pickled sides both come from a tradition of fermenting vegetables to preserve the harvest and add a sharp, lively punch to rich grilled food." },
        { title: "Side dishes make the meal", description: "Korean banchan and the many relishes and sides of a South African spread share a philosophy: the main grilled dish is only half the story, and it's the array of small sides that completes it." },
      ],
    },
  },
  "Czechia|South Africa": {
    menu: {
      bites: [
        {
          name: "Boerewors Klobása Rolls",
          description: "South African boerewors and Czech klobása sausage share a bun with mustard and a quick tomato-chili relish.",
          serves: "Serves 4", time: "20 min",
          ingredients: ["1 lb mixed boerewors and klobása", "4 soft rolls", "mustard", "1 tomato + 1 chili, chopped", "onion"],
          steps: ["Grill both sausages until browned.", "Mix tomato, chili, and onion into a quick relish.", "Slice sausages into rolls.", "Top with mustard and relish."],
        },
        {
          name: "Chakalaka Bramborák",
          description: "Czech potato pancakes topped with spicy South African chakalaka relish.",
          serves: "Serves 6", time: "30 min",
          ingredients: ["3 potatoes, grated", "1 egg", "2 tbsp flour", "1 clove garlic", "1 can chakalaka", "oil"],
          steps: ["Mix grated potato, egg, flour, and garlic.", "Fry spoonfuls into crisp pancakes.", "Warm the chakalaka.", "Spoon relish over each hot pancake."],
        },
        {
          name: "Malva Koláč",
          description: "A Czech koláč pastry filled with the apricot-caramel sweetness of South African malva pudding.",
          serves: "Serves 8", time: "40 min",
          ingredients: ["1 tube biscuit or pastry dough", "1/4 cup apricot jam", "2 tbsp caramel", "powdered sugar"],
          steps: ["Flatten dough rounds and press a well in each.", "Fill with apricot jam and a drizzle of caramel.", "Bake at 375°F for 15 min.", "Dust with powdered sugar."],
        },
      ],
      drink: {
        name: "Pilsner Rooibos Shandy",
        description: "A Czech pilsner cut with sweet rooibos iced tea for an easy shandy.",
        serves: "Serves 1", time: "3 min",
        ingredients: ["6 oz Czech pilsner", "6 oz chilled rooibos tea", "lemon"],
        steps: ["Fill a glass halfway with rooibos tea.", "Top with cold pilsner.", "Add a lemon wedge."],
      },
    },
    common: {
      intro: "Czechia and South Africa both lean on hearty, no-fuss food and a strong beer-and-grill culture to mark good times.",
      connections: [
        { title: "Sausage is a craft", description: "The Czech klobása and the South African boerewors are both points of national pride \u2014 coarse, well-spiced sausages grilled simply and eaten with the hands among friends." },
        { title: "Beer at the center", description: "Czechia practically invented pilsner, and South Africa pairs its braai with cold lager by default. In both, an unpretentious beer is the natural partner to grilled, salty, shareable food." },
        { title: "Potatoes and maize, the humble base", description: "Czech cooking leans on potatoes while South Africa leans on maize, but both fill the plate with a humble, filling starch that stretches a meal and soaks up sauce." },
      ],
    },
  },
  "Czechia|South Korea": {
    menu: {
      bites: [
        {
          name: "Kimchi Bramborák",
          description: "Crispy Czech potato pancakes loaded with chopped kimchi for a tangy, fermented kick.",
          serves: "Serves 6", time: "30 min",
          ingredients: ["3 potatoes, grated", "1 cup chopped kimchi, drained", "1 egg", "2 tbsp flour", "scallions", "oil"],
          steps: ["Mix grated potato, kimchi, egg, and flour.", "Fry spoonfuls into crisp pancakes, 3 min per side.", "Drain on paper towels.", "Top with sliced scallions."],
        },
        {
          name: "Bulgogi Klobása Rolls",
          description: "Czech sausage rolls reimagined with Korean bulgogi-marinated beef baked in flaky pastry.",
          serves: "Serves 4", time: "35 min",
          ingredients: ["1 sheet puff pastry", "1/2 lb ground beef", "2 tbsp soy sauce", "1 tbsp brown sugar", "1 tsp sesame oil", "1 egg"],
          steps: ["Mix beef with soy, sugar, and sesame oil.", "Roll the beef in strips of pastry.", "Brush with egg and slice into pieces.", "Bake at 400°F for 20 min until golden."],
        },
        {
          name: "Honey-Cinnamon Trdelník Hotteok",
          description: "The cinnamon-sugar spirit of Czech trdelník meets Korea's gooey honey-filled hotteok pancakes.",
          serves: "Serves 6", time: "30 min",
          ingredients: ["1 pack dough", "2 tbsp honey", "1 tbsp brown sugar", "1 tsp cinnamon", "crushed walnuts", "butter"],
          steps: ["Mix honey, sugar, cinnamon, and walnuts for filling.", "Press dough into discs and fill each.", "Seal and fry in butter until golden.", "Serve hot while the center is molten."],
        },
      ],
      drink: {
        name: "Pilsner Soju Boilermaker",
        description: "A nod to Korea's somaek \u2014 Czech pilsner dropped with a measure of soju.",
        serves: "Serves 1", time: "2 min",
        ingredients: ["1 Czech pilsner", "1 oz soju"],
        steps: ["Pour the pilsner into a tall glass.", "Add the soju.", "Stir gently and drink cold."],
      },
    },
    common: {
      intro: "Czechia and South Korea are both nations where drinking culture, fried snacks, and street food bring people shoulder to shoulder.",
      connections: [
        { title: "Beer-and-spirit rituals", description: "Korea's somaek (beer mixed with soju) and Czechia's deep pilsner tradition both treat a shared drink as the social glue of any gathering, with its own customs and pace." },
        { title: "Fried street snacks", description: "The Czech smažený sýr (fried cheese) and Korea's fried street foods come from the same instinct: hot, crispy, indulgent bites bought from a stand and eaten on the move." },
        { title: "Sweet dough done right", description: "Czech trdelník and Korean hotteok are both warm, sweet, doughy street treats \u2014 cinnamon, sugar, and a soft center meant to be eaten fresh and hot in the cold." },
      ],
    },
  },
  "Morocco|Scotland": {
    menu: {
      bites: [
        {
          name: "Spiced Lamb Bridies",
          description: "The Scottish hand pie filled with ras el hanout-spiced lamb instead of plain mince \u2014 flaky pastry, North African warmth.",
          serves: "Serves 4", time: "40 min",
          ingredients: ["1 sheet puff pastry", "1/2 lb ground lamb", "1 tbsp ras el hanout", "1 small onion, diced", "1 egg, beaten"],
          steps: ["Brown lamb with onion and ras el hanout, then cool.", "Cut pastry into rounds, spoon filling onto one half.", "Fold over and crimp the edges, brush with egg.", "Bake at 400\u00B0F for 20-25 min until golden."],
        },
        {
          name: "Harissa Haggis Bites",
          description: "Crispy fried haggis croquettes served with a bright harissa yogurt dip.",
          serves: "Serves 4", time: "30 min",
          ingredients: ["1 cup cooked haggis", "1/2 cup flour", "1 egg", "1 cup breadcrumbs", "1/2 cup yogurt + 1 tbsp harissa", "oil for frying"],
          steps: ["Roll haggis into small balls.", "Coat in flour, then egg, then breadcrumbs.", "Fry at 350\u00B0F until crisp and golden.", "Stir harissa into yogurt and serve as a dip."],
        },
        {
          name: "Preserved Lemon Oatcakes",
          description: "Scottish oatcakes topped with a Moroccan-style chickpea and preserved-lemon spread.",
          serves: "Serves 6", time: "10 min",
          ingredients: ["1 pack oatcakes", "1 can chickpeas, drained", "1 tbsp chopped preserved lemon", "1 clove garlic", "2 tbsp olive oil", "parsley"],
          steps: ["Blend chickpeas, preserved lemon, garlic, and oil into a spread.", "Taste and adjust salt.", "Spread generously onto oatcakes.", "Top with chopped parsley."],
        },
      ],
      drink: {
        name: "Mint Tea Hot Toddy",
        description: "Moroccan mint tea spiked with a touch of Scotch whisky and honey.",
        serves: "Serves 1", time: "5 min",
        ingredients: ["1 cup brewed mint tea", "1 oz Scotch whisky", "1 tsp honey", "lemon slice"],
        steps: ["Brew strong mint tea.", "Stir in honey while hot.", "Add whisky and a lemon slice."],
      },
    },
    common: {
      intro: "A windswept northern nation and a sun-baked North African kingdom might seem worlds apart, but both lean on slow cooking, warming spice, and hearty grains to get through.",
      connections: [
        { title: "Low and slow is the rule", description: "The Moroccan tagine and the Scottish stew pot work on the same principle: tough, affordable cuts of meat cooked gently for hours until they fall apart, stretching a little meat across a whole family." },
        { title: "Grains at the center", description: "Couscous in Morocco, oats and barley in Scotland \u2014 both built their everyday eating around a humble staple grain that fills the plate and soaks up whatever sauce or broth surrounds it." },
        { title: "Spice as comfort", description: "Scotland's warming spices in its baking and Morocco's ras el hanout both turn to aromatic spice not for show but for comfort \u2014 the kind of warmth you want when the weather, or the match, turns against you." },
      ],
    },
  },
  "United States|Australia": {
    menu: {
      bites: [
        {
          name: "BBQ Brisket Meat Pies",
          description: "The Aussie hand pie stuffed with American low-and-slow smoked brisket and a tangy BBQ glaze.",
          serves: "Serves 6", time: "35 min",
          ingredients: ["1 sheet puff pastry", "1 cup chopped cooked brisket", "1/4 cup BBQ sauce", "1 egg, beaten", "muffin tin"],
          steps: ["Mix brisket with BBQ sauce.", "Line muffin cups with pastry, fill with brisket.", "Top with a pastry lid, brush with egg.", "Bake at 400\u00B0F for 20 min until golden."],
        },
        {
          name: "Buffalo Shrimp on the Barbie",
          description: "Grilled Australian-style prawns tossed in American buffalo sauce with a blue cheese dip.",
          serves: "Serves 4", time: "20 min",
          ingredients: ["1 lb large shrimp, peeled", "2 tbsp buffalo sauce", "1 tbsp butter", "1/2 cup blue cheese dressing", "skewers"],
          steps: ["Skewer shrimp and grill 2 min per side.", "Melt butter into buffalo sauce.", "Toss grilled shrimp in the sauce.", "Serve with blue cheese dip."],
        },
        {
          name: "Lamington S'mores Bars",
          description: "The Aussie coconut-chocolate lamington reimagined as a gooey American s'mores bar.",
          serves: "Serves 8", time: "20 min",
          ingredients: ["1 store-bought pound cake", "1 cup chocolate, melted", "1 cup shredded coconut", "1 cup mini marshmallows"],
          steps: ["Cut cake into squares.", "Dip each in melted chocolate, then roll in coconut.", "Top with marshmallows.", "Broil 30-60 sec until toasted \u2014 watch closely."],
        },
      ],
      drink: {
        name: "Spiked Lemonade Shandy",
        description: "An American hard lemonade topped with Australian lager for an easy backyard shandy.",
        serves: "Serves 1", time: "2 min",
        ingredients: ["6 oz hard lemonade", "6 oz lager", "lemon wedge"],
        steps: ["Fill a glass halfway with hard lemonade.", "Top with cold lager.", "Garnish with a lemon wedge."],
      },
    },
    common: {
      intro: "Two big, sprawling countries with a shared love of the outdoors, the grill, and food that doesn't take itself too seriously.",
      connections: [
        { title: "Grilling is a national sport", description: "The American backyard cookout and the Australian barbie are practically the same ritual: fire, friends, casual outdoor cooking, and the grill as the social center of any gathering." },
        { title: "Big, generous portions", description: "Both cuisines lean toward abundance and comfort \u2014 hearty, shareable, no-fuss food designed to feed a crowd of friends gathered around a game." },
        { title: "Immigrant melting pots", description: "American and Australian food are both built almost entirely from waves of immigration, which is why both will happily fuse a taco, a curry, and a burger onto the same menu without blinking." },
      ],
    },
  },

  // ---------------- GROUP B ----------------
  "Canada|Bosnia and Herzegovina": {
    menu: {
      bites: [
        { name: "Poutine Cevapi Bowl", description: "Crispy fries and cheese curds piled with grilled Bosnian cevapi sausages and a peppery gravy.",
          serves: "Serves 4", time: "35 min",
          ingredients: ["1 lb frozen fries", "1 cup cheese curds", "12 cevapi (small skinless beef sausages)", "2 cups beef gravy", "1/2 red onion, diced"],
          steps: ["Bake or fry the fries until golden and crisp.", "Grill the cevapi 8-10 min, turning, until charred.", "Warm the gravy.", "Pile fries, scatter curds, top with cevapi, gravy, and onion."] },
        { name: "Maple Ajvar Flatbread", description: "Warm flatbread brushed with smoky red-pepper ajvar and a thread of maple.",
          serves: "Serves 4", time: "20 min",
          ingredients: ["2 large flatbreads", "1/2 cup ajvar (roasted red pepper relish)", "1 tbsp maple syrup", "1/2 cup crumbled feta", "Fresh parsley"],
          steps: ["Warm flatbreads in a hot oven 5 min.", "Spread ajvar across each.", "Drizzle lightly with maple syrup.", "Top with feta and parsley, slice and serve."] },
        { name: "Smoked Salmon Somun Toasts", description: "Pillowy Bosnian somun bread toasted and topped with Canadian smoked salmon and dill cream.",
          serves: "Serves 4", time: "15 min",
          ingredients: ["1 somun or pita loaf", "6 oz smoked salmon", "1/2 cup cream cheese", "1 tbsp chopped dill", "Lemon wedges"],
          steps: ["Slice and toast the bread.", "Mix cream cheese with dill.", "Spread on toasts, drape with salmon.", "Finish with a squeeze of lemon."] },
      ],
      drink: { name: "Maple-Plum Spritz", description: "Bosnian plum (sljivovica spirit optional) shaken with maple and soda.",
        serves: "Serves 4", time: "5 min",
        ingredients: ["1 cup plum juice", "2 tbsp maple syrup", "Soda water", "Ice", "Lemon"],
        steps: ["Stir plum juice and maple over ice.", "Top with soda.", "Garnish with lemon."] },
    },
    common: {
      intro: "Canada and Bosnia both build their tables around grilled meats, hearty breads, and the kind of cooking that feeds a crowd through a long winter.",
      connections: [
        { title: "Grilled meat, gathered around", description: "Bosnian cevapi and Canadian backyard grilling share the same instinct: simple seasoned meat, cooked over fire, eaten together in numbers." },
        { title: "Bread as the base", description: "Somun in Bosnia and bannock or fresh loaves in Canada both treat warm bread as the foundation a meal is built on." },
        { title: "Preserving the harvest", description: "Ajvar jars in autumn and maple tapped in spring both turn a short season's bounty into something that lasts the year." },
      ],
    },
  },
  "Canada|Qatar": {
    menu: {
      bites: [
        { name: "Machboos Poutine", description: "Fries topped with spiced Qatari machboos chicken, curds, and a saffron gravy.",
          serves: "Serves 4", time: "40 min",
          ingredients: ["1 lb fries", "2 cups shredded spiced chicken", "1 cup cheese curds", "2 cups gravy", "Pinch saffron", "1 tsp baharat spice"],
          steps: ["Bake fries until crisp.", "Warm chicken with baharat.", "Steep saffron in the warm gravy.", "Layer fries, curds, chicken, and saffron gravy."] },
        { name: "Maple Date Karak Bites", description: "Flaky pastry filled with date paste and a maple-cardamom glaze, nodding to Qatar's karak chai.",
          serves: "Serves 4", time: "25 min",
          ingredients: ["1 sheet puff pastry", "1/2 cup date paste", "1 tbsp maple syrup", "1/4 tsp cardamom", "1 egg (wash)"],
          steps: ["Cut pastry into squares.", "Spoon date paste in each center.", "Fold, seal, brush with egg.", "Bake 18 min; glaze with maple-cardamom syrup."] },
        { name: "Lemon-Sumac Salmon Skewers", description: "Canadian salmon cubes with a Qatari sumac-lemon rub, grilled on skewers.",
          serves: "Serves 4", time: "20 min",
          ingredients: ["1 lb salmon, cubed", "1 tbsp sumac", "1 lemon (zest + juice)", "2 tbsp olive oil", "Skewers"],
          steps: ["Toss salmon with sumac, lemon, oil.", "Thread onto skewers.", "Grill 3 min per side.", "Serve with extra lemon."] },
      ],
      drink: { name: "Karak-Maple Iced Tea", description: "Spiced Qatari karak chai chilled and sweetened with a touch of maple.",
        serves: "Serves 4", time: "10 min",
        ingredients: ["3 cups brewed strong tea", "1/2 cup milk", "2 tbsp maple syrup", "1/4 tsp cardamom", "Ice"],
        steps: ["Brew tea strong with cardamom.", "Stir in milk and maple.", "Chill and pour over ice."] },
    },
    common: {
      intro: "A cold-weather north and a desert gulf seem worlds apart, but both Canada and Qatar prize hospitality, sweet-spiced drinks, and welcoming guests with abundance.",
      connections: [
        { title: "The welcome drink", description: "Qatar's karak chai and Canada's endless coffee both say the same thing at the door: sit down, stay a while." },
        { title: "Dates and maple", description: "Two natural sweeteners at the heart of each culture's pantry, both tapped or harvested and folded into everything from breakfast to dessert." },
        { title: "Feeding guests first", description: "Generous hosting is a point of pride in both cultures, where sending someone home hungry would be unthinkable." },
      ],
    },
  },
  "Canada|Switzerland": {
    menu: {
      bites: [
        { name: "Raclette Poutine", description: "Fries blanketed in melted raclette instead of curds, with cornichons and a splash of gravy.",
          serves: "Serves 4", time: "30 min",
          ingredients: ["1 lb fries", "8 oz raclette cheese", "1 cup gravy", "1/4 cup cornichons, sliced", "Black pepper"],
          steps: ["Bake fries crisp.", "Melt raclette under a broiler or on a raclette grill.", "Drape cheese over fries.", "Top with gravy and cornichons."] },
        { name: "Maple Rosti Cakes", description: "Crispy Swiss potato rosti with a maple-mustard drizzle.",
          serves: "Serves 4", time: "25 min",
          ingredients: ["4 large potatoes, grated", "2 tbsp butter", "1 tbsp maple syrup", "1 tsp grainy mustard", "Salt"],
          steps: ["Squeeze grated potato dry, season.", "Fry in butter as small cakes, 4 min per side.", "Whisk maple and mustard.", "Drizzle over hot rosti."] },
        { name: "Chocolate-Maple Fondue", description: "Swiss chocolate fondue sweetened with maple, for dipping fruit and bread.",
          serves: "Serves 4", time: "15 min",
          ingredients: ["8 oz Swiss dark chocolate", "1/2 cup cream", "2 tbsp maple syrup", "Apple slices, bread cubes, strawberries"],
          steps: ["Warm cream gently.", "Melt in chocolate and maple, stirring smooth.", "Keep warm in a fondue pot.", "Dip fruit and bread."] },
      ],
      drink: { name: "Hot Maple Cider", description: "Warm spiced cider with maple, fitting for two mountain-winter nations.",
        serves: "Serves 4", time: "10 min",
        ingredients: ["4 cups apple cider", "2 tbsp maple syrup", "1 cinnamon stick", "2 cloves"],
        steps: ["Simmer cider with spices 8 min.", "Stir in maple.", "Strain and serve warm."] },
    },
    common: {
      intro: "Mountains, snow, and cheese run through both kitchens — Canada and Switzerland are nations that turn cold climates and dairy into comfort food.",
      connections: [
        { title: "Melted cheese is the answer", description: "Swiss raclette and fondue meet Canadian poutine in the same place: hot, melted cheese as the ultimate cold-weather comfort." },
        { title: "Mountain pantries", description: "Both cultures perfected hearty potato dishes and preserved dairy to get through long alpine and northern winters." },
        { title: "Sweet from the land", description: "Swiss chocolate and Canadian maple are each a national sweet-tooth signature, exported and beloved worldwide." },
      ],
    },
  },
  "Bosnia and Herzegovina|Qatar": {
    menu: {
      bites: [
        { name: "Baharat Cevapi", description: "Bosnian cevapi sausages seasoned with Qatari baharat spice, served with flatbread.",
          serves: "Serves 4", time: "30 min",
          ingredients: ["1 lb ground beef", "1 tsp baharat", "1 tsp paprika", "2 cloves garlic, minced", "Flatbread", "Diced onion"],
          steps: ["Mix beef with baharat, paprika, garlic.", "Form into small finger sausages.", "Grill 8-10 min, turning.", "Serve in flatbread with onion."] },
        { name: "Date-Walnut Baklava", description: "Layered phyllo with Bosnian walnuts and Qatari date syrup.",
          serves: "Serves 6", time: "45 min",
          ingredients: ["1 pack phyllo", "2 cups ground walnuts", "1/2 cup date syrup", "1/2 cup melted butter", "1 tsp cinnamon"],
          steps: ["Layer buttered phyllo with walnut-cinnamon.", "Cut into diamonds.", "Bake 30 min until golden.", "Soak with warm date syrup."] },
        { name: "Saffron Burek Rolls", description: "Flaky Bosnian burek pastry filled with spiced meat and a saffron touch.",
          serves: "Serves 4", time: "40 min",
          ingredients: ["1 pack phyllo", "1 lb ground lamb", "1 onion, diced", "Pinch saffron", "1 tsp baharat", "Butter"],
          steps: ["Cook lamb with onion, saffron, baharat.", "Roll in buttered phyllo into coils.", "Brush with butter.", "Bake 25 min until crisp."] },
      ],
      drink: { name: "Rosewater Plum Cooler", description: "Bosnian plum juice with a drop of Qatari rosewater.",
        serves: "Serves 4", time: "5 min",
        ingredients: ["3 cups plum juice", "1/2 tsp rosewater", "Soda", "Ice", "Mint"],
        steps: ["Stir plum juice with rosewater.", "Pour over ice, top with soda.", "Garnish with mint."] },
    },
    common: {
      intro: "Ottoman history left a shared culinary fingerprint across Bosnia and Qatar — phyllo pastries, spiced meats, and coffee rituals that feel like cousins.",
      connections: [
        { title: "An Ottoman inheritance", description: "Burek, baklava, and strong coffee traveled the same empire, and both Bosnian and Gulf tables still carry those flavors today." },
        { title: "Pastry as craft", description: "Layered phyllo work — savory or sweet — is a point of pride in both kitchens, judged by how thin and flaky the layers are." },
        { title: "Coffee as ceremony", description: "Bosnian and Qatari coffee are both slow, social rituals, served in small cups to mark hospitality rather than just caffeine." },
      ],
    },
  },
  "Bosnia and Herzegovina|Switzerland": {
    menu: {
      bites: [
        { name: "Cevapi Raclette Plate", description: "Grilled cevapi sausages with melted raclette and pickles.",
          serves: "Serves 4", time: "30 min",
          ingredients: ["12 cevapi", "8 oz raclette", "Cornichons", "Flatbread", "Diced onion"],
          steps: ["Grill cevapi 8-10 min.", "Melt raclette under the broiler.", "Drape cheese over sausages.", "Serve with pickles, onion, flatbread."] },
        { name: "Rosti Burek Wedges", description: "A mashup of Swiss rosti and Bosnian burek — crispy potato with a spiced meat layer.",
          serves: "Serves 4", time: "40 min",
          ingredients: ["4 potatoes, grated", "1/2 lb ground beef", "1 onion", "Butter", "Paprika"],
          steps: ["Cook beef with onion and paprika.", "Press half the potato in a pan, add meat, top with potato.", "Fry in butter both sides.", "Cut into wedges."] },
        { name: "Plum-Chocolate Truffles", description: "Swiss chocolate truffles rolled around a Bosnian plum center.",
          serves: "Serves 6", time: "30 min",
          ingredients: ["8 oz Swiss dark chocolate", "1/2 cup cream", "1/4 cup plum jam", "Cocoa powder"],
          steps: ["Heat cream, melt in chocolate.", "Chill until scoopable.", "Wrap each scoop around a dab of plum jam.", "Roll in cocoa."] },
      ],
      drink: { name: "Alpine Plum Tea", description: "Warm herbal tea with Bosnian plum and Swiss alpine herbs.",
        serves: "Serves 4", time: "10 min",
        ingredients: ["4 cups herbal tea", "1/2 cup plum juice", "Honey", "Lemon"],
        steps: ["Brew tea.", "Stir in plum juice and honey.", "Serve with lemon."] },
    },
    common: {
      intro: "Two mountain cultures that built their cooking on dairy, preserved fruit, and dishes hearty enough for alpine winters.",
      connections: [
        { title: "Mountain dairy", description: "Swiss cheese culture and Bosnian kajmak both turn mountain milk into rich, spreadable comfort." },
        { title: "Preserved fruit", description: "Bosnian plums and Swiss alpine berries are each dried, jammed, and distilled to last the winter." },
        { title: "Hearty by necessity", description: "Both cuisines lean filling and warming, shaped by the demands of cold, high-altitude living." },
      ],
    },
  },
  "Qatar|Switzerland": {
    menu: {
      bites: [
        { name: "Saffron Cheese Fondue", description: "Swiss fondue infused with Qatari saffron, for dipping bread and dates.",
          serves: "Serves 4", time: "20 min",
          ingredients: ["8 oz Gruyere", "8 oz Emmental", "1 cup white grape juice", "Pinch saffron", "Bread cubes, dates"],
          steps: ["Warm grape juice with saffron.", "Melt in cheese, stirring smooth.", "Keep warm in a pot.", "Dip bread and dates."] },
        { name: "Date Rosti Bites", description: "Crispy Swiss potato rosti topped with a sweet date relish.",
          serves: "Serves 4", time: "25 min",
          ingredients: ["4 potatoes, grated", "Butter", "1/2 cup chopped dates", "1 tsp baharat", "Yogurt"],
          steps: ["Fry small rosti cakes in butter.", "Warm dates with baharat.", "Top rosti with date relish.", "Finish with a dab of yogurt."] },
        { name: "Machboos-Spiced Chocolate", description: "Swiss chocolate bark spiced with Qatari baharat and cardamom.",
          serves: "Serves 6", time: "15 min + chill",
          ingredients: ["8 oz Swiss dark chocolate", "1/4 tsp baharat", "1/4 tsp cardamom", "Chopped pistachios"],
          steps: ["Melt chocolate gently.", "Stir in spices.", "Spread thin on parchment, scatter pistachios.", "Chill and break into shards."] },
      ],
      drink: { name: "Saffron Hot Chocolate", description: "Swiss hot chocolate perfumed with Qatari saffron and cardamom.",
        serves: "Serves 4", time: "10 min",
        ingredients: ["4 cups milk", "6 oz chocolate", "Pinch saffron", "1/4 tsp cardamom"],
        steps: ["Warm milk with saffron and cardamom.", "Whisk in chocolate.", "Serve hot."] },
    },
    common: {
      intro: "Precision and luxury define both tables — Swiss craftsmanship and Qatari opulence meet over saffron, fine chocolate, and an eye for quality.",
      connections: [
        { title: "Luxury ingredients", description: "Saffron in Qatar and fine chocolate in Switzerland are each treated as treasures, used with care and pride." },
        { title: "Craft and precision", description: "Both cultures prize doing things exactly right, whether it's a watch movement or the perfect cup of cardamom coffee." },
        { title: "Hospitality as status", description: "Welcoming guests with the very best you have is central to both Gulf and Swiss entertaining." },
      ],
    },
  },

  // ---------------- GROUP C ----------------
  "Brazil|Morocco": {
    menu: {
      bites: [
        { name: "Chermoula Coxinha", description: "Brazilian chicken croquettes with a Moroccan chermoula herb kick.",
          serves: "Serves 4", time: "45 min",
          ingredients: ["2 cups shredded chicken", "2 tbsp chermoula paste", "2 cups mashed potato or dough", "Breadcrumbs", "Oil for frying"],
          steps: ["Mix chicken with chermoula.", "Wrap in dough, shape into teardrops.", "Bread and fry until golden.", "Drain and serve hot."] },
        { name: "Harissa Pao de Queijo", description: "Brazilian cheese bread with a swirl of Moroccan harissa heat.",
          serves: "Serves 4", time: "30 min",
          ingredients: ["2 cups tapioca flour", "1 cup milk", "1/2 cup oil", "2 eggs", "1.5 cups cheese", "1 tbsp harissa"],
          steps: ["Boil milk and oil, mix into tapioca flour.", "Beat in eggs, cheese, harissa.", "Spoon into mini muffin tins.", "Bake 20 min until puffed."] },
        { name: "Preserved Lemon Pao", description: "Soft rolls studded with Moroccan preserved lemon and Brazilian olive.",
          serves: "Serves 4", time: "35 min",
          ingredients: ["Bread dough", "2 tbsp minced preserved lemon", "1/4 cup chopped olives", "Olive oil"],
          steps: ["Knead lemon and olives into dough.", "Shape into rolls.", "Rise 20 min.", "Bake 18 min until golden."] },
      ],
      drink: { name: "Mint-Lime Caipirinha Mocktail", description: "Brazilian lime muddle meets Moroccan mint tea, alcohol-free.",
        serves: "Serves 4", time: "5 min",
        ingredients: ["3 limes", "Fresh mint", "2 tbsp sugar", "Green tea, chilled", "Soda"],
        steps: ["Muddle lime, mint, sugar.", "Add chilled green tea.", "Top with soda and ice."] },
    },
    common: {
      intro: "Across the Atlantic from each other, Brazil and Morocco both cook with bright herbs, citrus, and a love of street-side snacks eaten on the move.",
      connections: [
        { title: "Citrus everywhere", description: "Brazilian lime and Moroccan preserved lemon both bring the sharp brightness that defines each cuisine's character." },
        { title: "Street snacks", description: "Coxinha stalls in Brazil and msemen carts in Morocco share the same culture of cheap, hot, handheld food." },
        { title: "Mint and freshness", description: "Fresh herbs finish dishes in both kitchens, from Moroccan mint tea to Brazilian salsa-topped grills." },
      ],
    },
  },
  "Brazil|Haiti": {
    menu: {
      bites: [
        { name: "Pikliz Pao de Queijo", description: "Brazilian cheese bread served with fiery Haitian pikliz slaw.",
          serves: "Serves 4", time: "30 min",
          ingredients: ["2 cups tapioca flour", "1 cup milk", "1/2 cup oil", "2 eggs", "1.5 cups cheese", "1 cup pikliz (pickled slaw)"],
          steps: ["Make the cheese bread batter and bake into puffs.", "Serve warm.", "Top or dip with tangy pikliz."] },
        { name: "Griot Coxinha", description: "Crispy croquettes filled with Haitian fried pork griot.",
          serves: "Serves 4", time: "50 min",
          ingredients: ["2 cups cooked griot pork, shredded", "2 cups dough", "Breadcrumbs", "Oil", "Epis seasoning"],
          steps: ["Season pork with epis.", "Wrap in dough teardrops.", "Bread and fry golden.", "Serve with pikliz."] },
        { name: "Plantain Farofa Cups", description: "Brazilian toasted farofa over sweet Haitian fried plantains.",
          serves: "Serves 4", time: "20 min",
          ingredients: ["3 ripe plantains", "1 cup cassava flour", "2 tbsp butter", "Salt", "Scallion"],
          steps: ["Fry plantain slices until caramelized.", "Toast cassava flour in butter until golden.", "Spoon farofa over plantains.", "Top with scallion."] },
      ],
      drink: { name: "Passionfruit Cremas Cooler", description: "Brazilian passionfruit with a splash of Haiti's creamy cremas flavor, alcohol-free.",
        serves: "Serves 4", time: "5 min",
        ingredients: ["1 cup passionfruit pulp", "1 cup coconut cream", "2 tbsp sweetened condensed milk", "Nutmeg", "Ice"],
        steps: ["Blend passionfruit, coconut cream, condensed milk.", "Pour over ice.", "Dust with nutmeg."] },
    },
    common: {
      intro: "Two tropical nations where cassava, plantains, and pork anchor the plate, and bright pickles cut through the richness.",
      connections: [
        { title: "Cassava roots", description: "Brazilian farofa and Haitian cassava bread both spring from the same staple root, ground and toasted into daily food." },
        { title: "Pork done proud", description: "Haitian griot and Brazilian roast pork are each celebratory centerpieces, crispy outside and tender within." },
        { title: "The cut of acid", description: "Haitian pikliz and Brazilian vinaigrete both exist to slice through fatty, fried richness with sharp pickled heat." },
      ],
    },
  },
  "Brazil|Scotland": {
    menu: {
      bites: [
        { name: "Haggis Coxinha", description: "Brazilian croquettes with a savory Scottish haggis filling.",
          serves: "Serves 4", time: "45 min",
          ingredients: ["2 cups cooked haggis", "2 cups dough", "Breadcrumbs", "Oil", "Black pepper"],
          steps: ["Loosen haggis with a splash of stock.", "Wrap in dough teardrops.", "Bread and fry golden.", "Serve hot with mustard."] },
        { name: "Cheese Bread Scotch Eggs", description: "Scotch eggs wrapped in Brazilian pao de queijo dough instead of breadcrumbs.",
          serves: "Serves 4", time: "40 min",
          ingredients: ["4 soft-boiled eggs", "1 lb sausage", "2 cups tapioca cheese dough", "Oil"],
          steps: ["Wrap each egg in sausage.", "Encase in cheese dough.", "Fry until golden and cooked through.", "Halve and serve."] },
        { name: "Shortbread Brigadeiro", description: "Brazilian chocolate brigadeiro sandwiched on Scottish shortbread.",
          serves: "Serves 6", time: "30 min",
          ingredients: ["1 can condensed milk", "3 tbsp cocoa", "1 tbsp butter", "Shortbread cookies", "Sprinkles"],
          steps: ["Cook condensed milk, cocoa, butter to a thick fudge.", "Cool slightly.", "Spoon onto shortbread.", "Top with sprinkles."] },
      ],
      drink: { name: "Guarana Cream Soda Float", description: "Brazilian guarana soda with a Scottish cream-soda nod.",
        serves: "Serves 4", time: "5 min",
        ingredients: ["Guarana soda", "Vanilla ice cream", "Cream", "Ice"],
        steps: ["Pour guarana over ice.", "Add a scoop of ice cream.", "Top with a splash of cream."] },
    },
    common: {
      intro: "A tropical giant and a northern highland nation, but both Brazil and Scotland love hearty fried snacks, sweet treats, and a fiercely proud food identity.",
      connections: [
        { title: "Fried and handheld", description: "Brazilian coxinha and Scottish chippy fare share a deep love of crispy, golden, fried-to-order snacks." },
        { title: "Sweet teeth", description: "Brigadeiro and shortbread or tablet are each a national sweet obsession, made at home and given as treats." },
        { title: "Proud traditions", description: "Both cultures hold their iconic dishes close, serving them at every celebration as edible identity." },
      ],
    },
  },
  "Morocco|Haiti": {
    menu: {
      bites: [
        { name: "Epis Chicken Tagine", description: "Moroccan tagine spiced with Haitian epis herb base.",
          serves: "Serves 4", time: "50 min",
          ingredients: ["4 chicken thighs", "3 tbsp epis", "1 tsp ras el hanout", "1/2 cup olives", "Preserved lemon", "Onion"],
          steps: ["Brown chicken.", "Add onion, epis, ras el hanout.", "Simmer with olives and lemon 35 min.", "Serve over couscous."] },
        { name: "Harissa Pikliz", description: "Haitian pickled slaw amped with Moroccan harissa.",
          serves: "Serves 6", time: "15 min + pickle",
          ingredients: ["2 cups shredded cabbage", "1 carrot", "1 tbsp harissa", "1 cup vinegar", "Scotch bonnet", "Salt"],
          steps: ["Pack vegetables in a jar.", "Whisk vinegar with harissa and salt.", "Pour over, add pepper.", "Chill at least a few hours."] },
        { name: "Plantain Msemen", description: "Flaky Moroccan msemen flatbread folded around sweet Haitian plantain.",
          serves: "Serves 4", time: "35 min",
          ingredients: ["Msemen dough", "2 ripe plantains, mashed", "Butter", "Cinnamon", "Honey"],
          steps: ["Roll msemen thin.", "Fill with mashed plantain and cinnamon.", "Fold and griddle in butter.", "Drizzle honey."] },
      ],
      drink: { name: "Hibiscus Mint Cooler", description: "Haitian hibiscus and Moroccan mint over ice.",
        serves: "Serves 4", time: "10 min",
        ingredients: ["3 cups brewed hibiscus tea", "Fresh mint", "Honey", "Lime", "Ice"],
        steps: ["Brew and chill hibiscus.", "Muddle mint with honey.", "Combine over ice with lime."] },
    },
    common: {
      intro: "Bold spice blends define both kitchens — Moroccan ras el hanout and Haitian epis are each the soul that flavors everything that follows.",
      connections: [
        { title: "A signature spice base", description: "Epis in Haiti and chermoula or ras el hanout in Morocco are the foundational blends that start nearly every savory dish." },
        { title: "Slow-simmered stews", description: "Moroccan tagine and Haitian braises both coax deep flavor from long, gentle cooking." },
        { title: "Sweet-savory balance", description: "Both cuisines fearlessly pair fruit and warm spice with meat, from tagine's apricots to Haitian plantain sides." },
      ],
    },
  },
  "Morocco|Scotland": {
    menu: {
      bites: [
        { name: "Ras el Hanout Haggis", description: "Scottish haggis warmed with Moroccan ras el hanout, served on oatcakes.",
          serves: "Serves 4", time: "25 min",
          ingredients: ["1 lb haggis", "1 tsp ras el hanout", "Oatcakes", "Yogurt", "Mint"],
          steps: ["Warm haggis with ras el hanout.", "Spoon onto oatcakes.", "Top with minted yogurt."] },
        { name: "Preserved Lemon Shortbread", description: "Buttery Scottish shortbread brightened with Moroccan preserved lemon zest.",
          serves: "Serves 6", time: "35 min",
          ingredients: ["1 cup butter", "1/2 cup sugar", "2 cups flour", "1 tbsp minced preserved lemon"],
          steps: ["Cream butter and sugar.", "Fold in flour and lemon.", "Press into a tin, score.", "Bake 25 min until pale gold."] },
        { name: "Harira Cullen Skink", description: "Scotland's smoked haddock soup crossed with Morocco's harira spice.",
          serves: "Serves 4", time: "30 min",
          ingredients: ["1 lb smoked haddock", "2 potatoes", "1 onion", "1 tsp cumin", "1/2 tsp turmeric", "2 cups milk"],
          steps: ["Soften onion with cumin and turmeric.", "Add diced potato and milk, simmer.", "Flake in haddock.", "Warm through and serve."] },
      ],
      drink: { name: "Mint Barley Cooler", description: "Scottish barley water with Moroccan mint.",
        serves: "Serves 4", time: "10 min",
        ingredients: ["3 cups barley water", "Fresh mint", "Lemon", "Honey", "Ice"],
        steps: ["Steep mint in warm barley water.", "Sweeten with honey.", "Chill, serve over ice with lemon."] },
    },
    common: {
      intro: "Hospitality and warming food connect a North African kingdom and a Highland nation — both greet guests with something hot to eat and drink.",
      connections: [
        { title: "Tea and welcome", description: "Moroccan mint tea and the Scottish cuppa are each poured the moment a guest arrives, a ritual of hospitality." },
        { title: "Oats and grains", description: "Scottish oats and Moroccan barley and semolina both form the humble, hearty backbone of everyday eating." },
        { title: "Warming spice", description: "Even in different forms, both kitchens reach for warming spices to take the chill off a cold, damp climate." },
      ],
    },
  },
  "Haiti|Scotland": {
    menu: {
      bites: [
        { name: "Griot Scotch Eggs", description: "Scotch eggs wrapped in Haitian griot-spiced pork.",
          serves: "Serves 4", time: "40 min",
          ingredients: ["4 soft-boiled eggs", "1 lb pork sausage", "2 tbsp epis", "Breadcrumbs", "Oil"],
          steps: ["Mix sausage with epis.", "Wrap each egg.", "Bread and fry golden.", "Halve and serve with pikliz."] },
        { name: "Pikliz Oatcakes", description: "Scottish oatcakes topped with tangy Haitian pikliz and cheese.",
          serves: "Serves 4", time: "15 min",
          ingredients: ["Oatcakes", "1 cup pikliz", "1/2 cup grated cheddar", "Scallion"],
          steps: ["Top oatcakes with cheese.", "Warm until melted.", "Crown with pikliz and scallion."] },
        { name: "Plantain Tablet", description: "Scottish tablet fudge studded with caramelized Haitian plantain.",
          serves: "Serves 6", time: "30 min",
          ingredients: ["2 cups sugar", "1/2 cup condensed milk", "1/4 cup butter", "1 ripe plantain, diced"],
          steps: ["Caramelize plantain, set aside.", "Boil sugar, milk, butter to soft-ball.", "Beat in plantain.", "Pour, cool, cut into squares."] },
      ],
      drink: { name: "Ginger Hibiscus Fizz", description: "Haitian hibiscus with a Scottish ginger-beer kick.",
        serves: "Serves 4", time: "5 min",
        ingredients: ["2 cups hibiscus tea", "Ginger beer", "Lime", "Ice"],
        steps: ["Chill hibiscus tea.", "Pour over ice with ginger beer.", "Finish with lime."] },
    },
    common: {
      intro: "An island in the Caribbean and one in the North Atlantic, but Haiti and Scotland both prize bold pickles, proud pork dishes, and sweet treats made to share.",
      connections: [
        { title: "Pickle power", description: "Haitian pikliz and Scottish pickled accompaniments both bring sharp, tangy contrast to rich plates." },
        { title: "Sweet fudge traditions", description: "Scottish tablet and Haitian sweet confections share a love of dense, sugary, made-at-home treats." },
        { title: "Resourceful cooking", description: "Both food cultures grew from making the most of what the land and sea provide, wasting nothing." },
      ],
    },
  },

  // ---------------- GROUP D ----------------
  "United States|Paraguay": {
    menu: {
      bites: [
        { name: "Chipa Cheese Sliders", description: "Mini burgers on Paraguayan chipa cheese rolls.",
          serves: "Serves 4", time: "35 min",
          ingredients: ["1 lb ground beef", "Chipa rolls (cassava cheese bread)", "Cheddar", "Pickles", "Burger sauce"],
          steps: ["Form small patties, season.", "Sear 2-3 min per side, melt cheese.", "Split warm chipa rolls.", "Build sliders with pickles and sauce."] },
        { name: "Sopa Paraguaya Cornbread", description: "Paraguay's savory cornbread, American BBQ-style with jalapeno.",
          serves: "Serves 6", time: "45 min",
          ingredients: ["2 cups cornmeal", "1 cup cottage cheese", "1 onion", "3 eggs", "1 cup corn", "1 jalapeno"],
          steps: ["Saute onion and jalapeno.", "Mix with cornmeal, cheese, eggs, corn.", "Pour into a pan.", "Bake 35 min until set and golden."] },
        { name: "Mbeju Quesadilla", description: "Paraguayan mbeju starch-cheese flatbread folded quesadilla-style.",
          serves: "Serves 4", time: "20 min",
          ingredients: ["2 cups cassava starch", "1 cup grated cheese", "2 tbsp butter", "Milk", "Extra cheese for filling"],
          steps: ["Mix starch, cheese, butter, milk into crumbs.", "Press into a pan, cook until set.", "Add cheese, fold over.", "Cook until melted, slice."] },
      ],
      drink: { name: "Terere Lemonade", description: "Paraguay's cold terere (yerba mate) mixed into American lemonade.",
        serves: "Serves 4", time: "10 min",
        ingredients: ["3 cups cold yerba mate", "1 cup lemonade", "Mint", "Lime", "Ice"],
        steps: ["Brew and chill yerba mate.", "Mix with lemonade.", "Serve over ice with mint and lime."] },
    },
    common: {
      intro: "Corn and cheese run deep in both countries — Paraguay's cassava-and-cheese breads meet America's cornbread-and-burger comfort.",
      connections: [
        { title: "Corn as foundation", description: "American cornbread and Paraguayan sopa paraguaya both turn humble corn into a beloved, everyday staple." },
        { title: "Cheese in the bread", description: "Paraguay bakes cheese right into chipa and mbeju, a trick American comfort baking loves too." },
        { title: "Cold drinks, shared", description: "Paraguay's communal terere and America's pitcher of lemonade both make a cold drink a social ritual." },
      ],
    },
  },
  "United States|Australia": {
    menu: {
      bites: [
        { name: "BBQ Brisket Snags", description: "Aussie sausage sizzle meets American smoked brisket on a roll.",
          serves: "Serves 4", time: "30 min",
          ingredients: ["4 thick sausages", "1 cup shredded brisket", "4 soft rolls", "BBQ sauce", "Grilled onion"],
          steps: ["Grill sausages and onions.", "Warm the brisket.", "Layer sausage and brisket in rolls.", "Top with onion and BBQ sauce."] },
        { name: "Vegemite Cheese Fries", description: "American loaded fries with a savory Vegemite-butter drizzle.",
          serves: "Serves 4", time: "25 min",
          ingredients: ["1 lb fries", "1 tsp Vegemite", "2 tbsp melted butter", "1 cup cheese", "Scallion"],
          steps: ["Bake fries crisp.", "Whisk Vegemite into melted butter.", "Toss fries with cheese, melt.", "Drizzle Vegemite butter, top with scallion."] },
        { name: "Lamington Brownies", description: "American brownies rolled in coconut like an Aussie lamington.",
          serves: "Serves 6", time: "40 min",
          ingredients: ["1 batch brownies, cut in squares", "1 cup chocolate glaze", "2 cups shredded coconut"],
          steps: ["Bake and cool brownies.", "Dip each in chocolate glaze.", "Roll in coconut.", "Set on a rack until firm."] },
      ],
      drink: { name: "Spider Float", description: "The Aussie 'spider' soda float, American root-beer style.",
        serves: "Serves 4", time: "5 min",
        ingredients: ["Root beer or lemonade", "Vanilla ice cream", "Ice"],
        steps: ["Pour soda into glasses.", "Add a scoop of ice cream.", "Serve with a spoon and straw."] },
    },
    common: {
      intro: "Two big, casual, grill-loving cultures — the US and Australia bond over barbecue, beach food, and an easygoing way of feeding a crowd.",
      connections: [
        { title: "Grill culture", description: "The American cookout and the Aussie barbie are practically siblings: outdoor, social, and built around grilled meat." },
        { title: "Sweet indulgence", description: "Brownies and lamingtons show a shared love of rich, coconut-and-chocolate desserts made by the tray." },
        { title: "Casual and generous", description: "Both food cultures favor relaxed, abundant, no-fuss eating where everyone helps themselves." },
      ],
    },
  },
  "United States|Turkiye": {
    menu: {
      bites: [
        { name: "Doner Cheesesteak", description: "Philly cheesesteak built with Turkish doner-spiced beef.",
          serves: "Serves 4", time: "30 min",
          ingredients: ["1 lb thin-sliced beef", "1 tsp doner spice", "4 hoagie rolls", "Provolone", "Onion, pepper"],
          steps: ["Saute onion and pepper.", "Sear spiced beef.", "Pile into rolls, melt provolone on top.", "Serve hot."] },
        { name: "Pide Pizza Boats", description: "Turkish pide flatbread loaded American-pizza style.",
          serves: "Serves 4", time: "35 min",
          ingredients: ["Pide or pizza dough", "1 cup mozzarella", "Sucuk or pepperoni", "Tomato", "Egg"],
          steps: ["Shape dough into boats.", "Fill with cheese and meat.", "Bake 12 min; crack an egg in the last few minutes.", "Slice and serve."] },
        { name: "Baklava Cheesecake Bites", description: "American cheesecake layered with Turkish baklava crunch.",
          serves: "Serves 6", time: "30 min + chill",
          ingredients: ["8 oz cream cheese", "1/4 cup sugar", "Crushed baklava or phyllo+walnut", "Honey"],
          steps: ["Beat cream cheese and sugar smooth.", "Layer with crushed baklava in cups.", "Chill 1 hour.", "Drizzle honey before serving."] },
      ],
      drink: { name: "Turkish Coffee Frappe", description: "Turkish coffee blended American iced-frappe style.",
        serves: "Serves 4", time: "10 min",
        ingredients: ["2 cups strong Turkish coffee, chilled", "1 cup milk", "2 tbsp sugar", "Ice", "Cardamom"],
        steps: ["Brew strong coffee with cardamom, chill.", "Blend with milk, sugar, and ice.", "Pour and serve frothy."] },
    },
    common: {
      intro: "Crossroads cuisines — Turkiye bridges Europe and Asia, the US blends every immigrant table, and both turn that mixing into bold, layered street food.",
      connections: [
        { title: "Street food kings", description: "Turkish doner and American diner classics share a genius for fast, flavorful, handheld food done at scale." },
        { title: "Melting-pot tables", description: "Both cuisines are defined by crossroads and migration, absorbing outside influences into something new." },
        { title: "Coffee culture", description: "Turkish coffee's deep ritual and America's all-day coffee habit are two sides of a shared devotion to the cup." },
      ],
    },
  },
  "Paraguay|Australia": {
    menu: {
      bites: [
        { name: "Chipa Sausage Rolls", description: "Aussie sausage rolls wrapped in Paraguayan chipa cheese dough.",
          serves: "Serves 4", time: "40 min",
          ingredients: ["1 lb sausage meat", "Cassava cheese dough", "1 egg", "Tomato relish"],
          steps: ["Roll sausage meat into logs.", "Wrap in chipa dough.", "Brush with egg, bake 25 min.", "Slice and serve with relish."] },
        { name: "Vegemite Mbeju", description: "Paraguayan cassava-cheese flatbread with a savory Vegemite butter.",
          serves: "Serves 4", time: "20 min",
          ingredients: ["2 cups cassava starch", "1 cup cheese", "Butter", "1 tsp Vegemite", "Milk"],
          steps: ["Mix starch, cheese, butter, milk.", "Press and cook in a pan until set.", "Whisk Vegemite into warm butter.", "Brush over the hot mbeju."] },
        { name: "Dulce Lamingtons", description: "Aussie lamingtons filled with Paraguayan dulce de leche.",
          serves: "Serves 6", time: "40 min",
          ingredients: ["Sponge cake squares", "1 cup dulce de leche", "Chocolate glaze", "Shredded coconut"],
          steps: ["Sandwich sponge with dulce de leche.", "Dip in chocolate glaze.", "Roll in coconut.", "Set until firm."] },
      ],
      drink: { name: "Terere Spider", description: "Paraguay's terere given the Aussie spider-float treatment.",
        serves: "Serves 4", time: "5 min",
        ingredients: ["Cold yerba mate", "Lemonade", "Vanilla ice cream", "Ice"],
        steps: ["Mix cold mate with lemonade.", "Pour over ice.", "Float a scoop of ice cream on top."] },
    },
    common: {
      intro: "Both Paraguay and Australia keep a relaxed, outdoor, share-everything food culture, with a cold communal drink never far from reach.",
      connections: [
        { title: "Communal cold drinks", description: "Paraguay's shared terere gourd and Australia's esky of cold drinks both make refreshment a group activity." },
        { title: "Baked to share", description: "Chipa by the bagful and lamingtons by the tray show a mutual love of baking in generous, shareable batches." },
        { title: "Outdoor and easy", description: "Warm climates push both cultures toward casual, alfresco eating with friends and family." },
      ],
    },
  },
  "Paraguay|Turkiye": {
    menu: {
      bites: [
        { name: "Sucuk Chipa Guazu", description: "Paraguay's corn pudding-bread baked with Turkish sucuk sausage.",
          serves: "Serves 6", time: "45 min",
          ingredients: ["2 cups corn", "1 cup cheese", "3 eggs", "1 onion", "1/2 cup sliced sucuk", "Cornmeal"],
          steps: ["Saute onion and sucuk.", "Mix corn, cheese, eggs, cornmeal.", "Fold in sausage.", "Bake 35 min until golden."] },
        { name: "Mbeju Gozleme", description: "Turkish gozleme technique with Paraguayan cassava-cheese filling.",
          serves: "Serves 4", time: "30 min",
          ingredients: ["Thin flatbread dough", "1 cup cassava starch", "1 cup cheese", "Butter", "Parsley"],
          steps: ["Mix starch and cheese into a filling.", "Spread over rolled dough, fold.", "Griddle in butter both sides.", "Cut into wedges."] },
        { name: "Lokum Coconut Sweets", description: "Turkish delight flavors in a Paraguayan coconut sweet.",
          serves: "Serves 6", time: "20 min + set",
          ingredients: ["2 cups shredded coconut", "1 can condensed milk", "1 tsp rosewater", "Pistachios"],
          steps: ["Mix coconut, condensed milk, rosewater.", "Press into a tin.", "Top with pistachios.", "Chill, then cut into squares."] },
      ],
      drink: { name: "Pomegranate Terere", description: "Paraguayan terere brightened with Turkish pomegranate.",
        serves: "Serves 4", time: "5 min",
        ingredients: ["Cold yerba mate", "1/2 cup pomegranate juice", "Mint", "Ice"],
        steps: ["Brew and chill mate.", "Stir in pomegranate juice.", "Serve over ice with mint."] },
    },
    common: {
      intro: "Cheese-filled breads and a deep tea-and-mate drinking culture tie together a South American heartland and an Anatolian crossroads.",
      connections: [
        { title: "Cheese baked in", description: "Paraguayan chipa and Turkish pide both bake cheese directly into the dough as a savory everyday staple." },
        { title: "The shared cup", description: "Paraguay's terere and Turkiye's endless tea are each a social glue, sipped slowly in good company." },
        { title: "Corn and grain breads", description: "Both cultures lean on grain and starch breads as the daily base that everything else accompanies." },
      ],
    },
  },
  "Australia|Turkiye": {
    menu: {
      bites: [
        { name: "Gozleme Snags", description: "Aussie sausage wrapped in Turkish gozleme flatbread.",
          serves: "Serves 4", time: "30 min",
          ingredients: ["4 sausages", "Flatbread dough", "Spinach", "Feta", "Butter"],
          steps: ["Grill the sausages.", "Fill rolled dough with spinach and feta, fold.", "Griddle in butter.", "Wrap around a sausage and serve."] },
        { name: "Lamb Pide Boats", description: "Turkish pide loaded with Aussie-spiced lamb.",
          serves: "Serves 4", time: "35 min",
          ingredients: ["Pide dough", "1/2 lb ground lamb", "Onion", "1 tsp cumin", "Mozzarella", "Egg"],
          steps: ["Cook lamb with onion and cumin.", "Fill dough boats with lamb and cheese.", "Bake 12 min, crack egg in last minutes.", "Slice and serve."] },
        { name: "Baklava Lamingtons", description: "Aussie lamingtons layered with Turkish baklava crunch.",
          serves: "Serves 6", time: "40 min",
          ingredients: ["Sponge squares", "Chocolate glaze", "Coconut", "Crushed baklava", "Honey"],
          steps: ["Dip sponge in chocolate glaze.", "Roll in coconut mixed with crushed baklava.", "Drizzle honey.", "Set until firm."] },
      ],
      drink: { name: "Pomegranate Spider", description: "Turkish pomegranate in an Aussie spider float.",
        serves: "Serves 4", time: "5 min",
        ingredients: ["Pomegranate soda", "Vanilla ice cream", "Mint", "Ice"],
        steps: ["Pour pomegranate soda over ice.", "Float a scoop of ice cream.", "Garnish with mint."] },
    },
    common: {
      intro: "A shared history runs surprisingly deep here — and both Australian and Turkish tables center grilled meat, flatbread, and generous sweets.",
      connections: [
        { title: "Grill and flatbread", description: "Aussie barbecue and Turkish mangal both pair charred meat with warm flatbread as the natural order of things." },
        { title: "Lamb as centerpiece", description: "Lamb holds pride of place at both tables, whether on an Aussie spit or a Turkish skewer." },
        { title: "Sweet and shared", description: "Lamingtons and baklava are each made in generous batches, meant for passing around with tea or coffee." },
      ],
    },
  },

};

function getPairingContent(teamA, teamB) {
  return (
    PAIRING_CONTENT[`${teamA}|${teamB}`] ||
    PAIRING_CONTENT[`${teamB}|${teamA}`] ||
    null
  );
}

// Knockout bracket. Slot labels follow the real FIFA structure (group winners,
// runners-up, and best third-placed teams); actual teams lock in as the group
// stage finishes. Labels like "1A" = winner of Group A, "2B" = runner-up Group B,
// "3rd" = a qualifying third-placed team.
const COURSES = [
  {
    name: "Course of 32",
    matches: [
      { id: "r32-1", teamA: "1A", teamB: "3rd", status: "upcoming" },
      { id: "r32-2", teamA: "1C", teamB: "3rd", status: "upcoming" },
      { id: "r32-3", teamA: "1E", teamB: "3rd", status: "upcoming" },
      { id: "r32-4", teamA: "1F", teamB: "2B", status: "upcoming" },
      { id: "r32-5", teamA: "1I", teamB: "3rd", status: "upcoming" },
      { id: "r32-6", teamA: "1L", teamB: "2A", status: "upcoming" },
      { id: "r32-7", teamA: "1D", teamB: "2G", status: "upcoming" },
      { id: "r32-8", teamA: "1H", teamB: "2K", status: "upcoming" },
      { id: "r32-9", teamA: "1B", teamB: "3rd", status: "upcoming" },
      { id: "r32-10", teamA: "1G", teamB: "2D", status: "upcoming" },
      { id: "r32-11", teamA: "1J", teamB: "2H", status: "upcoming" },
      { id: "r32-12", teamA: "1K", teamB: "3rd", status: "upcoming" },
      { id: "r32-13", teamA: "1A2", teamB: "2C", status: "upcoming" },
      { id: "r32-14", teamA: "2E", teamB: "2F", status: "upcoming" },
      { id: "r32-15", teamA: "1A3", teamB: "2I", status: "upcoming" },
      { id: "r32-16", teamA: "2J", teamB: "2L", status: "upcoming" },
    ],
  },
  {
    name: "Course of 16",
    matches: Array.from({ length: 8 }, (_, i) => ({
      id: `r16-${i + 1}`,
      teamA: "TBD",
      teamB: "TBD",
      status: "upcoming",
    })),
  },
  {
    name: "Quarterfinals",
    matches: Array.from({ length: 4 }, (_, i) => ({
      id: `qf-${i + 1}`,
      teamA: "TBD",
      teamB: "TBD",
      status: "upcoming",
    })),
  },
  {
    name: "Semifinals",
    matches: Array.from({ length: 2 }, (_, i) => ({
      id: `sf-${i + 1}`,
      teamA: "TBD",
      teamB: "TBD",
      status: "upcoming",
    })),
  },
  {
    name: "Final Course",
    matches: [{ id: "final", teamA: "TBD", teamB: "TBD", status: "upcoming" }],
  },
];

// Friendly labels for bracket slot codes
const SLOT_LABELS = {
  "1A": "Winner A", "1B": "Winner B", "1C": "Winner C", "1D": "Winner D",
  "1E": "Winner E", "1F": "Winner F", "1G": "Winner G", "1H": "Winner H",
  "1I": "Winner I", "1J": "Winner J", "1K": "Winner K", "1L": "Winner L",
  "1A2": "Winner B", "1A3": "Winner H",
  "2A": "Runner-up A", "2B": "Runner-up B", "2C": "Runner-up C", "2D": "Runner-up D",
  "2E": "Runner-up E", "2F": "Runner-up F", "2G": "Runner-up G", "2H": "Runner-up H",
  "2I": "Runner-up I", "2J": "Runner-up J", "2K": "Runner-up K", "2L": "Runner-up L",
  "3rd": "3rd place",
};

function FlagChip({ team, size = 24 }) {
  const isTbd = team === "TBD" || team === "TBD ";
  const svg = flagSvg(team);

  if (isTbd || !svg) {
    return (
      <span
        style={{
          display: "inline-block",
          width: size,
          height: size,
          borderRadius: "50%",
          background: C.surfaceRaised,
          flexShrink: 0,
        }}
        aria-label={`${team} flag`}
      />
    );
  }

  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        background: C.surfaceRaised,
        lineHeight: 0,
        verticalAlign: "middle",
      }}
      aria-label={`${team} flag`}
    >
      <svg
        viewBox="0 0 60 60"
        width={size}
        height={size}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block" }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </span>
  );
}

const LOGO_URI = "data:image/png;base64,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";

function SpoonLogo({ size = 28 }) {
  return (
    <img src={LOGO_URI} alt="World Plate logo" style={{ height: size, width: "auto", display: "block" }} />
  );
}

function UtensilsIcon({ color, size = 18 }) {
  // Crossed knife (upper-left) + fork (upper-right) in an X, matching reference
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill={color}>
      {/* Knife — broad blade upper-left, handle lower-right */}
      <g transform="rotate(45 32 32)">
        <path d="M32 5 c-5 1 -9 7 -9 15 c0 5 3 7.5 6 8.5 l3 0 0 -23.5 c0 -2 0 -3 0 0 z" />
        <rect x="29.5" y="28" width="3" height="31" rx="1.5" />
      </g>
      {/* Fork — tines upper-right, handle lower-left */}
      <g transform="rotate(-45 32 32)">
        <rect x="28.4" y="5" width="2.6" height="14" rx="1.3" />
        <rect x="33" y="5" width="2.6" height="14" rx="1.3" />
        <rect x="37.6" y="5" width="2.6" height="14" rx="1.3" />
        <path d="M28 18 h12 a2.2 2.2 0 0 1 2.2 2.2 c0 5 -3.2 7 -5.6 8 l-5.2 0 c-2.4 -1 -5.6 -3 -5.6 -8 a2.2 2.2 0 0 1 2.2 -2.2 z" />
        <rect x="32.6" y="27" width="2.8" height="32" rx="1.4" />
      </g>
    </svg>
  );
}

function BackArrow({ color, flip = false }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: flip ? "scaleX(-1)" : "none" }}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function MenuSection({ icon, label, dish }) {
  const [open, setOpen] = useState(false);
  const hasRecipe = dish.ingredients?.length || dish.steps?.length;

  return (
    <div style={{ background: C.surface, borderRadius: "12px", marginBottom: "10px", overflow: "hidden" }}>
      <button
        onClick={() => hasRecipe && setOpen(!open)}
        style={{
          width: "100%",
          display: "block",
          padding: "16px",
          background: "none",
          border: "none",
          cursor: hasRecipe ? "pointer" : "default",
          textAlign: "left",
          fontFamily: "inherit",
        }}
      >
        <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, letterSpacing: "0.01em", color: C.muted, display: "flex", alignItems: "center", gap: "7px" }}>
          {icon && <span style={{ fontSize: "16px" }}>{icon}</span>}{label}
        </p>
        <p style={{ margin: "6px 0 3px 0", fontSize: "17px", fontWeight: 700, color: C.white, lineHeight: 1.25 }}>{dish.name}</p>
        {dish.description && <p style={{ margin: 0, fontSize: "14px", color: C.muted, lineHeight: 1.5 }}>{dish.description}</p>}
        {hasRecipe && !open && (
          <p style={{ margin: "8px 0 0 0", fontSize: "13px", color: C.signal, fontWeight: 700 }}>Tap for recipe ↓</p>
        )}
      </button>

      {open && hasRecipe && (
        <div style={{ padding: "0 16px 16px 16px" }}>
          {(dish.serves || dish.time) && (
            <div style={{ display: "flex", gap: "18px", marginBottom: "14px", paddingTop: "4px" }}>
              {dish.serves && (
                <span style={{ fontSize: "13px", color: C.gold, fontWeight: 700 }}>🍽 {dish.serves}</span>
              )}
              {dish.time && (
                <span style={{ fontSize: "13px", color: C.gold, fontWeight: 700 }}>⏱ {dish.time}</span>
              )}
            </div>
          )}
          {dish.ingredients?.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{ margin: "0 0 8px 0", fontSize: "12px", fontWeight: 700, letterSpacing: "0.01em", color: C.muted }}>You'll Need</p>
              {dish.ingredients.map((ing, i) => (
                <p key={i} style={{ margin: "0 0 5px 0", fontSize: "14px", color: C.white, lineHeight: 1.4 }}>· {ing}</p>
              ))}
            </div>
          )}
          {dish.steps?.length > 0 && (
            <div>
              <p style={{ margin: "0 0 8px 0", fontSize: "12px", fontWeight: 700, letterSpacing: "0.01em", color: C.muted }}>How To Make It</p>
              {dish.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: "11px", marginBottom: "10px", alignItems: "flex-start" }}>
                  <span style={{
                    flexShrink: 0,
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: C.white,
                    color: C.bg,
                    fontSize: "12px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "1px",
                  }}>{i + 1}</span>
                  <span style={{ fontSize: "14px", color: C.white, lineHeight: 1.5 }}>{step}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GameDayMenuTab({ teamA, teamB }) {
  const content = getPairingContent(teamA, teamB);
  const menu = content?.menu;

  return (
    <div>
      <p style={{ fontSize: "14px", color: C.muted, lineHeight: 1.55, margin: "0 0 18px 0" }}>
        Shareable snack ideas that blend both teams' flavors.
      </p>
      {menu ? (
        <div>
          {menu.bites.map((bite, i) => (
            <MenuSection key={i} label={`Bite ${i + 1}`} dish={bite} />
          ))}
          {menu.drink && <MenuSection label="Drink" dish={menu.drink} />}
        </div>
      ) : (
        <div style={{ background: C.surfaceRaised, borderRadius: "10px", padding: "16px" }}>
          <p style={{ fontSize: "13.5px", color: C.white, fontWeight: 600, margin: "0 0 6px 0" }}>Menu coming soon</p>
          <p style={{ fontSize: "12.5px", color: C.muted, lineHeight: 1.5, margin: 0 }}>
            A fusion spread for {teamA} vs. {teamB} is still being plated. Check back once this matchup is set.
          </p>
        </div>
      )}
    </div>
  );
}

function CommonGroundTab({ teamA, teamB }) {
  const content = getPairingContent(teamA, teamB);
  const common = content?.common;

  return (
    <div>
      <p style={{ fontSize: "13px", color: C.muted, lineHeight: 1.5, margin: "0 0 16px 0" }}>
        What {teamA} and {teamB} share at the table.
      </p>
      {common ? (
        <div>
          <p style={{ fontSize: "15px", color: C.white, lineHeight: 1.65, marginBottom: "24px" }}>
            {common.intro}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {common.connections.map((c, i) => (
              <div key={i} style={{ background: C.surface, borderRadius: "12px", padding: "16px" }}>
                <p style={{ margin: "0 0 6px 0", fontSize: "15px", fontWeight: 700, color: C.white, lineHeight: 1.3 }}>{c.title}</p>
                <p style={{ margin: 0, fontSize: "14px", color: C.muted, lineHeight: 1.6 }}>{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ background: C.surface, borderRadius: "12px", padding: "16px" }}>
          <p style={{ fontSize: "14px", color: C.white, fontWeight: 700, margin: "0 0 6px 0" }}>Common ground coming soon</p>
          <p style={{ fontSize: "14px", color: C.muted, lineHeight: 1.55, margin: 0 }}>
            The shared food story for {teamA} and {teamB} is still being written.
          </p>
        </div>
      )}
    </div>
  );
}

function MatchPage({ match, onBack }) {
  const [tab, setTab] = useState("menu");

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <div style={{ padding: "18px 16px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: "13px", fontWeight: 600, padding: 0, marginBottom: "16px", fontFamily: "inherit" }}>
            <BackArrow color={C.muted} /> Back
          </button>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "18px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flex: 1 }}>
            <FlagChip team={match.teamA} size={36} />
            <span style={{ fontSize: "14px", fontWeight: 600, color: C.white, textAlign: "center" }}>{match.teamA}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", flexShrink: 0 }}>
            <UtensilsIcon color={C.muted} size={28} />
            <div style={{ textAlign: "center", lineHeight: 1.35 }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: C.white }}>{(match.date || match.kickoff?.date)}</div>
              <div style={{ fontSize: "11px", fontWeight: 500, color: C.muted }}>{(match.time || match.kickoff?.time)}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flex: 1 }}>
            <FlagChip team={match.teamB} size={36} />
            <span style={{ fontSize: "14px", fontWeight: 600, color: C.white, textAlign: "center" }}>{match.teamB}</span>
          </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", maxWidth: "640px", margin: "0 auto", padding: "0 16px" }}>
        {[
          { key: "menu", label: "Game Day Menu" },
          { key: "common", label: "Common Ground" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "15px 0",
              marginRight: "28px",
              fontSize: "15px",
              fontWeight: 700,
              color: tab === t.key ? C.white : C.muted,
              borderBottom: tab === t.key ? `2px solid ${C.signal}` : "2px solid transparent",
              fontFamily: "inherit",
            }}
          >
            {t.label}
          </button>
        ))}
        </div>
      </div>

      <div style={{ padding: "20px 16px 40px 16px", maxWidth: "640px", margin: "0 auto" }}>
        {tab === "menu" ? (
          <GameDayMenuTab teamA={match.teamA} teamB={match.teamB} />
        ) : (
          <CommonGroundTab teamA={match.teamA} teamB={match.teamB} />
        )}
      </div>
    </div>
  );
}

function MatchListRow({ match, onSelect, divider = true }) {
  const played = match.played;
  const nameColor = played ? C.muted : C.white;
  return (
    <button
      onClick={() => onSelect(match)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "14px 16px",
        background: "none",
        border: "none",
        borderBottom: divider ? `1px solid ${C.border}` : "none",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "inherit",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0, justifyContent: "flex-end" }}>
        <span style={{ fontSize: "14px", fontWeight: 400, color: nameColor, textAlign: "right", lineHeight: 1.3 }}>
          {match.teamA}
        </span>
        <FlagChip team={match.teamA} size={24} />
      </div>

      <div style={{ flexShrink: 0, width: "96px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "5px" }}>
        <UtensilsIcon color={C.mutedDark} size={18} />
        <div style={{ fontSize: "11px", fontWeight: 600, color: played ? C.mutedDark : C.white }}>{match.time}</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0, justifyContent: "flex-start" }}>
        <FlagChip team={match.teamB} size={24} />
        <span style={{ fontSize: "14px", fontWeight: 400, color: nameColor, textAlign: "left", lineHeight: 1.3 }}>
          {match.teamB}
        </span>
      </div>
    </button>
  );
}

function DayCard({ day, onSelect }) {
  return (
    <div style={{ background: C.surface, borderRadius: "14px", overflow: "hidden", marginBottom: "14px" }}>
      <div style={{ padding: "15px 16px 12px 16px", borderBottom: `1px solid ${C.border}` }}>
        <p style={{ fontSize: "16px", fontWeight: 700, color: C.white, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          {day.weekday} <span style={{ color: C.muted, fontWeight: 600 }}>{day.date}</span>
          {day.isToday && (
            <span style={{ fontSize: "10px", fontWeight: 700, color: C.bg, background: C.signal, borderRadius: "4px", padding: "2px 7px", letterSpacing: "0.02em" }}>TODAY</span>
          )}
        </p>
      </div>
      {day.games.map((g, i) => (
        <MatchListRow key={g.id} match={g} onSelect={onSelect} divider={i < day.games.length - 1} />
      ))}
    </div>
  );
}

function ScheduleView({ onSelect }) {
  const days = scheduleByDate();
  const pastDays = days.filter((d) => d.past);
  const upcomingDays = days.filter((d) => !d.past);

  const [showPast, setShowPast] = useState(false);

  if (showPast) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <p style={{ fontSize: "18px", fontWeight: 700, color: C.white, margin: 0 }}>Past matches</p>
          <button
            onClick={() => setShowPast(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: C.signal,
              fontSize: "13px",
              fontWeight: 700,
              padding: 0,
              fontFamily: "inherit",
            }}
          >
            <BackArrow color={C.signal} /> Upcoming
          </button>
        </div>
        {pastDays.length > 0 ? (
          pastDays.map((day) => <DayCard key={day.date} day={day} onSelect={onSelect} />)
        ) : (
          <p style={{ fontSize: "14px", color: C.muted, padding: "4px" }}>No matches have been played yet.</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <p style={{ fontSize: "18px", fontWeight: 700, color: C.white, margin: 0 }}>Upcoming</p>
        {pastDays.length > 0 && (
          <button
            onClick={() => setShowPast(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: C.muted,
              fontSize: "13px",
              fontWeight: 600,
              padding: 0,
              fontFamily: "inherit",
            }}
          >
            Past matches <BackArrow color={C.muted} flip />
          </button>
        )}
      </div>

      {upcomingDays.length > 0 ? (
        upcomingDays.map((day) => <DayCard key={day.date} day={day} onSelect={onSelect} />)
      ) : (
        <p style={{ fontSize: "14px", color: C.muted, lineHeight: 1.55, padding: "4px" }}>
          The group stage is complete. Head to the Knockout tab for the bracket matchups.
        </p>
      )}
    </div>
  );
}

function BracketSlot({ team }) {
  const isReal = team !== "TBD" && !SLOT_LABELS[team];
  const label = SLOT_LABELS[team] || team;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "7px", minWidth: 0 }}>
      {isReal && <FlagChip team={team} size={16} />}
      <span style={{ fontSize: "12.5px", fontWeight: 600, color: isReal ? C.white : C.mutedDark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {label}
      </span>
    </div>
  );
}

function BracketNode({ match, onSelect }) {
  // Only tappable once both sides are real teams with a menu
  const bothReal =
    match.teamA !== "TBD" && !SLOT_LABELS[match.teamA] &&
    match.teamB !== "TBD" && !SLOT_LABELS[match.teamB];
  return (
    <button
      onClick={() => bothReal && onSelect(match)}
      style={{
        width: "200px",
        flexShrink: 0,
        background: C.surface,
        borderRadius: "10px",
        padding: "10px 12px",
        cursor: bothReal ? "pointer" : "default",
        textAlign: "left",
        fontFamily: "inherit",
      }}
    >
      <div style={{ marginBottom: "8px" }}>
        <BracketSlot team={match.teamA} />
      </div>
      <div>
        <BracketSlot team={match.teamB} />
      </div>
    </button>
  );
}

function BracketView({ onSelect }) {
  return (
    <div>
      <p style={{ fontSize: "12px", color: C.mutedDark, marginBottom: "14px", lineHeight: 1.5 }}>
        Scroll horizontally to follow the knockout path. TBD slots lock in as group results finalize.
      </p>
      <div className="bracket-scroll" style={{ display: "flex", gap: "26px", overflowX: "auto", paddingBottom: "10px" }}>
        {COURSES.map((round) => (
          <div key={round.name} style={{ display: "flex", flexDirection: "column", gap: "16px", flexShrink: 0 }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: C.muted, letterSpacing: "0", margin: 0 }}>{round.name}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", justifyContent: "space-around", flex: 1 }}>
              {round.matches.map((m) => (
                <BracketNode key={m.id} match={m} onSelect={onSelect} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WorldPlateApp() {
  const [matchView, setMatchView] = useState(groupStageOver() ? "bracket" : "groups"); // groups | bracket
  const [selectedMatch, setSelectedMatch] = useState(null);

  if (selectedMatch) {
    return (
      <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          * { box-sizing: border-box; }
          button { font-family: inherit; }
          @keyframes pulse { 0%,100% { transform: scale(1); opacity: 0.4; } 50% { transform: scale(2.2); opacity: 0; } }
        `}</style>
        <MatchPage match={selectedMatch} onBack={() => setSelectedMatch(null)} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        @keyframes pulse { 0%,100% { transform: scale(1); opacity: 0.4; } 50% { transform: scale(2.2); opacity: 0; } }
        .bracket-scroll::-webkit-scrollbar, .rail-scroll::-webkit-scrollbar { height: 6px; }
        .bracket-scroll::-webkit-scrollbar-thumb, .rail-scroll::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        .groups-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 700px) { .groups-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1040px) { .groups-grid { grid-template-columns: 1fr 1fr 1fr; } }
      `}</style>

      <div style={{ padding: "24px 20px 0 20px" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "40px" }}>
            <SpoonLogo size={52} />
          </div>

          <h2 style={{ fontSize: "20px", fontWeight: 700, color: C.white, margin: "0 0 8px 0", lineHeight: 1.15, letterSpacing: "-0.01em" }}>
            Every Match Is a Meal
          </h2>
          <p style={{ fontSize: "15px", color: C.muted, lineHeight: 1.55, margin: "0 0 20px 0" }}>
            Pick any matchup for a watch-party menu that fuses both teams' kitchens.
          </p>

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "16px" }}>
            <div style={{ display: "inline-flex", background: C.surface, borderRadius: "10px", padding: "3px" }}>
              {[
                { key: "groups", label: "Group Stage" },
                { key: "bracket", label: "Knockout" },
              ].map((v) => (
                <button
                  key={v.key}
                  onClick={() => setMatchView(v.key)}
                  style={{
                    border: "none",
                    borderRadius: "7px",
                    padding: "7px 18px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    background: matchView === v.key ? C.surfaceRaised : "none",
                    color: matchView === v.key ? C.white : C.mutedDark,
                    fontFamily: "inherit",
                  }}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "18px 16px 36px 16px" }}>
        {matchView === "groups" ? <ScheduleView onSelect={setSelectedMatch} /> : <BracketView onSelect={setSelectedMatch} />}
      </div>
    </div>
  );
}
