/**
 * Static, non-editable config (routes, icon keys, fallbacks).
 * All editable content (profile, projects, skills, experience, socials, tools)
 * now lives in the database and is read via `src/lib/content.ts`, managed
 * from the /admin panel.
 */

export type IconKey =
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "stats"
  | "contact";

export type SocialKey = "github" | "twitter" | "linkedin" | "mail" | "resume";

export type NavItem = { name: string; href: string; icon: IconKey };

export const navItems: NavItem[] = [
  { name: "About", href: "/", icon: "about" },
  { name: "Projects", href: "/projects", icon: "projects" },
  { name: "Skills", href: "/skills", icon: "skills" },
  { name: "Experience", href: "/experience", icon: "experience" },
  { name: "Stats", href: "/stats", icon: "stats" },
  { name: "Contact", href: "/contact", icon: "contact" },
];

/** Shown if the live GitHub API can't be reached (e.g. placeholder handle). */
export const statsFallback = {
  publicRepos: 48,
  followers: 1280,
  following: 96,
  stars: 3400,
};
