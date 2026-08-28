import type { ReactNode } from "react";
import type { ThemeId } from "@/lib/themes";
import { getThemeDefinition } from "@/lib/themes";
import { ThemeDecorations } from "@/components/ThemeDecorations";

/**
 * Full-page gradient background for the built-in themes (birthday,
 * graduation, christmas). The custom-photo theme uses
 * CustomPhotoPaper instead — a photo doesn't have a "fill the whole
 * page" gradient to fall back on, so it gets its own layout sized to
 * the photo itself rather than reusing this one.
 */
export function PaperBackground({
  theme,
  children,
}: {
  theme: ThemeId;
  children: ReactNode;
}) {
  const definition = getThemeDefinition(theme);

  return (
    <div className={`relative min-h-dvh w-full ${definition.gradientClassName}`}>
      <ThemeDecorations theme={theme} />
      <div className="relative">{children}</div>
    </div>
  );
}
