# Motion and teardown

## Motion

- **Time-based.** Advance by `dt` from the frame clock (clamped to 1/30 s by `useLoop`), never by a fixed step per frame.
- **Ease toward targets.** Pointer and keys set a target; parts `follow` it (τ 0.1–0.3 s) or ride a `spring` with real stiffness. Nothing snaps to the cursor.
- **Physical curves for physical things.** A falling part covers distance with the square of time (`t * t`). A sprung panel overshoots once (`1 + 2.2(t−1)³ + 1.2(t−1)²`). A carriage starts and stops smoothly (`inOut`). An entrance decelerates (`1 − (1−t)³`).
- **One loop, refs only.** The loop writes `transform`, `d`, `style.opacity`, `innerHTML` of a small rebuilt group and the readout. React never re-renders per frame.
- **Stop when nothing moves.** Return `false` from the tick once settled, and let `useInView` stop it offscreen.
- **Reduced motion.** Jump to targets. A story (`useTour`) shows each event already finished, and a step snaps rather than plays. The figure still responds to input.

## Telling a story with `useTour`

```tsx
const pose = React.useCallback((n: number, t: number) => {
  const root = anchor.current;            // the figure's wrapper
  if (!root) return;
  // event n, t seconds into it: place every moving part from the model
  root.querySelector('[data-part="carriage"]')?.setAttribute("transform", translateAlong(P, [xAt(t), 0, 0]));
  say(readoutAt(n, t));
}, [anchor, say]);
const { handlers } = useTour(anchor, LENGTH, pose);
return <div ref={anchor} className="slug" {...handlers} aria-label={`${LABEL} Press to step; hover to pause.`}>…</div>;
```

Write `pose` so it is a function of `(n, t)` alone, plus any state that only changes at an event boundary (counts that grow by one per event). Make those updates idempotent with a "done for event n" marker, so a frame that runs twice, or a reduced-motion jump to the end, never counts twice. Reset accumulated state at the start of each lap so a tour that loops never runs away.

**Lesson:** a value that starts as `NaN` fails every `>` comparison. "Rebuild when it changed by more than 0.01" written as `Math.abs(z - last) > 0.01` never fires the first time. Write `!(Math.abs(z - last) <= 0.01)`, or start `last` at the rest value.

**Lesson:** when a layer is rendered from a string (`<g dangerouslySetInnerHTML>`), there is an extra `<g>` between your class and the parts. Query with a descendant selector (`.slug-cards [data-i]`), not a child selector.

## Readout

Read it from where the parts are, not from the target, so it never claims something the drawing has not shown yet. Keep it short and in true units: `upcoming 3 · overdue 1 · done 1`, `Website Redesign · 2/9 · 22%`. Take a phase word and a number from the same instant of the same source.

## Pointer and keyboard

The root is focusable with a visible focus ring (`outline: 1px solid var(--anatomy-muted); outline-offset: 6px`) and an `aria-label` that names the object and the controls. A slider-like figure maps the pointer's x across the plate to the part's travel and uses arrows, Home and End; a story steps on Enter, Space or a click and pauses on hover. On touch, a tap acts, and `touch-action: pan-y` keeps the page scrolling.

## Teardown

An exploded view should show the order of assembly: parts separate along the direction they were put on, in the reverse of the order they went on, with a fine trail back to where each one sat. In this kit every part is set down onto the one below it, so each layer rises straight up by `level × gap` and keeps its orientation. A gap of zero rebuilds the assembly exactly.

- **Levels follow assembly.** The bench is 0. What is bolted to the bench is 1. What rides on or is placed onto that is 2. The cargo of a moving part (the task on the shuttle, the change on the carriage) is one above its carrier.
- **Labels go on parts that stay put.** Labels and trails are measured from each layer's bounding box once, at mount. A layer whose part moves (a carriage, a tile in flight) gets `td.lift(level)` with no label, and rides at the level of the rail it runs on, so it stays on its rail when the figure comes apart.
- **Anchor the leader on the part.** `[fx, fy]` are fractions of the layer's bounding box. Isometric plates are rhombi, so the box's corners are empty: aim for points near the middle of the visible top, such as `[0.3, 0.6]` for a left-lane label or `[0.8, 0.7]` for a right one, and check the screenshot.
- **Names are short.** One or two words. The lanes sit at the edges of the drawing and clip long names.
- **Draw order still holds.** Layers are lifted as whole groups in the order they are drawn, so a layer drawn later still covers one drawn earlier where they overlap apart. Order layers so that what is nearer and higher in the assembly is drawn later.
- **Motion carries on.** The figure keeps playing inside the lifted layers. Make sure nothing looks wrong mid-motion when it is apart. A part that hops between two layers (cargo into a drawer) is acceptable, but check it.
