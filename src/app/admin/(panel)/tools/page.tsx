import type { Tool } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { saveTool, deleteTool } from "@/app/admin/actions";
import {
  Card,
  Field,
  Input,
  Submit,
  DeleteButton,
} from "@/components/admin/form";

function ToolForm({ tool }: { tool?: Tool }) {
  return (
    <form action={saveTool} className="space-y-3">
      <input type="hidden" name="id" defaultValue={tool?.id ?? ""} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name">
          <Input name="name" defaultValue={tool?.name ?? ""} required />
        </Field>
        <Field label="Designation" hint="e.g. UI, Database">
          <Input name="designation" defaultValue={tool?.designation ?? ""} />
        </Field>
      </div>
      <div className="grid items-end gap-3 sm:grid-cols-[1fr_120px]">
        <Field label="Logo URL" hint="e.g. a devicon SVG URL">
          <Input name="image" defaultValue={tool?.image ?? ""} required />
        </Field>
        <Field label="Order">
          <Input name="order" type="number" defaultValue={tool?.order ?? 0} />
        </Field>
      </div>
      <Submit>{tool ? "Update" : "Add tool"}</Submit>
    </form>
  );
}

export default async function ToolsPage() {
  const tools = await prisma.tool.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Hero tools</h1>
      <Card title="New tool">
        <ToolForm />
      </Card>
      <div className="space-y-4">
        {tools.map((tool) => (
          <Card key={tool.id} title={tool.name}>
            <div className="mb-3 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tool.image}
                alt={tool.name}
                className="h-10 w-10 rounded-lg border border-white/10 bg-neutral-950 object-contain p-1.5"
              />
            </div>
            <ToolForm tool={tool} />
            <form action={deleteTool} className="mt-3 border-t border-white/5 pt-3">
              <input type="hidden" name="id" defaultValue={tool.id} />
              <DeleteButton>Delete</DeleteButton>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
