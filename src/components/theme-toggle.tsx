"use client";

import { useEffect, useState } from "react";

import type { ThemeMode } from "@/lib/portfolio";

type ThemeToggleProps = {
  defaultMode: ThemeMode;
  enabled: boolean;
};

export function ThemeToggle({ defaultMode, enabled }: ThemeToggleProps) {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    window.localStorage.setItem("portfolio-theme", mode);
  }, [mode]);

  if (!enabled) {
    return null;
  }

  function toggleTheme() {
    const nextMode: ThemeMode = mode === "light" ? "dark" : "light";
    setMode(nextMode);
  }

  return (
    <button className="themeToggle" onClick={toggleTheme} type="button">
      <span>{mode === "light" ? "Mode sombre" : "Mode clair"}</span>
    </button>
  );
}
