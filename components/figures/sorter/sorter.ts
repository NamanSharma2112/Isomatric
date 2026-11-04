/* Task sorter. A shuttle on two rails picks a task tile from the magazine
   and drops it into one of three trays: Upcoming, Overdue, Done. The stack in
   each tray is the count a task list shows on its tabs. Pure: the model and
   every static path, built once. */

import { benchSvg, draw, k, trayParts, type Plan } from "@/components/iso/parts";

export const WIDTH = 600;
export const HEIGHT = 360;
const PLATE: Plan = { x: -132, y: -64, w: 264, d: 128, r: 8 };
export const BINS = [-72, 0, 72];
export const NAMES = ["upcoming", "overdue", "done"];
export const BIN_Y = -8;
export const BIN_D = 46;
const WALL = 10;
const TILE = 18;
const TILE_H = 2.2;
export const PITCH = 2.6;
export const MAX = 9;
export const RAIL_Y = -30;
export const HOME = -96;
export const CARRIAGE_TOP = 8;

/** Where each tray starts, and the tasks the tour sends (a worked example). */
export const START = [2, 1, 1];
export const TOUR: [string, number][] = [
  ["Design responsive navigation", 0],
  ["Audit legacy redirects", 1],
  ["Hero illustration handoff", 2],
  ["Offline mode sync", 0],
  ["Crash reporting setup", 1],
  ["Release 2.4 to TestFlight", 2],
  ["Token naming RFC", 0],
];

export const readoutOf = ([a, b, c]: number[]) => `upcoming ${a} · overdue ${b} · done ${c}`;

const tilePlan: Plan = { x: -TILE / 2, y: -TILE / 2, w: TILE, d: TILE, r: 1.2 };

export const P = k.fitProjection(
  [...k.boxCorners(PLATE, -15, 0), [PLATE.x, PLATE.y, 40], [PLATE.x + PLATE.w, PLATE.y + PLATE.d, 0]],
  WIDTH,
  HEIGHT,
  { pad: 52, azimuth: 40 },
);

function build() {
  const { S, L, D, at, slab, cyl, rules } = draw(P);

  const base = benchSvg(P, { plate: PLATE, label: [PLATE.x + PLATE.w - 40, PLATE.y + 8] });

  // Rails, the far end stop, and the magazine of blank tiles at the near end.
  const rails: string[] = [];
  for (const y of [RAIL_Y - 8, RAIL_Y + 4]) {
    rails.push(S(slab({ x: -120, y, w: 236, d: 4, r: 1 }, 0, 3, 3, 0.4), { tone: "mid" }));
    rails.push(D([-112, -40, 40, 108].map((x) => at([x, y + 2, 3])), { size: 0.4, tone: "lo" }));
  }
  rails.push(S(slab({ x: 116, y: RAIL_Y - 11, w: 6, d: 22, r: 1.2 }, 0, 8, 3, 0.5), { tone: "mid" }));
  rails.push(D([at([119, RAIL_Y - 6, 8]), at([119, RAIL_Y + 6, 8])], { size: 0.45 }));
  const mag: Plan = { x: -126, y: RAIL_Y - 16, w: 22, d: 32, r: 1.6 };
  rails.push(S(slab(mag, 0, 26, 4, 0.8), { tone: "mid" }));
  rails.push(L(k.planOutline(k.insetPlan(mag, 3), 26, P, 3), { tone: "lo" }));
  rails.push(S(slab({ x: mag.x + 4, y: mag.y + 6, w: 14, d: 20, r: 0.8 }, 26, 1.2, 3, 0.2), { tone: "hi" }));
  rails.push(L(k.sideTicks(mag.y + 6, mag.y + 26, 2.6, 5, mag.x + mag.w, 22, [1.4, 2.6], P, "y").minor, { tone: "lo" }));
  rails.push(D([at([mag.x + 2.4, mag.y + 2.4, 26]), at([mag.x + mag.w - 2.4, mag.y + mag.d - 2.4, 26])], { size: 0.45 }));

  // The shuttle: a carriage on four bushings with a knurled stop knob.
  const shuttle: string[] = [`<path class="iso-halo" d="${k.haloOf({ x: -11, y: RAIL_Y - 11, w: 22, d: 22, r: 2 }, 3, 0.1, P)}" style="filter:blur(4px)"/>`];
  shuttle.push(S(slab({ x: -13, y: RAIL_Y - 12, w: 26, d: 24, r: 2 }, 3, CARRIAGE_TOP - 3, 4, 0.6), { tone: "mid" }));
  shuttle.push(L(k.planOutline({ x: -10, y: RAIL_Y - 9, w: 20, d: 18, r: 1 }, CARRIAGE_TOP, P, 3), { tone: "faint" }));
  shuttle.push(D([[-10, RAIL_Y - 9], [10, RAIL_Y - 9], [-10, RAIL_Y + 9], [10, RAIL_Y + 9]].map(([x, y]) => at([x, y, CARRIAGE_TOP])), { size: 0.45 }));
  shuttle.push(S(cyl(9, RAIL_Y + 14.5, 2.6, 3, 4, 20), { tone: "mid" }));
  shuttle.push(L(k.knurl(9, RAIL_Y + 14.5, 2.6, 3, 7, 16, P), { tone: "lo" }));

  // Trays and their stacks: every tile is drawn, and the live layer shows as
  // many as the tray holds.
  const trays = BINS.map((cx, b) => {
    const plan: Plan = { x: cx - 27, y: BIN_Y, w: 54, d: BIN_D, r: 1.6 };
    const parts = trayParts(P, plan, 0, WALL);
    const stack: string[] = [];
    for (let i = 0; i < MAX; i++) {
      const z = 2 + i * PITCH;
      const tile = S(slab({ ...tilePlan, x: cx - TILE / 2, y: BIN_Y + BIN_D / 2 - TILE / 2 }, z, TILE_H, 3, 0.3), { tone: "mid" });
      stack.push(`<g data-bin="${b}" data-i="${i}"${i < START[b] ? "" : ' style="display:none"'}>${tile}</g>`);
    }
    const ticks = k.sideTicks(cx - 18, cx + 18, 4, 3, BIN_Y + BIN_D, WALL + 2, [1.6, 3], P);
    const marks = L(ticks.minor, { tone: "lo" }) + L(ticks.major, { tone: "mid" });
    const pins = D([at([cx - 24, BIN_Y + BIN_D - 1.2, WALL + 2]), at([cx + 24, BIN_Y + BIN_D - 1.2, WALL + 2])], { size: 0.4 });
    return parts.behind + stack.join("") + parts.before + marks + pins;
  });

  // The task in flight: the one lit part, with two rule lines for its title.
  const tile = S(slab(tilePlan, 0, TILE_H, 3, 0.3), { tone: "hi", lit: true }) + rules(-6, -3, [12, 8], 3, TILE_H, "lo");

  return {
    base,
    rails: rails.join(""),
    shuttle: `<g data-part="shuttle" transform="${k.translateAlong(P, [HOME, 0, 0])}">${shuttle.join("")}</g>`,
    trays: trays.join(""),
    tile: `<g data-part="tile" style="opacity:0" transform="${k.translateAlong(P, [HOME, RAIL_Y, CARRIAGE_TOP])}">${tile}</g>`,
  };
}

/** The static drawing, one string per teardown layer. */
export const ART = build();
