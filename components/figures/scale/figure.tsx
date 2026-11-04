import { Plate } from "@/components/iso/react/draw";
import { PROJECTS, readoutOf } from "./scale";
import { ScaleArt } from "./art";

export function ScaleFigure() {
  const [name, done, total] = PROJECTS[0]!;
  return (
    <Plate
      fig="Fig 9"
      title="Progress scale"
      hint="Click to weigh the next project"
      readout={readoutOf(name, done, total)}
      keys={[
        { mark: "lit", label: "A plate: one finished task" },
        { mark: "raised", label: "The collar, at the project's total" },
        { mark: "edge", label: "The dial: one turn is the whole project" },
      ]}
      caption="Project progress weighed rather than typed in: the plates are the tasks that are done, the collar marks how many there are in all, and the dial reads one over the other. A worked example across six projects."
    >
      <ScaleArt />
    </Plate>
  );
}
