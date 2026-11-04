import { Plate } from "@/components/iso/react/draw";
import { KeypadArt } from "./art";

export function KeypadFigure() {
  return (
    <Plate
      fig="Fig 8"
      title="Command keypad"
      hint="Click to search again"
      readout="press ⌘K"
      keys={[
        { mark: "lit", label: "The results panel" },
        { mark: "raised", label: "A key: it travels down to the housing" },
        { mark: "edge", label: "The posts the panel rides on" },
      ]}
      caption="A command palette as a machine. ⌘ and K raise the results panel on its posts, ↓ walks the highlight down the four results, and ↵ opens one and lowers the panel. The posts are rebuilt as they extend; nothing else changes shape."
    >
      <KeypadArt />
    </Plate>
  );
}
