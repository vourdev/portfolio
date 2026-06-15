import { getGitHubStats } from "@/lib/github";
import { getProfile } from "@/lib/content";
import { Section, SectionHeading } from "@/components/section";
import { Meteors } from "@/components/ui/meteors";
import {
  IconUsers,
  IconBook,
  IconStar,
  IconUserPlus,
  IconBrandGithub,
  IconArrowUpRight,
} from "@tabler/icons-react";

function formatNum(n: number) {
  return n >= 1000
    ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "k"
    : String(n);
}

export async function Stats() {
  const profile = await getProfile();
  const stats = await getGitHubStats(profile.githubUsername);
  const user = stats.username;

  const cards = [
    { label: "Followers", value: stats.followers, Icon: IconUsers },
    { label: "Public Repos", value: stats.publicRepos, Icon: IconBook },
    { label: "Total Stars", value: stats.stars, Icon: IconStar },
    { label: "Following", value: stats.following, Icon: IconUserPlus },
  ];

  const theme =
    "theme=transparent&hide_border=true&title_color=60a5fa&icon_color=22d3ee&text_color=a3a3a3";

  return (
    <Section id="stats">
      <SectionHeading
        eyebrow="Activity"
        title="GitHub Stats"
        description="A live snapshot of my open-source activity, pulled straight from the GitHub API."
      />

      <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, Icon }) => (
          <div
            key={label}
            className="relative overflow-hidden rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-neutral-950"
          >
            <Meteors number={6} />
            <div className="relative z-10">
              <Icon size={22} className="text-blue-500 dark:text-blue-400" />
              <p className="mt-3 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                {formatNum(value)}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {!stats.isFallback ? (
        <>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://github-readme-stats.vercel.app/api?username=${user}&show_icons=true&${theme}`}
              alt={`${user} GitHub stats`}
              className="w-full rounded-xl border border-black/10 bg-neutral-50 p-2 dark:border-white/10 dark:bg-neutral-950"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${user}&layout=compact&${theme}`}
              alt={`${user} top languages`}
              className="w-full rounded-xl border border-black/10 bg-neutral-50 p-2 dark:border-white/10 dark:bg-neutral-950"
            />
          </div>
          <div className="mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://github-readme-activity-graph.vercel.app/graph?username=${user}&bg_color=00000000&color=a3a3a3&line=3b82f6&point=22d3ee&area=true&hide_border=true`}
              alt={`${user} contribution graph`}
              className="w-full rounded-xl border border-black/10 bg-neutral-50 p-2 dark:border-white/10 dark:bg-neutral-950"
            />
          </div>
        </>
      ) : (
        <p className="mt-6 rounded-xl border border-dashed border-black/10 bg-black/[0.02] px-5 py-4 text-sm text-neutral-500 dark:border-white/10 dark:bg-white/[0.02]">
          Showing placeholder numbers. Set your GitHub handle in the admin
          panel (Profile → GitHub username) to show live contribution graphs.
        </p>
      )}

      <div className="mt-8">
        <a
          href={`https://github.com/${user}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-black/15 bg-black/5 px-5 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-black/10 dark:border-white/15 dark:bg-white/5 dark:text-neutral-100 dark:hover:bg-white/10"
        >
          <IconBrandGithub size={18} />
          View full profile
          <IconArrowUpRight size={16} className="text-neutral-400" />
        </a>
      </div>
    </Section>
  );
}
