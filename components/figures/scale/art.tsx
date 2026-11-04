import { ART } from "./scale";
import { ScaleLive } from "./live";

const layer = (key: keyof typeof ART) => <g key={key} dangerouslySetInnerHTML={{ __html: ART[key] }} />;

export function ScaleArt() {
  return <ScaleLive base={layer("base")} cell={layer("cell")} pan={layer("pan")} dial={layer("dial")} />;
}
