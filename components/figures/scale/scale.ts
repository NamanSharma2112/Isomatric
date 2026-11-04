/* Progress scale. A platform scale weighs a project's finished tasks: one
   plate per done task, a collar on the post marking the total, and a dial
   reading done ÷ total. Pure: the model and every static path. */

import { benchSvg, draw, k, type Plan } from "@/components/iso/parts";

export const WIDTH = 600;
export const HEIGHT = 360;
const PLATE: Plan = { x: -126, y: -62, w: 252, d: 124, r: 8 };
const BODY: Plan = { x: -110, y: -46, w: 96, d: 92, r: 4 };
const BODY_TOP = 16;
const PAN: Plan = { x: -102, y: -38, w: 80, d: 76, r: 3 };
const PAN_Z = 20;
const PAN_H = 3;
const PAN_TOP = PAN_Z + PAN_H;
const WEIGHT: Plan = { x: -78, y: -16, w: 40, d: 36, r: 1.5 };
export const PITCH = 3.2;
export const MAX = 10;
const POST: [number, number] = [-94, -30];
const DIAL: [number, number] = [64, -2];
const DIAL_R = 30;
const DIAL_Z = 40;
const DIAL_TOP = DIAL_Z + 8;

/** A worked example: project, tasks done, tasks in all. */
export const PROJECTS: [string, number, number][] = [
  ["Website Redesign", 2, 9],
  ["Mobile App", 2, 10],
  ["Marketing Campaign", 1, 7],
  ["Product Launch", 0, 6],
  ["Design System", 1, 6],
  ["Customer Portal", 2, 9],
];

export const readoutOf = (name: string, done: number, total: number) => `${name} · ${done}/${total} · ${Math.round((done / total) * 100)}%`;

export const P = k.fitProjection(
  [...k.boxCorners(PLATE, -15, 0), [POST[0], POST[1], PAN_TOP + MAX * PITCH + 4], [DIAL[0], DIAL[1] - DIAL_R, DIAL_TOP]],
  WIDTH,
  HEIGHT,
  { pad: 52, azimuth: 42 },
);

/** The needle at a share done, 0–100: one full turn is the whole project. */
export function needleAt(pct: number) {
  const a = (pct / 100) * Math.PI * 2;
  const [x, y] = DIAL;
  const r = DIAL_R - 6;
  return k.lineOnTop([x - Math.sin(a) * 4, y + Math.cos(a) * 4], [x + Math.sin(a) * r, y - Math.cos(a) * r], DIAL_TOP + 0.2, P);
}

