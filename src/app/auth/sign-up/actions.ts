"use server";

import { redirect } from "next/navigation";
import { createDefaultAvatarPreset, createDefaultDisplayName } from "@/lib/community";
import { recordAnalyticsEvent } from "@/lib/analytics";
import { prisma } from "@/lib/db";
import { hashPassword, isValidPassword } from "@/lib/password";
import { setSessionUser } from "@/lib/session";

export async function signUpAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const avatarUrl = String(formData.get("avatarUrl") ?? "").trim() || null;
  const avatarPreset = String(formData.get("avatarPreset") ?? "").trim() || null;
  const password = String(formData.get("password") ?? "");

  if (!username || !isValidPassword(password)) return;

  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) return;

  const user = await prisma.user.create({
    data: {
      username,
      displayName: createDefaultDisplayName(),
      autoDisplayName: true,
      avatarUrl,
      avatarPreset: avatarUrl ? null : avatarPreset ?? createDefaultAvatarPreset(),
      password: hashPassword(password)
    }
  });

  await setSessionUser(user.username);
  await recordAnalyticsEvent({
    type: "sign_in",
    userId: user.id,
    page: "/auth/sign-up",
    metadata: { username: user.username, entry: "sign_up_auto_login" }
  });
  redirect("/");
}
