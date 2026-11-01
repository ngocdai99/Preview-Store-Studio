"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const saved = localStorage.getItem("sps_theme") as "dark" | "light" | null;
    const initial = saved || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
    if (initial === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("sps_theme", next);
    document.documentElement.setAttribute("data-theme", next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  };

  if (!mounted) {
    return (
      <div className="w-[36px] h-[36px] rounded-full border border-border bg-card-muted shrink-0" aria-hidden="true" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="btn-scale w-[36px] h-[36px] rounded-full border border-border bg-card-muted hover:bg-card text-foreground flex items-center justify-center transition-all shrink-0 cursor-pointer"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-foreground transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-foreground transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
