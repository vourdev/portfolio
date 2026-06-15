import { prisma } from "@/lib/prisma";
import { updateProfile } from "@/app/admin/actions";
import { Card, Field, Input, Textarea, Submit, inputCls } from "@/components/admin/form";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [p, sp] = await Promise.all([
    prisma.profile.findUnique({ where: { id: "singleton" } }),
    searchParams,
  ]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        {sp.saved && (
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400">
            Saved ✓
          </span>
        )}
      </div>

      <form action={updateProfile} className="space-y-6">
        <Card title="Identity">
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
          <div className="mt-4 flex items-center gap-3">
            <input
              id="available"
              type="checkbox"
              name="available"
              defaultChecked={p?.available ?? true}
              className="h-4 w-4 accent-blue-600"
            />
            <label htmlFor="available" className="text-sm text-foreground">
              Available for work
            </label>
            <Input
              name="availabilityText"
              defaultValue={p?.availabilityText ?? ""}
              placeholder="Available for new projects"
              className="max-w-xs"
            />
          </div>
        </Card>

        <Card title="Intro">
          <div className="space-y-4">
            <Field label="Headline" hint="animated hero line">
              <Input name="headline" defaultValue={p?.headline ?? ""} />
            </Field>
            <Field label="Summary" hint="used for SEO / meta description">
              <Textarea name="summary" rows={2} defaultValue={p?.summary ?? ""} />
            </Field>
            <Field label="About paragraphs" hint="separate paragraphs with a blank line">
              <Textarea
                name="about"
                rows={7}
                defaultValue={(p?.about ?? []).join("\n\n")}
              />
            </Field>
          </div>
        </Card>

        <Card title="Images (stored in the database)">
          <div className="grid gap-6 sm:grid-cols-2">
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
              <Field label="Avatar (fallback)" hint="leave empty to keep current">
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
          </div>
        </Card>

        <Submit>Save profile</Submit>
      </form>
    </div>
  );
}
