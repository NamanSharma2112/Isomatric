"use client";

import * as React from "react";
import { TeardownLabels, TeardownToggle, TeardownTrails, useTeardown } from "@/components/iso/react/teardown";
import { IsoFigure } from "@/components/iso/react/draw";
import { useReadout } from "@/components/iso/react/live";
import { useTour } from "@/components/iso/react/tour";
import { translateAlong } from "@/components/iso/iso-kit";
import { BINS, BIN_D, BIN_Y, CARRIAGE_TOP, HEIGHT, HOME, MAX, NAMES, P, PITCH, RAIL_Y, START, TOUR, WIDTH, readoutOf } from "./sorter";
import "./sorter.css";

const LABEL =
  "A shuttle on two rails carries a task tile from a magazine to one of three trays, Upcoming, Overdue and Done, and drops it on that tray's stack. The stacks are the counts on the task tabs.";

/** One delivery: load, travel, hop into the tray, return, rest. */
const LENGTH = 3.6;
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const span = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const out = (t: number) => 1 - (1 - t) ** 3;

export function SorterLive(props: { base: React.ReactNode; rails: React.ReactNode; shuttle: React.ReactNode; trays: React.ReactNode; tile: React.ReactNode }) {
  const { anchor, say } = useReadout<HTMLDivElement>();
  const td = useTeardown({ gap: 30, width: WIDTH });
  const s = React.useRef({ counts: [...START], done: -1 });

  const pose = React.useCallback(
    (n: number, t: number) => {
      const svg = anchor.current;
      if (!svg) return;
      const st = s.current;
      const shuttle = svg.querySelector<SVGGElement>('[data-part="shuttle"]');
      const tile = svg.querySelector<SVGGElement>('[data-part="tile"]');
      const show = () =>
        svg.querySelectorAll<SVGGElement>("[data-bin]").forEach((g) => {
          g.style.display = Number(g.dataset.i) < st.counts[Number(g.dataset.bin)] ? "" : "none";
        });
      // Each tour starts from the same trays, so the counts never run away.
      if (n % TOUR.length === 0 && st.done !== n) {
        st.counts = [...START];
        show();
      }
      const [title, bin] = TOUR[n % TOUR.length]!;
      const cx = BINS[bin]!;
      const x = t < 1.95 ? lerp(HOME, cx, inOut(span(t, 0.35, 1.25))) : lerp(cx, HOME, inOut(span(t, 1.95, 2.9)));
      shuttle?.setAttribute("transform", translateAlong(P, [x, 0, 0]));
      const hop = span(t, 1.25, 1.95);
      const top = 2 + st.counts[bin]! * PITCH;
      const landed = t >= 1.95;
      if (landed && st.done !== n) {
        st.done = n;
        st.counts[bin] = Math.min(MAX, st.counts[bin]! + 1);
        show();
      }
      const y = landed ? RAIL_Y : lerp(RAIL_Y, BIN_Y + BIN_D / 2, out(hop));
      const z = landed ? CARRIAGE_TOP : lerp(CARRIAGE_TOP, top, hop) + 24 * Math.sin(Math.PI * hop);
      tile?.setAttribute("transform", translateAlong(P, [x, y, z]));
      if (tile) tile.style.opacity = landed ? "0" : String(span(t, 0, 0.35));
      const name = title.length > 22 ? `${title.slice(0, 21)}…` : title;
      say(t < 1.95 ? `“${name}” → ${NAMES[bin]}` : readoutOf(st.counts));
    },
    [anchor, say],
  );

  const { handlers } = useTour(anchor, LENGTH, pose);

  return (
    <>
      <div
        ref={anchor}
        className="sorter"
        {...handlers}
        aria-label={`${LABEL} Press to send the next task; hover to pause.`}
      >
        <IsoFigure width={WIDTH} height={HEIGHT} label={LABEL}>
          <g ref={td.frame}>
            {/* Taken apart the way it was put together: the bench, then the
                rails and trays bolted to it. The shuttle rides at the rails'
                level so it stays on them, and the task it carries lifts one
                level clear. Moving parts carry no label: a label is placed
                once, and a moving part would leave it behind. */}
            <g ref={td.lift(0, "Bench", [0.86, 0.82])}>{props.base}</g>
            <TeardownTrails td={td} />
            <g ref={td.lift(1, "Rails", [0.12, 0.3])}>{props.rails}</g>
            <g ref={td.lift(1)}>{props.shuttle}</g>
            <g ref={td.lift(1, "Trays", [0.62, 0.86], "r")}>{props.trays}</g>
            <g ref={td.lift(2)}>{props.tile}</g>
            <TeardownLabels td={td} />
          </g>
        </IsoFigure>
      </div>
      <TeardownToggle td={td} />
    </>
  );
}
