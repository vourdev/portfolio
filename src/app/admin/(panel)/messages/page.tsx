import { prisma } from "@/lib/prisma";
import { toggleMessageRead, deleteMessage } from "@/app/admin/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Messages</h1>
        <span className="text-sm text-muted-foreground">
          {messages.length} total · {unread} unread
        </span>
      </div>

      {messages.length === 0 && (
        <Card>
          <CardContent className="text-sm text-muted-foreground">
            No messages yet.
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {messages.map((m) => (
          <Card key={m.id} className={cn(!m.read && "border-primary/40")}>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="flex items-center gap-2 font-semibold">
                    {m.name}
                    {!m.read && <Badge>New</Badge>}
                  </p>
                  <a
                    href={`mailto:${m.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {m.email}
                  </a>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(m.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                {m.message}
              </p>
              <div className="flex items-center gap-2">
                <form action={toggleMessageRead}>
                  <input type="hidden" name="id" defaultValue={m.id} />
                  <Button type="submit" variant="outline" size="sm">
                    Mark as {m.read ? "unread" : "read"}
                  </Button>
                </form>
                <form action={deleteMessage}>
                  <input type="hidden" name="id" defaultValue={m.id} />
                  <Button type="submit" variant="destructive" size="sm">
                    Delete
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
