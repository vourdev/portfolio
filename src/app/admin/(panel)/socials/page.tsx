import type { Social } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { saveSocial, deleteSocial, reorderSocials } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { FormDialog } from "@/components/admin/form-dialog";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import {
  SortableList,
  SortableRow,
  DragHandle,
} from "@/components/admin/sortable-list";
import { Field, Input, inputCls } from "@/components/admin/form";
import { socialIcons } from "@/lib/icon-map";
import type { SocialKey } from "@/lib/site";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconPlus, IconPencil } from "@tabler/icons-react";

const ICONS = ["github", "twitter", "linkedin", "mail", "resume"];

function SocialFields({ social }: { social?: Social }) {
  return (
    <>
      <input type="hidden" name="id" defaultValue={social?.id ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Label">
          <Input name="name" defaultValue={social?.name ?? ""} required />
        </Field>
        <Field label="Icon">
          <select name="icon" defaultValue={social?.icon ?? "github"} className={inputCls}>
            {ICONS.map((ic) => (
              <option key={ic} value={ic}>
                {ic}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="URL" hint="https://… or mailto:…">
        <Input name="href" defaultValue={social?.href ?? ""} required />
      </Field>
    </>
  );
}

export default async function SocialsPage() {
  const socials = await prisma.social.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader
        title="Social links"
        description={`${socials.length} link${socials.length === 1 ? "" : "s"}`}
        action={
          <FormDialog
            title="New link"
            action={saveSocial}
            trigger={
              <Button>
                <IconPlus size={16} /> New link
              </Button>
            }
          >
            <SocialFields />
          </FormDialog>
        }
      />

      {socials.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No social links yet.
          </CardContent>
        </Card>
      ) : (
        <SortableList items={socials} onReorder={reorderSocials}>
          {socials.map((social) => {
            const Icon = socialIcons[social.icon as SocialKey];
            return (
              <SortableRow key={social.id} id={social.id}>
                <Card>
                  <CardContent className="flex items-center gap-4">
                    <DragHandle />
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                      {Icon ? <Icon size={18} /> : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{social.name}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {social.href}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <FormDialog
                        title="Edit link"
                        action={saveSocial}
                        submitLabel="Update"
                        trigger={
                          <Button variant="ghost" size="icon" aria-label="Edit">
                            <IconPencil size={16} />
                          </Button>
                        }
                      >
                        <SocialFields social={social} />
                      </FormDialog>
                      <DeleteDialog
                        id={social.id}
                        action={deleteSocial}
                        title="Delete link?"
                        description={`"${social.name}" will be removed.`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </SortableRow>
            );
          })}
        </SortableList>
      )}
    </div>
  );
}
