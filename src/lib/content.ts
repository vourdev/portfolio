import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

const FALLBACK_LOGO = "/vourdev-logo.jpeg";
const FALLBACK_AVATAR = "/avatar.svg";

/**
 * Persistent cache for content read from the database.
 *
 * `unstable_cache` caches across requests (unlike React's `cache`, which only
 * dedupes within a single render). Everything is tagged with `CONTENT_TAG` so a
 * single `revalidateTag(CONTENT_TAG)` in an admin mutation refreshes the whole
 * site; each entity also gets its own tag for granular invalidation. We still
 * wrap in React `cache` to dedupe lookups within one render pass.
 *
 * `revalidate` is a slow safety net — admin edits invalidate immediately via
 * tags, so the time-based refresh only matters if a tag is ever missed.
 */
export const CONTENT_TAG = "content";
const ONE_HOUR = 3600;

function cached<T>(fn: () => Promise<T>, key: string, tags: string[]) {
  return cache(
    unstable_cache(fn, [key], { tags: [CONTENT_TAG, ...tags], revalidate: ONE_HOUR }),
  );
}

export const imageUrl = (id?: string | null) =>
  id ? `/api/images/${id}` : null;

export type SiteProfile = {
  name: string;
  title: string;
  domain: string;
  url: string;
  email: string;
  location: string;
  available: boolean;
  availabilityText: string;
  githubUsername: string;
  headline: string;
  summary: string;
  resumeUrl: string;
  about: string[];
  logo: string;
  avatar: string;
};

export const getProfile = cached(async (): Promise<SiteProfile> => {
  const p = await prisma.profile.findUnique({ where: { id: "singleton" } });
  if (!p) {
    return {
      name: "Vour",
      title: "Full-Stack Developer",
      domain: "vour.dev",
      url: "https://vour.dev",
      email: "hello@vour.dev",
      location: "San Francisco, CA",
      available: true,
      availabilityText: "Available for new projects",
      githubUsername: "vourdev",
      headline: "I build fast, accessible web apps from idea to production.",
      summary: "",
      resumeUrl: "/resume.pdf",
      about: [],
      logo: FALLBACK_LOGO,
      avatar: FALLBACK_AVATAR,
    };
  }
  return {
    name: p.name,
    title: p.title,
    domain: p.domain,
    url: p.url,
    email: p.email,
    location: p.location,
    available: p.available,
    availabilityText: p.availabilityText,
    githubUsername: p.githubUsername,
    headline: p.headline,
    summary: p.summary,
    resumeUrl: p.resumeUrl,
    about: p.about,
    logo: imageUrl(p.logoImageId) ?? FALLBACK_LOGO,
    avatar: imageUrl(p.avatarImageId) ?? FALLBACK_AVATAR,
  };
}, "profile", ["profile"]);

export type SocialView = { id: string; name: string; href: string; icon: string };
export const getSocials = cached(
  async (): Promise<SocialView[]> =>
    prisma.social.findMany({ orderBy: { order: "asc" } }),
  "socials",
  ["socials"],
);

export type ToolView = {
  id: string;
  name: string;
  designation: string;
  image: string;
};
export const getTools = cached(
  async (): Promise<ToolView[]> =>
    prisma.tool.findMany({ orderBy: { order: "asc" } }),
  "tools",
  ["tools"],
);

export const getSkillGroups = cached(
  () => prisma.skillGroup.findMany({ orderBy: { order: "asc" } }),
  "skills",
  ["skills"],
);

export const getSkillMarquee = cache(async () =>
  (await getSkillGroups()).flatMap((g) => g.items),
);

export const getExperiences = cached(
  () => prisma.experience.findMany({ orderBy: { order: "asc" } }),
  "experiences",
  ["experiences"],
);

export type ProjectView = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  href: string | null;
  repo: string | null;
  status: string | null;
  featured: boolean;
  image: string | null;
};
export const getProjects = cached(async (): Promise<ProjectView[]> => {
  const rows = await prisma.project.findMany({ orderBy: { order: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    tags: r.tags,
    href: r.href,
    repo: r.repo,
    status: r.status,
    featured: r.featured,
    image: imageUrl(r.imageId),
  }));
}, "projects", ["projects"]);
