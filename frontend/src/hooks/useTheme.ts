import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "logitrack-theme";

function temaInicial(): Theme {
  const salvo = localStorage.getItem(STORAGE_KEY);
  if (salvo === "light" || salvo === "dark") return salvo;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(temaInicial);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  function alternar() {
    setTheme((atual) => (atual === "light" ? "dark" : "light"));
  }

  return { theme, alternar };
}
