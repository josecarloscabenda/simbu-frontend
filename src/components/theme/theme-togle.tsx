"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }

  if (!mounted) {
    return (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/10" />
    );
  }

  return (
    <button
      onClick={toggle}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/10 hover:bg-black/3 dark:hover:bg-white/6 transition"
      aria-label="Alternar tema"
      title="Alternar tema"
    >
      {dark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
}
