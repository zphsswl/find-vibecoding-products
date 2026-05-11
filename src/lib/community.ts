import { randomInt } from "node:crypto";

const displayNameLeft = [
  "Amber",
  "Aster",
  "Bloom",
  "Canvas",
  "Cloud",
  "Echo",
  "Forge",
  "Harbor",
  "Indigo",
  "Juniper",
  "Lumen",
  "Nova",
  "Orbit",
  "Pixel",
  "Ripple",
  "Sol",
  "Spark",
  "Tide"
];

const displayNameRight = [
  "Atlas",
  "Bloom",
  "Circuit",
  "Drift",
  "Field",
  "Frame",
  "Garden",
  "Loop",
  "Nest",
  "Note",
  "Pulse",
  "Studio",
  "Trail",
  "Wave"
];

export const avatarPresets = [
  "amber",
  "aqua",
  "coral",
  "forest",
  "indigo",
  "lavender",
  "lime",
  "rose"
];

const avatarPresetSeeds: Record<string, string> = {
  amber: "vcg-amber",
  aqua: "vcg-aqua",
  coral: "vcg-coral",
  forest: "vcg-forest",
  indigo: "vcg-indigo",
  lavender: "vcg-lavender",
  lime: "vcg-lime",
  rose: "vcg-rose"
};

export function createDefaultDisplayName() {
  const left = displayNameLeft[randomInt(displayNameLeft.length)];
  const right = displayNameRight[randomInt(displayNameRight.length)];
  return `${left} ${right}`;
}

export function createDefaultAvatarPreset() {
  return avatarPresets[randomInt(avatarPresets.length)];
}

export function getAvatarUrl(avatarUrl?: string | null, avatarPreset?: string | null) {
  if (avatarUrl) return avatarUrl;

  const preset = avatarPreset && avatarPreset in avatarPresetSeeds ? avatarPreset : "amber";
  return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${avatarPresetSeeds[preset]}`;
}
