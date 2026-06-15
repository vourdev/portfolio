import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const devicon = (p) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${p}`;

async function main() {
  console.log("Seeding…");

  await prisma.profile.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      name: "Vour",
      title: "Full-Stack Developer",
      domain: "vour.dev",
      url: "https://vour.dev",
      email: "hello@vour.dev",
      location: "San Francisco, CA",
      available: true,
      availabilityText: "Available for new projects",
      githubUsername: "vourdev",
      resumeUrl: "/resume.pdf",
      headline: "I build fast, accessible web apps from idea to production.",
      summary:
        "Full-stack developer specializing in React, Next.js and TypeScript. I turn complex problems into clean, performant products that people love to use.",
      about: [
        "I'm a full-stack developer with 6+ years of experience shipping production web applications end to end — from database schema to pixel-perfect UI. I care deeply about performance, accessibility and developer experience.",
        "Lately I've been building with the Next.js App Router, edge-first infrastructure, and type-safe APIs. I enjoy the whole stack: designing data models, optimizing queries, crafting smooth interactions, and wiring up CI/CD that lets a team ship with confidence.",
        "When I'm not coding, you'll find me contributing to open source, writing about the web platform, or over-engineering my home automation setup.",
      ],
    },
  });

  await prisma.social.deleteMany();
  await prisma.social.createMany({
    data: [
      { name: "GitHub", href: "https://github.com/vourdev", icon: "github", order: 0 },
      { name: "Twitter / X", href: "https://x.com/vourdev", icon: "twitter", order: 1 },
      { name: "LinkedIn", href: "https://linkedin.com/in/vourdev", icon: "linkedin", order: 2 },
      { name: "Email", href: "mailto:hello@vour.dev", icon: "mail", order: 3 },
      { name: "Résumé", href: "/resume.pdf", icon: "resume", order: 4 },
    ],
  });

  await prisma.project.deleteMany();
  await prisma.project.createMany({
    data: [
      {
        title: "Orbit",
        description:
          "Real-time SaaS analytics dashboard with customizable widgets, cohort analysis and sub-second queries over billions of events.",
        tags: ["Next.js", "TypeScript", "PostgreSQL", "Redis"],
        href: "https://vour.dev",
        repo: "https://github.com/vourdev/orbit",
        status: "Live",
        featured: true,
        order: 0,
      },
      {
        title: "Lumen",
        description:
          "AI writing assistant that drafts, edits and fact-checks long-form content with streaming responses and inline citations.",
        tags: ["Next.js", "AI SDK", "tRPC", "Postgres"],
        href: "https://vour.dev",
        repo: "https://github.com/vourdev/lumen",
        status: "Live",
        featured: true,
        order: 1,
      },
      {
        title: "Cartel",
        description:
          "Headless commerce storefront with Stripe checkout, Sanity CMS and a perfect 100 Lighthouse score.",
        tags: ["Next.js", "Stripe", "Sanity"],
        href: "https://vour.dev",
        repo: "https://github.com/vourdev/cartel",
        status: "Live",
        order: 2,
      },
      {
        title: "Pulse",
        description:
          "Realtime team chat with presence, typing indicators, threads and end-to-end encryption.",
        tags: ["Node.js", "Socket.IO", "Redis"],
        repo: "https://github.com/vourdev/pulse",
        status: "Open source",
        order: 3,
      },
      {
        title: "Nimbus",
        description:
          "Encrypted cloud file storage with chunked, resumable uploads backed by S3 durability.",
        tags: ["React", "Express", "AWS S3"],
        repo: "https://github.com/vourdev/nimbus",
        status: "WIP",
        order: 4,
      },
      {
        title: "Verdant",
        description:
          "Offline-first habit tracker PWA with streaks, reminders and local-first sync.",
        tags: ["React", "IndexedDB", "PWA"],
        repo: "https://github.com/vourdev/verdant",
        status: "Open source",
        order: 5,
      },
    ],
  });

  await prisma.skillGroup.deleteMany();
  await prisma.skillGroup.createMany({
    data: [
      { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "React Query"], order: 0 },
      { category: "Backend", items: ["Node.js", "Express", "tRPC", "GraphQL", "Python", "REST APIs"], order: 1 },
      { category: "Database", items: ["PostgreSQL", "MongoDB", "Redis", "Prisma", "Supabase"], order: 2 },
      { category: "DevOps & Cloud", items: ["Docker", "AWS", "Vercel", "GitHub Actions", "Kubernetes", "Nginx"], order: 3 },
    ],
  });

  await prisma.experience.deleteMany();
  await prisma.experience.createMany({
    data: [
      {
        role: "Senior Full-Stack Developer",
        company: "Nebula Labs",
        period: "2023 — Present",
        location: "San Francisco, CA",
        description:
          "Lead engineer on a real-time analytics platform serving 2M+ daily active users.",
        achievements: [
          "Cut p95 API latency by 63% by introducing edge caching and query batching.",
          "Architected a multi-tenant data model that scaled to billions of events.",
          "Mentored 4 engineers and established the team's testing and review culture.",
        ],
        tags: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "AWS"],
        order: 0,
      },
      {
        role: "Full-Stack Developer",
        company: "Pixel Foundry",
        period: "2021 — 2023",
        location: "Remote",
        description:
          "Built client products end-to-end across fintech, e-commerce and healthtech.",
        achievements: [
          "Shipped 12+ production apps with 99.9% uptime SLAs.",
          "Migrated a legacy monolith to a typed tRPC + Next.js stack.",
          "Reduced bundle size by 40% and improved Core Web Vitals across the board.",
        ],
        tags: ["React", "Node.js", "tRPC", "Stripe", "Docker"],
        order: 1,
      },
      {
        role: "Frontend Developer",
        company: "Brightwave",
        period: "2019 — 2021",
        location: "Austin, TX",
        description:
          "Owned the design system and component library used across 6 product teams.",
        achievements: [
          "Built an accessible component library adopted by 30+ engineers.",
          "Drove WCAG 2.1 AA compliance across the flagship product.",
        ],
        tags: ["React", "Storybook", "TypeScript", "Sass"],
        order: 2,
      },
      {
        role: "Freelance Web Developer",
        company: "Self-employed",
        period: "2018 — 2019",
        location: "Remote",
        description:
          "Designed and built marketing sites and web apps for early-stage startups.",
        achievements: [
          "Delivered 20+ projects for clients across 5 countries.",
          "Set up CI/CD pipelines that let solo founders ship daily.",
        ],
        tags: ["JavaScript", "Vue", "Node.js", "Figma"],
        order: 3,
      },
    ],
  });

  await prisma.tool.deleteMany();
  await prisma.tool.createMany({
    data: [
      { name: "React", designation: "UI", image: devicon("react/react-original.svg"), order: 0 },
      { name: "Next.js", designation: "Framework", image: devicon("nextjs/nextjs-original.svg"), order: 1 },
      { name: "TypeScript", designation: "Language", image: devicon("typescript/typescript-original.svg"), order: 2 },
      { name: "Node.js", designation: "Runtime", image: devicon("nodejs/nodejs-original.svg"), order: 3 },
      { name: "PostgreSQL", designation: "Database", image: devicon("postgresql/postgresql-original.svg"), order: 4 },
      { name: "Tailwind", designation: "Styling", image: devicon("tailwindcss/tailwindcss-original.svg"), order: 5 },
      { name: "Docker", designation: "DevOps", image: devicon("docker/docker-original.svg"), order: 6 },
      { name: "GraphQL", designation: "API", image: devicon("graphql/graphql-plain.svg"), order: 7 },
    ],
  });

  const counts = {
    socials: await prisma.social.count(),
    projects: await prisma.project.count(),
    skillGroups: await prisma.skillGroup.count(),
    experiences: await prisma.experience.count(),
    tools: await prisma.tool.count(),
  };
  console.log("Seeded:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
