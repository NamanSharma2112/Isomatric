/* Shared parts for figures drawn as SVG strings: a surface plate on feet, an
   open tray, and short helpers bound to one projection. Pure, so it runs on
   the server or the client, and the strings it returns are the same markup
   <Solid>, <Line> and <Dots> draw. */

import * as k from "./iso-kit";
import type { Plan, Point3, Projection, SolidPaths, SolidStyle, LineStyle, Tone } from "./iso-kit";

export { k };
export type { Plan, Point3, Projection };

export function draw(P: Projection) {
  const at = (p: Point3) => k.iso(p, P);
  const S = (paths: SolidPaths, style?: SolidStyle) => k.solidSvg(paths, style);
  const L = (d: string, style?: LineStyle) => k.lineSvg(d, style);
  const D = (points: [number, number][], style?: { size?: number; tone?: Tone }) => k.dotsSvg(points, style);
  const slab = (plan: Plan, z: number, h: number, steps = 4, bevel = 0.5) => k.slabOf(plan, z, h, P, steps, bevel);
  const cyl = (x: number, y: number, r: number, z: number, h: number, steps = 28, bevel = 0) => k.cylinder(x, y, r, z, h, P, steps, bevel);
  const byDepth = <T extends [number, number]>(points: T[]) =>
    [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
  const halo = (plan: Plan, z: number, h: number, blur = 0) =>
    `<path class="iso-halo" d="${k.haloOf(plan, z, h, P)}"${blur ? ` style="filter:blur(${blur}px)"` : ""}/>`;
  /** Two screws with rings, as on a plate's corners. */
  const screws = (points: [number, number][], z: number, r = 2) =>
    L(points.map(([x, y]) => k.ring(x, y, r, z, P, 16)).join(""), { tone: "lo" }) + D(points.map(([x, y]) => at([x, y, z])), { size: 0.5 });
  /** Rule lines that stand for printed text, on a top face. */
  const rules = (x: number, y: number, widths: number[], gap: number, z: number, tone: Tone = "faint") =>
    L(widths.map((w, i) => k.lineOnTop([x, y + i * gap], [x + w, y + i * gap], z, P)).join(""), { tone, free: true });
  return { at, S, L, D, slab, cyl, byDepth, halo, screws, rules };
}

export type Bench = { plate: Plan; height?: number; foot?: number; ruler?: boolean; label?: [number, number] };

/**
 * The surface plate every figure stands on: feet, a groove, corner screws, a
 * ruler strip along the front edge and a small label plate.
 */
export function benchSvg(P: Projection, { plate, height = 10, foot = 5, ruler = true, label }: Bench) {
  const { S, L, D, at, slab, cyl, byDepth, halo, screws, rules } = draw(P);
  const out = [halo(plate, -height - foot, height)];
  for (const [x, y] of byDepth(k.corners(plate, 20))) {
    out.push(S(cyl(x, y, 6.5, -height - foot, 1.6), { tone: "lo" }));
    out.push(S(cyl(x, y, 5, -height - foot + 1.6, foot - 1.6), { tone: "mid" }));
  }
  out.push(S(slab(plate, -height, height, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(plate, 5), 0, P), { tone: "lo" }));
  out.push(screws(k.corners(plate, 10), 0, 2.2));
  if (ruler) {
    const strip = { x: plate.x + 18, y: plate.y + plate.d - 13, w: plate.w - 36, d: 6, r: 1 };
    out.push(S(slab(strip, 0, 0.6, 3, 0), { tone: "lo", crease: "none" }));
    const t = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [1.8, 3.4], P);
    out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
    out.push(D([at([strip.x + 2, strip.y + 3, 0.6]), at([strip.x + strip.w - 2, strip.y + 3, 0.6])], { size: 0.45 }));
  }
  if (label) {
    const [x, y] = label;
    const tag = { x, y, w: 26, d: 12, r: 1 };
    out.push(S(slab(tag, 0, 0.8, 3, 0.2), { tone: "lo" }));
    out.push(rules(x + 4, y + 3.5, [16, 12, 9], 2.6, 0.8));
    out.push(D([at([x + 2, y + 2, 0.8]), at([x + 24, y + 10, 0.8])], { size: 0.4, tone: "lo" }));
  }
  return out.join("");
}

/** A raised, bevelled tray with walls, drawn as back + left walls, then whatever goes inside, then right + front walls. */
export function trayParts(P: Projection, plan: Plan, z: number, wall: number, t = 2.4) {
  const { S, slab } = draw(P);
  const floor = S(slab(plan, z, 2, 4, 0.4), { tone: "lo" });
  const back = S(slab({ x: plan.x, y: plan.y, w: plan.w, d: t, r: 0.6 }, z + 2, wall, 3, 0.3), { tone: "mid" });
  const left = S(slab({ x: plan.x, y: plan.y + t, w: t, d: plan.d - t * 2, r: 0.6 }, z + 2, wall, 3, 0.3), { tone: "mid" });
  const right = S(slab({ x: plan.x + plan.w - t, y: plan.y + t, w: t, d: plan.d - t * 2, r: 0.6 }, z + 2, wall, 3, 0.3), { tone: "mid" });
  const front = S(slab({ x: plan.x, y: plan.y + plan.d - t, w: plan.w, d: t, r: 0.6 }, z + 2, wall, 3, 0.3), { tone: "mid" });
  return { behind: floor + back + left, before: right + front };
}
