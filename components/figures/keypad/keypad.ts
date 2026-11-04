/* Command keypad. A ten-key pad with a results panel on two posts behind
   it: ⌘ and K raise the panel, ↓ walks the highlight down the results, and
   ↵ opens one and lowers the panel again. Pure: every static path, built
   once. */

import { benchSvg, draw, k, type Plan } from "@/components/iso/parts";

export const WIDTH = 600;
export const HEIGHT = 360;
const PLATE: Plan = { x: -122, y: -72, w: 244, d: 144, r: 8 };
const HOUSING: Plan = { x: -100, y: -12, w: 200, d: 72, r: 5 };
const HOUSING_TOP = 12;
const KEY_Z = 15;
const KEY_H = 7;
const KEY_W = 30;
const KEY_D = 26;
const COLS = [-88, -52, -16, 20, 56];
const ROWS = [-4, 26];
const LEGENDS = [
  ["esc", "⌘", "K", "/", "?"],
  ["⇧", "↑", "↓", "←", "↵"],
];
const STAND: Plan = { x: -80, y: -64, w: 160, d: 34, r: 3 };
const PANEL: Plan = { x: -74, y: -60, w: 148, d: 26, r: 2 };
const PANEL_H = 3;
export const POSTS: [number, number][] = [[-60, -47], [60, -47]];
/** Top of the guide sleeves, where the moving posts start. */
export const SLEEVE_TOP = 6 + 1.4;
export const REST = 9;
export const OPEN = 36;
export const ROW_Y = [-52.5, -47, -41.5, -36];
/** How far a pressed key travels: down until it meets the housing. */
export const KEY_DOWN = HOUSING_TOP + 0.6 - KEY_Z;
export const RESULTS = ["Create a new task", "Launch readiness checklist", "Product Launch", "Pricing sign-off"];

export const P = k.fitProjection(
  [...k.boxCorners(PLATE, -15, 0), [PANEL.x, PANEL.y, OPEN + PANEL_H], [PANEL.x + PANEL.w, PANEL.y, OPEN + PANEL_H]],
  WIDTH,
  HEIGHT,
  { pad: 52, azimuth: 38 },
);

/** The two posts, rebuilt as the panel rises: they are the only parts whose shape changes. */
export const postsAt = (z: number) =>
  POSTS.map(([x, y]) => k.solidSvg(k.cylinder(x, y, 2.4, SLEEVE_TOP, Math.max(0.1, z - SLEEVE_TOP), P, 20), { tone: "mid", crease: "none" })).join("");

function build() {
  const { S, L, D, at, slab, cyl, rules, screws } = draw(P);
  const base = benchSvg(P, { plate: PLATE, label: [PLATE.x + 10, PLATE.y + PLATE.d - 30], ruler: false });

  // Stand: a low base with two guide sleeves, and the posts that ride in them.
  const stand: string[] = [];
  stand.push(S(slab(STAND, 0, 6, 4, 0.6), { tone: "mid" }));
  stand.push(L(k.planOutline(k.insetPlan(STAND, 3), 6, P, 3), { tone: "faint" }));
  stand.push(screws([[STAND.x + 5, STAND.y + 5], [STAND.x + STAND.w - 5, STAND.y + STAND.d - 5]], 6, 1.6));
  for (const [x, y] of POSTS) stand.push(S(cyl(x, y, 4.2, 6, 1.4, 24), { tone: "mid" }));
  stand.push(`<g data-part="posts">${postsAt(REST)}</g>`);

  // Panel: a search line with a caret, four result rows and the highlight.
  const panel: string[] = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(PANEL, 6), 0, 0.1, P)}" style="filter:blur(5px);opacity:.35"/>`];
  panel.push(S(slab(PANEL, 0, PANEL_H, 4, 0.5), { tone: "hi", lit: true }));
  panel.push(L(k.lineOnTop([PANEL.x + 4, -57.5], [PANEL.x + PANEL.w - 4, -57.5], PANEL_H, P), { tone: "faint" }));
  panel.push(rules(PANEL.x + 8, -59.2, [26], 0, PANEL_H, "mid"));
  panel.push(L(k.lineOnTop([PANEL.x + 36, -60], [PANEL.x + 36, -58.4], PANEL_H, P), { tone: "hi" }));
  panel.push(
    `<g data-part="highlight">${S(slab({ x: PANEL.x + 3, y: ROW_Y[0]! - 2.2, w: PANEL.w - 6, d: 4.4, r: 1 }, PANEL_H, 0.01, 3), { tone: "mid", flat: true })}</g>`,
  );
  ROW_Y.forEach((y, i) => {
    panel.push(D([at([PANEL.x + 8, y, PANEL_H])], { size: 0.7, tone: "mid" }));
    panel.push(rules(PANEL.x + 12, y, [[54, 40, 62, 46][i]!], 0, PANEL_H, "lo"));
    panel.push(rules(PANEL.x + PANEL.w - 24, y, [14], 0, PANEL_H, "faint"));
  });

  // Housing, with a groove, corner screws and vent slots.
  const housing: string[] = [];
  housing.push(S(slab(HOUSING, 0, HOUSING_TOP, 6, 1.2), { tone: "mid" }));
  housing.push(L(k.planOutline(k.insetPlan(HOUSING, 4), HOUSING_TOP, P, 4), { tone: "lo" }));
  housing.push(screws(k.corners(HOUSING, 2.2), HOUSING_TOP, 1.2));
  const vents = k.sideTicks(HOUSING.x + 10, HOUSING.x + 60, 4, 100, HOUSING.y + HOUSING.d, 8, [4, 4], P);
  housing.push(L(vents.minor + vents.major, { tone: "lo" }));

  // Keys in depth order, each a stem under a cap with its legend on top.
  const keys: { x: number; y: number; svg: string }[] = [];
  ROWS.forEach((y, r) =>
    COLS.forEach((x, c) => {
      const cap: Plan = { x, y, w: KEY_W, d: KEY_D, r: 3 };
      const cx = x + KEY_W / 2;
      const cy = y + KEY_D / 2;
      const legend = LEGENDS[r]![c]!;
      const stem = S(cyl(cx, cy, 2.6, HOUSING_TOP, KEY_Z - HOUSING_TOP, 16), { tone: "lo", crease: "none" });
      const capSvg =
        S(slab(cap, KEY_Z, KEY_H, 5, 1.2), { tone: "mid" }) +
        L(k.planOutline(k.insetPlan(cap, 3.2), KEY_Z + KEY_H, P, 4), { tone: "faint" }) +
        k.faceTextSvg(k.topMatrix([cx, cy + 2.6], KEY_Z + KEY_H, P, "x"), legend, { size: legend.length > 1 ? 6 : 8, tone: "hi", anchor: "middle" });
      keys.push({ x: cx, y: cy, svg: `${stem}<g data-key="${legend}">${capSvg}</g>` });
    }),
  );
  keys.sort((a, b) => k.depthOf([a.x, a.y, 0], P) - k.depthOf([b.x, b.y, 0], P));

  return {
    base,
    stand: stand.join(""),
    panel: `<g data-part="panel" transform="${k.translateAlong(P, [0, 0, REST])}">${panel.join("")}</g>`,
    housing: housing.join(""),
    keys: keys.map((key) => key.svg).join(""),
  };
}

export const ART = build();
