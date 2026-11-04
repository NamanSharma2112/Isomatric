---
name: isomatric
description: Builds interactive isometric figures for React in the Isomatric style — a real, well-made machine whose working is the idea it explains, drawn as shaded solids in painter's order, animated from a true model, and taken apart into a labelled teardown. Use when someone wants an isometric illustration, an explanatory or "how it works" figure, a technical drawing for a docs page, landing page, bento card or article, or a new figure for the Isomatric set, even if they never say "isometric".
---

# Isomatric

An Isomatric figure explains an idea by being a machine that does it. A cache is a pin-tumbler lock, an easing curve is a cam, churn is beads crossing a bar on an abacus, a task list's tabs are trays a shuttle fills. The reader understands the idea because they recognise the object and can watch it work.

Every figure in the set meets the same bar:

1. **A real object you could build.** Named at a glance, invented for the subject, never traced.
2. **Many small, precise parts.** 40–80 solids for a figure, each resting on another part and doing a job: feet, rails, stops, bushings, screws, knobs, ticks.
3. **Volume and calm.** Filled solids with four-tone sides and lighter tops, thin even lines, a soft halo underneath, one lit part.
4. **Truth.** The readout, the motion and the caption all come from one model. Invented numbers are labelled as a worked example.
5. **It comes apart.** Every figure has a teardown along its assembly path, one switch away.

## The reference implementation

