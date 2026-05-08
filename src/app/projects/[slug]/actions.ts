"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getActingUser } from "@/lib/session";

export async function addCommentAction(slug: string, formData: FormData) {
  const body = String(formData.get("body") ?? "").trim();
  if (!body) {
    return;
  }

  const project = await prisma.project.findUnique({ where: { slug } });
  const user = await getActingUser();

  if (!project || !user) {
    return;
  }

  await prisma.comment.create({
    data: {
      projectId: project.id,
      authorId: user.id,
      body
    }
  });

  await prisma.project.update({
    where: { id: project.id },
    data: { commentCount: { increment: 1 } }
  });

  revalidatePath(`/projects/${slug}`);
}

export async function toggleLikeAction(slug: string) {
  const project = await prisma.project.findUnique({ where: { slug } });
  const user = await getActingUser();

  if (!project || !user) return;

  const existing = await prisma.vote.findUnique({
    where: { userId_projectId: { userId: user.id, projectId: project.id } }
  });

  if (existing) {
    await prisma.vote.delete({ where: { id: existing.id } });
    await prisma.project.update({
      where: { id: project.id },
      data: { likeCount: { decrement: 1 } }
    });
  } else {
    await prisma.vote.create({
      data: { userId: user.id, projectId: project.id, value: 1 }
    });
    await prisma.project.update({
      where: { id: project.id },
      data: { likeCount: { increment: 1 }, hotScore: { increment: 2 } }
    });
  }

  revalidatePath(`/projects/${slug}`);
  revalidatePath("/discover");
}

export async function toggleBookmarkAction(slug: string) {
  const project = await prisma.project.findUnique({ where: { slug } });
  const user = await getActingUser();

  if (!project || !user) return;

  const existing = await prisma.bookmark.findUnique({
    where: { userId_projectId: { userId: user.id, projectId: project.id } }
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    await prisma.project.update({
      where: { id: project.id },
      data: { bookmarkCount: { decrement: 1 } }
    });
  } else {
    await prisma.bookmark.create({
      data: { userId: user.id, projectId: project.id }
    });
    await prisma.project.update({
      where: { id: project.id },
      data: { bookmarkCount: { increment: 1 }, hotScore: { increment: 3 } }
    });
  }

  revalidatePath(`/projects/${slug}`);
  revalidatePath("/discover");
}

export async function reportProjectAction(slug: string, formData: FormData) {
  const project = await prisma.project.findUnique({ where: { slug } });
  const user = await getActingUser();
  const reason = String(formData.get("reason") ?? "other");
  const detail = String(formData.get("detail") ?? "").trim();

  if (!project || !user) return;

  await prisma.report.create({
    data: {
      reporterId: user.id,
      projectId: project.id,
      targetType: "project",
      targetId: project.id,
      reason,
      detail
    }
  });

  revalidatePath("/admin");
}
