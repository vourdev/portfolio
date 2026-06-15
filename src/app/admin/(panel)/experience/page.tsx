import type { Experience } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { saveExperience, deleteExperience } from "@/app/admin/actions";
import {
  Card,
  Field,
  Input,
  Textarea,
  Submit,
  DeleteButton,
} from "@/components/admin/form";

function ExperienceForm({ exp }: { exp?: Experience }) {
  return (
    <form action={saveExperience} className="space-y-3">
      <input type="hidden" name="id" defaultValue={exp?.id ?? ""} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Role">
          <Input name="role" defaultValue={exp?.role ?? ""} required />
        </Field>
        <Field label="Company">
          <Input name="company" defaultValue={exp?.company ?? ""} required />
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
      <div className="grid items-end gap-3 sm:grid-cols-[1fr_120px]">
        <Field label="Tags" hint="comma separated">
          <Input name="tags" defaultValue={(exp?.tags ?? []).join(", ")} />
        </Field>
        <Field label="Order">
          <Input name="order" type="number" defaultValue={exp?.order ?? 0} />
        </Field>
      </div>
      <Submit>{exp ? "Update" : "Add experience"}</Submit>
    </form>
  );
}

export default async function ExperiencePage() {
  const items = await prisma.experience.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Experience</h1>
      <Card title="New experience">
        <ExperienceForm />
      </Card>
      <div className="space-y-4">
        {items.map((exp) => (
          <Card key={exp.id} title={`${exp.role} · ${exp.company}`}>
            <ExperienceForm exp={exp} />
            <form action={deleteExperience} className="mt-3 border-t border-border pt-3">
              <input type="hidden" name="id" defaultValue={exp.id} />
              <DeleteButton>Delete</DeleteButton>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
