import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconFolders,
  IconStack2,
  IconBriefcase,
  IconShare3,
  IconSparkles,
  IconMail,
  IconArrowRight,
  IconUserCircle,
} from "@tabler/icons-react";

export default async function DashboardPage() {
  const [projects, skills, experiences, socials, tools, messages, unread, recent] =
    await Promise.all([
      prisma.project.count(),
      prisma.skillGroup.count(),
      prisma.experience.count(),
      prisma.social.count(),
      prisma.tool.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

  const stats = [
    { label: "Projects", value: projects, href: "/admin/projects", icon: IconFolders },
    { label: "Skill groups", value: skills, href: "/admin/skills", icon: IconStack2 },
    { label: "Experience", value: experiences, href: "/admin/experience", icon: IconBriefcase },
    { label: "Socials", value: socials, href: "/admin/socials", icon: IconShare3 },
    { label: "Hero tools", value: tools, href: "/admin/tools", icon: IconSparkles },
    { label: "Messages", value: messages, href: "/admin/messages", icon: IconMail, badge: unread },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Manage everything that appears on your portfolio."
        action={
          <Button asChild>
            <Link href="/admin/profile">
              <IconUserCircle size={16} /> Edit profile
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="group">
              <Card className="h-full transition-colors group-hover:border-primary/40">
                <CardContent className="flex items-start justify-between">
                  <div>
                    <p className="text-3xl font-bold tabular-nums">{stat.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                  <div className="relative">
                    <Icon className="text-muted-foreground" size={22} />
                    {stat.badge ? (
                      <span className="absolute -top-2 -right-2 rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                        {stat.badge}
                      </span>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Recent messages</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/messages">
              View all <IconArrowRight size={14} />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {recent.length === 0 && (
            <p className="text-sm text-muted-foreground">No messages yet.</p>
          )}
          {recent.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-medium">
                  {m.name}
                  {!m.read && <Badge className="h-5">New</Badge>}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {m.message}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {new Date(m.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
