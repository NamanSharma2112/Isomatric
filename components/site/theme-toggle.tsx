"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

/** Light or dark, remembered. The class on <html> is what the figures read. */
export function ThemeToggle() {
  const [dark, setDark] = React.useState<boolean | null>(null);
  React.useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const flip = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    setDark(next);
  };
  return (
    <button type="button" className="theme" onClick={flip} aria-label={dark ? "Switch to light" : "Switch to dark"}>
      {dark ? <Sun aria-hidden /> : <Moon aria-hidden />}
    </button>
  );
}
