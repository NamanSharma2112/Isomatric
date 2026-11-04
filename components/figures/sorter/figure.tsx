import { Plate } from "@/components/iso/react/draw";
import { MAX, START, readoutOf } from "./sorter";
import { SorterArt } from "./art";

export function SorterFigure() {
  return (
    <Plate
      fig="Fig 7"
      title="Task sorter"
      hint="Click to send the next task"
      readout={readoutOf(START)}
      keys={[
        { mark: "lit", label: "The task in flight" },
        { mark: "raised", label: "A tile: one task in a tray" },
        { mark: "edge", label: "The shuttle and its rails" },
      ]}
      caption={`A task list's three tabs as trays. Each task leaves the magazine on the shuttle and drops into Upcoming, Overdue or Done, so the stacks are the counts on the tabs. A worked example, starting at ${START.join(", ")}; a tray holds ${MAX}.`}
    >
      <SorterArt />
    </Plate>
  );
}
