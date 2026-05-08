"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { setSessionUser } from "@/lib/session";

export async function signUpAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const displayName = String(formData.get("displayName") ?? "").trim() || username;

  if (!username) return;

  const user = await prisma.user.upsert({
    where: { username },
    update: { displayName },
    create: {
      username,
      displayName,
      bio: "vibe coding 创作者"
    }
  });

  await setSessionUser(user.username);
  redirect("/");
}

