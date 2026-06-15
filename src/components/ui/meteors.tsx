"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const Meteors = ({
  number = 20,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  // Randomized timings are generated on the client only (after mount) so the
  // server-rendered HTML matches the first client render — otherwise the
  // random animationDelay/Duration values cause a hydration mismatch.
  const [timings, setTimings] = useState<
    { delay: string; duration: string }[] | null
  >(null);

  useEffect(() => {
    setTimings(
      Array.from({ length: number }, () => ({
        delay: (Math.random() * 0.6 + 0.2).toFixed(2) + "s",
        duration: Math.floor(Math.random() * 8 + 4) + "s",
      })),
    );
  }, [number]);

  return (
    <>
      {Array.from({ length: number }).map((_, idx) => {
        const position = idx * (800 / number);
        return (
          <span
            key={"meteor" + idx}
            className={cn(
              "animate-meteor-effect absolute top-1/2 left-1/2 h-0.5 w-0.5 rotate-[215deg] rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
              "before:absolute before:top-1/2 before:h-px before:w-[50px] before:-translate-y-1/2 before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:content-['']",
              className,
            )}
            style={{
              top: "-40px",
              left: position + "px",
              // Deterministic fallback for SSR + first client render.
              animationDelay: timings?.[idx]?.delay ?? "0s",
              animationDuration: timings?.[idx]?.duration ?? "6s",
            }}
          />
        );
      })}
    </>
  );
};
