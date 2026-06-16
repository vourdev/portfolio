import type { Project } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  saveProject,
  deleteProject,
  reorderProjects,
} from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { FormDialog } from "@/components/admin/form-dialog";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import {
  SortableList,
  SortableRow,
  DragHandle,
} from "@/components/admin/sortable-list";
import { Field, Input, Textarea, inputCls } from "@/components/admin/form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconPlus, IconPencil, IconFolder } from "@tabler/icons-react";

const statusVariant: Record<string, string> = {
  Live: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
  WIP: "border-amber-500/30 text-amber-600 dark:text-amber-400",
  "Open source": "border-blue-500/30 text-blue-600 dark:text-blue-400",
};

function ProjectFields({ project }: { project?: Project }) {
  return (
    <>
      <input type="hidden" name="id" defaultValue={project?.id ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title">
          <Input name="title" defaultValue={project?.title ?? ""} required />
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={project?.status ?? ""} className={inputCls}>
            <option value="">— none —</option>
            <option>Live</option>
            <option>WIP</option>
            <option>Open source</option>
          </select>
        </Field>
      </div>
      <Field label="Description">
        <Textarea name="description" rows={2} defaultValue={project?.description ?? ""} />
      </Field>
      <Field label="Tags" hint="comma separated">
        <Input name="tags" defaultValue={(project?.tags ?? []).join(", ")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Live URL">
          <Input name="href" defaultValue={project?.href ?? ""} />
        </Field>
        <Field label="Repo URL">
          <Input name="repo" defaultValue={project?.repo ?? ""} />
        </Field>
      </div>
      <Field label="Image" hint="optional, stored in DB">
        <input type="file" name="image" accept="image/*" className={inputCls} />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={project?.featured ?? false}
          className="h-4 w-4 accent-primary"
        />
        Featured (wide card)
      </label>
    </>
  );
}

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader
        title="Projects"
        description={`${projects.length} project${projects.length === 1 ? "" : "s"}`}
        action={
          <FormDialog
            title="New project"
            action={saveProject}
            trigger={
              <Button>
                <IconPlus size={16} /> New project
              </Button>
            }
          >
            <ProjectFields />
          </FormDialog>
        }
      />

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No projects yet. Add your first one.
          </CardContent>
        </Card>
      ) : (
        <SortableList items={projects} onReorder={reorderProjects}>
          {projects.map((p) => (
            <SortableRow key={p.id} id={p.id}>
              <Card>
                <CardContent className="flex items-center gap-4">
                  <DragHandle />
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
                    {p.imageId ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`/api/images/${p.imageId}`}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <IconFolder size={20} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{p.title}</p>
                      {p.status && (
                        <Badge variant="outline" className={statusVariant[p.status]}>
                          {p.status}
                        </Badge>
                      )}
                      {p.featured && <Badge variant="secondary">Featured</Badge>}
                    </div>
                    <p className="truncate text-sm text-muted-foreground">
                      {p.tags.join(" · ") || p.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <FormDialog
                      title="Edit project"
                      action={saveProject}
                      submitLabel="Update"
                      trigger={
                        <Button variant="ghost" size="icon" aria-label="Edit">
                          <IconPencil size={16} />
                        </Button>
                      }
                    >
                      <ProjectFields project={p} />
                    </FormDialog>
                    <DeleteDialog
                      id={p.id}
                      action={deleteProject}
                      title="Delete project?"
                      description={`"${p.title}" will be permanently removed.`}
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
