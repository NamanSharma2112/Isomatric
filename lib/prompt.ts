import type { Figure } from "./figures";

/** Where the skill lives, for prompts pasted into another tool. */
export const REPO = "github.com/NamanSharma2112/isomatric";
export const SKILL_INSTALL = "npx skills add NamanSharma2112/isomatric --skill isomatric";

const SKILL_LINE = `Use the "isomatric" skill (${REPO}, skills/isomatric/SKILL.md; install with \`${SKILL_INSTALL}\`). Follow its workflow, its parts and tone rules, and its review checklist; if the skill is not installed, read that file first.`;

const DELIVER = `Deliver
- A folder components/figures/<slug>/ with <slug>.ts (the model and every static path, pure), art.tsx (server: static parts as elements), live.tsx ("use client": motion, pointer and keys, readout, teardown layers), figure.tsx (the <Plate>: number, title, hint, readout, legend, caption) and <slug>.css.
- An entry in lib/figures.tsx: slug, name, a one-line description, what moves and what that means, and how to play with it.
- Verified, by looking at screenshots: light and dark, 390 px wide, assembled and taken apart, mid-motion, and with reduced motion. Every line ends on something, exactly one part is lit, every number the figure shows comes from its model, and no label is left behind by a moving part.`;

/**
 * A prompt that rebuilds one figure, or adapts it to a new idea, with the
 * isomatric skill. Every fact in it comes from the figure's own entry.
 */
const sentence = (t: string) => {
  const s = t.trim().replace(/[.;]+$/, "");
  return s ? `${s[0]!.toUpperCase()}${s.slice(1)}.` : "";
};

export function promptFor(f: Figure) {
  const apart = f.tryIt.find((t) => /apart/i.test(t));
  const play = f.tryIt.filter((t) => t !== apart);
  // "Take it apart: tray, case…" or "Take it apart to see the plate…" → just the layers.
  const layers = apart?.replace(/^take it apart[:,]?\s*(to see\s*)?/i, "");
  return [
    `Build an Isomatric figure: ${f.name}.`,
    "",
    SKILL_LINE,
    "",
    "The figure",
    `- What it is: ${f.line}`,
    `- What moves, and what that motion means: ${f.mechanism}`,
    `- How people play with it: ${play.map(sentence).join(" ")}`,
    layers ? `- Teardown: ${sentence(layers)}` : "- Teardown: it comes apart along its assembly path, one labelled layer per assembly.",
    "",
    `Reference: components/figures/${f.folder} in ${REPO} is a finished version. Read ${f.folder}.ts, art.tsx, live.tsx and figure.tsx before writing anything, and match how they are split.`,
    "",
    DELIVER,
    "",
    "To use it for a different idea instead, replace \"What it is\" and \"What moves\" with your idea and invent the machine whose working is that idea; keep everything else.",
  ].join("\n");
}

/** A blank prompt for a new figure, with the parts to fill in marked. */
export const BLANK_PROMPT = [
  "Build an Isomatric figure that explains: <the idea, in one sentence>.",
  "",
  SKILL_LINE,
  "",
  "The figure",
  "- The true numbers behind it: <sizes, counts, rates, thresholds — or say it is a worked example>",
  "- Who it is for and where it appears: <a docs page, a landing page, an article>",
  "- How people should play with it: <drag, step with the keys, hover, or let it run>",
  "",
  "Start by inventing the machine whose working is the idea, say in one sentence what moves and what that motion means, and write the parts list before any geometry.",
  "",
  DELIVER,
].join("\n");
