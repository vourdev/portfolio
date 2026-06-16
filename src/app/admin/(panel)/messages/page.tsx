import { prisma } from "@/lib/prisma";
import { toggleMessageRead, deleteMessage } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { IconMail, IconMailOpened } from "@tabler/icons-react";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <PageHeader
        title="Messages"
        description={`${messages.length} total · ${unread} unread`}
      />

      {messages.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No messages yet.
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {messages.map((m) => (
          <Card
            key={m.id}
            className={cn(!m.read && "border-primary/40 bg-primary/[0.03]")}
          >
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-muted text-sm font-medium">
                    {m.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{m.name}</p>
                    {!m.read && <Badge>New</Badge>}
                  </div>
                  <a
                    href={`mailto:${m.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {m.email}
                  </a>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {new Date(m.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap text-foreground/90">
                {m.message}
              </p>
              <div className="flex items-center gap-1">
                <form action={toggleMessageRead}>
                  <input type="hidden" name="id" defaultValue={m.id} />
                  <Button type="submit" variant="outline" size="sm" className="gap-1.5">
                    {m.read ? (
                      <>
                        <IconMail size={14} /> Mark unread
                      </>
                    ) : (
                      <>
                        <IconMailOpened size={14} /> Mark read
                      </>
                    )}
                  </Button>
                </form>
                <DeleteDialog
                  id={m.id}
                  action={deleteMessage}
                  title="Delete message?"
                  description={`Message from ${m.name} will be removed.`}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
