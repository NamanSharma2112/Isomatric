# Kit reference

Everything here is in `components/iso`. `P` is a `Projection` from `fitProjection`. A `Plan` is a rounded rectangle on the floor, `{ x, y, w, d, r }`; `Plane` is `[x, y]`, `Point3` is `[x, y, z]`, `Flat` is a screen point. World z is up.

## Camera — `iso-kit.ts`

| Function | What it does |
| --- | --- |
| `fitProjection(points, width, height, { pad, headroom, azimuth, elevation })` | The projection that fits `points` in the canvas. Defaults: azimuth 45, elevation 30. |
| `iso([x, y, z], P)` | World point to screen point. |
| `depthOf([x, y, z], P)` | Depth for sorting: larger is nearer the viewer. |
| `towardViewer(P)` | The floor direction that faces the viewer, for choosing visible sides. |
| `axisVector(P, [dx, dy, dz])` | Screen vector of a world move. |
| `translateAlong(P, [dx, dy, dz])` | A `translate(...)` string that moves a group by a world vector. The way to move a part built at rest. |
| `screenRise(h, P)` | Screen height of a world height. |
| `groundSlide(P)` | How far one unit of rise slides along the ground on screen. |
| `topMatrix(at, z, P, "x" \| "y")`, `sideMatrix(at, z, P, "left" \| "right")` | A `matrix(...)` that lays a group (text, a screen) flat on a top face or a side face. |

## Solids

All return `SolidPaths` (`fill`, `outline`, `crease`, `top`, `shades[4]`, `bevel`), drawn by `<Solid>` or `solidSvg`.

| Function | Shape |
| --- | --- |
| `slabOf(plan, z, height, P, steps = 8, bevel = 0)` | A rounded box. `steps` are the facets per corner; `bevel` catches light on the top edge. |
| `cylinder(cx, cy, r, z, height, P, steps = 32, bevel = 0)` | A vertical cylinder. |
| `extrude(ring, z, height, P, options)` | Any plan outline (a list of `Plane`) extruded up. |
| `opening(cx, cy, r, top, depth, P)` | A round hole in a top face: `hole`, `wall`, `foot` paths. Cut the hole through the fill with `fill-rule: evenodd`. |

## Lines and marks

| Function | Draws |
| --- | --- |
| `planOutline(plan, z, P, steps)` | A plan's outline lying at height z: grooves and inset borders (with `insetPlan(plan, by)`). |
| `lineOnTop(from, to, z, P)`, `onTop(points, z, P, closed)` | Lines lying on a top face: pointers, rule lines, needles. |
| `segment(from3, to3, P)`, `rise(at, z0, z1, P)` | A straight 3D line; a vertical one. |
| `ring(cx, cy, r, z, P, steps)` | A full circle on a top face: screw rings, bezels, hubs. |
| `sideArc(cx, cy, r, z, P)` | The visible half of a ring round a cylinder: seams and bands. |
| `sideSeam(plan, z, P, steps)` | A seam round a box's visible sides, ending exactly on its silhouette. |
| `sideRing(center, r, "x" \| "y", P)` | A ring standing on a side face (wheels, port rims). |
| `knurl(cx, cy, r, z0, z1, count, P)` | Vertical knurl lines on the visible side of a knob. |
| `coil(from, to, [cy, cz], r, turns, "x" \| "y", P)` | A spring along x or y, as `back` and `front` halves for painter's order. |
| `topTicks(from, to, step, every, edge, z, [minor, major], P, axis)` | Ruler ticks growing from a strip's edge on a top face. |
| `sideTicks(from, to, step, every, face, top, [minor, major], P, axis)` | Ticks hanging from the top edge of a side face (also vent slots, with equal lengths). |
| `radialTicks(cx, cy, r, count, every, z, [minor, major], P, from, span)` | Dial ticks. |
| `corners(plan, inset)`, `boxCorners(plan, z0, z1)`, `dotGrid(...)` | Points: screw positions, fit points, perforations. |
| `haloOf(plan, z, h, P)` | The soft shadow under a part (class `iso-halo`). |

