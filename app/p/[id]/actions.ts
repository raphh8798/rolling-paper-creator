"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { addMessageSchema, isUuid } from "@/lib/validation";

export type AddMessageInput = {
  authorName: string;
  content: string;
  cardColor: string;
};

export async function addMessage(
  paperId: string,
  input: AddMessageInput
): Promise<{ error?: string }> {
  if (!isUuid(paperId)) {
    return { error: "롤링페이퍼를 찾을 수 없어요." };
  }

  const parsed = addMessageSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const papers = await sql`select id, is_locked from papers where id = ${paperId}`;
  const paper = papers[0] as { id: string; is_locked: boolean } | undefined;

  if (!paper) {
    return { error: "롤링페이퍼를 찾을 수 없어요." };
  }
  if (paper.is_locked) {
    return { error: "메시지 작성이 마감되었어요." };
  }

  const { authorName, content, cardColor } = parsed.data;
  try {
    await sql`
      insert into messages (paper_id, author_name, content, card_color)
      values (${paperId}, ${authorName}, ${content}, ${cardColor || null})
    `;
  } catch {
    return { error: "메시지를 남기지 못했어요. 잠시 후 다시 시도해주세요." };
  }

  revalidatePath(`/p/${paperId}`);
  return {};
}
