import { ART } from "./shuttle";
import { ShuttleLive } from "./live";

const layer = (key: keyof typeof ART) => <g key={key} dangerouslySetInnerHTML={{ __html: ART[key] }} />;

export function ShuttleArt() {
  return (
    <ShuttleLive base={layer("base")} cradle={layer("cradle")} cabinet={layer("cabinet")} rail={layer("rail")} car={layer("car")} block={layer("block")} />
  );
}
