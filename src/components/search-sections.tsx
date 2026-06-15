"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { navItems } from "@/lib/site";
import { navIcons } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import { IconSearch, IconCornerDownLeft } from "@tabler/icons-react";

export function SearchSections() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  const results = navItems.filter((n) =>
    n.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  // Global ⌘K / Ctrl+K to toggle, Esc to close.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  // Rendered into <body> so the top bar's backdrop-filter doesn't clip the
  // fixed overlay (which would otherwise be confined to the bar's height).
  const overlay = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-start justify-center bg-black/60 p-4 pt-[14vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-lg overflow-hidden rounded-xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-black/10 px-4 dark:border-white/10">
              <IconSearch size={18} className="text-neutral-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sections…"
                className="w-full bg-transparent py-4 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100"
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActive((a) => Math.min(a + 1, results.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive((a) => Math.max(a - 1, 0));
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    if (results[active]) go(results[active].href);
                  }
                }}
              />
            </div>

            <ul className="max-h-72 overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-neutral-500">
                  No sections found.
                </li>
              )}
              {results.map((item, i) => {
                const Icon = navIcons[item.icon];
                return (
                  <li key={item.href}>
                    <button
                      type="button"
                      onClick={() => go(item.href)}
                      onMouseEnter={() => setActive(i)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                        i === active
                          ? "bg-black/5 text-neutral-900 dark:bg-white/10 dark:text-white"
                          : "text-neutral-600 dark:text-neutral-300",
                      )}
                    >
                      <Icon
                        size={18}
                        className={
                          i === active ? "text-blue-500" : "text-neutral-400"
                        }
                      />
                      <span className="flex-1">{item.name}</span>
                      {i === active && (
                        <IconCornerDownLeft
                          size={14}
                          className="text-neutral-400"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex items-center gap-2 rounded-lg border border-black/10 bg-black/[0.03] px-3 py-1.5 text-sm text-neutral-500 transition-colors hover:border-black/20 dark:border-white/10 dark:bg-white/5 dark:text-neutral-400 dark:hover:border-white/20"
      >
        <IconSearch size={16} />
        <span className="hidden lg:inline">Search sections…</span>
        <kbd className="ml-1 hidden rounded border border-black/10 bg-black/5 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500 lg:inline dark:border-white/10 dark:bg-white/10 dark:text-neutral-400">
          ⌘K
        </kbd>
      </button>

      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
