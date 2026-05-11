"use server";

import { redirect } from "next/navigation";
import { createDefaultAvatarPreset, createDefaultDisplayName } from "@/lib/community";
import { recordAnalyticsEvent } from "@/lib/analytics";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { clearSessionUser, setSessionUser } from "@/lib/session";

export async function signInAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) return;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    redirect("/auth/sign-in?error=not_registered");
  }

  if (!verifyPassword(password, user.password)) return;

  const profileUpdates: { displayName?: string; autoDisplayName?: boolean; avatarPreset?: string } = {};

  if (!user.displayName.trim()) {
    profileUpdates.displayName = createDefaultDisplayName();
    profileUpdates.autoDisplayName = true;
  }

  if (!user.avatarUrl && !user.avatarPreset) {
    profileUpdates.avatarPreset = createDefaultAvatarPreset();
  }

  if (Object.keys(profileUpdates).length > 0) {
    await prisma.user.update({
      where: { id: user.id },
      data: profileUpdates
    });
  }

  await setSessionUser(user.username);
  await recordAnalyticsEvent({
    type: "sign_in",
    userId: user.id,
    page: "/auth/sign-in",
    metadata: { username: user.username }
  });
  redirect("/");
}

export async function signOutAction() {
  await clearSessionUser();
  redirect("/");
}
