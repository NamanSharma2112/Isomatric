/* Save shuttle. A change shows at once on the client cradle, then a shuttle
   carries it along the rail to a filing cabinet — the database — and a
   drawer takes it in. Undo runs the same path backwards. Pure: the model
   and every static path. */

import { benchSvg, draw, k, type Plan } from "@/components/iso/parts";

export const WIDTH = 600;
export const HEIGHT = 360;
const PLATE: Plan = { x: -142, y: -60, w: 284, d: 124, r: 8 };
export const RAIL_Y = 41;
export const HOME = -96;
export const DOCK = 91;
export const CAR_TOP = 9;
const CRADLE: Plan = { x: -134, y: -50, w: 64, d: 52, r: 4 };
const CRADLE_TOP = 14;
const CAB: Plan = { x: 58, y: -52, w: 66, d: 62, r: 2.5 };
const CAB_H = 78;
/** The cabinet's front face, where the drawers open from. */
export const FACE = CAB.y + CAB.d;
export const DRAWER = { x: 62, w: 58, z: 4, h: 15 };
/** How far the drawer opens: short of the shuttle's path. */
export const OPEN = 16;
const BUTTON: [number, number] = [-86, -38];
const BLOCK: Plan = { x: -7, y: -7, w: 14, d: 14, r: 1.2 };
const BLOCK_H = 8;

export const P = k.fitProjection([...k.boxCorners(PLATE, -15, 0), [CAB.x, CAB.y, CAB_H], [CAB.x + CAB.w, CAB.y, CAB_H]], WIDTH, HEIGHT, {
  pad: 52,
  azimuth: 40,
});

/** The part of the open drawer that is outside the cabinet, rebuilt as it slides. */
export function drawerAt(open: number) {
  if (open < 0.3) return { back: "", side: "" };
  const S = k.solidSvg;
  return {
    back:
      S(k.slabOf({ x: DRAWER.x, y: FACE, w: DRAWER.w, d: open, r: 0.4 }, DRAWER.z, 1.5, P, 3), { tone: "lo" }) +
      S(k.slabOf({ x: DRAWER.x, y: FACE, w: 2, d: open, r: 0.4 }, DRAWER.z, DRAWER.h, P, 3), { tone: "mid" }),
    side: S(k.slabOf({ x: DRAWER.x + DRAWER.w - 2, y: FACE, w: 2, d: open, r: 0.4 }, DRAWER.z, DRAWER.h, P, 3), { tone: "mid" }),
  };
}