This skill is written against [github.com/NamanSharma2112/isomatric](https://github.com/NamanSharma2112/isomatric). Before writing a figure, open the one closest to yours and copy its structure, not its object:

| Figure | Folder | Study it for |
| --- | --- | --- |
| Cam and slide | `cam` | A part driven by a true curve; pointer mapped to a crank |
| Churn abacus | `churn` | Many identical moving parts; a dial that reads the parts, not the model |
| Desk computer | `desk` | Content drawn in the plane of a face (a screen) |
| Workbench line | `bench` | Stations along a line; tools that move only while they work |
| Day-Date 40 | `watch` | Dense round parts; a teardown in six layers |
| Graphics card | `gpu` | A crowded board; a cooler that lifts clear |
| Task sorter | `sorter` | A shuttle on rails; stacks that count |
| Command keypad | `keypad` | Keys that travel; posts rebuilt as they extend |
| Progress scale | `scale` | A needle and collar easing to the model |
| Activity spindle | `spindle` | Parts that hide one another; gravity |
| Save and undo | `shuttle` | A drawer whose outside is rebuilt as it slides; a path run backwards |

The last five draw their static art as SVG strings with `components/iso/parts.ts` and play a story with `useTour`. The first six build JSX with `<Solid>` and `<Line>` and drive their own loop. Both are fine; pick the one that suits the motion.

## Workflow

Work in this order. Most of the quality is decided before the first path.

### 1. Find the truth

Collect the real numbers and behaviour of what you are explaining: sizes, counts, rates, thresholds, curves, the order things happen in. Write them as a small pure model in `<slug>.ts` (functions like `keptAt(row, month)` or `readoutOf(state)`), and drive the readout, the motion and the caption from it. Where you have no real data, say "a worked example" in the caption rather than presenting invented numbers as fact.

### 2. Invent the object

Pick a machine, instrument or piece of furniture whose mechanism maps one-to-one onto the idea, then say in one sentence what moves and what that motion means. If you cannot write that sentence, the object is wrong.

Two failures, both common:

- **Too abstract.** Floating slabs, stacked plates and labelled boxes standing for "layers" or "services". Make layers into drawers, trays in a rack, cards on a spindle or plates on guide posts.
- **Too plain.** One big slab with a few lines on it. Break it into a base, a carriage and parts, then add a groove, screws, a ruler strip and a label plate.

### 3. Write the parts list

Before any geometry, list at least 40 parts in groups, each resting on another: **base** (plate, feet, groove, corner screws, label plate, ruler strip), **structure** (posts, rails, frames, end stops), **mechanism** (carriage, bushings, springs, plungers, needles), **controls** (knobs, buttons, cranks), and the **subject**, the one lit part. Group them by assembly, because the groups become the teardown layers.

### 4. Plan the world and the camera

Use world units of roughly one pixel of the real thing: x and y on the floor, z up. Lay out plans as rounded rectangles `{ x, y, w, d, r }` and circles.

The kit's default camera is azimuth 45°, elevation 30°. **That is not true isometric.** At 30° elevation the ground lines rise one unit for every two across, which is 26.57°: the "2:1" dimetric view pixel artists call isometric. Verticals are foreshortened to cos 30° ≈ 0.87. True isometric, with ground lines at 30° and all three axes equally foreshortened, needs elevation 35.26° (arctan of 1/√2). Keep the default unless the brief asks for true isometric; it reads flatter and calmer, and every figure in the set uses it.

- Turn the azimuth (35–60°) so the face that carries the mechanism points at the viewer.
- Raise the elevation (up to ~44°) to look down into something open: a tray, a tank, a drawer.
- Fit with `fitProjection(points, WIDTH, HEIGHT, { pad, azimuth })` using the plate's box corners plus the tallest point the motion reaches. Use a 600 × 340–540 canvas and pad 40–56, so the teardown's labels have room at the sides. The object fills 55–65% of the card.

### 5. Build the geometry once

Every static path is computed once, when `<slug>.ts` loads, with the kit: `slabOf`, `cylinder`, `planOutline`, `topTicks`, `knurl`, `coil`, `radialTicks` and friends ([references/kit.md](references/kit.md)). Moving parts are built once at rest and moved with `translateAlong(P, [dx, dy, dz])`. Rebuild per frame only what changes shape: a needle (`lineOnTop`), a spring (`coil`), a post that extends, a drawer's visible length. [references/recipes.md](references/recipes.md) has the part recipes.

### 6. Paint back to front, bottom to top

SVG has no depth buffer: what is drawn later covers what is drawn earlier. So:

- Base first, then everything that rests on it.
- Within a level, sort by `depthOf([x, y, 0], P)`, ascending: far before near. At azimuth 45° nearer simply means a larger x + y.
- **Split anything that wraps another part.** A spring around a rod: back half, rod, front half. A tray around its contents: floor and back walls, contents, front walls (`trayParts` returns exactly this). A rod through a block: the segment below, the block, the segment above.
- If two parts each cover part of the other (a cycle), no order is right. Split one of them, or bound the motion so the order never flips. This is the general rule for the painter's algorithm, not a quirk of the kit.
- A moving part is drawn in the slot where it physically sits. If it can pass both in front of and behind the same neighbour, split the neighbour.

### 7. Frame it

Every figure sits in a `<Plate>`: `fig="Fig n"` top left, a short `title` top right, the interaction `hint` bottom left and the live `readout` bottom right. Then legend `keys` (mark plus label, at most three) and a true `caption` underneath. Words stay out of the drawing apart from at most one tiny engraved label (`FaceText` on a face) and key legends where they are the subject.

### 8. Make it live

One loop per figure (`useLoop`, or `useTour` for a story told event by event), stopped offscreen (`useInView`). The loop writes attributes on refs and the readout through `useReadout`, and never re-renders React per frame. Motion eases toward targets or follows real springs. Under reduced motion, jump to targets. Pointer and keyboard both work: arrows step, Home and End go to the extremes, Enter or Space acts. Details in [references/motion-and-teardown.md](references/motion-and-teardown.md).

### 9. Take it apart

Wrap each assembly in `<g ref={td.lift(level, label, [fx, fy], side)}>`. Levels follow the order the thing was put together: the bench is 0, what is bolted to it is 1, what rides on that is 2. Rules learned the hard way:

- **Lift along the assembly axis.** Parts set down onto one another rise straight up. Zero gap must rebuild the assembly exactly.
- **A moving part rides at the level of what it runs on, and carries no label.** Labels are measured once, at mount. A labelled shuttle leaves its label behind the moment it moves. Label the rail, not the carriage.
- **Anchor a label on the part, not on its bounding box's empty corner.** A plate seen in isometric is a rhombus, so `[0.12, 0.8]` of its box is empty air. Points like `[0.3, 0.6]` (left lane) and `[0.8, 0.7]` (right lane) land on it.
- **Short names.** "Rails", "Trays", "Dial". A label lane is a few words wide, and long names are clipped at the plate's edge.

### 10. Review like a critic

Look at the render, not the source. Capture light and dark, 390 px wide, assembled and apart, several moments of motion, and reduced motion, then zoom to 4× over every junction. Fix the largest fault first. The full checklist and a capture script are in [references/review.md](references/review.md).

## Tones

| Element | Tone |
| --- | --- |
| Base, feet, floors | `lo` |
| Structure: posts, rails, frames, carriages, cases | `mid` |
| The subject | `hi` |
| The one part to watch now | `lit` (exactly one) |
| Grooves, inset outlines | `faint` |
| Minor ticks / major ticks / zero mark and pointers | `lo` / `mid` / `hi` |
| Screws and rivets | dots, size 0.4–0.55, `mid` |

This follows technical illustration practice. Keep the shading in a narrow mid-tone band so outlines and the one highlight stay prominent, and let tone, not colour, carry form. The site's single accent (`--mark`, used for `lit`) is the only colour unless colour is itself the subject, such as RGB channels or status. Every colour is a token with a light and a dark value, so both themes work. Light is designed first.

## Craft rules

- **Solids, not wireframes.** Every part is filled with the paper colour, so things in front hide things behind. No see-through edges, no dashed hidden lines.
- **Lines end on something:** a face, another line or a terminal dot. A seam on a box wraps its corners (`sideSeam`), a line on one face runs edge to edge, ticks hang from a ruler strip's edge, and vents are closed slots. The only lines allowed to stop on a bare face are rule lines standing for printed text, a needle's tail and a pointer's tip. Mark those `free`.
- **No blueprint furniture in the drawing:** no balloons, dimension arrows, hatching or floating labels. They go in the legend and caption. The teardown's leaders are the one exception, and they live outside the object.
- **Detail is structure, not texture.** Bevels of 0.4–1.6, grooves inset 3–5 from an edge, screws at plate corners, knurls on knobs, ruler ticks every 4–5 units with a major every fifth, label plates with three rule lines. Every detail belongs to a part.
- **Volume.** Real thickness, parts standing on parts, a soft halo under the base and under anything lifted.
- **Calm motion.** Eased, slow enough to follow, true to the model. Nothing snaps to the cursor.
- **Two looks.** At 1× it reads as one clear machine. At 4× every region still has something true to find. A bare face or an empty corner is unfinished work.

## Folder template

```
components/figures/<slug>/
  <slug>.ts    model, constants, projection P, every static path (pure, no React)
  art.tsx      server component: static parts as elements, passed to live.tsx as props
  live.tsx     "use client": loop, pointer and keys, readout, teardown layers
  figure.tsx   <Plate fig title hint readout keys caption>
  <slug>.css   focus ring, cursor, phone scaling
```

Register it in `lib/figures.tsx` with a slug, a name, one line on what it is, what moves and what that means, and how to play with it. That entry drives the gallery, the figure page and the copy-prompt button.

## Before you finish

| You notice | Do this |
| --- | --- |
| It reads as boxes and arrows | Go back to step 2 and find the machine |
| A big face is plain | Add the parts that belong there: groove, screws, ruler, label plate, seams |
| A part pokes through another | Fix the painter's order or split the wrapping part |
| A line stops in mid-air | End it on an edge, a dot or an outline, or mark it `free` if it stands for print |
| Two parts are lit | Keep the one the reader should watch |
| A readout disagrees with the parts | Read it from where the parts are, not from the target |
| A teardown label points at empty space | Move its anchor onto the part, or drop the label from a moving part |
| A label is clipped at the edge | Shorten the name or widen the figure's pad |
| It breaks at 390 px | Scale the SVG to ~112% inside an `overflow: hidden` wrapper |
| It moves under reduced motion | Jump to targets; keep it responding to input |

## Credits and sources

- The drawing rules build on the [Anatomy](https://github.com/wheresryan22/anatomy) isometric skill by Ryan (MIT), which the kit and its first figures were drawn to.
- The teardown view follows [Jakub Krehel's teardown skill](https://github.com/jakubkrehel/skills): explode along the assembly path, one view away from the assembled one.
- Line-weight and tone conventions follow technical illustration practice as summarised by Gooch et al., "A Non-Photorealistic Lighting Model for Automatic Technical Illustration" (SIGGRAPH 1998).
- The camera numbers are standard axonometric geometry: true isometric elevation is arctan(1/√2) ≈ 35.26°, and the 2:1 "pixel isometric" slope is arctan(1/2) ≈ 26.57°.
