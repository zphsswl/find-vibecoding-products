import { createHash } from "node:crypto";

const PASSWORD_PEPPER = process.env.PASSWORD_PEPPER ?? "local-vcg-password-pepper";

export function hashPassword(password: string) {
  return createHash("sha256").update(`${PASSWORD_PEPPER}:${password}`).digest("hex");
}

export function isValidPassword(password: string) {
  return password.trim().length >= 6;
}

export function verifyPassword(password: string, passwordHash: string | null | undefined) {
  if (!passwordHash) return false;
  return hashPassword(password) === passwordHash;
}

export function randomDisplayName(seed?: string) {
  const prefixes = ["Sunny", "Pixel", "Moss", "Paper", "Nova", "Tiny", "Mint", "Echo"];
  const suffixes = ["Fox", "Leaf", "Stone", "Dot", "Wave", "Spark", "Moon", "Loop"];
  const source = seed ?? `${Date.now()}-${Math.random()}`;
  const hash = createHash("sha256").update(source).digest("hex");
  const first = prefixes[parseInt(hash.slice(0, 2), 16) % prefixes.length];
  const second = suffixes[parseInt(hash.slice(2, 4), 16) % suffixes.length];
  return `${first}${second}`;
}

export function defaultAvatarUrl(seed?: string) {
  const palette = [
    "https://api.dicebear.com/9.x/pixel-art/svg?seed=",
    "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=",
    "https://api.dicebear.com/9.x/identicon/svg?seed="
  ];
  const source = seed ?? `${Date.now()}-${Math.random()}`;
  const hash = createHash("sha256").update(source).digest("hex");
  const index = parseInt(hash.slice(4, 6), 16) % palette.length;
  return `${palette[index]}${encodeURIComponent(source)}`;
}
