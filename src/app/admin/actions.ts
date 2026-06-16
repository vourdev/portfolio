"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth, signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionResult = { ok: boolean; error?: string };

// ---------- helpers ----------
const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const lines = (fd: FormData, k: string) =>
  s(fd, k)
    .split(/[\n,]/)
    .map((x) => x.trim())
    .filter(Boolean);
const paras = (fd: FormData, k: string) =>
  s(fd, k)
    .split(/\n\s*\n/)
    .map((x) => x.trim())
    .filter(Boolean);
const num = (fd: FormData, k: string) => Number(s(fd, k) || 0) || 0;

async function saveImage(file: FormDataEntryValue | null): Promise<string | null> {
  if (!file || typeof file === "string" || file.size === 0) return null;
  const buf = Buffer.from(await file.arrayBuffer());
  const img = await prisma.image.create({
    data: { data: buf, mimeType: file.type || "image/png", filename: file.name },
  });
  return img.id;
}

function revalidate() {
  revalidatePath("/", "layout");
}

// ---------- auth ----------
export type LoginState = { error?: string };
export async function loginAction(
  _prev: LoginState,
  fd: FormData,
): Promise<LoginState> {
  try {
    await signIn("credentials", {
      password: s(fd, "password"),
      redirectTo: "/admin",
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Incorrect password." };
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}

// ---------- profile ----------
export async function updateProfile(fd: FormData) {
  await requireAuth();
  const logoId = await saveImage(fd.get("logo"));
  const avatarId = await saveImage(fd.get("avatar"));
  const data = {
    name: s(fd, "name"),
    title: s(fd, "title"),
    domain: s(fd, "domain"),
    url: s(fd, "url"),
    email: s(fd, "email"),
    location: s(fd, "location"),
    available: fd.get("available") === "on",
    availabilityText: s(fd, "availabilityText"),
    githubUsername: s(fd, "githubUsername"),
    headline: s(fd, "headline"),
    summary: s(fd, "summary"),
    resumeUrl: s(fd, "resumeUrl") || "/resume.pdf",
    about: paras(fd, "about"),
    ...(logoId ? { logoImageId: logoId } : {}),
    ...(avatarId ? { avatarImageId: avatarId } : {}),
  };
  await prisma.profile.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });
  revalidate();
  redirect("/admin/profile?saved=1");
}

// ---------- projects ----------
export async function saveProject(
  _prev: ActionResult,
  fd: FormData,
): Promise<ActionResult> {
  await requireAuth();
  const title = s(fd, "title");
  if (!title) return { ok: false, error: "Title is required." };
  const id = s(fd, "id");
  const imageId = await saveImage(fd.get("image"));
  const data: Record<string, unknown> = {
    title,
    description: s(fd, "description"),
    tags: lines(fd, "tags"),
    href: s(fd, "href") || null,
    repo: s(fd, "repo") || null,
    status: s(fd, "status") || null,
    featured: fd.get("featured") === "on",
    ...(imageId ? { imageId } : {}),
  };
  if (id) await prisma.project.update({ where: { id }, data });
  else {
    const max = await prisma.project.aggregate({ _max: { order: true } });
    data.order = (max._max.order ?? 0) + 1;
    await prisma.project.create({ data: data as any });
  }
  revalidate();
  return { ok: true };
}
export async function deleteProject(fd: FormData) {
  await requireAuth();
  await prisma.project.delete({ where: { id: s(fd, "id") } });
  revalidate();
}

// ---------- skill groups ----------
export async function saveSkillGroup(
  _prev: ActionResult,
  fd: FormData,
): Promise<ActionResult> {
  await requireAuth();
  const category = s(fd, "category");
  if (!category) return { ok: false, error: "Category is required." };
  const id = s(fd, "id");
  const data: Record<string, unknown> = {
    category,
    items: lines(fd, "items"),
  };
  if (id) await prisma.skillGroup.update({ where: { id }, data });
  else {
    const max = await prisma.skillGroup.aggregate({ _max: { order: true } });
    data.order = (max._max.order ?? 0) + 1;
    await prisma.skillGroup.create({ data: data as any });
  }
  revalidate();
  return { ok: true };
}
export async function deleteSkillGroup(fd: FormData) {
  await requireAuth();
  await prisma.skillGroup.delete({ where: { id: s(fd, "id") } });
  revalidate();
}

// ---------- experience ----------
export async function saveExperience(
  _prev: ActionResult,
  fd: FormData,
): Promise<ActionResult> {
  await requireAuth();
  const role = s(fd, "role");
  if (!role) return { ok: false, error: "Role is required." };
  const id = s(fd, "id");
  const data: Record<string, unknown> = {
    role,
    company: s(fd, "company"),
    period: s(fd, "period"),
    location: s(fd, "location"),
    description: s(fd, "description"),
    achievements: lines(fd, "achievements"),
    tags: lines(fd, "tags"),
  };
  if (id) await prisma.experience.update({ where: { id }, data });
  else {
    const max = await prisma.experience.aggregate({ _max: { order: true } });
    data.order = (max._max.order ?? 0) + 1;
    await prisma.experience.create({ data: data as any });
  }
  revalidate();
  return { ok: true };
}
export async function deleteExperience(fd: FormData) {
  await requireAuth();
  await prisma.experience.delete({ where: { id: s(fd, "id") } });
  revalidate();
}

// ---------- socials ----------
export async function saveSocial(
  _prev: ActionResult,
  fd: FormData,
): Promise<ActionResult> {
  await requireAuth();
  const name = s(fd, "name");
  const href = s(fd, "href");
  if (!name || !href) return { ok: false, error: "Label and URL are required." };
  const id = s(fd, "id");
  const data: Record<string, unknown> = { name, href, icon: s(fd, "icon") };
  if (id) await prisma.social.update({ where: { id }, data });
  else {
    const max = await prisma.social.aggregate({ _max: { order: true } });
    data.order = (max._max.order ?? 0) + 1;
    await prisma.social.create({ data: data as any });
  }
  revalidate();
  return { ok: true };
}
export async function deleteSocial(fd: FormData) {
  await requireAuth();
  await prisma.social.delete({ where: { id: s(fd, "id") } });
  revalidate();
}

// ---------- reorder ----------

async function reorder<T>(
  model: keyof typeof prisma,
  ids: string[],
) {
  await requireAuth();
  const tx = ids.map((id, i) =>
    (prisma[model as keyof typeof prisma] as any).update({
      where: { id },
      data: { order: i },
    }),
  );
  await prisma.$transaction(tx);
  revalidate();
}

export async function reorderProjects(ids: string[]) {
  await reorder("project", ids);
}

export async function reorderSkillGroups(ids: string[]) {
  await reorder("skillGroup", ids);
}

export async function reorderExperience(ids: string[]) {
  await reorder("experience", ids);
}

export async function reorderSocials(ids: string[]) {
  await reorder("social", ids);
}

export async function reorderTools(ids: string[]) {
  await reorder("tool", ids);
}

// ---------- tools ----------
export async function saveTool(
  _prev: ActionResult,
  fd: FormData,
): Promise<ActionResult> {
  await requireAuth();
  const name = s(fd, "name");
  const image = s(fd, "image");
  if (!name || !image) return { ok: false, error: "Name and logo URL are required." };
  const id = s(fd, "id");
  const data: Record<string, unknown> = {
    name,
    designation: s(fd, "designation"),
    image,
  };
  if (id) await prisma.tool.update({ where: { id }, data });
  else {
    const max = await prisma.tool.aggregate({ _max: { order: true } });
    data.order = (max._max.order ?? 0) + 1;
    await prisma.tool.create({ data: data as any });
  }
  revalidate();
  return { ok: true };
}
export async function deleteTool(fd: FormData) {
  await requireAuth();
  await prisma.tool.delete({ where: { id: s(fd, "id") } });
  revalidate();
}

// ---------- contact messages ----------
export async function toggleMessageRead(fd: FormData) {
  await requireAuth();
  const id = s(fd, "id");
  const msg = await prisma.contactMessage.findUnique({ where: { id } });
  if (msg) {
    await prisma.contactMessage.update({
      where: { id },
      data: { read: !msg.read },
    });
  }
  revalidate();
}
export async function deleteMessage(fd: FormData) {
  await requireAuth();
  await prisma.contactMessage.delete({ where: { id: s(fd, "id") } });
  revalidate();
}
