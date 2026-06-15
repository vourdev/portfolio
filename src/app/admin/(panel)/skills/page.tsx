import type { SkillGroup } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { saveSkillGroup, deleteSkillGroup } from "@/app/admin/actions";
import {
  Card,
  Field,
  Input,
  Textarea,
  Submit,
  DeleteButton,
} from "@/components/admin/form";

function SkillForm({ group }: { group?: SkillGroup }) {
  return (
    <form action={saveSkillGroup} className="space-y-3">
      <input type="hidden" name="id" defaultValue={group?.id ?? ""} />
      <div className="grid items-end gap-3 sm:grid-cols-[1fr_120px]">
        <Field label="Category">
          <Input name="category" defaultValue={group?.category ?? ""} required />
        </Field>
        <Field label="Order">
          <Input name="order" type="number" defaultValue={group?.order ?? 0} />
        </Field>
      </div>
      <Field label="Skills" hint="comma or newline separated">
        <Textarea
          name="items"
          rows={2}
          defaultValue={(group?.items ?? []).join(", ")}
        />
      </Field>
      <Submit>{group ? "Update" : "Add group"}</Submit>
    </form>
  );
}

export default async function SkillsPage() {
  const groups = await prisma.skillGroup.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Skills</h1>
      <Card title="New skill group">
        <SkillForm />
      </Card>
      <div className="space-y-4">
        {groups.map((g) => (
          <Card key={g.id} title={g.category}>
            <SkillForm group={g} />
            <form action={deleteSkillGroup} className="mt-3 border-t border-white/5 pt-3">
              <input type="hidden" name="id" defaultValue={g.id} />
              <DeleteButton>Delete group</DeleteButton>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
