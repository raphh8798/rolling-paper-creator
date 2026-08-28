export type ThemeId = "birthday" | "graduation" | "christmas" | "custom";

export type ThemeDefinition = {
  id: ThemeId;
  label: string;
  emoji: string;
  /** Tailwind gradient classes for the paper's background. */
  gradientClassName: string;
  /** Text color that reads well on the gradient. */
  textClassName: string;
  /** Default sticky-note colors offered when writing a message on this theme. */
  cardColors: string[];
};

export const BUILT_IN_THEMES: Record<
  Exclude<ThemeId, "custom">,
  ThemeDefinition
> = {
  birthday: {
    id: "birthday",
    label: "생일",
    emoji: "🎂",
    gradientClassName: "bg-gradient-to-br from-pink-300 via-fuchsia-300 to-orange-200",
    textClassName: "text-fuchsia-950",
    cardColors: ["#FFE3EC", "#FFF3C4", "#DFF7E2", "#E3E8FF"],
  },
  graduation: {
    id: "graduation",
    label: "졸업",
    emoji: "🎓",
    gradientClassName: "bg-gradient-to-br from-slate-800 via-indigo-900 to-amber-700",
    textClassName: "text-amber-50",
    cardColors: ["#FDF3D9", "#E9EAF6", "#D9E8FD", "#F4E3D3"],
  },
  christmas: {
    id: "christmas",
    label: "크리스마스",
    emoji: "🎄",
    gradientClassName: "bg-gradient-to-br from-emerald-800 via-emerald-700 to-red-700",
    textClassName: "text-white",
    cardColors: ["#FFF5F5", "#F0FFF4", "#FFF9DB", "#F5F0FF"],
  },
};

export const CUSTOM_THEME_DEFAULTS: Omit<ThemeDefinition, "id"> = {
  label: "커스텀",
  emoji: "🖼️",
  gradientClassName: "bg-gradient-to-br from-slate-200 to-slate-400",
  // White + shadow, not dark text, because this sits directly on top
  // of whatever photo the user uploads — needs to stay legible either way.
  textClassName: "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]",
  cardColors: ["#FFFFFF", "#FFF3C4", "#DFF7E2", "#E3E8FF"],
};

export const THEME_ORDER: ThemeId[] = [
  "birthday",
  "graduation",
  "christmas",
  "custom",
];

export function getThemeDefinition(theme: ThemeId): ThemeDefinition {
  if (theme === "custom") return { id: "custom", ...CUSTOM_THEME_DEFAULTS };
  return BUILT_IN_THEMES[theme];
}

export function isThemeId(value: string): value is ThemeId {
  return THEME_ORDER.includes(value as ThemeId);
}
