import type { SkillGroup } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  saveSkillGroup,
  deleteSkillGroup,
  reorderSkillGroups,
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
import { Badge } from "@/components/ui/badge";
import { IconPlus, IconPencil } from "@tabler/icons-react";

function SkillFields({ group }: { group?: SkillGroup }) {
  return (
    <>
      <input type="hidden" name="id" defaultValue={group?.id ?? ""} />
      <Field label="Category">
        <Input name="category" defaultValue={group?.category ?? ""} required />
      </Field>
      <Field label="Skills" hint="comma or newline separated">
        <Textarea name="items" rows={3} defaultValue={(group?.items ?? []).join(", ")} />
      </Field>
    </>
  );
}

export default async function SkillsPage() {
  const groups = await prisma.skillGroup.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader
        title="Skills"
        description={`${groups.length} group${groups.length === 1 ? "" : "s"}`}
        action={
          <FormDialog
            title="New skill group"
            action={saveSkillGroup}
            trigger={
              <Button>
                <IconPlus size={16} /> New group
              </Button>
            }
          >
            <SkillFields />
          </FormDialog>
        }
      />

      {groups.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No skill groups yet.
          </CardContent>
        </Card>
      ) : (
        <SortableList items={groups} onReorder={reorderSkillGroups}>
          {groups.map((g) => (
            <SortableRow key={g.id} id={g.id}>
              <Card>
                <CardContent className="flex items-center gap-4">
                  <div className="pt-0.5">
                    <DragHandle />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{g.category}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {g.items.map((it) => (
                        <Badge key={it} variant="secondary" className="font-normal">
                          {it}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <FormDialog
                      title="Edit skill group"
                      action={saveSkillGroup}
                      submitLabel="Update"
                      trigger={
                        <Button variant="ghost" size="icon" aria-label="Edit">
                          <IconPencil size={16} />
                        </Button>
                      }
                    >
                      <SkillFields group={g} />
                    </FormDialog>
                    <DeleteDialog
                      id={g.id}
                      action={deleteSkillGroup}
                      title="Delete skill group?"
                      description={`"${g.category}" will be removed.`}
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
