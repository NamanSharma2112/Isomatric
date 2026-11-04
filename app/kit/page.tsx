import type { Metadata } from "next";
import { HelloFigure } from "@/components/site/hello-figure";

export const metadata: Metadata = {
  title: "Kit",
  description: "The isometric kit: geometry, drawing components, motion hooks and the teardown view.",
};

type Row = [string, string];

function Api({ rows }: { rows: Row[] }) {
  return (
    <table className="api">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">What it does</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([name, what]) => (
          <tr key={name}>
            <td>
              <code>{name}</code>
            </td>
            <td>{what}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const GEOMETRY: Row[] = [
  ["fitProjection(points, w, h, { pad, azimuth, elevation })", "Fits a camera to the world points that must show: azimuth 45° by default, elevation 30°."],
  ["iso([x, y, z], P)", "One world point to the screen. x and y lie on the floor, z is up."],
  ["slabOf(plan, z, h, P, steps, bevel)", "A rounded-rectangle block. Returns fill, four shade tones by facing, a lighter top, outline and crease."],
  ["cylinder(cx, cy, r, z, h, P, steps, bevel)", "A vertical cylinder, shaded the same way."],
  ["extrude(ring, z, h, P, { convex, bevel })", "Any plan outline raised into a solid; convex: false for shapes with concave edges."],
  ["planOutline(plan, z, P)", "A plan's outline at a height: grooves, inlays, seats."],
  ["lineOnTop(a, b, z, P) · ring(cx, cy, r, z, P)", "Lines and circles lying on a top face."],
  ["knurl · radialTicks · topTicks · sideTicks", "Knurls on knobs, dial ticks, ruler ticks along an edge or down a face."],
  ["sideArc · sideSeam · sideRing", "Seams round the visible half of a cylinder or a slab, and rings on vertical faces."],
  ["coil(from, to, centre, r, turns, axis, P)", "A coil spring along x or y, split into back and front turns to paint either side of a rod."],
  ["opening(cx, cy, r, top, depth, P)", "A round opening in a top face: its edge, the far inner wall as a crescent, and the wall's foot, exact."],
  ["translateAlong(P, [dx, dy, dz])", "A world move as a screen transform, for parts built once at rest and moved."],
  ["topMatrix · sideMatrix", "Transforms that lay text or a picture in the plane of a face."],
  ["towardViewer(P) · groundSlide(P)", "Which way the camera looks along the floor, and how far one unit of rise slides on screen."],
];

const DRAW: Row[] = [
  ["<Plate fig title hint readout keys caption>", "The card: figure number top left, title top right, hint and live readout below, legend and caption underneath."],
  ["<IsoFigure width height label>", "The SVG, with an accessible label, inside a stage that knows whether it is in view."],
  ["<Solid paths tone lit flat inner>", "A filled solid: paper fill, shade tones, top, crease and outline. One lit part per figure."],
  ["<Line d tone free>", "A line in a tone: hi, mid, lo, faint, lit or red. free marks an end allowed to stop on a bare face."],
  ["<Dots points size tone>", "Screws, rivets and terminal dots."],
  ["<FaceText transform size>", "Text set in the plane of a face."],
];

const LIVE: Row[] = [
  ["useLoop((dt, calm) => more, running)", "One rAF loop that runs while the figure is in view; calm is true under reduced motion."],
  ["useInView(ref)", "Whether the figure is near the viewport, to start and stop its loop."],
  ["useReadout()", "Writes the plate's live readout without re-rendering."],
  ["follow(current, target, dt, seconds)", "Exponential follow: calm motion that can be interrupted at any point."],
  ["spring(state, target, dt, stiffness, damping)", "A real spring, sub-stepped, for parts that should overshoot and settle."],
  ["useEased(target, seconds) · useStillness()", "An eased value, and the reduced-motion preference."],
];

const TEARDOWN: Row[] = [
  ["useTeardown({ gap, width, font })", "The exploded view's state and a critically damped spring that opens it from the bottom up."],
  ["td.lift(level, label?, at?, side?)", "A ref for one layer: how many gaps it rises, its name, where on its bounds the leader lands, which lane the name sits in."],
  ["<TeardownTrails td> · <TeardownLabels td>", "Chain lines from where each part sat, drawn first; names on leaders in side lanes, drawn last."],
  ["<TeardownToggle td>", "The Take apart / Put together button. A real button with aria-pressed; Escape puts it back together."],
];

export default function KitPage() {
  return (
    <article className="doc">
      <p className="crumb">Kit</p>
      <h1>The kit</h1>
      <p className="lede">
        One TypeScript module for geometry, three small React files for drawing, motion and the teardown, and one
        stylesheet. Copy <code>components/iso</code> into a project; it needs React and <code>lucide-react</code> for the
        teardown button&rsquo;s icons, nothing else.
      </p>
      <ul className="toc" aria-label="On this page">
        <li><a href="#example">A first figure</a></li>
        <li><a href="#pattern">The file pattern</a></li>
        <li><a href="#geometry">Geometry</a></li>
        <li><a href="#drawing">Drawing</a></li>
        <li><a href="#motion">Motion</a></li>
        <li><a href="#teardown">Teardown</a></li>
        <li><a href="#theme">Theme</a></li>
      </ul>

      <section className="section" id="example">
        <h2>A first figure</h2>
        <p>
          Plan the world in plain units, fit a camera to it, build every path once, then paint back to front. This one is
          seven parts and renders on the server with no client code at all.
        </p>
        <div className="stage" style={{ marginTop: 24, maxWidth: 640 }}>
          <HelloFigure />
        </div>
        <pre>
          <code>{`const BASE: Plan = { x: -60, y: -40, w: 120, d: 80, r: 8 };
const P = fitProjection([...boxCorners(BASE, -8, 0), [0, 0, 26]], 480, 260, { pad: 28 });

const ART = {
  base: slabOf(BASE, -8, 8, P, 8, 1.2),
  groove: planOutline(insetPlan(BASE, 5), 0, P),
  knob: cylinder(0, 0, 12, 3, 14, P, 40, 0.6),
  knurl: knurl(0, 0, 12, 3, 17, 36, P, 0),
};

<Plate fig="Fig 0" title="A knob on a plate" hint="Static" readout="7 parts">
  <IsoFigure width={480} height={260} label="A knurled knob on a base plate.">
    <Solid paths={ART.base} tone="mid" inner={<Line d={ART.groove} tone="faint" />} />
    <Solid paths={ART.knob} tone="hi" lit />
    <Line d={ART.knurl} tone="lo" />
  </IsoFigure>
</Plate>`}</code>
        </pre>
      </section>

      <section className="section" id="pattern">
        <h2>The file pattern</h2>
        <p>
          Every figure in the set is five files. The split keeps the large static drawing on the server and sends the
          browser only what moves.
        </p>
        <pre>
          <code>{`components/figures/cam/
  cam.ts       the model and every static path, built once (pure, no React)
  art.tsx      server: static parts as elements, passed to live.tsx as props
  live.tsx     "use client": motion, pointer, keys, readout, teardown layers
  figure.tsx   the <Plate>: number, title, hint, readout, legend, caption
  cam.css      the figure's own few rules`}</code>
        </pre>
        <p>
          The live component writes attributes on refs inside one loop and never re-renders per frame. Moving parts are
          built once at rest and moved with <code>translateAlong</code>; only a part whose shape changes is rebuilt.
        </p>
      </section>

      <section className="section" id="geometry">
        <h2>Geometry</h2>
        <p>
          <code>iso-kit.ts</code>. Plans are rounded rectangles <code>{`{ x, y, w, d, r }`}</code>; every builder returns
          path strings ready for the drawing components.
        </p>
        <Api rows={GEOMETRY} />
      </section>

      <section className="section" id="drawing">
        <h2>Drawing</h2>
        <p>
          <code>react/draw.tsx</code>, server-safe components.
        </p>
        <Api rows={DRAW} />
      </section>

      <section className="section" id="motion">
        <h2>Motion</h2>
        <p>
          <code>react/live.tsx</code>, client hooks. Motion is time-based, stops offscreen and goes still under reduced
          motion.
        </p>
        <Api rows={LIVE} />
      </section>

      <section className="section" id="teardown">
        <h2>Teardown</h2>
        <p>
          <code>react/teardown.tsx</code>. Each layer rises straight up by its level times one gap, keeping its
          orientation, so zero offset rebuilds the assembly and the figure&rsquo;s own motion carries on inside a lifted
          layer.
        </p>
        <Api rows={TEARDOWN} />
        <pre>
          <code>{`const td = useTeardown({ gap: 26, width: WIDTH });

<IsoFigure width={WIDTH} height={HEIGHT} label={LABEL}>
  <g ref={td.frame}>
    <g ref={td.lift(0, "Base plate", [0.8, 0.85])}>{base}</g>
    <TeardownTrails td={td} />
    <g ref={td.lift(1, "Rails")}>{rails}</g>
    <g ref={td.lift(2, "Slide")}>{slide}</g>
    <TeardownLabels td={td} />
  </g>
</IsoFigure>
<TeardownToggle td={td} />`}</code>
        </pre>
      </section>

      <section className="section" id="theme">
        <h2>Theme</h2>
        <p>
          <code>iso.css</code> draws in light by default and in dark under <code>html.dark</code>. Put figures inside an
          element with <code>class=&quot;iso&quot;</code>. Plates take their card colour from <code>--surface</code>,
          and the one lit part and accent lines from <code>--mark</code>:
        </p>
        <pre>
          <code>{`:root      { --bg: #f7f7f6; --surface: #fff;    --mark: #c8361a; }
html.dark  { --bg: #191a1d; --surface: #212327; --mark: #ff6b4a; }

.iso { --anatomy-lit: var(--mark); --anatomy-red: var(--mark); }`}</code>
        </pre>
      </section>
    </article>
  );
}
