import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { logoutAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { IconExternalLink, IconLogout } from "@tabler/icons-react";

export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "Profile" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/socials", label: "Socials" },
  { href: "/admin/tools", label: "Tools" },
  { href: "/admin/messages", label: "Messages" },
];

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="font-semibold">vour.dev / admin</span>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/" target="_blank">
                View site <IconExternalLink size={14} />
              </Link>
            </Button>
            <form action={logoutAction}>
              <Button type="submit" variant="outline" size="sm">
                Logout <IconLogout size={14} />
              </Button>
            </form>
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-2 pb-2">
          {nav.map((n) => (
            <Button key={n.href} asChild variant="ghost" size="sm">
              <Link href={n.href}>{n.label}</Link>
            </Button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
