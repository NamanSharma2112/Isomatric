import { Plate } from "@/components/iso/react/draw";
import { FEED } from "./spindle";
import { SpindleArt } from "./art";

export function SpindleFigure() {
  return (
    <Plate
      fig="Fig 10"
      title="Activity spindle"
      hint="Click to add the next card"
      readout={FEED[0]}
      keys={[
        { mark: "lit", label: "The newest change, falling" },
        { mark: "raised", label: "A card: one change, newest on top" },
        { mark: "edge", label: "The clock, moving on with each one" },
      ]}
      caption="An activity feed as a spindle of cards. Every change lands on top, so the order of the stack is the order things happened, and the clock beside it moves on with each one. A worked example; a full spindle is cleared before the next card lands."
    >
      <SpindleArt />
    </Plate>
  );
}
