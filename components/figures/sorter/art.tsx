import { ART } from "./sorter";
import { SorterLive } from "./live";

/* Static parts as elements. Each layer is the kit's own markup, built once
   in sorter.ts; the live component moves what moves inside them. */
const layer = (key: keyof typeof ART) => <g key={key} dangerouslySetInnerHTML={{ __html: ART[key] }} />;

export function SorterArt() {
  return <SorterLive base={layer("base")} rails={layer("rails")} shuttle={layer("shuttle")} trays={layer("trays")} tile={layer("tile")} />;
}
