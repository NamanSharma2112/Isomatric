import Link from "next/link";
import { FIGURES } from "@/lib/figures";
import { promptFor } from "@/lib/prompt";
import { CopyPrompt } from "@/components/site/copy-prompt";

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Isometric figures for React.</h1>
        <p className="lede">
          Eleven interactive machines, each one the explanation of an idea: a cam cut to an easing curve, an abacus of churned
          customers, a watch that keeps your time, a scale that weighs a project. They are drawn from one small kit of real solids, painted back to front
          with four-tone shading, and every one comes apart into a labelled teardown.
        </p>
        <ul className="facts">
          <li>
            <strong>{FIGURES.length}</strong> figures
          </li>
          <li>
            <strong>1</strong> small kit, about 1,700 lines
          </li>
          <li>Light and dark</li>
          <li>Keyboard, touch and reduced motion</li>
        </ul>
      </section>

      <section className="gallery" id="figures" aria-label="Figures">
        {FIGURES.map((f) => (
          <article className="card" key={f.slug}>
            {f.render()}
            <div className="card-meta">
              <div>
                <h3>{f.name}</h3>
                <p>{f.line}</p>
              </div>
              <div className="card-actions">
                <CopyPrompt text={promptFor(f)} />
                <Link className="open" href={`/figures/${f.slug}`} aria-label={`Open ${f.name}`}>
                  Open →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="band" aria-labelledby="rules">
        <div>
          <h2 id="rules">The object is the explanation.</h2>
          <p className="lede">
            No boxes and arrows. Each figure is a real, well-made thing whose working is the concept, built from many small
            parts that each sit on another part. The rules the kit holds every figure to:
          </p>
          <p>
            <Link href="/kit">Read the kit →</Link>
          </p>
        </div>
        <ol className="rules">
          <li>
            <b>01</b>
            <span>
              <strong>Solids, not wireframes.</strong> Every part is filled and painted far to near, low to high, so what is
              in front hides what is behind.
            </span>
          </li>
          <li>
            <b>02</b>
            <span>
              <strong>Lines end on something.</strong> Every seam, tick and rule ends on an outline, a stroke or a dot,
              checked by a line-end audit.
            </span>
          </li>
          <li>
            <b>03</b>
            <span>
              <strong>One lit part.</strong> Base is low, structure mid, the subject high, and exactly one accent marks the
              part to watch. Colour only where colour is the subject.
            </span>
          </li>
          <li>
            <b>04</b>
            <span>
              <strong>Every number is true.</strong> Readouts, motion and captions all come from the same model that moves
              the parts.
            </span>
          </li>
          <li>
            <b>05</b>
            <span>
              <strong>Taken apart along the assembly path.</strong> Layers rise straight up off each other, zero offset
              rebuilds the assembly, and the assembled view is one switch away.
            </span>
          </li>
        </ol>
      </section>
    </>
  );
}
