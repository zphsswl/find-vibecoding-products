"use server";

import { Buffer } from "node:buffer";
import { redirect } from "next/navigation";
import { recordAnalyticsEvent } from "@/lib/analytics";
import { prisma } from "@/lib/db";
import { requireCurrentUser } from "@/lib/session";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const maxCoverBytes = 1_200_000;
const allowedCoverTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]);

async function readCoverUpload(value: FormDataEntryValue | null) {
  if (!(value instanceof File) || value.size === 0) return null;
  if (value.size > maxCoverBytes || !allowedCoverTypes.has(value.type)) return undefined;

  const buffer = Buffer.from(await value.arrayBuffer());
  return `data:${value.type};base64,${buffer.toString("base64")}`;
}

export async function submitProjectAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const purpose = String(formData.get("purpose") ?? "").trim();
  const howToUse = String(formData.get("howToUse") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryName = String(formData.get("category") ?? "").trim() || "工具";
  const projectUrl = String(formData.get("projectUrl") ?? "").trim();
  const coverText = String(formData.get("coverText") ?? "").trim();
  const coverImageUrlInput = String(formData.get("coverImageUrl") ?? "").trim();
  const uploadedCover = await readCoverUpload(formData.get("coverImageFile"));

  if (!title || !summary || !purpose || !howToUse || !projectUrl) {
    return;
  }

  if (uploadedCover === undefined) return;

  const fallbackCoverText = coverText || summary || title;
  const coverImageUrl = uploadedCover ?? coverImageUrlInput ?? `data:text/plain;charset=utf-8,${encodeURIComponent(fallbackCoverText)}`;

  try {
    const parsedProjectUrl = new URL(projectUrl);
    if (!["http:", "https:"].includes(parsedProjectUrl.protocol)) return;

    if (coverImageUrlInput) {
      const parsedCoverUrl = new URL(coverImageUrlInput);
      if (!["http:", "https:"].includes(parsedCoverUrl.protocol)) return;
    }
  } catch {
    return;
  }

  const user = await requireCurrentUser();

  const categorySlug = slugify(categoryName);
  const category = await prisma.category.upsert({
    where: { slug: categorySlug },
    update: { name: categoryName },
    create: { slug: categorySlug, name: categoryName }
  });

  const baseSlug = slugify(title);
  const slug = await uniqueProjectSlug(baseSlug || "project");
  const project = await prisma.project.create({
    data: {
      slug,
      title,
      summary,
      description: description || summary,
      purpose,
      howToUse,
      projectUrl,
      coverImageUrl,
      status: "pending",
      difficulty: "beginner",
      isOpenSource: false,
      isFeatured: false,
      submittedAt: new Date(),
      authorId: user.id,
      categoryId: category.id
    }
  });

  await prisma.project.update({
    where: { id: project.id },
    data: { hotScore: 0 }
  });

  await recordAnalyticsEvent({
    type: "submit_project",
    userId: user.id,
    page: "/submit",
    projectId: project.id,
    projectSlug: project.slug,
    metadata: { category: categoryName }
  });

  redirect(`/projects/${slug}`);
}

async function uniqueProjectSlug(baseSlug: string) {
  let slug = baseSlug;
  let suffix = 2;

  while (await prisma.project.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}
