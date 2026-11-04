import { Plate } from "@/components/iso/react/draw";
import { ShuttleArt } from "./art";

export function ShuttleFigure() {
  return (
    <Plate
      fig="Fig 11"
      title="Save and undo"
      hint="Click to save again"
      readout="change shown at once"
      keys={[
        { mark: "lit", label: "The change" },
        { mark: "raised", label: "The drawer: where it is kept" },
        { mark: "dotted", label: "The cable, busy while it travels" },
      ]}
      caption="An optimistic save. The change shows on the client at once, then rides the shuttle to the cabinet and a drawer takes it in. Undo is the same trip backwards: the drawer gives it up and the shuttle brings it home."
    >
      <ShuttleArt />
    </Plate>
  );
}
