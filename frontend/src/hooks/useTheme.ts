import { useEffect, useState } from "react";

const THEME_OPTIONS = ["light", "dark"];
type ThemeOptions = typeof THEME_OPTIONS[number];

export default function useTheme() {
  const [theme, setTheme] = useState<ThemeOptions>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as ThemeOptions) || "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, setTheme, toggleTheme };
}
