"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { clearSessionUser, setSessionUser } from "@/lib/session";

export async function signInAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  if (!username) return;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return;

  await setSessionUser(user.username);
  redirect("/");
}

export async function signOutAction() {
  await clearSessionUser();
  redirect("/");
}

