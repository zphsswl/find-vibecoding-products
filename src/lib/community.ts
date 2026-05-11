import { randomInt } from "node:crypto";
import { avatarPresets, getAvatarUrl } from "@/lib/avatar";

// Re-export avatar functions for backward-compat
export { avatarPresets, getAvatarUrl };

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

export function createDefaultDisplayName() {
  const left = displayNameLeft[randomInt(displayNameLeft.length)];
  const right = displayNameRight[randomInt(displayNameRight.length)];
  return `${left} ${right}`;
}

export function createDefaultAvatarPreset() {
  return avatarPresets[randomInt(avatarPresets.length)];
}
