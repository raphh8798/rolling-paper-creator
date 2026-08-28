import type { CSSProperties } from "react";
import type { ThemeId } from "@/lib/themes";

function Balloon({ color, style }: { color: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 40 60"
      className="absolute h-16 w-auto opacity-70 animate-float-y"
      style={style}
      aria-hidden
    >
      <ellipse cx="20" cy="20" rx="18" ry="20" fill={color} />
      <path d="M20 40 L20 58" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M17 40 Q20 44 23 40" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function ConfettiDot({ color, style }: { color: string; style?: CSSProperties }) {
  return (
    <span
      className="absolute h-2.5 w-2.5 rounded-sm opacity-70 animate-float-y"
      style={{ background: color, ...style }}
      aria-hidden
    />
  );
}

function GraduationCap({ style }: { style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 64 48"
      className="absolute h-14 w-auto opacity-30"
      style={style}
      aria-hidden
    >
      <path d="M32 4 L62 16 L32 28 L2 16 Z" fill="#F2C744" />
      <path d="M14 20 V34 Q32 44 50 34 V20" fill="none" stroke="#F2C744" strokeWidth="2" />
      <circle cx="60" cy="16" r="1.6" fill="#F2C744" />
      <path d="M60 16 V32" stroke="#F2C744" strokeWidth="1.5" />
    </svg>
  );
}

function Snowflake({ style }: { style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="absolute h-6 w-6 text-white/70 animate-drift-down"
      style={style}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 0h1v24h-1zM0 12v-1h24v1z" />
      <path d="M4.2 4.2l.7-.7 15 15-.7.7zM19.2 4.2l-15 15-.7-.7 15-15z" />
    </svg>
  );
}

const BIRTHDAY_COLORS = ["#FF7AA2", "#FFD166", "#8ECAE6", "#B98BFF"];
const CONFETTI_COLORS = ["#FFD166", "#FF7AA2", "#8ECAE6", "#B98BFF", "#FFFFFF"];

/**
 * Purely decorative, non-interactive overlay rendered on top of a
 * themed paper background. Positions are fixed (not random) so server
 * and client render identical markup.
 */
export function ThemeDecorations({ theme }: { theme: ThemeId }) {
  if (theme === "birthday") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Balloon color={BIRTHDAY_COLORS[0]} style={{ left: "6%", top: "8%" }} />
        <Balloon
          color={BIRTHDAY_COLORS[1]}
          style={{ right: "10%", top: "14%", animationDelay: "1.2s" }}
        />
        <Balloon
          color={BIRTHDAY_COLORS[2]}
          style={{ left: "16%", bottom: "10%", animationDelay: "2.4s" }}
        />
        <Balloon
          color={BIRTHDAY_COLORS[3]}
          style={{ right: "18%", bottom: "16%", animationDelay: "0.6s" }}
        />
        {Array.from({ length: 14 }).map((_, i) => (
          <ConfettiDot
            key={i}
            color={CONFETTI_COLORS[i % CONFETTI_COLORS.length]}
            style={{
              left: `${(i * 7.3) % 100}%`,
              top: `${(i * 13.7) % 100}%`,
              animationDelay: `${(i % 5) * 0.5}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (theme === "graduation") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <GraduationCap style={{ left: "4%", top: "10%" }} />
        <GraduationCap style={{ right: "6%", top: "50%" }} />
        <GraduationCap style={{ left: "20%", bottom: "6%" }} />
      </div>
    );
  }

  if (theme === "christmas") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <Snowflake
            key={i}
            style={{
              left: `${(i * 5.5) % 100}%`,
              animationDelay: `${(i % 6) * 1.7}s`,
              animationDuration: `${10 + (i % 5)}s`,
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}
