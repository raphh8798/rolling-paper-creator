"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { isUuid } from "@/lib/validation";

const AUTH_ERROR = "관리 권한이 없어요. 관리 링크를 다시 확인해주세요.";

async function assertOwner(paperId: string, token: string) {
  if (!isUuid(paperId) || !isUuid(token)) {
    throw new Error(AUTH_ERROR);
  }
  const rows = await sql`select id, owner_token from papers where id = ${paperId}`;
  const paper = rows[0] as { id: string; owner_token: string } | undefined;

  if (!paper || paper.owner_token !== token) {
    throw new Error(AUTH_ERROR);
  }
}

export async function deleteMessage(
  paperId: string,
  token: string,
  messageId: string
): Promise<{ error?: string }> {
  try {
    await assertOwner(paperId, token);
    if (!isUuid(messageId)) throw new Error("메시지를 찾을 수 없어요.");
    await sql`delete from messages where id = ${messageId} and paper_id = ${paperId}`;
  } catch (err) {
    return { error: err instanceof Error ? err.message : "메시지를 삭제하지 못했어요." };
  }
  revalidatePath(`/p/${paperId}`);
  revalidatePath(`/p/${paperId}/manage`);
  return {};
}

export async function setLocked(
  paperId: string,
  token: string,
  locked: boolean
): Promise<{ error?: string }> {
  try {
    await assertOwner(paperId, token);
    await sql`update papers set is_locked = ${locked} where id = ${paperId}`;
  } catch (err) {
    return { error: err instanceof Error ? err.message : "설정을 변경하지 못했어요." };
  }
  revalidatePath(`/p/${paperId}`);
  revalidatePath(`/p/${paperId}/manage`);
  return {};
}

export async function deletePaper(paperId: string, token: string): Promise<{ error?: string }> {
  try {
    await assertOwner(paperId, token);
    await sql`delete from papers where id = ${paperId}`;
  } catch (err) {
    return { error: err instanceof Error ? err.message : "롤링페이퍼를 삭제하지 못했어요." };
  }
  redirect("/");
}
