import { getExperiences } from "@/lib/content";
import { Section, SectionHeading } from "@/components/section";
import { Timeline } from "@/components/ui/timeline";
import { IconCircleCheck } from "@tabler/icons-react";

export async function Experience() {
  const experiences = await getExperiences();

  const data = experiences.map((exp) => ({
    title: exp.period,
    content: (
      <div
        key={exp.id}
        className="rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-neutral-950"
      >
        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          {exp.role}
        </h3>
        <p className="mt-0.5 text-sm font-medium text-blue-600 dark:text-blue-400">
          {exp.company}
          <span className="text-neutral-500 dark:text-neutral-600">
            {" "}
            · {exp.location}
          </span>
        </p>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {exp.description}
        </p>
        <ul className="mt-4 space-y-2">
          {exp.achievements.map((a, index) => (
            <li
              key={index}
              className="flex gap-2 text-sm text-neutral-700 dark:text-neutral-300"
            >
              <IconCircleCheck
                size={16}
                className="mt-0.5 shrink-0 text-emerald-500 dark:text-emerald-400"
              />
              <span>{a}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-2">
          {exp.tags.map((t, index) => (
            <span
              key={index}
              className="rounded-md border border-black/5 bg-black/[0.03] px-2 py-1 text-xs text-neutral-500 dark:border-white/5 dark:bg-white/[0.03] dark:text-neutral-400"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    ),
  }));

  return (
    <Section id="experience">
      <SectionHeading
        eyebrow="Career"
        title="Experience"
        description="Building and shipping products across startups and scale-ups."
      />
      <div className="mt-4">
        {data.length > 0 && <Timeline data={data} />}
      </div>
    </Section>
  );
}
