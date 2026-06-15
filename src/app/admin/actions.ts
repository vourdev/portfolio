"use server";

import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  checkPassword,
  createSession,
  destroySession,
} from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

function revalidateSite() {
  revalidatePath("/", "layout");
}

// ---------- auth ----------
export type LoginState = { error?: string };
export async function loginAction(
  _prev: LoginState,
  fd: FormData,
): Promise<LoginState> {
  if (!checkPassword(s(fd, "password"))) {
    return { error: "Incorrect password." };
  }
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
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
  revalidateSite();
  redirect("/admin?saved=1");
}

// ---------- projects ----------
export async function saveProject(fd: FormData) {
  await requireAuth();
  const id = s(fd, "id");
  const imageId = await saveImage(fd.get("image"));
  const data = {
    title: s(fd, "title"),
    description: s(fd, "description"),
    tags: lines(fd, "tags"),
    href: s(fd, "href") || null,
    repo: s(fd, "repo") || null,
    status: s(fd, "status") || null,
    featured: fd.get("featured") === "on",
    order: num(fd, "order"),
    ...(imageId ? { imageId } : {}),
  };
  if (id) await prisma.project.update({ where: { id }, data });
  else await prisma.project.create({ data });
  revalidateSite();
  redirect("/admin/projects");
}
export async function deleteProject(fd: FormData) {
  await requireAuth();
  await prisma.project.delete({ where: { id: s(fd, "id") } });
  revalidateSite();
  redirect("/admin/projects");
}

// ---------- skill groups ----------
export async function saveSkillGroup(fd: FormData) {
  await requireAuth();
  const id = s(fd, "id");
  const data = {
    category: s(fd, "category"),
    items: lines(fd, "items"),
    order: num(fd, "order"),
  };
  if (id) await prisma.skillGroup.update({ where: { id }, data });
  else await prisma.skillGroup.create({ data });
  revalidateSite();
  redirect("/admin/skills");
}
export async function deleteSkillGroup(fd: FormData) {
  await requireAuth();
  await prisma.skillGroup.delete({ where: { id: s(fd, "id") } });
  revalidateSite();
  redirect("/admin/skills");
}

// ---------- experience ----------
export async function saveExperience(fd: FormData) {
  await requireAuth();
  const id = s(fd, "id");
  const data = {
    role: s(fd, "role"),
    company: s(fd, "company"),
    period: s(fd, "period"),
    location: s(fd, "location"),
    description: s(fd, "description"),
    achievements: lines(fd, "achievements"),
    tags: lines(fd, "tags"),
    order: num(fd, "order"),
  };
  if (id) await prisma.experience.update({ where: { id }, data });
  else await prisma.experience.create({ data });
  revalidateSite();
  redirect("/admin/experience");
}
export async function deleteExperience(fd: FormData) {
  await requireAuth();
  await prisma.experience.delete({ where: { id: s(fd, "id") } });
  revalidateSite();
  redirect("/admin/experience");
}

// ---------- socials ----------
export async function saveSocial(fd: FormData) {
  await requireAuth();
  const id = s(fd, "id");
  const data = {
    name: s(fd, "name"),
    href: s(fd, "href"),
    icon: s(fd, "icon"),
    order: num(fd, "order"),
  };
  if (id) await prisma.social.update({ where: { id }, data });
  else await prisma.social.create({ data });
  revalidateSite();
  redirect("/admin/socials");
}
export async function deleteSocial(fd: FormData) {
  await requireAuth();
  await prisma.social.delete({ where: { id: s(fd, "id") } });
  revalidateSite();
  redirect("/admin/socials");
}

// ---------- tools ----------
export async function saveTool(fd: FormData) {
  await requireAuth();
  const id = s(fd, "id");
  const data = {
    name: s(fd, "name"),
    designation: s(fd, "designation"),
    image: s(fd, "image"),
    order: num(fd, "order"),
  };
  if (id) await prisma.tool.update({ where: { id }, data });
  else await prisma.tool.create({ data });
  revalidateSite();
  redirect("/admin/tools");
}
export async function deleteTool(fd: FormData) {
  await requireAuth();
  await prisma.tool.delete({ where: { id: s(fd, "id") } });
  revalidateSite();
  redirect("/admin/tools");
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
  redirect("/admin/messages");
}
export async function deleteMessage(fd: FormData) {
  await requireAuth();
  await prisma.contactMessage.delete({ where: { id: s(fd, "id") } });
  redirect("/admin/messages");
}
