import type { Tool } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { saveTool, deleteTool, reorderTools } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { FormDialog } from "@/components/admin/form-dialog";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import {
  SortableList,
  SortableRow,
  DragHandle,
} from "@/components/admin/sortable-list";
import { Field, Input } from "@/components/admin/form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconPlus, IconPencil } from "@tabler/icons-react";

function ToolFields({ tool }: { tool?: Tool }) {
  return (
    <>
      <input type="hidden" name="id" defaultValue={tool?.id ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <Input name="name" defaultValue={tool?.name ?? ""} required />
        </Field>
        <Field label="Designation" hint="e.g. UI, Database">
          <Input name="designation" defaultValue={tool?.designation ?? ""} />
        </Field>
      </div>
      <Field label="Logo URL" hint="e.g. a devicon SVG URL">
        <Input name="image" defaultValue={tool?.image ?? ""} required />
      </Field>
    </>
  );
}

export default async function ToolsPage() {
  const tools = await prisma.tool.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader
        title="Hero tools"
        description={`${tools.length} tool${tools.length === 1 ? "" : "s"}`}
        action={
          <FormDialog
            title="New tool"
            action={saveTool}
            trigger={
              <Button>
                <IconPlus size={16} /> New tool
              </Button>
            }
          >
            <ToolFields />
          </FormDialog>
        }
      />

      {tools.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No tools yet.
          </CardContent>
        </Card>
      ) : (
        <SortableList items={tools} onReorder={reorderTools}>
          {tools.map((tool) => (
            <SortableRow key={tool.id} id={tool.id}>
              <Card>
                <CardContent className="flex items-center gap-4">
                  <DragHandle />
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-muted p-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tool.image}
                      alt={tool.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{tool.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {tool.designation}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <FormDialog
                      title="Edit tool"
                      action={saveTool}
                      submitLabel="Update"
                      trigger={
                        <Button variant="ghost" size="icon" aria-label="Edit">
                          <IconPencil size={16} />
                        </Button>
                      }
                    >
                      <ToolFields tool={tool} />
                    </FormDialog>
                    <DeleteDialog
                      id={tool.id}
                      action={deleteTool}
                      title="Delete tool?"
                      description={`"${tool.name}" will be removed.`}
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
