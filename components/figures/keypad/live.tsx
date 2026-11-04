"use client";

import * as React from "react";
import { TeardownLabels, TeardownToggle, TeardownTrails, useTeardown } from "@/components/iso/react/teardown";
import { IsoFigure } from "@/components/iso/react/draw";
import { useReadout } from "@/components/iso/react/live";
import { useTour } from "@/components/iso/react/tour";
import { translateAlong } from "@/components/iso/iso-kit";
import { HEIGHT, KEY_DOWN, OPEN, P, REST, RESULTS, ROW_Y, WIDTH, postsAt } from "./keypad";
import "./keypad.css";

const LABEL =
  "A ten-key pad with a results panel on two posts behind it. Pressing command and K raises the panel; the down arrow moves the highlight through four results and return opens one and lowers the panel.";

/** One search: ⌘K, two ↓, ↵, and a rest before the next. */
const LENGTH = 5.6;
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const span = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const out = (t: number) => 1 - (1 - t) ** 3;
/** Rises with a small overshoot, the way a sprung panel settles. */
const back = (t: number) => 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2;
const down = (t: number, ...presses: [number, number][]) => presses.some(([a, b]) => t >= a && t <= b);

export function KeypadLive(props: { base: React.ReactNode; stand: React.ReactNode; panel: React.ReactNode; housing: React.ReactNode; keys: React.ReactNode }) {
  const { anchor, say } = useReadout<HTMLDivElement>();
  const td = useTeardown({ gap: 28, width: WIDTH });
  const lastZ = React.useRef(REST);

  const pose = React.useCallback(
    (_n: number, t: number) => {
      const root = anchor.current;
      if (!root) return;
      const press = (legend: string, on: boolean) =>
        root.querySelector(`[data-key="${legend}"]`)?.setAttribute("transform", on ? translateAlong(P, [0, 0, KEY_DOWN]) : "");
      press("⌘", down(t, [0.5, 1.3]));
      press("K", down(t, [0.8, 1.2]));
      press("↓", down(t, [1.9, 2.1], [2.5, 2.7]));
      press("↵", down(t, [3.2, 3.4]));

      const z = t < 3.45 ? lerp(REST, OPEN, back(span(t, 0.9, 1.6))) : lerp(OPEN, REST, inOut(span(t, 3.45, 4.2)));
      root.querySelector('[data-part="panel"]')?.setAttribute("transform", translateAlong(P, [0, 0, z]));
      if (Math.abs(z - lastZ.current) > 0.01) {
        lastZ.current = z;
        const posts = root.querySelector('[data-part="posts"]');
        if (posts) posts.innerHTML = postsAt(z);
      }

      const row = t < 1.9 ? 0 : t < 2.5 ? out(span(t, 1.9, 2.1)) : t < 4.2 ? 1 + out(span(t, 2.5, 2.7)) : 0;
      const from = Math.floor(row);
      const dy = ROW_Y[from]! - ROW_Y[0]! + (ROW_Y[1]! - ROW_Y[0]!) * (row - from);
      root.querySelector('[data-part="highlight"]')?.setAttribute("transform", translateAlong(P, [0, dy, 0]));

      say(
        t < 0.9 ? "press ⌘K" : t < 1.9 ? "palette open · 4 results" : t < 3.2 ? `↓ ${RESULTS[Math.round(row)]}` : t < 4.4 ? `↵ opened ${RESULTS[2]}` : "press ⌘K",
      );
    },
    [anchor, say],
  );

  const { handlers } = useTour(anchor, LENGTH, pose);

  return (
    <>
      <div ref={anchor} className="keypad" {...handlers} aria-label={`${LABEL} Press to run it again; hover to pause.`}>
        <IsoFigure width={WIDTH} height={HEIGHT} label={LABEL}>
          <g ref={td.frame}>
            {/* The panel stands behind the pad, so it is drawn first and
                comes off highest; the keycaps lift off the housing they sit
                in, stems and all. */}
            <g ref={td.lift(0, "Bench", [0.3, 0.6], "l")}>{props.base}</g>
            <TeardownTrails td={td} />
            <g ref={td.lift(1, "Stand", [0.9, 0.5], "r")}>{props.stand}</g>
            <g ref={td.lift(3, "Results", [0.85, 0.4], "r")}>{props.panel}</g>
            <g ref={td.lift(1, "Housing", [0.1, 0.6], "l")}>{props.housing}</g>
            <g ref={td.lift(2, "Keys", [0.12, 0.4], "l")}>{props.keys}</g>
            <TeardownLabels td={td} />
          </g>
        </IsoFigure>
      </div>
      <TeardownToggle td={td} />
    </>
  );
}
