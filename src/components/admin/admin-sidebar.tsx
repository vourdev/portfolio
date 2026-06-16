"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { logoutAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";
import {
  IconLayoutDashboard,
  IconUserCircle,
  IconFolders,
  IconStack2,
  IconBriefcase,
  IconShare3,
  IconSparkles,
  IconMail,
  IconMenu2,
  IconLogout,
  IconExternalLink,
} from "@tabler/icons-react";
import { Logo } from "../portfolio-sidebar";

const nav = [
  { href: "/admin", label: "Dashboard", icon: IconLayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: IconUserCircle },
  { href: "/admin/projects", label: "Projects", icon: IconFolders },
  { href: "/admin/skills", label: "Skills", icon: IconStack2 },
  { href: "/admin/experience", label: "Experience", icon: IconBriefcase },
  { href: "/admin/socials", label: "Socials", icon: IconShare3 },
  { href: "/admin/tools", label: "Tools", icon: IconSparkles },
  { href: "/admin/messages", label: "Messages", icon: IconMail },
];

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-2.5">
      <Logo
        src="/vourdev-logo.jpeg"
        fallback="/vourdev-logo.jpeg"
        size={42}
        className="border border-black/10 ring-2 ring-black/5 dark:border-white/15 dark:ring-white/5"
      />
      <div className="leading-tight">
        <p className="font-semibold text-foreground">vour.dev</p>
        <p className="text-xs text-muted-foreground">Admin panel</p>
      </div>
    </Link>
  );
}

function NavLinks({
  unread,
  onNavigate,
}: {
  unread: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <Icon size={18} className="shrink-0" />
            <span>{item.label}</span>
            {item.href === "/admin/messages" && unread > 0 && (
              <span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 text-xs font-semibold text-primary-foreground">
                {unread}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function Footer() {
  return (
    <div className="space-y-2 border-t border-border pt-4">
      <Button
        asChild
        variant="outline"
        size="sm"
        className="w-full justify-start gap-2"
      >
        <Link href="/" target="_blank">
          <IconExternalLink size={16} /> View site
        </Link>
      </Button>
      <form action={logoutAction}>
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground"
        >
          <IconLogout size={16} /> Logout
        </Button>
      </form>
    </div>
  );
}

export function AdminSidebar({ unread }: { unread: number }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card/40 p-4 lg:flex">
        <Brand />
        <div className="mt-6 flex-1">
          <NavLinks unread={unread} />
        </div>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Footer />
          </div>
        </div>
        <div className="mt-2 flex justify-end">
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
        <Brand />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <IconMenu2 size={18} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-4">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Brand />
              <div className="mt-6">
                <NavLinks unread={unread} onNavigate={() => setOpen(false)} />
              </div>
              <div className="mt-6">
                <Footer />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}
