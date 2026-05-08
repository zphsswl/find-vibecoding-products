import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

const SESSION_COOKIE = "vcg_user";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const username = cookieStore.get(SESSION_COOKIE)?.value;

  if (!username) return null;

  return prisma.user.findUnique({
    where: { username }
  });
}

export async function getActingUser() {
  const currentUser = await getCurrentUser();
  if (currentUser) return currentUser;

  return prisma.user.findUnique({
    where: { username: "admin" }
  });
}

export async function setSessionUser(username: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, username, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
}

export async function clearSessionUser() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

