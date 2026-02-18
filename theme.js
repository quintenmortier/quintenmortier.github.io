(() => {
  const root = document.documentElement;
  const storageKey = "site-theme";
  const dark = "dark";
  const light = "light";
  const icons = {
    dark: "&#9728;",
    light: "&#9790;",
  };

  const getStoredTheme = () => {
    try {
      const value = localStorage.getItem(storageKey);
      if (value === dark || value === light) return value;
    } catch {}
    return dark;
  };

  const updateButtons = (theme) => {
    const isDark = theme === dark;
    const nextAria = isDark ? "Switch to light mode" : "Switch to dark mode";
    const icon = isDark ? icons.dark : icons.light;
    const buttons = document.querySelectorAll("[data-theme-toggle]");
    buttons.forEach((button) => {
      button.innerHTML = icon;
      button.setAttribute("aria-label", nextAria);
      button.setAttribute("title", nextAria);
      button.setAttribute("aria-pressed", String(isDark));
    });
  };

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    updateButtons(theme);
  };

  const saveTheme = (theme) => {
    try {
      localStorage.setItem(storageKey, theme);
    } catch {}
  };

  const initialTheme = getStoredTheme();
  applyTheme(initialTheme);

  const bindToggle = () => {
    const buttons = document.querySelectorAll("[data-theme-toggle]");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const current = root.getAttribute("data-theme") === light ? light : dark;
        const next = current === dark ? light : dark;
        applyTheme(next);
        saveTheme(next);
      });
    });
  };

  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey) return;
    const next = event.newValue === light ? light : dark;
    applyTheme(next);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindToggle);
  } else {
    bindToggle();
  }
})();
