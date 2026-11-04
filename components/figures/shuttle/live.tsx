"use client";

import * as React from "react";
import { TeardownLabels, TeardownToggle, TeardownTrails, useTeardown } from "@/components/iso/react/teardown";
import { IsoFigure } from "@/components/iso/react/draw";
import { useReadout } from "@/components/iso/react/live";
import { useTour } from "@/components/iso/react/tour";
import { translateAlong } from "@/components/iso/iso-kit";
import { CAR_TOP, DOCK, DRAWER, FACE, HEIGHT, HOME, OPEN, P, RAIL_Y, WIDTH, drawerAt } from "./shuttle";
import "./shuttle.css";

const LABEL =
  "A shuttle on a rail carries a change from the client cradle to a filing cabinet that stands for the database; a drawer opens to take it. Pressing undo opens the drawer again and the shuttle brings the change back.";

/** One save and one undo, end to end. */
const LENGTH = 9;
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const span = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const out = (t: number) => 1 - (1 - t) ** 3;
type V3 = [number, number, number];
const arc = (a: V3, b: V3, p: number): V3 => [lerp(a[0], b[0], p), lerp(a[1], b[1], p), lerp(a[2], b[2], p) + 20 * Math.sin(Math.PI * p)];

/** Where the shuttle is: out to the cabinet and back, twice. */
function carAt(t: number) {
  if (t < 0.6) return HOME;
  if (t < 1.8) return lerp(HOME, DOCK, inOut(span(t, 0.6, 1.8)));
  if (t < 3.5) return DOCK;
  if (t < 4.6) return lerp(DOCK, HOME, inOut(span(t, 3.5, 4.6)));
  if (t < 5.0) return HOME;
  if (t < 6.0) return lerp(HOME, DOCK, inOut(span(t, 5.0, 6.0)));
  if (t < 7.3) return DOCK;
  return lerp(DOCK, HOME, inOut(span(t, 7.3, 8.3)));
}

/** How far the drawer is open: to take the change in, and to give it back. */
function drawerOpen(t: number) {
  if (t < 1.6) return 0;
  if (t < 2.2) return OPEN * out(span(t, 1.6, 2.2));
  if (t < 2.8) return OPEN;
  if (t < 3.5) return OPEN * (1 - inOut(span(t, 2.8, 3.5)));
  if (t < 5.8) return 0;
  if (t < 6.3) return OPEN * out(span(t, 5.8, 6.3));
  if (t < 6.8) return OPEN;
  if (t < 7.3) return OPEN * (1 - inOut(span(t, 6.8, 7.3)));
  return 0;
}

export function ShuttleLive(props: {
  base: React.ReactNode;
  cradle: React.ReactNode;
  cabinet: React.ReactNode;
  rail: React.ReactNode;
  car: React.ReactNode;
  block: React.ReactNode;
}) {
  const { anchor, say } = useReadout<HTMLDivElement>();
  const td = useTeardown({ gap: 28, width: WIDTH });
  const lastOpen = React.useRef(NaN);

  const pose = React.useCallback(
    (_n: number, t: number) => {
      const root = anchor.current;
      if (!root) return;
      const q = (part: string) => root.querySelector<SVGGElement>(`[data-part="${part}"]`);
      const x = carAt(t);
      q("car")?.setAttribute("transform", translateAlong(P, [x, 0, 0]));

      const o = drawerOpen(t);
      q("drawer-front")?.setAttribute("transform", translateAlong(P, [0, o, 0]));
      if (Math.abs(o - lastOpen.current) > 0.01 || Number.isNaN(lastOpen.current)) {
        lastOpen.current = o;
        const parts = drawerAt(o);
        const back = q("drawer-back");
        const side = q("drawer-side");
        if (back) back.innerHTML = parts.back;
        if (side) side.innerHTML = parts.side;
      }
      const inside: V3 = [DRAWER.x + DRAWER.w / 2, FACE + OPEN - 8.5, DRAWER.z + 1.5];
      const onCar = (at: number): V3 => [at, RAIL_Y, CAR_TOP];

      // The change is on the shuttle, in flight, or in the drawer; it is only
      // seen in the drawer while enough of the drawer is out to hold it.
      let pos: V3 | null = onCar(x);
      let inDrawer = 0;
      if (t >= 2.2 && t < 2.8) pos = arc(onCar(DOCK), inside, out(span(t, 2.2, 2.8)));
      else if (t >= 2.8 && t < 6.3) {
        pos = null;
        inDrawer = clamp((o - 12) / 4);
      } else if (t >= 6.3 && t < 6.8) pos = arc(inside, onCar(DOCK), out(span(t, 6.3, 6.8)));
      const block = q("block");
      if (block) {
        block.style.opacity = pos ? String(t < 0.4 ? span(t, 0, 0.4) : 1) : "0";
        if (pos) block.setAttribute("transform", translateAlong(P, pos));
      }
      const held = q("drawer-block");
      if (held) {
        held.style.opacity = String(inDrawer);
        held.setAttribute("transform", translateAlong(P, [DRAWER.x + DRAWER.w / 2, FACE + o - 8.5, DRAWER.z + 1.5]));
      }

      q("lamp")?.querySelector(".iso-dots")?.setAttribute("data-tone", t < 0.6 || t > 7.3 ? "hi" : "lo");
      q("button")?.setAttribute("transform", t >= 4.8 && t <= 5.05 ? translateAlong(P, [0, 0, -1.6]) : "");
      const sending = (t > 0.6 && t < 2.8) || (t > 5.0 && t < 6.8);
      const cable = root.querySelector('[data-part="cable"] path');
      if (sending) cable?.setAttribute("data-flow", "");
      else cable?.removeAttribute("data-flow");

      say(
        t < 0.6
          ? "change shown at once"
          : t < 2.2
            ? "sending"
            : t < 4.8
              ? "saved"
              : t < 6.3
                ? "undo · same path back"
                : t < 7.3
                  ? "restored"
                  : "back on screen",
      );
    },
    [anchor, say],
  );

  const { handlers } = useTour(anchor, LENGTH, pose);

  return (
    <>
      <div ref={anchor} className="shuttle" {...handlers} aria-label={`${LABEL} Press to run it again; hover to pause.`}>
        <IsoFigure width={WIDTH} height={HEIGHT} label={LABEL}>
          <g ref={td.frame}>
            <g ref={td.lift(0, "Bench", [0.8, 0.7], "r")}>{props.base}</g>
            <TeardownTrails td={td} />
            <g ref={td.lift(1, "Client", [0.12, 0.3], "l")}>{props.cradle}</g>
            <g ref={td.lift(2, "Database", [0.85, 0.2], "r")}>{props.cabinet}</g>
            <g ref={td.lift(1, "Rail", [0.15, 0.6], "l")}>{props.rail}</g>
            {/* The shuttle rides at the rail's level so it stays on it, and
                the change it carries lifts one level clear. Neither carries
                a label: a label is placed once, and they move. */}
            <g ref={td.lift(1)}>{props.car}</g>
            <g ref={td.lift(2)}>{props.block}</g>
            <TeardownLabels td={td} />
          </g>
        </IsoFigure>
      </div>
      <TeardownToggle td={td} />
    </>
  );
}