## Drawing — `react/draw.tsx` (server-safe)

| Component | Props |
| --- | --- |
| `<Solid paths tone crease halo lit flat inner />` | `tone`: `hi` `mid` `lo` `faint`; `lit` for the one accent; `flat` for inlays under 1 unit; `inner` for seams drawn under the outline. |
| `<Line d tone dotted dashed flow free />` | `tone` adds `lit` `red` `green` `blue`; `flow` animates a dash along it; `free` marks a line allowed to stop on a face. |
| `<Wire from to via tone flow ends />` | A cable with terminal dots that land on parts. |
| `<Dots points size tone pulse />` | Screws, rivets, LEDs. |
| `<FaceText transform size tone anchor>` | Engraved text, with `topMatrix` or `sideMatrix`. |
| `<IsoFigure width height label>` | The `<svg>`, with `role="img"` and the label. |
| `<Plate fig title hint readout keys caption>` | The card. `keys`: `{ mark, label }`, `mark` one of `raised` `flat` `lit` `edge` `dim` `dotted` `dashed`. |

The same markup as strings, for figures that build SVG in `.ts` files: `solidSvg`, `lineSvg`, `dotsSvg`, `wireSvg`, `faceTextSvg`.

## String parts — `parts.ts`

| Function | Gives |
| --- | --- |
| `draw(P)` | Short helpers bound to one projection: `S` (solid), `L` (line), `D` (dots), `at`, `slab`, `cyl`, `byDepth`, `halo`, `screws`, `rules`. |
| `benchSvg(P, { plate, height, foot, ruler, label })` | The standard surface plate: halo, feet in depth order, bevelled slab, groove, corner screws, ruler strip and label plate. |
| `trayParts(P, plan, z, wall)` | An open tray as `{ behind, before }`: draw `behind`, then the contents, then `before`. |

## Live — `react/live.tsx` and `react/tour.tsx` (client)

| Hook | Use |
| --- | --- |
| `useLoop((dt, calm) => more, running)` | One rAF loop; `dt` is clamped to 1/30 s; return `false` to park it. Returns `kick()` to restart it. |
| `useInView(ref)` | True while the figure is near the viewport; pass it as `running`. |
| `useReadout()` | `{ anchor, say }`: put `anchor` on the figure's root; `say(text)` writes the plate's readout without re-rendering. |
| `follow(current, target, dt, seconds, calm)` | Exponential ease toward a target; snaps when `calm`. |
| `spring(state, target, dt, stiffness, damping, calm)` | A sub-stepped spring; returns true once settled. |
| `useStillness()`, `asksForStillness()` | Reduced-motion preference. |
| `useTour(anchor, length, pose)` | A story told event by event: calls `pose(n, t)`, pauses on hover, steps on click or Enter/Space, shows each event finished under reduced motion. Spread `handlers` on the root. |

## Teardown — `react/teardown.tsx` (client)

```tsx
const td = useTeardown({ gap: 30, width: WIDTH });
<IsoFigure …>
  <g ref={td.frame}>
    <g ref={td.lift(0, "Bench", [0.8, 0.7], "r")}>{props.base}</g>
    <TeardownTrails td={td} />
    <g ref={td.lift(1, "Rails", [0.12, 0.3], "l")}>{props.rails}</g>
    <g ref={td.lift(1)}>{props.carriage}</g>  {/* moves: rides with the rails, no label */}
    <TeardownLabels td={td} />
  </g>
</IsoFigure>
<TeardownToggle td={td} />
```

`lift(level, label?, [fx, fy], side?)`: `level` × `gap` is how far the layer rises; `[fx, fy]` is where on the layer's bounding box the leader lands (fractions); `side` forces the label lane (`"l"` or `"r"`).
