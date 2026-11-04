import { ART } from "./spindle";
import { SpindleLive } from "./live";

const layer = (key: keyof typeof ART) => <g key={key} dangerouslySetInnerHTML={{ __html: ART[key] }} />;

export function SpindleArt() {
  return <SpindleLive base={layer("base")} block={layer("block")} cards={layer("cards")} clock={layer("clock")} />;
}
