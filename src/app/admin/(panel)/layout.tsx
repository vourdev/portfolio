import { requireAuth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Toaster } from "@/components/ui/sonner";

export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  const unread = await prisma.contactMessage.count({ where: { read: false } });

  return (
    <div className="flex min-h-screen flex-col bg-muted/30 text-foreground lg:flex-row dark:bg-background">
      <AdminSidebar unread={unread} />
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8 lg:py-10">
          {children}
        </div>
      </main>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
