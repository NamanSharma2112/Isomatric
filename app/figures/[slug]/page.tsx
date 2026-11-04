import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FIGURES, figureBySlug } from "@/lib/figures";

export function generateStaticParams() {
  return FIGURES.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const f = figureBySlug(slug);
  return f ? { title: f.name, description: f.line } : {};
}

export default async function FigurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = figureBySlug(slug);
  if (!f) notFound();
  const i = FIGURES.indexOf(f);
  const prev = FIGURES[(i - 1 + FIGURES.length) % FIGURES.length]!;
  const next = FIGURES[(i + 1) % FIGURES.length]!;
  const dir = `components/figures/${f.folder}`;

  return (
    <article className="doc">
      <p className="crumb">
        <Link href="/#figures">Figures</Link> / {f.name}
      </p>
      <h1>{f.name}</h1>
      <p className="lede">{f.line}</p>

      <div className="stage">{f.render()}</div>

      <div className="cols">
        <section>
          <h2>What moves</h2>
          <p>{f.mechanism}</p>
        </section>
        <section>
          <h2>Try it</h2>
          <ul>
            {f.tryIt.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="section">
        <h2>Use it</h2>
        <p>
          Copy <code>components/iso</code> and <code>{dir}</code> into your project, import the kit&rsquo;s styles once,
          and put the figure inside an element with <code>class=&quot;iso&quot;</code>.
        </p>
        <pre>
          <code>{`import "@/components/iso/iso.css";
import { ${f.component} } from "@/${dir}/figure";

export default function Page() {
  return (
    <main className="iso">
      <${f.component} />
    </main>
  );
}`}</code>
        </pre>
      </section>

      <section className="section">
        <h2>Files</h2>
        <table className="api">
          <tbody>
            <tr>
              <td>
                <code>{f.folder}.ts</code>
              </td>
              <td>The model and every static path, built once when the module loads. Pure, no React.</td>
            </tr>
            <tr>
              <td>
                <code>art.tsx</code>
              </td>
              <td>Server component: the static parts as elements, handed to the live component as props.</td>
            </tr>
            <tr>
              <td>
                <code>live.tsx</code>
              </td>
              <td>
                <code>&quot;use client&quot;</code>: motion, pointer and keys, the readout and the teardown layers. Writes
                attributes on refs, never re-renders per frame.
              </td>
            </tr>
            <tr>
              <td>
                <code>figure.tsx</code>
              </td>
              <td>The plate: figure number, title, hint, readout, legend and caption.</td>
            </tr>
            <tr>
              <td>
                <code>{f.folder}.css</code>
              </td>
              <td>The figure&rsquo;s own few rules, on top of the kit&rsquo;s.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <nav className="pager" aria-label="More figures">
        <Link href={`/figures/${prev.slug}`}>← {prev.name}</Link>
        <Link href={`/figures/${next.slug}`}>{next.name} →</Link>
      </nav>
    </article>
  );
}
