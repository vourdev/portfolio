"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Animated flowing "beams" background (Aceternity UI).
 * Paths are generated so the file stays compact while still rendering a
 * dense field of animated gradient curves.
 */
export const BackgroundBeams = React.memo(
  ({ className }: { className?: string }) => {
    const paths = Array.from({ length: 26 }, (_, i) => {
      const startX = -420 + i * 42;
      return `M${startX} -200C${startX} -200 ${startX + 120} 120 ${
        startX + 220
      } 320C${startX + 320} 520 ${startX + 420} 760 ${startX + 420} 900`;
    });

    return (
      <div
        className={cn(
          "absolute inset-0 flex h-full w-full items-center justify-center",
          className,
        )}
      >
        <svg
          className="pointer-events-none absolute z-0 h-full w-full"
          viewBox="-420 -220 1500 1160"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          {paths.map((path, index) => (
            <motion.path
              key={`path-${index}`}
              d={path}
              stroke={`url(#linearGradient-${index})`}
              strokeOpacity="0.4"
              strokeWidth="0.6"
            />
          ))}
          <defs>
            {paths.map((_, index) => (
              <motion.linearGradient
                id={`linearGradient-${index}`}
                key={`gradient-${index}`}
                initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "0%" }}
                animate={{
                  x1: ["0%", "100%"],
                  x2: ["0%", "95%"],
                  y1: ["0%", "100%"],
                  y2: ["0%", `${93 + Math.random() * 8}%`],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: Math.random() * 10,
                }}
              >
                <stop stopColor="#18CCFC" stopOpacity="0" />
                <stop stopColor="#18CCFC" />
                <stop offset="32.5%" stopColor="#6344F5" />
                <stop offset="100%" stopColor="#AE48FF" stopOpacity="0" />
              </motion.linearGradient>
            ))}
          </defs>
        </svg>
      </div>
    );
  },
);

BackgroundBeams.displayName = "BackgroundBeams";
