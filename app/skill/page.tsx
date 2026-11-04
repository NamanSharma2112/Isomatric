import type { Metadata } from "next";
import Link from "next/link";
import { SKILL_FILES } from "@/lib/skill";
import { BLANK_PROMPT, SKILL_INSTALL } from "@/lib/prompt";
import { CopyPrompt } from "@/components/site/copy-prompt";

export const metadata: Metadata = {
  title: "The skill",
  description: "An agent skill that teaches a coding model to build Isomatric figures: the workflow, the kit, the part recipes and the review checklist.",
};

export default function SkillPage() {
  return (
    <article className="doc">
      <p className="crumb">
        <Link href="/">Isomatric</Link> / Skill
      </p>
      <h1>The skill</h1>
      <p className="lede">
        Everything a coding model needs to build figures to this site&rsquo;s standard: find the truth, invent the machine,
        list its parts, paint them back to front, make it move from a model, take it apart, and review it like a critic.
      </p>
      <div className="actions">
        <a className="download" href="/skill/isomatric.zip" download>
          Download the skill (.zip)
        </a>
        <CopyPrompt text={SKILL_INSTALL} label="Copy install command" />
      </div>

      <section className="section">
        <h2>Install it</h2>
        <p>With the skills CLI, which puts it where Claude Code, Cursor and other agents look:</p>
        <pre>
          <code>{SKILL_INSTALL}</code>
        </pre>
        <p>
          Or by hand: unzip the download into your agent&rsquo;s skills folder, so the file sits at{" "}
          <code>~/.claude/skills/isomatric/SKILL.md</code> (or <code>.claude/skills/isomatric/</code> in a project). The
          skill expects this repository&rsquo;s kit, so clone it, or copy <code>components/iso</code> into your project.
        </p>
      </section>

      <section className="section">
        <h2>What&rsquo;s in it</h2>
        <table className="api">
          <tbody>
            {SKILL_FILES.map((f) => (
              <tr key={f.name}>
                <td>
                  <a href={`/skill/files/${f.name}`}>
                    <code>{f.name}</code>
                  </a>
                </td>
                <td>{f.about}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="section">
        <h2>Start a new figure</h2>
        <p>
          Fill in the parts in angle brackets and paste it into your agent. To rebuild or adapt one of the figures instead,
          use the <strong>Copy prompt</strong> button on its card.
        </p>
        <details className="prompt" open>
          <summary>The prompt</summary>
          <pre>
            <code>{BLANK_PROMPT}</code>
          </pre>
        </details>
        <CopyPrompt text={BLANK_PROMPT} />
      </section>

      <section className="section">
        <h2>Where it comes from</h2>
        <p>
          It is distilled from the eleven figures in this repository and the reviews that shaped them, and builds on the{" "}
          <a href="https://github.com/wheresryan22/anatomy">Anatomy</a> isometric skill and{" "}
          <a href="https://github.com/jakubkrehel/skills">Jakub Krehel&rsquo;s teardown skill</a>, with line and tone conventions
          from technical illustration practice.
        </p>
      </section>
    </article>
  );
}
