import { useState, useEffect } from "react";

// theme types
export type Theme = "light" | "dark" | "system";

//
function getEffectiveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
}

// applies or removes the .dark
function applyTheme(theme: Theme) {
  const effective = getEffectiveTheme(theme);

  document.documentElement.classList.add(
    "transition-colors",
    "duration-300",
    "ease-in-out"
  );


  if (effective === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

// usetheme
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");

  // on mount — read saved preference and apply it
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    const initial = saved ?? "light"; // default system if nothing saved
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  // listen to the os preference changes in system
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function handleChange() {
      // only react if we r in system mode
      if (theme === "system") {
        applyTheme("system");
      }
    }

    mediaQuery.addEventListener("change", handleChange);

    // remove listener when component unmounts or theme changes
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]);

  //save preference and apply to dom
  function setTheme(newTheme: Theme) {
    setThemeState(newTheme);
    applyTheme(newTheme);

    if (newTheme === "system") {
      localStorage.removeItem("theme"); // clear choice, revert to def
    } else {
      localStorage.setItem("theme", newTheme);
    }
  }

  return {
    theme,
    setTheme,
    // derive the actual applied color for UI purposes (icon selection etc.)
    effectiveTheme:
      typeof window !== "undefined" ? getEffectiveTheme(theme) : "light",
  };
}
