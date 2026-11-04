import type { ReactNode } from "react";
import { CamFigure } from "@/components/figures/cam/figure";
import { ChurnFigure } from "@/components/figures/churn/figure";
import { DeskFigure } from "@/components/figures/desk/figure";
import { BenchFigure } from "@/components/figures/bench/figure";
import { WatchFigure } from "@/components/figures/watch/figure";
import { GpuFigure } from "@/components/figures/gpu/figure";
import { SorterFigure } from "@/components/figures/sorter/figure";
import { KeypadFigure } from "@/components/figures/keypad/figure";
import { ScaleFigure } from "@/components/figures/scale/figure";
import { SpindleFigure } from "@/components/figures/spindle/figure";
import { ShuttleFigure } from "@/components/figures/shuttle/figure";

/**
 * Every figure in the set, in one list: the gallery, the figure pages and
 * the static params all read from here, so a figure is added in one place.
 */
export type Figure = {
  slug: string;
  name: string;
  /** What it is, in one line, for the gallery. */
  line: string;
  /** What moves, and what that motion means. */
  mechanism: string;
  /** How to play with it. */
  tryIt: string[];
  component: string;
  folder: string;
  render: () => ReactNode;
};

export const FIGURES: Figure[] = [
  {
    slug: "cam",
    name: "Cam and slide",
    line: "An easing curve cut into a disc cam.",
    mechanism:
      "The disc is cut to cubic-bezier(0.23, 1, 0.32, 1): its radius at any angle is the eased value at that fraction of a turn. A roller follower rides the rim, pushes a slide along a ruler, and a dial gauge reads how far it has gone, so one turn of the crank plays the curve once.",
    tryIt: ["Move across the plate to turn the crank", "← → step it, Home goes back to the start", "Take it apart to see the plate, rails, cam, follower and crank"],
    component: "CamFigure",
    folder: "cam",
    render: () => <CamFigure />,
  },
  {
    slug: "churn",
    name: "Churn abacus",
    line: "Monthly churn as beads crossing a bar.",
    mechanism:
      "Six rods, one per monthly cohort, ten beads to a rod. Each month the beads that churned slide across the bar, at a worked-example retention of 88% a month, and the dial counts the beads themselves rather than the model.",
    tryIt: ["It runs on its own, month by month", "Take it apart to see the frame, rods, beads and dial"],
    component: "ChurnFigure",
    folder: "churn",
    render: () => <ChurnFigure />,
  },
  {
    slug: "desk",
    name: "Desk computer",
    line: "A workstation that boots on its own screen.",
    mechanism:
      "A monitor, keyboard, mouse and tower on a desk. It boots, puts up a menu bar and a dock of six apps, and opens three windows. The screen is drawn in the plane of the monitor's own face, so the picture sits in the glass rather than on top of it.",
    tryIt: ["Hover the figure to boot it again", "Take it apart to see the stand, keyboard, monitor and tower"],
    component: "DeskFigure",
    folder: "desk",
    render: () => <DeskFigure />,
  },
  {
    slug: "bench",
    name: "Workbench line",
    line: "One piece, four stations, and a gauge at the end.",
    mechanism:
      "A carriage takes a piece down the bench past four stations: it is scribed, cut and pressed, and then measured. Each tool only moves while it works, each mark appears on the piece when its station has passed, and the last station is a gauge rather than a stamp.",
    tryIt: ["It runs on its own", "Take it apart to see the bench, rail, stations and tools"],
    component: "BenchFigure",
    folder: "bench",
    render: () => <BenchFigure />,
  },
  {
    slug: "watch",
    name: "Day-Date 40",
    line: "A watch that keeps your time, taken apart in six layers.",
    mechanism:
      "A 40 mm case with a fluted bezel cut as a true ring, an ice-blue dial in its recess, day and date windows and a Cyclops lens, on a President bracelet lying open on a tray. The hands read the visitor's own clock and the seconds step eight times a second, as the movement beats.",
    tryIt: ["Move across it to turn the crown up to twelve hours either way", "← → set the hands, Home returns to now", "Take it apart: tray, case and bracelet, dial, hands, bezel, crystal"],
    component: "WatchFigure",
    folder: "watch",
    render: () => <WatchFigure />,
  },
  {
    slug: "gpu",
    name: "Three-fan graphics card",
    line: "A flagship card with its board on show.",
    mechanism:
      "A backplate; a board with the GPU package, twelve memory packages wired to it, a bank of chokes, power stages and capacitors and a 16-pin connector; a fin stack with six heat pipes; three ring fans, the middle one turning the other way; and a shroud with a light bar. The fans hold still below 30% load and run up to 3,000 rpm, a worked example rather than any card's figures.",
    tryIt: ["Move across it to set the load", "← → step the load", "Take it apart: the cooler lifts clear so the whole board shows"],
    component: "GpuFigure",
    folder: "gpu",
    render: () => <GpuFigure />,
  },
  {
    slug: "sorter",
    name: "Task sorter",
    line: "A task list's three tabs, as trays a shuttle fills.",
    mechanism:
      "A shuttle runs on two rails from a magazine of blank tiles to three trays: Upcoming, Overdue and Done. Each task rides the shuttle to its tray and hops onto the stack, so the height of each stack is the count on that tab. The tray walls carry a scale of ticks, and the readout counts the tiles themselves.",
    tryIt: ["Click or press Enter to send the next task", "Hover to pause it", "Take it apart: the bench, the rails with the shuttle on them, and the trays"],
    component: "SorterFigure",
    folder: "sorter",
    render: () => <SorterFigure />,
  },
  {
    slug: "keypad",
    name: "Command keypad",
    line: "A command palette, as a key pad and a panel on posts.",
    mechanism:
      "A ten-key pad with a results panel standing behind it on two posts. ⌘ and K go down and the panel rises on a spring; ↓ walks the highlight down four results; ↵ opens one and the panel sinks back. Each key travels until it meets the housing, and the posts are the only parts rebuilt as they extend.",
    tryIt: ["Click or press Enter to run the search again", "Hover to pause it", "Take it apart: bench, stand, housing, keys and the results panel"],
    component: "KeypadFigure",
    folder: "keypad",
    render: () => <KeypadFigure />,
  },
  {
    slug: "scale",
    name: "Progress scale",
    line: "Project progress, weighed rather than typed in.",
    mechanism:
      "A platform scale with a backstop post. Each finished task is a plate on the pan, a collar on the post marks the project's total, and a dial on a pedestal reads done ÷ total, one turn for the whole project. The pan sinks a little under the load, and the needle follows the plates rather than jumping.",
    tryIt: ["Click or press Enter to weigh the next project", "Hover to pause it", "Take it apart: bench, load cell, pan and dial"],
    component: "ScaleFigure",
    folder: "scale",
    render: () => <ScaleFigure />,
  },
  {
    slug: "spindle",
    name: "Activity spindle",
    line: "An activity feed, as cards on a spindle.",
    mechanism:
      "A weighted base with a rod, and a desk clock beside it. Every change drops as a card down the rod onto the stack, falling from rest, so the stack's order is the order things happened, newest on top. The rod is drawn above the highest card only, since the cards hide it below, and the clock moves on with each card.",
    tryIt: ["Click or press Enter to add the next card", "Hover to pause it", "Take it apart: bench, base, cards and clock"],
    component: "SpindleFigure",
    folder: "spindle",
    render: () => <SpindleFigure />,
  },
  {
    slug: "shuttle",
    name: "Save and undo",
    line: "An optimistic save, and its undo, on a rail.",
    mechanism:
      "A client cradle, a rail and a filing cabinet that stands for the database. The change shows on the client at once, rides the shuttle to the cabinet, and a drawer slides out to take it, its outside rebuilt as it opens. The cable runs while it travels. Undo presses the button on the cradle and the same trip runs backwards.",
    tryIt: ["Click or press Enter to save again", "Hover to pause it", "Take it apart: the bench, the client, the rail with its shuttle, and the database"],
    component: "ShuttleFigure",
    folder: "shuttle",
    render: () => <ShuttleFigure />,
  },
];

export const figureBySlug = (slug: string) => FIGURES.find((f) => f.slug === slug);
