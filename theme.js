(() => {
  const root = document.documentElement;
  const storageKey = "site-theme";
  const dark = "dark";
  const light = "light";
  const icons = {
    dark: "&#9728;",
    light: "&#9789;",
  };

  const getDefaultTheme = () => {
    const isMobile =
      window.matchMedia &&
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    return isMobile ? dark : light;
  };

  const getStoredTheme = () => {
    try {
      const value = localStorage.getItem(storageKey);
      if (value === dark || value === light) return value;
    } catch {}
    return getDefaultTheme();
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

  const getCurrentTheme = () =>
    root.getAttribute("data-theme") === light ? light : dark;

  const saveTheme = (theme) => {
    try {
      localStorage.setItem(storageKey, theme);
    } catch {}
  };

  const initialTheme = getStoredTheme();
  applyTheme(initialTheme);

  const bindToggle = () => {
    updateButtons(getCurrentTheme());

    const buttons = document.querySelectorAll("[data-theme-toggle]");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const current = getCurrentTheme();
        const next = current === dark ? light : dark;
        applyTheme(next);
        saveTheme(next);
      });
    });
  };

  const setExternalLinksToNewTab = () => {
    const links = document.querySelectorAll("a[href]");
    links.forEach((link) => {
      if (link.hasAttribute("target")) return;
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      let url;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      }
    });
  };

  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey) return;
    const next = event.newValue === light || event.newValue === dark
      ? event.newValue
      : getDefaultTheme();
    applyTheme(next);
  });

  window.addEventListener("pageshow", () => {
    updateButtons(getCurrentTheme());
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      bindToggle();
      setExternalLinksToNewTab();
    });
  } else {
    bindToggle();
    setExternalLinksToNewTab();
  }
})();
