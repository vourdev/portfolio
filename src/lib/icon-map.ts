import {
  IconUser,
  IconFolders,
  IconTool,
  IconBriefcase,
  IconChartBar,
  IconMail,
  IconBrandGithub,
  IconBrandX,
  IconBrandLinkedin,
  IconFileText,
} from "@tabler/icons-react";
import type { IconKey, SocialKey } from "@/lib/site";

export const navIcons = {
  about: IconUser,
  projects: IconFolders,
  skills: IconTool,
  experience: IconBriefcase,
  stats: IconChartBar,
  contact: IconMail,
} satisfies Record<IconKey, typeof IconUser>;

export const socialIcons = {
  github: IconBrandGithub,
  twitter: IconBrandX,
  linkedin: IconBrandLinkedin,
  mail: IconMail,
  resume: IconFileText,
} satisfies Record<SocialKey, typeof IconUser>;
