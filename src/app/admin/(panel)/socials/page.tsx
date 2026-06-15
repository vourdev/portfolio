import type { Social } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { saveSocial, deleteSocial } from "@/app/admin/actions";
import {
  Card,
  Field,
  Input,
  Submit,
  DeleteButton,
  inputCls,
} from "@/components/admin/form";

const ICONS = ["github", "twitter", "linkedin", "mail", "resume"];

function SocialForm({ social }: { social?: Social }) {
  return (
    <form action={saveSocial} className="space-y-3">
      <input type="hidden" name="id" defaultValue={social?.id ?? ""} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Label">
          <Input name="name" defaultValue={social?.name ?? ""} required />
        </Field>
        <Field label="Icon">
          <select
            name="icon"
            defaultValue={social?.icon ?? "github"}
            className={inputCls}
          >
            {ICONS.map((ic) => (
              <option key={ic} value={ic}>
                {ic}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="grid items-end gap-3 sm:grid-cols-[1fr_120px]">
        <Field label="URL" hint="https://… or mailto:…">
          <Input name="href" defaultValue={social?.href ?? ""} required />
        </Field>
        <Field label="Order">
          <Input name="order" type="number" defaultValue={social?.order ?? 0} />
        </Field>
      </div>
      <Submit>{social ? "Update" : "Add link"}</Submit>
    </form>
  );
}

export default async function SocialsPage() {
  const socials = await prisma.social.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Social links</h1>
      <Card title="New link">
        <SocialForm />
      </Card>
      <div className="space-y-4">
        {socials.map((social) => (
          <Card key={social.id} title={`${social.name} (${social.icon})`}>
            <SocialForm social={social} />
            <form action={deleteSocial} className="mt-3 border-t border-border pt-3">
              <input type="hidden" name="id" defaultValue={social.id} />
              <DeleteButton>Delete</DeleteButton>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
