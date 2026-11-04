import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeToggle } from "@/components/site/theme-toggle";
import "@/components/iso/iso.css";
import "./globals.css";

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Isomatric", template: "%s · Isomatric" },
  description:
    "Interactive isometric figures for React: real solids, painter's order, four-tone shading and a teardown view, built from one small kit.",
};

/* The theme is set before the first paint: a stored choice if there is one,
   otherwise the system's. */
const THEME = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME }} />
      </head>
      <body>
        <header className="top">
          <Link href="/" className="word">
            Isomatric
          </Link>
          <nav aria-label="Site">
            <Link href="/#figures">Figures</Link>
            <Link href="/kit">Kit</Link>
            <Link href="/skill">Skill</Link>
            <a href="https://github.com/NamanSharma2112/isomatric">GitHub</a>
            <ThemeToggle />
          </nav>
        </header>
        <main className="iso">{children}</main>
        <footer className="foot">
          <span>Isomatric — isometric figures for React.</span>
          <span>
            By <a href="https://www.namansharma.com">Naman Sharma</a>
          </span>
        </footer>
      </body>
    </html>
  );
}
