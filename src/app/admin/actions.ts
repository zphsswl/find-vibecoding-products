"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdminUser } from "@/lib/session";

type ReviewStatus = "approved" | "rejected" | "changes_requested";

async function reviewProject(slug: string, status: ReviewStatus) {
  const user = await requireAdminUser();
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) {
    return;
  }

  await prisma.$transaction([
    prisma.project.update({
      where: { id: project.id },
      data: {
        status,
        approvedAt: status === "approved" ? new Date() : null
      }
    }),
    prisma.moderationAction.create({
      data: {
        actorId: user.id,
        targetType: "project",
        targetId: project.id,
        action: status
      }
    })
  ]);
}

export async function approveProjectAction(slug: string) {
  await reviewProject(slug, "approved");
  redirect("/admin");
}

export async function rejectProjectAction(slug: string) {
  await reviewProject(slug, "rejected");
  redirect("/admin");
}

export async function requestChangesProjectAction(slug: string) {
  await reviewProject(slug, "changes_requested");
  redirect("/admin");
}
