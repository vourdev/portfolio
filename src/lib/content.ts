import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";

const FALLBACK_LOGO = "/vourdev-logo.jpeg";
const FALLBACK_AVATAR = "/avatar.svg";

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

export const getProfile = cache(async (): Promise<SiteProfile> => {
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
});

export type SocialView = { id: string; name: string; href: string; icon: string };
export const getSocials = cache(
  async (): Promise<SocialView[]> =>
    prisma.social.findMany({ orderBy: { order: "asc" } }),
);

export type ToolView = {
  id: string;
  name: string;
  designation: string;
  image: string;
};
export const getTools = cache(
  async (): Promise<ToolView[]> =>
    prisma.tool.findMany({ orderBy: { order: "asc" } }),
);

export const getSkillGroups = cache(() =>
  prisma.skillGroup.findMany({ orderBy: { order: "asc" } }),
);

export const getSkillMarquee = cache(async () =>
  (await getSkillGroups()).flatMap((g) => g.items),
);

export const getExperiences = cache(() =>
  prisma.experience.findMany({ orderBy: { order: "asc" } }),
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
export const getProjects = cache(async (): Promise<ProjectView[]> => {
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
});
