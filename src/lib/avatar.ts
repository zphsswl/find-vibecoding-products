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

export function getAvatarUrl(avatarUrl?: string | null, avatarPreset?: string | null) {
  if (avatarUrl) return avatarUrl;

  const preset = avatarPreset && avatarPreset in avatarPresetSeeds ? avatarPreset : "amber";
  return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${avatarPresetSeeds[preset]}`;
}
