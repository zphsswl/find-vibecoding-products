"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireCurrentUser } from "@/lib/session";

export async function toggleFollowAction(targetUsername: string) {
  const user = await requireCurrentUser();
  if (user.username === targetUsername) return;

  const target = await prisma.user.findUnique({ where: { username: targetUsername } });
  if (!target) return;

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: user.id,
        followingId: target.id
      }
    }
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
  } else {
    await prisma.follow.create({
      data: {
        followerId: user.id,
        followingId: target.id
      }
    });
  }

  revalidatePath(`/users/${targetUsername}`);
  revalidatePath(`/users/${user.username}`);
  revalidatePath("/me");
}
