"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import {
  IconSun,
  IconMoon,
  IconBrandGithub,
  IconArrowUpRight,
  IconExternalLink,
} from "@tabler/icons-react";
import type { SiteProfile, SocialView } from "@/lib/content";
import { SearchSections } from "@/components/search-sections";
import { toggleTheme } from "@/lib/theme-transition";
import { cn } from "@/lib/utils";

function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="hidden items-center gap-2 rounded-full border border-black/10 bg-black/3 px-3 py-1.5 text-xs font-medium text-neutral-600 sm:flex dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
      <div className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
      </div>
      <span className="tabular-nums">{time || "--:--:--"}</span>
    </div>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = (resolvedTheme ?? "dark") === "dark";
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={(e) =>
        toggleTheme(resolvedTheme, setTheme, { x: e.clientX, y: e.clientY })
      }
      className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-black/5 dark:text-neutral-300 dark:hover:bg-white/10"
    >
      {mounted && !isDark ? <IconMoon size={18} /> : <IconSun size={18} />}
    </button>
  );
}

export function TopBar({
  profile,
  socials,
}: {
  profile: SiteProfile;
  socials: SocialView[];
}) {
  const [scrolled, setScrolled] = useState(false);
  useLenis(({ scroll }) => setScrolled(scroll > 8));

  const githubUrl = `https://github.com/${profile.githubUsername}`;
  const linkedin = socials.find((s) => s.icon === "linkedin")?.href;

  return (
    <header
      className={cn(
        "sticky top-4 z-50 hidden h-14 items-center justify-between gap-4 border-b px-5 transition-all duration-300 md:flex lg:top-6",
        scrolled
          ? "border-black/10 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/70"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <IconArrowUpRight size={18} className="text-neutral-400" />
          <span className="font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {profile.domain}
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/"
            className="rounded-md px-2.5 py-1.5 font-medium text-neutral-900 transition-colors hover:bg-black/5 dark:text-neutral-100 dark:hover:bg-white/10"
          >
            Home
          </Link>
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-neutral-500 transition-colors hover:bg-black/5 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-neutral-100"
            >
              LinkedIn <IconExternalLink size={13} />
            </a>
          )}
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-neutral-500 transition-colors hover:bg-black/5 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-neutral-100"
          >
            Resume <IconExternalLink size={13} />
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <SearchSections />
        <Clock />
        <ThemeToggle />
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-black/5 dark:text-neutral-300 dark:hover:bg-white/10"
        >
          <IconBrandGithub size={18} />
        </a>
      </div>
    </header>
  );
}
