import { flushSync } from "react-dom";

type Origin = { x: number; y: number };

type ViewTransitionDocument = Document & {
  startViewTransition?: (cb: () => void) => { finished: Promise<void> };
};

/**
 * Toggle between light/dark with a circular reveal animation that expands from
 * the point the user clicked (the toggle button).
 *
 * next-themes applies the `.dark` class in a passive effect, so we wrap
 * `setTheme` in `flushSync` to make that DOM change happen synchronously —
 * otherwise the View Transitions API would snapshot the *old* theme as the
 * "new" frame and nothing would animate.
 *
 * Falls back to an instant switch when the browser lacks View Transitions or
 * the user prefers reduced motion.
 */
export function toggleTheme(
  current: string | undefined,
  setTheme: (theme: string) => void,
  origin?: Origin,
) {
  const next = (current ?? "dark") === "dark" ? "light" : "dark";
  const doc = document as ViewTransitionDocument;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (typeof doc.startViewTransition !== "function" || reduceMotion) {
    setTheme(next);
    return;
  }

  const root = document.documentElement;
  // Default origin: top-right corner (where the nav toggle lives).
  const x = origin?.x ?? window.innerWidth - 24;
  const y = origin?.y ?? 24;
  // Radius needed to cover the farthest corner from the click point.
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  root.style.setProperty("--theme-x", `${x}px`);
  root.style.setProperty("--theme-y", `${y}px`);
  root.style.setProperty("--theme-r", `${endRadius}px`);
  root.dataset.themeTransition = "";

  const transition = doc.startViewTransition(() => {
    flushSync(() => setTheme(next));
  });

  transition.finished.finally(() => {
    delete root.dataset.themeTransition;
    root.style.removeProperty("--theme-x");
    root.style.removeProperty("--theme-y");
    root.style.removeProperty("--theme-r");
  });
}
