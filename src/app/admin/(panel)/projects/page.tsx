import type { Project } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { saveProject, deleteProject } from "@/app/admin/actions";
import {
  Card,
  Field,
  Input,
  Textarea,
  Submit,
  DeleteButton,
  inputCls,
} from "@/components/admin/form";

const STATUSES = ["", "Live", "WIP", "Open source"];

function ProjectForm({ project }: { project?: Project }) {
  return (
    <form action={saveProject} className="space-y-3">
      <input type="hidden" name="id" defaultValue={project?.id ?? ""} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Title">
          <Input name="title" defaultValue={project?.title ?? ""} required />
        </Field>
        <Field label="Status">
          <select
            name="status"
            defaultValue={project?.status ?? ""}
            className={inputCls}
          >
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st || "— none —"}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Description">
        <Textarea
          name="description"
          rows={2}
          defaultValue={project?.description ?? ""}
          required
        />
      </Field>
      <Field label="Tags" hint="comma or newline separated">
        <Input name="tags" defaultValue={(project?.tags ?? []).join(", ")} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Live URL">
          <Input name="href" defaultValue={project?.href ?? ""} />
        </Field>
        <Field label="Repo URL">
          <Input name="repo" defaultValue={project?.repo ?? ""} />
        </Field>
      </div>
      <div className="grid items-end gap-3 sm:grid-cols-2">
        <Field label="Order">
          <Input name="order" type="number" defaultValue={project?.order ?? 0} />
        </Field>
        <Field label="Image" hint="optional, stored in DB">
          <input type="file" name="image" accept="image/*" className={inputCls} />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={project?.featured ?? false}
          className="h-4 w-4 accent-blue-600"
        />
        Featured (wide card)
      </label>
      {project?.imageId && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/api/images/${project.imageId}`}
          alt=""
          className="h-20 rounded-lg border border-border object-cover"
        />
      )}
      <Submit>{project ? "Update" : "Add project"}</Submit>
    </form>
  );
}

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Projects</h1>
      <Card title="New project">
        <ProjectForm />
      </Card>
      <div className="space-y-4">
        {projects.map((p) => (
          <Card key={p.id} title={p.title}>
            <ProjectForm project={p} />
            <form action={deleteProject} className="mt-3 border-t border-border pt-3">
              <input type="hidden" name="id" defaultValue={p.id} />
              <DeleteButton>Delete project</DeleteButton>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
