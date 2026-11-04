import { readFileSync } from "node:fs";
import { join } from "node:path";

/** The skill's files, as published: download name → path inside skills/isomatric. */
export const SKILL_FILES = [
  { name: "SKILL.md", path: "SKILL.md", about: "The skill itself: the bar, the workflow, tones, craft rules and the finishing table." },
  { name: "kit.md", path: "references/kit.md", about: "Every kit function, component and hook, with its arguments." },
  { name: "recipes.md", path: "references/recipes.md", about: "Recipes for the parts figures are made of: plates, rails, trays, dials, keys, drawers." },
  { name: "motion-and-teardown.md", path: "references/motion-and-teardown.md", about: "Loops, easing, stories told event by event, and taking a figure apart." },
  { name: "review.md", path: "references/review.md", about: "How to capture and review a figure, and the checklist it must pass." },
] as const;

const ROOT = join(process.cwd(), "skills", "isomatric");

export const readSkillFile = (path: string) => readFileSync(join(ROOT, path));

/* ── A stored (uncompressed) zip ────────────────────────────────────────
   Five small text files need no compression, and writing the format
   directly keeps the site free of a zip dependency. */
const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(data: Uint8Array) {
  let c = 0xffffffff;
  for (const byte of data) c = CRC[(c ^ byte) & 0xff]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export function zipSkill(folder = "isomatric"): Uint8Array {
  const local: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;
  for (const f of SKILL_FILES) {
    const name = new TextEncoder().encode(`${folder}/${f.path}`);
    const data = new Uint8Array(readSkillFile(f.path));
    const crc = crc32(data);
    const head = new DataView(new ArrayBuffer(30));
    head.setUint32(0, 0x04034b50, true); // local file header
    head.setUint16(4, 20, true); // version needed
    head.setUint16(8, 0, true); // stored
    head.setUint32(14, crc, true);
    head.setUint32(18, data.length, true);
    head.setUint32(22, data.length, true);
    head.setUint16(26, name.length, true);
    local.push(new Uint8Array(head.buffer), name, data);
    const dir = new DataView(new ArrayBuffer(46));
    dir.setUint32(0, 0x02014b50, true); // central directory header
    dir.setUint16(4, 20, true);
    dir.setUint16(6, 20, true);
    dir.setUint32(16, crc, true);
    dir.setUint32(20, data.length, true);
    dir.setUint32(24, data.length, true);
    dir.setUint16(28, name.length, true);
    dir.setUint32(42, offset, true);
    central.push(new Uint8Array(dir.buffer), name);
    offset += 30 + name.length + data.length;
  }
  const size = central.reduce((n, b) => n + b.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true); // end of central directory
  end.setUint16(8, SKILL_FILES.length, true);
  end.setUint16(10, SKILL_FILES.length, true);
  end.setUint32(12, size, true);
  end.setUint32(16, offset, true);
  const parts = [...local, ...central, new Uint8Array(end.buffer)];
  const out = new Uint8Array(parts.reduce((n, b) => n + b.length, 0));
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.length;
  }
  return out;
}
