"use client";

import { BUILT_IN_THEMES, CUSTOM_THEME_DEFAULTS, THEME_ORDER, type ThemeId } from "@/lib/themes";

const OPTIONS = THEME_ORDER.map((id) =>
  id === "custom" ? { id, ...CUSTOM_THEME_DEFAULTS } : BUILT_IN_THEMES[id]
);

export function ThemePicker({
  value,
  onChange,
}: {
  value: ThemeId;
  onChange: (theme: ThemeId) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {OPTIONS.map((option) => {
        const selected = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            aria-pressed={selected}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition ${
              selected
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
            }`}
          >
            <span className="text-2xl">{option.emoji}</span>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
