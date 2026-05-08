"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getActingUser } from "@/lib/session";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function submitProjectAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const purpose = String(formData.get("purpose") ?? "").trim();
  const howToUse = String(formData.get("howToUse") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryName = String(formData.get("category") ?? "").trim() || "工具";
  const projectUrl = String(formData.get("projectUrl") ?? "").trim();
  const coverImageUrl =
    String(formData.get("coverImageUrl") ?? "").trim() ||
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";

  if (!title || !summary || !purpose || !howToUse || !projectUrl) {
    return;
  }

  const user = await getActingUser();
  if (!user) return;

  const categorySlug = slugify(categoryName);
  const category = await prisma.category.upsert({
    where: { slug: categorySlug },
    update: { name: categoryName },
    create: { slug: categorySlug, name: categoryName }
  });

  const slug = slugify(title);
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
      status: "approved",
      difficulty: "beginner",
      isOpenSource: false,
      isFeatured: false,
      submittedAt: new Date(),
      approvedAt: new Date(),
      authorId: user.id,
      categoryId: category.id
    }
  });

  await prisma.project.update({
    where: { id: project.id },
    data: { hotScore: 120 }
  });

  redirect(`/projects/${slug}`);
}
