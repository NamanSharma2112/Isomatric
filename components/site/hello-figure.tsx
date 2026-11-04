import { Dots, IsoFigure, Line, Plate, Solid } from "@/components/iso/react/draw";
import {
  boxCorners,
  corners,
  cylinder,
  fitProjection,
  haloOf,
  insetPlan,
  knurl,
  planOutline,
  pointsAt,
  ring,
  slabOf,
  type Plan,
  type Point3,
} from "@/components/iso/iso-kit";

/* The smallest whole figure: a base plate on its own halo, a groove and
   four corner screws, and one knurled knob standing on it. Static, so it
   needs no live component: a server component and the kit, nothing else. */
const W = 480;
const H = 260;
const BASE: Plan = { x: -60, y: -40, w: 120, d: 80, r: 8 };
const P = fitProjection([...boxCorners(BASE, -8, 0), [0, 0, 26] as Point3], W, H, { pad: 28 });

const ART = {
  halo: haloOf(BASE, -8, 8, P),
  base: slabOf(BASE, -8, 8, P, 8, 1.2),
  groove: planOutline(insetPlan(BASE, 5), 0, P),
  screwRings: corners(BASE, 10).map(([x, y]) => ring(x, y, 2.2, 0, P, 16)).join(""),
  screws: pointsAt(corners(BASE, 10).map(([x, y]) => [x, y, 0] as Point3), P),
  collar: cylinder(0, 0, 16, 0, 3, P, 40, 0.4),
  knob: cylinder(0, 0, 12, 3, 14, P, 40, 0.6),
  knurl: knurl(0, 0, 12, 3, 17, 36, P, 0),
  cap: ring(0, 0, 7, 17, P, 32),
};

export function HelloFigure() {
  return (
    <Plate fig="Fig 0" title="A knob on a plate" hint="Static" readout="7 parts">
      <IsoFigure width={W} height={H} label="A knurled knob standing on a base plate with four corner screws.">
        <path className="iso-halo" d={ART.halo} />
        <Solid paths={ART.base} tone="mid" inner={<Line d={ART.groove} tone="faint" />} />
        <Line d={ART.screwRings} tone="lo" />
        <Dots points={ART.screws} size={0.5} tone="mid" />
        <Solid paths={ART.collar} tone="mid" />
        <Solid paths={ART.knob} tone="hi" lit />
        <Line d={ART.knurl} tone="lo" />
        <Line d={ART.cap} tone="faint" />
      </IsoFigure>
    </Plate>
  );
}
