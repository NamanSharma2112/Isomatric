/* Activity spindle. Every change lands as a card on a spindle, newest on
   top, and a desk clock beside it moves on with each one. Pure: the model
   and every static path. */

import { benchSvg, draw, k, type Plan, type Projection } from "@/components/iso/parts";

export const WIDTH = 600;
export const HEIGHT = 360;
const PLATE: Plan = { x: -112, y: -62, w: 224, d: 124, r: 8 };
const BASE: Plan = { x: -66, y: -38, w: 76, d: 76, r: 8 };
export const BASE_TOP = 10;
const BOSS_H = 2.4;
/** Where the first card rests: on the rod's boss. */
export const STACK_FLOOR = BASE_TOP + BOSS_H;
export const ROD: [number, number] = [-28, 0];
export const ROD_TIP = 70;
const CARD: Plan = { x: -60, y: -22, w: 64, d: 44, r: 1.4 };
export const CARD_H = 1.2;
export const PITCH = 1.7;
export const MAX = 12;
const CLOCK: [number, number] = [56, 12];
const CLOCK_R = 22;
const CLOCK_TOP = 16;

/** A worked example feed. */
export const FEED = [
  "Sara moved Product Launch",
  "Jordan completed Release 2.4",
  "Emma joined Marketing",
  "You created Triage feedback",
  "Priya commented on creatives",
  "You completed Sitemap review",
];

export const P: Projection = k.fitProjection(
  [...k.boxCorners(PLATE, -15, 0), [ROD[0], ROD[1], ROD_TIP + 12], [CARD.x, CARD.y, BASE_TOP]],
  WIDTH,
  HEIGHT,
  { pad: 52, azimuth: 44 },
);

function card(z: number, lit: boolean) {
  const { S, D, at, rules } = draw(P);
  const top = z + CARD_H;
  return (
    S(k.slabOf(CARD, z, CARD_H, P, 3, 0.2), { tone: lit ? "hi" : "mid", lit, crease: "none" }) +
    k.lineSvg(k.ring(ROD[0], ROD[1], 2.6, top, P, 18), { tone: "lo" }) +
    D([at([CARD.x + 7, CARD.y + 7, top])], { size: 1.6, tone: lit ? "hi" : "lo" }) +
    rules(CARD.x + 12, CARD.y + 6, [22], 0, top, lit ? "mid" : "lo") +
    rules(CARD.x + 6, CARD.y + 14, [18, 14], 4, top, "faint") +
    rules(CARD.x + 40, CARD.y + 34, [16], 0, top, "faint")
  );
}

/** The rod above whatever is highest, and its cap: cards hide the rod below them. */
export function rodAbove(from: number) {
  const z = Math.min(ROD_TIP, from);
  return (
    (z < ROD_TIP ? k.solidSvg(k.cylinder(ROD[0], ROD[1], 1.6, z, ROD_TIP - z, P, 16), { tone: "mid", crease: "none" }) : "") +
    k.solidSvg(k.cylinder(ROD[0], ROD[1], 2.2, ROD_TIP, 2, P, 16), { tone: "mid" })
  );
}

/** A hand on the clock, at a fraction of a turn. */
export function handAt(turn: number, length: number) {
  const a = turn * Math.PI * 2;
  const [x, y] = CLOCK;
  return k.lineOnTop([x - Math.sin(a) * 2.5, y + Math.cos(a) * 2.5], [x + Math.sin(a) * length, y - Math.cos(a) * length], CLOCK_TOP + 0.2, P);
}
export const HOUR_LEN = CLOCK_R - 10;
export const MINUTE_LEN = CLOCK_R - 5;

function build() {
  const { S, L, D, at, slab, cyl, screws } = draw(P);
  const base = benchSvg(P, { plate: PLATE, label: [PLATE.x + PLATE.w - 40, PLATE.y + 8] });

  // Weighted base with a groove and screws, the boss and the full rod.
  const block: string[] = [];
  block.push(S(slab(BASE, 0, BASE_TOP, 8, 1.4), { tone: "mid" }));
  block.push(L(k.planOutline(k.insetPlan(BASE, 4), BASE_TOP, P, 6), { tone: "lo" }));
  block.push(screws(k.corners(BASE, 8), BASE_TOP, 1.4));
  block.push(S(cyl(ROD[0], ROD[1], 6, BASE_TOP, BOSS_H, 28, 0.4), { tone: "mid" }));
  block.push(S(cyl(ROD[0], ROD[1], 1.6, STACK_FLOOR, ROD_TIP - STACK_FLOOR, 16), { tone: "mid", crease: "none" }));

  // Every card in the stack is drawn; the live layer shows one per event.
  // Then the falling card, then the rod above the highest card.
  const cards: string[] = [];
  for (let i = 0; i < MAX; i++) cards.push(`<g data-i="${i}" style="display:none">${card(STACK_FLOOR + i * PITCH, false)}</g>`);
  cards.push(`<g data-part="drop" style="opacity:0">${card(0, true)}</g>`);
  cards.push(`<g data-part="rodtop">${rodAbove(STACK_FLOOR)}</g>`);

  // Desk clock: foot, drum, bezel, sixty ticks, a winding key and two hands.
  const [x, y] = CLOCK;
  const clock: string[] = [];
  clock.push(S(cyl(x, y, CLOCK_R + 3, 0, 3, 48, 0.6), { tone: "lo" }));
  clock.push(S(cyl(x, y, CLOCK_R, 3, CLOCK_TOP - 3, 64, 0.8), { tone: "hi", crease: "lo" }));
  clock.push(L(k.knurl(x, y, CLOCK_R, 3, 7, 70, P, 0.3), { tone: "faint" }));
  clock.push(L(k.ring(x, y, CLOCK_R - 2.2, CLOCK_TOP, P, 64), { tone: "lo" }));
  const t = k.radialTicks(x, y, CLOCK_R - 3, 60, 5, CLOCK_TOP, [1, 2.6], P);
  clock.push(L(t.minor, { tone: "faint" }), L(t.major, { tone: "mid" }));
  clock.push(S(cyl(x + CLOCK_R + 2, y, 2.4, 9, 3, 16), { tone: "mid" }));
  clock.push(`<path data-part="hour" class="iso-line" data-tone="hi" data-free="start" style="stroke-width:1.3" d="${handAt(10 / 12, HOUR_LEN)}"/>`);
  clock.push(`<path data-part="minute" class="iso-line" data-tone="hi" data-free="start" style="stroke-width:.9" d="${handAt(10 / 60, MINUTE_LEN)}"/>`);
  clock.push(D([at([x, y, CLOCK_TOP])], { size: 1, tone: "hi" }));

  return { base, block: block.join(""), cards: cards.join(""), clock: clock.join("") };
}

export const ART = build();
