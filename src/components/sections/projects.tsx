import { getProjects } from "@/lib/content";
import { Section, SectionHeading } from "@/components/section";
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconExternalLink,
  IconArrowUpRight,
} from "@tabler/icons-react";

const statusStyles: Record<string, string> = {
  Live: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  WIP: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "Open source":
    "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
};

export async function Projects() {
  const projects = await getProjects();

  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="Work"
        title="Featured Projects"
        description="A selection of things I've designed, built and shipped — from real-time platforms to open-source tools."
      />
      <div className="mt-12 grid grid-flow-dense grid-cols-1 gap-4 md:auto-rows-[15.5rem] md:grid-cols-2 lg:grid-cols-4">
        {projects.map((p) => {
          const img = p.image;
          const MAX_TAGS = p.featured ? 6 : 3;
          const shownTags = p.tags.slice(0, MAX_TAGS);
          const extraTags = p.tags.length - shownTags.length;
          return (
            <div
              key={p.id}
              className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5",
                img
                  ? "border-white/10"
                  : "border-black/10 bg-white hover:border-black/20 dark:border-white/10 dark:bg-neutral-950 dark:hover:border-white/20",
                p.featured && "md:col-span-2",
              )}
            >
              {img && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={p.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/65 to-black/30" />
                </>
              )}

              <div className="relative z-10 min-h-0">
                <div className="mb-4 flex items-center justify-between gap-3">
                  {p.status && (
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                        img
                          ? "border-white/20 bg-black/30 text-white"
                          : statusStyles[p.status],
                      )}
                    >
                      {p.status}
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    {p.repo && (
                      <a
                        href={p.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${p.title} source code`}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                          img
                            ? "text-white/80 hover:bg-white/15 hover:text-white"
                            : "text-neutral-400 hover:bg-black/5 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-white/5 dark:hover:text-neutral-200",
                        )}
                      >
                        <IconBrandGithub size={18} />
                      </a>
                    )}
                    {p.href && (
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${p.title} live demo`}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                          img
                            ? "text-white/80 hover:bg-white/15 hover:text-white"
                            : "text-neutral-400 hover:bg-black/5 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-white/5 dark:hover:text-neutral-200",
                        )}
                      >
                        <IconExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>

                <h3
                  className={cn(
                    "flex items-start gap-1 text-xl font-bold",
                    img ? "text-white" : "text-neutral-900 dark:text-neutral-100",
                  )}
                >
                  <span className="line-clamp-2">{p.title}</span>
                  <IconArrowUpRight
                    size={18}
                    className={cn(
                      "mt-1 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                      img
                        ? "text-white/70 group-hover:text-white"
                        : "text-neutral-400 group-hover:text-blue-500 dark:text-neutral-600 dark:group-hover:text-blue-400",
                    )}
                  />
                </h3>
                <p
                  className={cn(
                    "mt-2 text-sm leading-relaxed",
                    p.featured ? "line-clamp-2" : "line-clamp-3",
                    img ? "text-neutral-200" : "text-neutral-600 dark:text-neutral-400",
                  )}
                >
                  {p.description}
                </p>
              </div>

              <div className="relative z-10 mt-6 flex flex-wrap items-center gap-2">
                {shownTags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "rounded-md border px-2 py-1 text-xs",
                      img
                        ? "border-white/15 bg-white/10 text-white/90"
                        : "border-black/5 bg-black/[0.03] text-neutral-500 dark:border-white/5 dark:bg-white/[0.03] dark:text-neutral-400",
                    )}
                  >
                    {tag}
                  </span>
                ))}
                {extraTags > 0 && (
                  <span
                    className={cn(
                      "rounded-md px-2 py-1 text-xs font-medium",
                      img ? "text-white/70" : "text-neutral-400 dark:text-neutral-500",
                    )}
                  >
                    +{extraTags}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
