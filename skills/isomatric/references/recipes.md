# Part recipes

Shown in the string form (`parts.ts` helpers: `S` solid, `L` line, `D` dots, `slab`, `cyl`, `at`). In JSX, `S(paths, style)` is `<Solid paths={…} {...style} />` and `L(d, style)` is `<Line d={…} {...style} />`. Heights are world units, z up. Draw each recipe's pieces in the order listed.

## Surface plate (the bench)

```ts
const PLATE = { x: -130, y: -64, w: 260, d: 128, r: 8 };
benchSvg(P, { plate: PLATE, label: [PLATE.x + PLATE.w - 40, PLATE.y + 8] });
```
Halo, four feet (flange `lo` + foot `mid`, sorted by depth), a 10-high bevelled slab (`mid`), a groove inset 5 (`lo`), corner screws (ring + dot), a ruler strip along the front edge with ticks every 4 and a major every 5th, and a label plate with three rule lines. Nearly every figure stands on one.

## Rails, end stops and a carriage

```ts
for (const y of [RAIL_Y - 8, RAIL_Y + 4]) S(slab({ x: -120, y, w: 236, d: 4, r: 1 }, 0, 3, 3, 0.4), { tone: "mid" });
S(slab({ x: 116, y: RAIL_Y - 11, w: 6, d: 22, r: 1.2 }, 0, 8, 3, 0.5), { tone: "mid" });     // end stop + 2 screw dots
// carriage, built at x = 0 and moved with translateAlong(P, [x, 0, 0]):
S(slab({ x: -13, y: RAIL_Y - 12, w: 26, d: 24, r: 2 }, 3, 5, 4, 0.6), { tone: "mid" });
D(fourCorners.map((p) => at([...p, 8])), { size: 0.45 });                                 // bushing screws
S(cyl(9, RAIL_Y + 14.5, 2.6, 3, 4, 20), { tone: "mid" }) + L(k.knurl(9, RAIL_Y + 14.5, 2.6, 3, 7, 16, P));  // stop knob
```
Put a blurred `haloOf` under the carriage so it reads as lifted off the rails.

## An open tray with a stack in it

```ts
const { behind, before } = trayParts(P, { x, y, w: 54, d: 46, r: 1.6 }, 0, 10);
behind + stackTiles + before + L(k.sideTicks(x0, x1, 4, 3, y + d, 12, [1.6, 3], P).minor);
```
Tiles in the stack are all drawn once and shown or hidden by count; a tray's front wall can carry a tick scale that counts them.

## Dial gauge, face up

```ts
S(cyl(x, y, R, z, 8, 64, 0.8), { tone: "hi", crease: "lo" });   // puck
L(k.knurl(x, y, R, top - 3.4, top, 90, P, 0.3));                 // bezel knurl
L(k.ring(x, y, R - 2.4, top, P, 64));                             // bezel ring
const t = k.radialTicks(x, y, R - 3.4, 50, 5, top, [1.6, 3.4], P);  // minor lo, major mid
L(k.ring(x, y, 2, top, P, 16), { tone: "mid" });                  // hub
needle: k.lineOnTop(tail, tip, top + 0.2, P), tone lit, stroke-width 1.1–1.2, rebuilt per frame
```
Stand it on a column (`cyl`, crease none, two `sideArc` seams) on a round foot with two screws.

## Keycap on a stem

```ts
S(cyl(cx, cy, 2.6, housingTop, keyZ - housingTop, 16), { tone: "lo", crease: "none" });   // stem
S(slab(cap, keyZ, 7, 5, 1.2), { tone: "mid" });                                          // cap
L(k.planOutline(k.insetPlan(cap, 3.2), keyZ + 7, P, 4), { tone: "faint" });              // dish
k.faceTextSvg(k.topMatrix([cx, cy + 2.6], keyZ + 7, P, "x"), "⌘", { size: 8, anchor: "middle" });
```
Leave a gap of about 3 between cap and housing; a press moves the cap down until it meets the housing (never into it).

## A part on posts that rise

Build the panel at rest and move it with `translateAlong`. The posts are the one thing whose shape changes: rebuild them as cylinders from the sleeve top to the panel's underside each time the height changes. Draw the stand and posts first, then the panel.

## Spindle through a stack

Draw the full rod first, then the stack (each card hides the rod beneath it), then the rod again from the top card to the tip, plus its cap. Rebuild that top segment whenever the stack height or a falling card's height changes.

## Drawer that slides out

The drawer's front is a thin slab moved along its axis. Its outside part (floor, left wall, right wall) is rebuilt from the cabinet face to the front each frame, so nothing is ever drawn inside the cabinet. Draw floor and the far wall, then anything held in the drawer, then the near wall, then the front.

## Desk clock or any face-up dial with hands

Foot (`lo`), drum (`hi`, crease `lo`), a knurl band, a bezel ring, 60 ticks with a major every 5th, a winding key on the side, two hands as `lineOnTop` (hour heavier, minute longer), and a hub dot.

## Coil spring round a rod

```ts
const c = k.coil(x0, x1, [y, z], 4.2, 6, "x", P);
L(c.back, { tone: "lo" }); /* the rod */ L(c.front, { tone: "mid" });
```
Rebuild the coil when it compresses by changing `x0`/`x1`.

## Cable between two parts

`k.wireSvg(at(startOnFace), at(endOnFace), { via: [at(floorPoint1), at(floorPoint2)] })`. Both ends sit on a real face, and the run lies on the floor beside the structure, never across the subject. Set `data-flow` on its path while something travels along it.

## Label plate and rule lines

A thin slab (`lo`, 0.8 high) with three `lineOnTop` rule lines of different lengths (`free: true`, they stand for print) and two screw dots. It gives a plain region of the bench a reason to be there.
