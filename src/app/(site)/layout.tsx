import type { Metadata } from "next";
import { LenisProvider } from "@/components/lenis-provider";
import { PortfolioSidebar } from "@/components/portfolio-sidebar";
import { TopBar } from "@/components/top-bar";
import { getProfile, getSocials } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const title = `${profile.name} — ${profile.title}`;
  const description = profile.summary || profile.headline;
  return {
    metadataBase: new URL(profile.url || "https://vour.dev"),
    title: { default: title, template: `%s — ${profile.name}` },
    description,
    authors: [{ name: profile.name, url: profile.url }],
    openGraph: {
      title,
      description,
      url: profile.url,
      siteName: profile.domain,
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, socials] = await Promise.all([getProfile(), getSocials()]);

  return (
    <LenisProvider>
      {/* Fixed crosshair frame */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
        <div className="absolute inset-x-0 top-0 h-3 bg-[var(--background)] sm:h-4 lg:h-6" />
        <div className="absolute inset-x-0 bottom-0 h-3 bg-[var(--background)] sm:h-4 lg:h-6" />
        <div className="absolute inset-y-0 left-0 w-3 bg-[var(--background)] sm:w-4 lg:w-6" />
        <div className="absolute inset-y-0 right-0 w-3 bg-[var(--background)] sm:w-4 lg:w-6" />
        <span className="absolute inset-x-0 top-3 border-t border-black/10 sm:top-4 lg:top-6 dark:border-white/10" />
        <span className="absolute inset-x-0 bottom-3 border-b border-black/10 sm:bottom-4 lg:bottom-6 dark:border-white/10" />
        <div className="absolute inset-0 px-3 sm:px-4 lg:px-6">
          <div className="mx-auto h-full max-w-[1600px] border-x border-black/10 dark:border-white/10" />
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-6">
        <div className="mx-auto min-h-[calc(100vh-1.5rem)] max-w-[1600px] sm:min-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-3rem)]">
          <TopBar profile={profile} socials={socials} />
          <div className="flex flex-col md:flex-row">
            <PortfolioSidebar profile={profile} socials={socials} />
            <main className="min-w-0 flex-1">{children}</main>
          </div>
        </div>
      </div>
    </LenisProvider>
  );
}
