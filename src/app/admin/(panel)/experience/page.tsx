import type { Experience } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  saveExperience,
  deleteExperience,
  reorderExperience,
} from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { FormDialog } from "@/components/admin/form-dialog";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import {
  SortableList,
  SortableRow,
  DragHandle,
} from "@/components/admin/sortable-list";
import { Field, Input, Textarea } from "@/components/admin/form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconPlus, IconPencil, IconBriefcase } from "@tabler/icons-react";

function ExperienceFields({ exp }: { exp?: Experience }) {
  return (
    <>
      <input type="hidden" name="id" defaultValue={exp?.id ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Role">
          <Input name="role" defaultValue={exp?.role ?? ""} required />
        </Field>
        <Field label="Company">
          <Input name="company" defaultValue={exp?.company ?? ""} />
        </Field>
        <Field label="Period" hint="e.g. 2023 — Present">
          <Input name="period" defaultValue={exp?.period ?? ""} />
        </Field>
        <Field label="Location">
          <Input name="location" defaultValue={exp?.location ?? ""} />
        </Field>
      </div>
      <Field label="Description">
        <Textarea name="description" rows={2} defaultValue={exp?.description ?? ""} />
      </Field>
      <Field label="Achievements" hint="one per line">
        <Textarea
          name="achievements"
          rows={3}
          defaultValue={(exp?.achievements ?? []).join("\n")}
        />
      </Field>
      <Field label="Tags" hint="comma separated">
        <Input name="tags" defaultValue={(exp?.tags ?? []).join(", ")} />
      </Field>
    </>
  );
}

export default async function ExperiencePage() {
  const items = await prisma.experience.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader
        title="Experience"
        description={`${items.length} entr${items.length === 1 ? "y" : "ies"}`}
        action={
          <FormDialog
            title="New experience"
            action={saveExperience}
            trigger={
              <Button>
                <IconPlus size={16} /> New entry
              </Button>
            }
          >
            <ExperienceFields />
          </FormDialog>
        }
      />

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No experience entries yet.
          </CardContent>
        </Card>
      ) : (
        <SortableList items={items} onReorder={reorderExperience}>
          {items.map((exp) => (
            <SortableRow key={exp.id} id={exp.id}>
              <Card>
                <CardContent className="flex items-center gap-4">
                  <DragHandle />
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
                    <IconBriefcase size={20} className="text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{exp.role}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {exp.company} · {exp.period}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <FormDialog
                      title="Edit experience"
                      action={saveExperience}
                      submitLabel="Update"
                      trigger={
                        <Button variant="ghost" size="icon" aria-label="Edit">
                          <IconPencil size={16} />
                        </Button>
                      }
                    >
                      <ExperienceFields exp={exp} />
                    </FormDialog>
                    <DeleteDialog
                      id={exp.id}
                      action={deleteExperience}
                      title="Delete experience?"
                      description={`"${exp.role}" will be removed.`}
                    />
                  </div>
                </CardContent>
              </Card>
            </SortableRow>
          ))}
        </SortableList>
      )}
    </div>
  );
}
