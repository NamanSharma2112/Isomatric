"use client";

import * as React from "react";
import { TeardownLabels, TeardownToggle, TeardownTrails, useTeardown } from "@/components/iso/react/teardown";
import { IsoFigure } from "@/components/iso/react/draw";
import { useReadout } from "@/components/iso/react/live";
import { useTour } from "@/components/iso/react/tour";
import { translateAlong } from "@/components/iso/iso-kit";
import { CARD_H, FEED, HEIGHT, HOUR_LEN, MAX, MINUTE_LEN, P, PITCH, ROD_TIP, STACK_FLOOR, WIDTH, handAt, rodAbove } from "./spindle";
import "./spindle.css";

const LABEL =
  "A card spindle on a weighted base. Each change in the workspace drops a new card on top of the stack; a desk clock beside it moves on with each one.";

/** One event: the card falls, lands, and the clock moves on. */
const LENGTH = 2.6;
const START = 5;
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const span = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const out = (t: number) => 1 - (1 - t) ** 3;
/** Falling from rest: distance grows with the square of time. */
const fall = (t: number) => t * t;

export function SpindleLive(props: { base: React.ReactNode; block: React.ReactNode; cards: React.ReactNode; clock: React.ReactNode }) {
  const { anchor, say } = useReadout<HTMLDivElement>();
  const td = useTeardown({ gap: 30, width: WIDTH });
  const s = React.useRef({ count: START, landed: -1, rod: NaN });

  const pose = React.useCallback(
    (n: number, t: number) => {
      const root = anchor.current;
      if (!root) return;
      const st = s.current;
      // A full spindle is cleared down to a few cards before the next lands.
      if (st.landed !== n && st.count >= MAX) st.count = 3;
      const stackTop = STACK_FLOOR + st.count * PITCH;
      const z = lerp(ROD_TIP + 12, stackTop, fall(span(t, 0.2, 0.95)));
      const landed = t >= 0.95;
      if (landed && st.landed !== n) {
        st.landed = n;
        st.count = Math.min(MAX, st.count + 1);
      }
      root.querySelectorAll<SVGGElement>(".spindle-cards [data-i]").forEach((g) => {
        g.style.display = Number(g.dataset.i) < st.count ? "" : "none";
      });
      const drop = root.querySelector<SVGGElement>('[data-part="drop"]');
      if (drop) {
        drop.style.opacity = landed ? "0" : String(span(t, 0.05, 0.25));
        drop.setAttribute("transform", translateAlong(P, [0, 0, z]));
      }
      const top = landed ? STACK_FLOOR + st.count * PITCH : Math.max(stackTop, z + CARD_H);
      if (top !== st.rod) {
        st.rod = top;
        const rod = root.querySelector('[data-part="rodtop"]');
        if (rod) rod.innerHTML = rodAbove(top);
      }
      const minutes = 10 + (n + out(span(t, 0.95, 1.5))) * 7;
      root.querySelector('[data-part="minute"]')?.setAttribute("d", handAt(minutes / 60, MINUTE_LEN));
      root.querySelector('[data-part="hour"]')?.setAttribute("d", handAt((10 + minutes / 60) / 12, HOUR_LEN));
      say(FEED[n % FEED.length]!);
    },
    [anchor, say],
  );

  const { handlers } = useTour(anchor, LENGTH, pose);

  return (
    <>
      <div ref={anchor} className="spindle" {...handlers} aria-label={`${LABEL} Press to add the next card; hover to pause.`}>
        <IsoFigure width={WIDTH} height={HEIGHT} label={LABEL}>
          <g ref={td.frame}>
            <g ref={td.lift(0, "Bench", [0.3, 0.6], "l")}>{props.base}</g>
            <TeardownTrails td={td} />
            <g ref={td.lift(1, "Weighted base", [0.1, 0.6], "l")}>{props.block}</g>
            {/* The rod above the stack travels with the cards, since the
                cards are threaded on it. */}
            <g ref={td.lift(2, "Cards", [0.15, 0.5], "l")} className="spindle-cards">{props.cards}</g>
            <g ref={td.lift(1, "Desk clock", [0.9, 0.4], "r")}>{props.clock}</g>
            <TeardownLabels td={td} />
          </g>
        </IsoFigure>
      </div>
      <TeardownToggle td={td} />
    </>
  );
}
