"use server";

import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { createPaperSchema, isOwnBackgroundUrl } from "@/lib/validation";

export type CreatePaperInput = {
  title: string;
  recipientName: string;
  theme: string;
  backgroundUrl: string;
};

export type CreatePaperResult = { error: string };

export async function createPaper(
  input: CreatePaperInput
): Promise<CreatePaperResult> {
  const parsed = createPaperSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const { title, recipientName, theme, backgroundUrl } = parsed.data;

  if (theme === "custom" && !isOwnBackgroundUrl(backgroundUrl || "")) {
    return { error: "배경 이미지 업로드에 문제가 있어요. 다시 시도해주세요." };
  }

  let created: { id: string; owner_token: string } | undefined;
  try {
    const rows = await sql`
      insert into papers (title, recipient_name, theme, background_url)
      values (
        ${title},
        ${recipientName || null},
        ${theme},
        ${theme === "custom" ? backgroundUrl : null}
      )
      returning id, owner_token
    `;
    created = rows[0] as { id: string; owner_token: string } | undefined;
  } catch {
    return { error: "롤링페이퍼 생성에 실패했어요. 잠시 후 다시 시도해주세요." };
  }

  if (!created) {
    return { error: "롤링페이퍼 생성에 실패했어요. 잠시 후 다시 시도해주세요." };
  }

  redirect(`/p/${created.id}/manage?token=${created.owner_token}&new=1`);
}
