import { getSkillGroups, getSkillMarquee } from "@/lib/content";
import { Section, SectionHeading } from "@/components/section";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

export async function Skills() {
  const [skillGroups, skillMarquee] = await Promise.all([
    getSkillGroups(),
    getSkillMarquee(),
  ]);

  return (
    <Section
      id="skills"
      className="border-y border-black/5 bg-black/[0.015] dark:border-white/5 dark:bg-white/[0.015]"
    >
      <SectionHeading
        eyebrow="Toolkit"
        title="Skills & Technologies"
        description="The languages, frameworks and tools I reach for to take products from prototype to production."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {skillGroups.map((group) => (
          <div
            key={group.id}
            className="rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-neutral-950"
          >
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-black/10 bg-black/5 px-3 py-1.5 text-sm text-neutral-700 transition-colors hover:border-blue-500/40 hover:text-neutral-900 dark:border-white/10 dark:bg-white/5 dark:text-neutral-200 dark:hover:text-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {skillMarquee.length > 0 && (
        <div className="mt-10">
          <InfiniteMovingCards items={skillMarquee} speed="slow" />
        </div>
      )}
    </Section>
  );
}
