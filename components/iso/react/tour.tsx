"use client";

import * as React from "react";
import { useInView, useLoop } from "./live";

/**
 * A figure that plays a story one event at a time: `pose(n, t)` draws event
 * n at t seconds into it. The tour runs while the figure is on screen,
 * pauses while the pointer rests on it, and steps to the next event on a
 * click or Enter/Space. Under reduced motion every event is shown already
 * finished, and steps snap instead of playing.
 */
export function useTour<T extends HTMLElement>(
  anchor: React.RefObject<T | null>,
  length: number,
  pose: (n: number, t: number) => void,
) {
  const visible = useInView(anchor);
  const s = React.useRef({ n: 0, t: 0, paused: false });

  const kick = useLoop((dt, calm) => {
    const st = s.current;
    if (calm) {
      pose(st.n, length - 1e-3);
      return false;
    }
    if (!st.paused) st.t += dt;
    if (st.t >= length) {
      st.t = 0;
      st.n += 1;
    }
    pose(st.n, st.t);
    return true;
  }, visible);

  const step = React.useCallback(() => {
    s.current.n += 1;
    s.current.t = 0;
    kick();
  }, [kick]);

  /** Spread these on the figure's focusable wrapper. */
  const handlers = {
    tabIndex: 0,
    role: "button" as const,
    onClick: step,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        step();
      }
    },
    onPointerEnter: () => {
      s.current.paused = true;
    },
    onPointerLeave: () => {
      s.current.paused = false;
    },
  };

  return { step, handlers };
}
