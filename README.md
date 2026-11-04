# Isomatric

Interactive isometric figures for React, and the small kit they are drawn with.

Each figure is a real, well-made machine whose working *is* the idea it explains: a disc cam cut to an easing curve, an abacus of churned customers, a watch that keeps your time. Parts are solids painted back to front with four-tone shading, every line ends on something, every number on a figure comes from the model that moves it, and every figure comes apart into a labelled teardown.

## The figures

| Figure | What it shows | Folder |
| --- | --- | --- |
| Cam and slide | An easing curve, `cubic-bezier(0.23, 1, 0.32, 1)`, cut into a disc cam that drives a slide and a dial gauge | `components/figures/cam` |
| Churn abacus | Monthly churn as beads crossing a bar: six cohorts, ten beads each, 88% monthly retention (a worked example) | `components/figures/churn` |
| Desk computer | A workstation that boots, puts up a menu bar and dock, and opens windows on a screen drawn in the plane of the glass | `components/figures/desk` |
| Workbench line | One piece, four stations: scribed, cut, pressed, then measured by a gauge | `components/figures/bench` |
| Day-Date 40 | A watch with a fluted bezel, day and date windows and a Cyclops, keeping the visitor's time | `components/figures/watch` |
| Three-fan graphics card | Board, GPU, memory, power stages, fin stack and fans; load drives a fan curve with a zero-rpm stop | `components/figures/gpu` |

Every figure responds to pointer and keyboard, pauses offscreen, goes still under `prefers-reduced-motion`, and works in light and dark.

## Run the site

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build && pnpm start
```

Next.js 16, React 19, TypeScript. The site has a gallery (`/`), a page per figure (`/figures/[slug]`) and the kit's docs (`/kit`).

## Use a figure in your project

Copy `components/iso` and the figure's folder, import the kit's styles once, and put the figure inside an element with `class="iso"`:

```tsx
import "@/components/iso/iso.css";
import { WatchFigure } from "@/components/figures/watch/figure";

export default function Page() {
  return (
    <main className="iso">
      <WatchFigure />
    </main>
  );
}
```

The kit reads a few colour tokens, so define them (these are the defaults the site uses):

```css
:root     { --bg: #f7f7f6; --surface: #fff;    --mark: #c8361a; --fg: #141414; --fg-muted: #666; }
html.dark { --bg: #191a1d; --surface: #212327; --mark: #ff6b4a; --fg: #ededed; --fg-muted: #8f8f8f; }
.iso      { --anatomy-lit: var(--mark); --anatomy-red: var(--mark); }
```

Dependencies: React 18+ and `lucide-react` (the teardown button's icons).

## The kit

| File | What it holds |
| --- | --- |
| `components/iso/iso-kit.ts` | Camera and projection, solids (`slabOf`, `cylinder`, `extrude`), parts (`knurl`, `coil`, ticks, seams, `opening`), transforms |
| `components/iso/react/draw.tsx` | Server-safe components: `Plate`, `IsoFigure`, `Solid`, `Line`, `Dots`, `FaceText` |
| `components/iso/react/live.tsx` | Client hooks: `useLoop`, `useInView`, `useReadout`, `follow`, `spring` |
| `components/iso/react/teardown.tsx` | The exploded view: `useTeardown`, `TeardownToggle`, labels and trails |
| `components/iso/iso.css` | Tones, fills and the plate, in light and dark |

### How a figure is built

```
components/figures/<name>/
  <name>.ts    the model and every static path, built once (pure, no React)
  art.tsx      server component: static parts as elements, passed to live.tsx
  live.tsx     "use client": motion, pointer, keys, readout, teardown layers
  figure.tsx   the <Plate>: number, title, hint, readout, legend, caption
  <name>.css   the figure's own few rules
```

The live component writes attributes on refs inside one loop and never re-renders per frame. Moving parts are built once at rest and moved with `translateAlong`; only parts whose shape changes are rebuilt.

## Credits

Figures by [Naman Sharma](https://www.namansharma.com), drawn to the rules of the [Anatomy](https://github.com/wheresryan22/anatomy) isometric skill; the teardown view follows [Jakub Krehel's teardown skill](https://github.com/jakubkrehel/skills).
