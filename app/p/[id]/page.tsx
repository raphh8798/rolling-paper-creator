import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { getThemeDefinition, isThemeId } from "@/lib/themes";
import { isUuid } from "@/lib/validation";
import { PaperBackground } from "@/components/PaperBackground";
import { CustomPhotoPaper } from "@/components/CustomPhotoPaper";
import { MessageGrid } from "@/components/MessageGrid";
import { MessageComposer } from "@/app/p/[id]/MessageComposer";

export const dynamic = "force-dynamic";

type PaperRow = {
  id: string;
  title: string;
  recipient_name: string | null;
  theme: string;
  background_url: string | null;
  is_locked: boolean;
};

type MessageRow = {
  id: string;
  author_name: string;
  content: string;
  card_color: string | null;
  created_at: string;
};

async function getPaper(id: string) {
  if (!isUuid(id)) return null;

  const papers = await sql`
    select id, title, recipient_name, theme, background_url, is_locked
    from papers
    where id = ${id}
  `;
  const paper = papers[0] as PaperRow | undefined;
  if (!paper || !isThemeId(paper.theme)) return null;

  const messages = (await sql`
    select id, author_name, content, card_color, created_at
    from messages
    where paper_id = ${id}
    order by created_at desc
  `) as MessageRow[];

  return { paper, messages };
}

export async function generateMetadata(
  { params }: PageProps<"/p/[id]">
): Promise<Metadata> {
  const { id } = await params;
  const result = await getPaper(id);
  if (!result) return { title: "롤링페이퍼" };
  return { title: `${result.paper.title} | 롤링페이퍼` };
}

export default async function PaperPage({ params }: PageProps<"/p/[id]">) {
  const { id } = await params;
  const result = await getPaper(id);
  if (!result) notFound();

  const { paper, messages } = result;
  const theme = getThemeDefinition(paper.theme as Parameters<typeof getThemeDefinition>[0]);

  const header = (
    <header className="text-center">
      <p className={`text-sm font-semibold opacity-80 ${theme.textClassName}`}>
        {theme.emoji} {paper.recipient_name ? `To. ${paper.recipient_name}` : "롤링페이퍼"}
      </p>
      <h1 className={`mt-2 text-3xl font-bold sm:text-4xl ${theme.textClassName}`}>{paper.title}</h1>
    </header>
  );

  const composer = paper.is_locked ? (
    <p className={`rounded-full bg-black/20 px-5 py-2 text-sm font-medium ${theme.textClassName}`}>
      🔒 메시지 작성이 마감되었어요
    </p>
  ) : (
    <MessageComposer paperId={paper.id} cardColors={theme.cardColors} textClassName={theme.textClassName} />
  );

  if (theme.id === "custom" && paper.background_url) {
    return (
      <CustomPhotoPaper
        backgroundUrl={paper.background_url}
        header={
          <div className="flex flex-col items-center gap-4">
            {header}
            {composer}
          </div>
        }
        body={<MessageGrid messages={messages} emptyClassName="text-white" />}
      />
    );
  }

  return (
    <PaperBackground theme={theme.id}>
      <div className="mx-auto flex min-h-dvh w-full relative w-[92vw] max-w-[1600px] flex-col items-center gap-8 px-6 py-12">
        {header}
        {composer}
        <section className="w-full">
          {/* A capped-height, independently-scrolling panel — no matter
              how many messages there are or how long one is, the grid
              scrolls inside this box instead of stretching the whole
              page (and however tall a single card gets, it's clipped to
              this box's scroll area, never spilling past it). */}
          {messages.length === 0 ? (
            <MessageGrid messages={messages} emptyClassName={theme.textClassName} />
          ) : (
            <div className="max-h-[65vh] w-full overflow-y-auto rounded-2xl bg-white/30 p-4 backdrop-blur-sm">
              <MessageGrid messages={messages} emptyClassName={theme.textClassName} />
            </div>
          )}
        </section>
      </div>
    </PaperBackground>
  );
}
