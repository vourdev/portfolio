"use client";
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import type { SiteProfile, ToolView } from "@/lib/content";
import { IconArrowRight, IconMail, IconDownload } from "@tabler/icons-react";

export function About({
  profile,
  tools,
}: {
  profile: SiteProfile;
  tools: ToolView[];
}) {
  const intro = profile.about[0] ?? profile.summary;

  return (
    <section
      id="about"
      className="relative flex min-h-[calc(100vh-6.5rem)] w-full items-center overflow-hidden px-6 py-24 md:py-4 md:px-12"
    >
      <div className="hidden dark:block">
        <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.10),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.4] [background-image:linear-gradient(to_right,rgba(120,120,120,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.12)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] dark:opacity-[0.25]" />

      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-1.5 text-sm text-neutral-600 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
          <span className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400" />
          {profile.title}
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl dark:text-neutral-100">
          Hi, I&apos;m{" "}
          <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-violet-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-cyan-300 dark:to-violet-400">
            {profile.name}
          </span>
          .
        </h1>

        {profile.headline && (
          <TextGenerateEffect
            words={profile.headline}
            className="mt-4 text-2xl font-semibold text-neutral-700 sm:text-3xl dark:text-neutral-300"
          />
        )}

        {intro && (
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            {intro}
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-neutral-50 transition-colors hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
          >
            View my work
            <IconArrowRight size={18} />
          </a>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg border border-black/15 bg-black/5 px-5 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-black/10 dark:border-white/15 dark:bg-white/5 dark:text-neutral-100 dark:hover:bg-white/10"
          >
            Get in touch
            <IconMail size={16} />
          </a>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            Résumé
            <IconDownload size={16} />
          </a>
        </div>

        {tools.length > 0 && (
          <div className="mt-14">
            <p className="mb-5 text-sm text-neutral-500">Tools I work with</p>
            <div className="flex items-center pl-3">
              <AnimatedTooltip items={tools} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
