import { ART } from "./keypad";
import { KeypadLive } from "./live";

const layer = (key: keyof typeof ART) => <g key={key} dangerouslySetInnerHTML={{ __html: ART[key] }} />;

export function KeypadArt() {
  return <KeypadLive base={layer("base")} stand={layer("stand")} panel={layer("panel")} housing={layer("housing")} keys={layer("keys")} />;
}
