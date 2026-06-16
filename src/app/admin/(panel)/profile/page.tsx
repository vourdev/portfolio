import { prisma } from "@/lib/prisma";
import { updateProfile } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { Field, Input, Textarea, inputCls } from "@/components/admin/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [p, sp] = await Promise.all([
    prisma.profile.findUnique({ where: { id: "singleton" } }),
    searchParams,
  ]);
  const logoSrc = p?.logoImageId ? `/api/images/${p.logoImageId}` : undefined;

  return (
    <div>
      <PageHeader
        title="Profile"
        description="Your identity, intro and images."
        action={sp.saved ? <Badge variant="secondary">Saved ✓</Badge> : undefined}
      />

      {/* Preview */}
      <Card className="mb-6">
        <CardContent className="flex items-center gap-4">
          <Avatar className="h-16 w-16 rounded-xl">
            <AvatarImage src={logoSrc} alt={p?.name} />
            <AvatarFallback className="rounded-xl bg-primary/10 text-lg font-bold text-primary">
              {(p?.name ?? "V").charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold">{p?.name}</p>
            <p className="truncate text-sm text-muted-foreground">{p?.title}</p>
            {p?.available && (
              <Badge variant="outline" className="mt-1 gap-1.5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {p.availabilityText || "Available"}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <form action={updateProfile} className="space-y-6 pb-20">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <Input name="name" defaultValue={p?.name ?? ""} required />
              </Field>
              <Field label="Title">
                <Input name="title" defaultValue={p?.title ?? ""} required />
              </Field>
              <Field label="Domain">
                <Input name="domain" defaultValue={p?.domain ?? ""} />
              </Field>
              <Field label="Site URL">
                <Input name="url" defaultValue={p?.url ?? ""} />
              </Field>
              <Field label="Email">
                <Input name="email" type="email" defaultValue={p?.email ?? ""} />
              </Field>
              <Field label="Location">
                <Input name="location" defaultValue={p?.location ?? ""} />
              </Field>
              <Field label="GitHub username" hint="for the Stats page">
                <Input name="githubUsername" defaultValue={p?.githubUsername ?? ""} />
              </Field>
              <Field label="Résumé URL">
                <Input name="resumeUrl" defaultValue={p?.resumeUrl ?? "/resume.pdf"} />
              </Field>
            </div>
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/40 p-3">
              <input
                id="available"
                type="checkbox"
                name="available"
                defaultChecked={p?.available ?? true}
                className="h-4 w-4 accent-primary"
              />
              <label htmlFor="available" className="text-sm font-medium">
                Available for work
              </label>
              <Input
                name="availabilityText"
                defaultValue={p?.availabilityText ?? ""}
                placeholder="Available for new projects"
                className="h-8 max-w-xs"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Intro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Headline" hint="animated hero line">
              <Input name="headline" defaultValue={p?.headline ?? ""} />
            </Field>
            <Field label="Summary" hint="SEO / meta description">
              <Textarea name="summary" rows={2} defaultValue={p?.summary ?? ""} />
            </Field>
            <Field label="About paragraphs" hint="blank line between paragraphs">
              <Textarea
                name="about"
                rows={7}
                defaultValue={(p?.about ?? []).join("\n\n")}
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Images</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div>
              <Field label="Logo" hint="leave empty to keep current">
                <input type="file" name="logo" accept="image/*" className={inputCls} />
              </Field>
              {p?.logoImageId && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/images/${p.logoImageId}`}
                  alt="logo"
                  className="mt-3 h-16 w-16 rounded-lg border border-border object-cover"
                />
              )}
            </div>
            <div>
              <Field label="Avatar fallback" hint="leave empty to keep current">
                <input type="file" name="avatar" accept="image/*" className={inputCls} />
              </Field>
              {p?.avatarImageId && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/images/${p.avatarImageId}`}
                  alt="avatar"
                  className="mt-3 h-16 w-16 rounded-lg border border-border object-cover"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sticky save bar */}
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/90 px-4 py-3 backdrop-blur lg:left-64">
          <div className="mx-auto flex max-w-5xl justify-end px-0 lg:px-4">
            <Button type="submit">Save profile</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
