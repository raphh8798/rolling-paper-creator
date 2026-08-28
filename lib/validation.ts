import { z } from "zod";
import { THEME_ORDER } from "@/lib/themes";

export const TITLE_MAX = 60;
export const RECIPIENT_MAX = 30;
export const AUTHOR_MAX = 20;
export const MESSAGE_MAX = 500;

export const createPaperSchema = z
  .object({
    title: z.string().trim().min(1, "제목을 입력해주세요.").max(TITLE_MAX),
    recipientName: z.string().trim().max(RECIPIENT_MAX).optional().or(z.literal("")),
    theme: z.enum(THEME_ORDER as [string, ...string[]]),
    backgroundUrl: z.string().trim().optional().or(z.literal("")),
  })
  .refine((data) => data.theme !== "custom" || !!data.backgroundUrl, {
    message: "커스텀 테마는 배경 이미지가 필요해요.",
    path: ["backgroundUrl"],
  });

export const addMessageSchema = z.object({
  authorName: z.string().trim().min(1, "이름을 입력해주세요.").max(AUTHOR_MAX),
  content: z.string().trim().min(1, "내용을 입력해주세요.").max(MESSAGE_MAX),
  cardColor: z.string().trim().optional().or(z.literal("")),
});

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Guards every id/token that reaches a SQL query — an invalid UUID would otherwise error the query itself. */
export function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

/**
 * A custom background URL must point at our own Cloudinary cloud.
 * Without this check, `backgroundUrl` would be an arbitrary string an
 * attacker could set to any URL, turning the paper page into an open
 * image proxy / hotlink for unrelated (possibly abusive) content.
 */
export function isOwnBackgroundUrl(url: string): boolean {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return false;
  const prefix = `https://res.cloudinary.com/${cloudName}/image/upload/`;
  return url.startsWith(prefix);
}
