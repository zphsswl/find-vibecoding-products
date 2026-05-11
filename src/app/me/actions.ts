"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { randomDisplayName } from "@/lib/password";
import { requireCurrentUser } from "@/lib/session";

const maxAvatarBytes = 700_000;
const allowedAvatarTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]);

function normalizeEmail(value: FormDataEntryValue | null) {
  const email = String(value ?? "").trim().toLowerCase();
  if (!email) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return undefined;
  return email;
}

async function readAvatarUpload(value: FormDataEntryValue | null) {
  if (!(value instanceof File) || value.size === 0) return null;
  if (value.size > maxAvatarBytes || !allowedAvatarTypes.has(value.type)) return undefined;

  const buffer = Buffer.from(await value.arrayBuffer());
  return `data:${value.type};base64,${buffer.toString("base64")}`;
}

export async function updateMyEmailAction(formData: FormData) {
  const user = await requireCurrentUser();
  const email = normalizeEmail(formData.get("email"));

  if (email === undefined) return;

  if (email) {
    const existing = await prisma.user.findFirst({ where: { email } });
    if (existing && existing.id !== user.id) return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { email }
  });

  revalidatePath("/me");
  revalidatePath(`/users/${user.username}`);
}

export async function updateMyProfileAction(formData: FormData) {
  const user = await requireCurrentUser();
  const displayName = String(formData.get("displayName") ?? "").trim() || randomDisplayName(user.username);
  const avatarUrlInput = String(formData.get("avatarUrl") ?? "").trim() || null;
  const uploadedAvatar = await readAvatarUpload(formData.get("avatarFile"));

  if (uploadedAvatar === undefined) return;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      displayName,
      avatarUrl: uploadedAvatar ?? avatarUrlInput,
      avatarPreset: uploadedAvatar || avatarUrlInput ? null : user.avatarPreset
    }
  });

  revalidatePath("/me");
  revalidatePath(`/users/${user.username}`);
}

export async function setPresetAvatarAction(formData: FormData) {
  const user = await requireCurrentUser();
  const avatarPreset = String(formData.get("avatarPreset") ?? "").trim();
  if (!avatarPreset) return;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      avatarPreset,
      avatarUrl: null
    }
  });

  revalidatePath("/me");
  revalidatePath(`/users/${user.username}`);
}
