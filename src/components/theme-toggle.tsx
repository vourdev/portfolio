"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { toggleTheme } from "@/lib/theme-transition";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = (resolvedTheme ?? "dark") === "dark";
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      onClick={(e) =>
        toggleTheme(resolvedTheme, setTheme, { x: e.clientX, y: e.clientY })
      }
    >
      {mounted && !isDark ? <IconMoon size={16} /> : <IconSun size={16} />}
    </Button>
  );
}