function build() {
  const { S, L, D, at, slab, cyl, screws, rules } = draw(P);
  const base = benchSvg(P, { plate: PLATE, ruler: false, label: [-40, -50] });

  // Client cradle: a dock with a status lamp and the undo button, and the
  // network cable from it to a junction box beside the cabinet.
  const cradle: string[] = [];
  cradle.push(S(slab(CRADLE, 0, CRADLE_TOP, 6, 1), { tone: "mid" }));
  cradle.push(L(k.planOutline(k.insetPlan(CRADLE, 4), CRADLE_TOP, P, 4), { tone: "lo" }));
  cradle.push(S(slab({ x: CRADLE.x + 8, y: CRADLE.y + 18, w: 34, d: 26, r: 2 }, CRADLE_TOP, 0.6, 4, 0), { tone: "lo", crease: "none" }));
  cradle.push(rules(CRADLE.x + 12, CRADLE.y + 24, [24, 18, 22, 12], 4.4, CRADLE_TOP + 0.6, "lo"));
  cradle.push(screws([[CRADLE.x + 5, CRADLE.y + 5], [CRADLE.x + CRADLE.w - 5, CRADLE.y + CRADLE.d - 5]], CRADLE_TOP, 1.4));
  cradle.push(S(cyl(CRADLE.x + 14, CRADLE.y + 9, 2.4, CRADLE_TOP, 1.2, 16), { tone: "mid" }));
  cradle.push(`<g data-part="lamp">${D([at([CRADLE.x + 14, CRADLE.y + 9, CRADLE_TOP + 1.2])], { size: 1.3, tone: "lo" })}</g>`);
  cradle.push(S(cyl(BUTTON[0], BUTTON[1], 6, CRADLE_TOP, 1.2, 28), { tone: "mid" }));
  cradle.push(
    `<g data-part="button">${S(cyl(BUTTON[0], BUTTON[1], 4.4, CRADLE_TOP + 1.2, 3, 28, 0.5), { tone: "hi" })}${k.faceTextSvg(k.topMatrix([BUTTON[0], BUTTON[1] + 1.4], CRADLE_TOP + 4.2, P, "x"), "↶", { size: 5, tone: "lo", anchor: "middle" })}</g>`,
  );
  const box: Plan = { x: 44, y: -8, w: 14, d: 16, r: 1 };
  cradle.push(S(slab(box, 0, 9, 3, 0.4), { tone: "mid" }));
  cradle.push(D([at([box.x + 3, box.y + 3, 9]), at([box.x + box.w - 3, box.y + box.d - 3, 9])], { size: 0.4 }));
  cradle.push(
    `<g data-part="cable">${k.wireSvg(at([-102, CRADLE.y + CRADLE.d, 6]), at([box.x + 7, box.y + box.d, 4.5]), {
      via: [at([-102, 16, 0.6]), at([box.x + 7, 16, 0.6])],
      tone: "lo",
    })}</g>`,
  );

  // Filing cabinet: body, three fixed drawer fronts with handles and card
  // slots, and the moving drawer (its outside part rebuilt as it slides).
  const cabinet: string[] = [];
  const front = (z: number) =>
    S(slab({ x: DRAWER.x, y: FACE, w: DRAWER.w, d: 1.4, r: 0.6 }, z, DRAWER.h, 3, 0.3), { tone: "mid" }) +
    S(slab({ x: DRAWER.x + 21, y: FACE + 1.4, w: 16, d: 2.2, r: 0.8 }, z + 6, 2.4, 3, 0.2), { tone: "mid" }) +
    L(k.segment([DRAWER.x + 5, FACE + 1.4, z + DRAWER.h - 3], [DRAWER.x + 15, FACE + 1.4, z + DRAWER.h - 3], P), { tone: "faint", free: true });
  cabinet.push(S(slab(CAB, 0, CAB_H, 4, 1), { tone: "mid" }));
  cabinet.push(L(k.planOutline(k.insetPlan(CAB, 4), CAB_H, P, 3), { tone: "lo" }));
  cabinet.push(screws(k.corners(CAB, 6), CAB_H, 1.2));
  for (const z of [23, 42, 61]) cabinet.push(front(z));
  cabinet.push(L(k.segment([CAB.x, FACE, 3], [CAB.x + CAB.w, FACE, 3], P), { tone: "faint" }));
  cabinet.push(`<g data-part="drawer-back"></g>`);
  cabinet.push(`<g data-part="drawer-block" style="opacity:0">${S(slab(BLOCK, 0, BLOCK_H, 3, 0.6), { tone: "hi", lit: true })}</g>`);
  cabinet.push(`<g data-part="drawer-side"></g>`);
  cabinet.push(`<g data-part="drawer-front">${front(DRAWER.z)}</g>`);

  // Rails and end stops in front, and the shuttle on them.
  const rail: string[] = [];
  for (const y of [RAIL_Y - 9, RAIL_Y + 5]) {
    rail.push(S(slab({ x: -120, y, w: 232, d: 4, r: 1 }, 0, 3, 3, 0.4), { tone: "mid" }));
    rail.push(D([-110, -20, 60, 104].map((x) => at([x, y + 2, 3])), { size: 0.4, tone: "lo" }));
  }
  for (const x of [-125, 112]) {
    rail.push(S(slab({ x, y: RAIL_Y - 12, w: 5, d: 24, r: 1.2 }, 0, 7, 3, 0.5), { tone: "mid" }));
    rail.push(D([at([x + 2.5, RAIL_Y - 7, 7]), at([x + 2.5, RAIL_Y + 7, 7])], { size: 0.45 }));
  }
  const car: string[] = [`<path class="iso-halo" d="${k.haloOf({ x: -12, y: RAIL_Y - 11, w: 24, d: 22, r: 2 }, 3, 0.1, P)}" style="filter:blur(4px)"/>`];
  car.push(S(slab({ x: -14, y: RAIL_Y - 12, w: 28, d: 24, r: 2 }, 3, CAR_TOP - 3, 4, 0.6), { tone: "mid" }));
  car.push(D([[-11, RAIL_Y - 9], [11, RAIL_Y - 9], [-11, RAIL_Y + 9], [11, RAIL_Y + 9]].map(([x, y]) => at([x, y, CAR_TOP])), { size: 0.45 }));
  car.push(L(k.planOutline({ x: -9, y: RAIL_Y - 9, w: 18, d: 18, r: 1 }, CAR_TOP, P, 3), { tone: "faint" }));

  // The change itself: the one lit block.
  const change = S(slab(BLOCK, 0, BLOCK_H, 3, 0.6), { tone: "hi", lit: true }) + L(k.planOutline(k.insetPlan(BLOCK, 2.6), BLOCK_H, P, 3), { tone: "lo" });

  return {
    base,
    cradle: cradle.join(""),
    cabinet: cabinet.join(""),
    rail: rail.join(""),
    car: `<g data-part="car" transform="${k.translateAlong(P, [HOME, 0, 0])}">${car.join("")}</g>`,
    block: `<g data-part="block" transform="${k.translateAlong(P, [HOME, RAIL_Y, CAR_TOP])}">${change}</g>`,
  };
}

export const ART = build();
