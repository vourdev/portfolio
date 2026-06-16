"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { navItems } from "@/lib/site";
import type { SocialKey } from "@/lib/site";
import type { SiteProfile, SocialView } from "@/lib/content";
import { navIcons, socialIcons } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import {
  IconMenu2,
  IconX,
  IconChevronRight,
  IconArrowUpRight,
} from "@tabler/icons-react";

export function Logo({
  src,
  fallback,
  size = 40,
  className,
}: {
  src: string;
  fallback: string;
  size?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="logo"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      onError={(e) => {
        if (!e.currentTarget.src.endsWith(fallback)) {
          e.currentTarget.src = fallback;
        }
      }}
      className={cn("rounded-xl object-cover", className)}
    />
  );
}

function Profile({ profile }: { profile: SiteProfile }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Logo
          src={profile.logo}
          fallback={profile.avatar}
          size={56}
          className="border border-black/10 ring-2 ring-black/5 dark:border-white/15 dark:ring-white/5"
        />
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {profile.name}
          </p>
          <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
            {profile.title}
          </p>
        </div>
      </div>

      {profile.available && (
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          {profile.availabilityText}
        </div>
      )}
    </div>
  );
}

function SocialRow({
  socials,
  className,
}: {
  socials: SocialView[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {socials.map((social) => {
        const Icon = socialIcons[social.icon as SocialKey];
        if (!Icon) return null;
        const external = social.href.startsWith("http");
        return (
          <a
            key={social.id}
            href={social.href}
            aria-label={social.name}
            title={social.name}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-black/5 text-neutral-500 transition-colors hover:border-black/20 hover:text-neutral-900 dark:border-white/10 dark:bg-white/5 dark:text-neutral-400 dark:hover:border-white/20 dark:hover:text-neutral-100"
          >
            <Icon size={18} />
          </a>
        );
      })}
    </div>
  );
}

function MobileClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs tabular-nums text-neutral-600 dark:bg-white/5 dark:text-neutral-300">
      {time || "--:--"}
    </span>
  );
}

export function PortfolioSidebar({
  profile,
  socials,
}: {
  profile: SiteProfile;
  socials: SocialView[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    setOpen(false);
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-[4.5rem] hidden h-[calc(100vh-5.5rem)] w-[290px] shrink-0 flex-col border-r border-black/10 bg-white/70 px-5 py-6 backdrop-blur-xl md:flex lg:top-[5rem] lg:h-[calc(100vh-6.5rem)] dark:border-white/10 dark:bg-neutral-950/70">
        <Profile profile={profile} />

        <nav className="mt-8 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = navIcons[item.icon];
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-sm transition-colors",
                  active
                    ? "border-black/10 bg-black/5 text-neutral-900 dark:border-white/10 dark:bg-white/5 dark:text-neutral-50"
                    : "text-neutral-500 hover:bg-black/5 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-neutral-200",
                )}
              >
                <Icon
                  size={18}
                  className={cn(
                    "shrink-0 transition-colors",
                    active
                      ? "text-blue-500 dark:text-blue-400"
                      : "text-neutral-400 group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300",
                  )}
                />
                <span>{item.name}</span>
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-4 pt-6">
          <SocialRow socials={socials} />
          <p className="text-xs text-neutral-400 dark:text-neutral-600">
            © {new Date().getFullYear()} {profile.domain}
          </p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-black/10 bg-white/80 px-4 py-3 backdrop-blur-md md:hidden dark:border-white/10 dark:bg-neutral-950/80">
        <Link href="/" className="flex items-center gap-2">
          <Logo src={profile.logo} fallback={profile.avatar} size={30} />
          <span className="font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {profile.domain}
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-black/5 text-neutral-700 active:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-neutral-200 dark:active:bg-white/10"
        >
          <IconMenu2 size={20} />
        </button>
      </header>

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {open && (
          <div className="md:hidden">
            <motion.div
              className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              data-lenis-prevent
              className="fixed inset-x-0 bottom-0 z-[100] max-h-[92vh] overflow-y-auto rounded-t-3xl border-t border-black/10 bg-white px-5 pt-3 pb-6 shadow-2xl dark:border-white/10 dark:bg-neutral-950"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 120 || info.velocity.y > 600) {
                  setOpen(false);
                }
              }}
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-neutral-300 dark:bg-neutral-700" />

              <div className="mb-5 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <IconArrowUpRight size={18} className="text-neutral-400" />
                  <span className="font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                    {profile.domain}
                  </span>
                </Link>
                <div className="flex items-center gap-2">
                  {profile.available && (
                    <span className="flex items-center gap-1.5 rounded-full bg-black/5 px-2.5 py-1 text-xs text-neutral-600 dark:bg-white/5 dark:text-neutral-300">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Online
                    </span>
                  )}
                  <MobileClock />
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                    className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                  >
                    <IconX size={22} />
                  </button>
                </div>
              </div>

              <p className="mb-2 text-center text-xs font-semibold tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
                SECTIONS
              </p>

              <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = navIcons[item.icon];
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-2xl border px-4 py-3 text-base transition-colors",
                        active
                          ? "border-black/15 bg-black/10 text-neutral-900 dark:border-white/15 dark:bg-white/10 dark:text-white"
                          : "border-black/10 bg-black/[0.03] text-neutral-700 active:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.03] dark:text-neutral-200 dark:active:bg-white/[0.07]",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <Icon
                          size={20}
                          className={
                            active
                              ? "text-blue-500 dark:text-blue-400"
                              : "text-neutral-400 dark:text-neutral-500"
                          }
                        />
                        {item.name}
                      </span>
                      <IconChevronRight
                        size={18}
                        className="text-neutral-400 dark:text-neutral-500"
                      />
                    </Link>
                  );
                })}
              </nav>

              <SocialRow socials={socials} className="mt-5 justify-center" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
