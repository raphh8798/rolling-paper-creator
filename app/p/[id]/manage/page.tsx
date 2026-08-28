import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { isUuid } from "@/lib/validation";
import { ManageAuthGate } from "@/app/p/[id]/manage/ManageAuthGate";
import { ManageClient } from "@/app/p/[id]/manage/ManageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "롤링페이퍼 관리",
  robots: { index: false, follow: false },
};

type PaperRow = { id: string; title: string; owner_token: string; is_locked: boolean };
type MessageRow = { id: string; author_name: string; content: string; created_at: string };

export default async function ManagePage({
  params,
  searchParams,
}: PageProps<"/p/[id]/manage">) {
  const { id } = await params;
  const search = await searchParams;
  const token = typeof search.token === "string" ? search.token : null;

  if (!isUuid(id)) notFound();

  const papers = await sql`
    select id, title, owner_token, is_locked from papers where id = ${id}
  `;
  const paper = papers[0] as PaperRow | undefined;
  if (!paper) notFound();

  if (!token || token !== paper.owner_token) {
    return <ManageAuthGate paperId={id} />;
  }

  const messages = (await sql`
    select id, author_name, content, created_at from messages
    where paper_id = ${id}
    order by created_at desc
  `) as MessageRow[];

  return (
    <ManageClient
      paperId={id}
      token={token}
      title={paper.title}
      isLocked={paper.is_locked}
      messages={messages}
      isFresh={search.new === "1"}
    />
  );
}
