"use client";

import * as React from "react";
import { TeardownLabels, TeardownToggle, TeardownTrails, useTeardown } from "@/components/iso/react/teardown";
import { IsoFigure } from "@/components/iso/react/draw";
import { follow, useReadout } from "@/components/iso/react/live";
import { useTour } from "@/components/iso/react/tour";
import { translateAlong } from "@/components/iso/iso-kit";
import { HEIGHT, PITCH, PROJECTS, P, WIDTH, needleAt, readoutOf } from "./scale";
import "./scale.css";

const LABEL =
  "A platform scale weighs a project's finished tasks: one plate per done task, a collar on the post marking the total, and a dial reading the share that is done.";

/** One project: its plates go on one at a time, then a beat to read it. */
const LENGTH = 3.4;
const PER_PLATE = 0.4;

export function ScaleLive(props: { base: React.ReactNode; cell: React.ReactNode; pan: React.ReactNode; dial: React.ReactNode }) {
  const { anchor, say } = useReadout<HTMLDivElement>();
  const td = useTeardown({ gap: 30, width: WIDTH });
  const shown = React.useRef({ pct: 0, collar: 0, last: -1 });

  const pose = React.useCallback(
    (n: number, t: number) => {
      const root = anchor.current;
      if (!root) return;
      const [name, done, total] = PROJECTS[n % PROJECTS.length]!;
      const count = t < PER_PLATE ? 0 : Math.min(done, Math.floor((t - PER_PLATE) / PER_PLATE) + 1);
      root.querySelectorAll<SVGGElement>('[data-part="pan"] [data-i]').forEach((g) => {
        g.style.display = Number(g.dataset.i) < count ? "" : "none";
      });
      // The needle and collar follow the plates rather than jumping to them.
      const s = shown.current;
      const dt = t > s.last ? t - s.last : 0;
      s.last = t;
      const jump = dt === 0 || dt > 0.2;
      s.pct = follow(s.pct, (count / total) * 100, dt, 0.18, jump);
      s.collar = follow(s.collar, total * PITCH, dt, 0.25, jump);
      root.querySelector('[data-part="needle"]')?.setAttribute("d", needleAt(s.pct));
      root.querySelector('[data-part="collar"]')?.setAttribute("transform", translateAlong(P, [0, 0, s.collar]));
      // The pan sinks a little under the load.
      root.querySelector('[data-part="pan"]')?.setAttribute("transform", translateAlong(P, [0, 0, -0.3 * count]));
      say(readoutOf(name, count, total));
    },
    [anchor, say],
  );

  const { handlers } = useTour(anchor, LENGTH, pose);

  return (
    <>
      <div ref={anchor} className="scale" {...handlers} aria-label={`${LABEL} Press to weigh the next project; hover to pause.`}>
        <IsoFigure width={WIDTH} height={HEIGHT} label={LABEL}>
          <g ref={td.frame}>
            <g ref={td.lift(0, "Bench", [0.86, 0.85], "r")}>{props.base}</g>
            <TeardownTrails td={td} />
            <g ref={td.lift(1, "Load cell", [0.1, 0.6], "l")}>{props.cell}</g>
            <g ref={td.lift(2, "Pan", [0.12, 0.5], "l")}>{props.pan}</g>
            <g ref={td.lift(1, "Dial", [0.9, 0.3], "r")}>{props.dial}</g>
            <TeardownLabels td={td} />
          </g>
        </IsoFigure>
      </div>
      <TeardownToggle td={td} />
    </>
  );
}