function build() {
  const { S, L, D, at, slab, cyl, screws, halo } = draw(P);
  const base = benchSvg(P, { plate: PLATE, label: [PLATE.x + PLATE.w - 40, PLATE.y + PLATE.d - 32], ruler: false });

  // The cable from the load cell to the dial lies on the plate.
  const cable = k.wireSvg(at([BODY.x + BODY.w, 18, 8]), at([DIAL[0] - 5, DIAL[1] + 3, 10]), {
    via: [at([10, 18, 0.6]), at([40, 18, 0.6]), at([DIAL[0] - 5, DIAL[1] + 3, 0.6])],
    tone: "lo",
  });

  // Load cell: housing, vent slots and the column the pan sits on.
  const cell: string[] = [];
  cell.push(S(slab(BODY, 0, BODY_TOP, 6, 1), { tone: "mid" }));
  cell.push(L(k.planOutline(k.insetPlan(BODY, 4), BODY_TOP, P, 4), { tone: "lo" }));
  cell.push(screws(k.corners(BODY, 7), BODY_TOP, 1.4));
  const vents = k.sideTicks(BODY.x + 14, BODY.x + 50, 4, 100, BODY.y + BODY.d, 11, [6, 6], P);
  cell.push(L(vents.minor + vents.major, { tone: "lo" }));
  cell.push(S(cyl(-62, 0, 9, BODY_TOP, PAN_Z - BODY_TOP, 28), { tone: "mid" }));

  // The pan moves as one: plate, backstop post with tick rings, the collar
  // that marks the total, and every weight (shown as tasks get done).
  const pan: string[] = [halo(k.insetPlan(PAN, 6), PAN_Z, 0.1, 4)];
  pan.push(S(slab(PAN, PAN_Z, PAN_H, 6, 0.6), { tone: "mid" }));
  pan.push(L(k.planOutline(k.insetPlan(PAN, 3), PAN_TOP, P, 4), { tone: "faint" }));
  pan.push(D(k.corners(PAN, 5).map(([x, y]) => at([x, y, PAN_TOP])), { size: 0.45 }));
  pan.push(S(cyl(POST[0], POST[1], 3.4, PAN_TOP, 1.4, 20), { tone: "mid" }));
  pan.push(S(cyl(POST[0], POST[1], 2, PAN_TOP + 1.4, MAX * PITCH + 2, 18), { tone: "mid", crease: "none" }));
  pan.push(L(Array.from({ length: MAX }, (_, i) => k.sideArc(POST[0], POST[1], 2, PAN_TOP + (i + 1) * PITCH, P, 10)).join(""), { tone: "lo" }));
  pan.push(S(cyl(POST[0], POST[1], 2.6, PAN_TOP + MAX * PITCH + 3.4, 1, 18), { tone: "mid" }));
  pan.push(
    `<g data-part="collar">${S(cyl(POST[0], POST[1], 4, PAN_TOP, 1.6, 22), { tone: "hi" })}${D([at([POST[0] + 4, POST[1] + 1, PAN_TOP + 0.8])], { size: 0.6, tone: "hi" })}</g>`,
  );
  for (let i = 0; i < MAX; i++) {
    const z = PAN_TOP + i * PITCH;
    const w = S(slab(WEIGHT, z, PITCH - 0.4, 4, 0.4), { tone: "hi", lit: true });
    pan.push(`<g data-i="${i}" style="display:none">${w}${L(k.planOutline(k.insetPlan(WEIGHT, 3), z + PITCH - 0.4, P, 3), { tone: "faint" })}</g>`);
  }

  // Dial on a pedestal: foot, column, bezel, face, ticks and the needle.
  const dial: string[] = [];
  dial.push(S(cyl(DIAL[0], DIAL[1], 16, 0, 3, 32, 0.6), { tone: "mid" }));
  dial.push(screws([[DIAL[0] - 10, DIAL[1] + 8], [DIAL[0] + 10, DIAL[1] - 8]], 3, 1.2));
  dial.push(S(cyl(DIAL[0], DIAL[1], 5, 3, DIAL_Z - 3, 24), { tone: "mid", crease: "none" }));
  dial.push(L([14, 26].map((z) => k.sideArc(DIAL[0], DIAL[1], 5, z, P, 12)).join(""), { tone: "faint" }));
  dial.push(S(cyl(DIAL[0], DIAL[1], DIAL_R, DIAL_Z, DIAL_TOP - DIAL_Z, 64, 0.8), { tone: "hi", crease: "lo" }));
  dial.push(L(k.knurl(DIAL[0], DIAL[1], DIAL_R, DIAL_TOP - 3.4, DIAL_TOP, 90, P, 0.3), { tone: "lo" }));
  dial.push(L(k.ring(DIAL[0], DIAL[1], DIAL_R - 2.4, DIAL_TOP, P, 64), { tone: "lo" }));
  const t = k.radialTicks(DIAL[0], DIAL[1], DIAL_R - 3.4, 50, 5, DIAL_TOP, [1.6, 3.4], P);
  dial.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  dial.push(L(k.ring(DIAL[0], DIAL[1], 2, DIAL_TOP, P, 16), { tone: "mid" }));
  dial.push(k.faceTextSvg(k.topMatrix([DIAL[0], DIAL[1] + 12], DIAL_TOP, P, "x"), "% done", { size: 3.4, tone: "lo", anchor: "middle" }));
  dial.push(`<path data-part="needle" class="iso-line" data-tone="lit" data-free="start" d="${needleAt(0)}" style="stroke-width:1.2"/>`);

  return {
    base: base + cable,
    cell: cell.join(""),
    pan: `<g data-part="pan">${pan.join("")}</g>`,
    dial: dial.join(""),
  };
}

export const ART = build();
