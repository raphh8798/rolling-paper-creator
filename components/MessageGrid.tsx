import { MessageCard } from "@/components/MessageCard";

type Message = {
  id: string;
  author_name: string;
  content: string;
  card_color: string | null;
  created_at: string;
};

/** Round-robin into N columns — column 0 gets items 0, N, 2N…, column 1 gets 1, N+1…, etc. */
function splitIntoColumns(messages: Message[], columnCount: number): Message[][] {
  const columns: Message[][] = Array.from({ length: columnCount }, () => []);
  messages.forEach((message, i) => columns[i % columnCount].push(message));
  return columns;
}

function MasonryColumns({
  messages,
  columnCount,
  className,
}: {
  messages: Message[];
  columnCount: number;
  className: string;
}) {
  return (
    <div className={`gap-4 ${className}`}>
      {splitIntoColumns(messages, columnCount).map((column, i) => (
        <div key={i} className="flex flex-1 flex-col gap-4">
          {column.map((message) => (
            <MessageCard key={message.id} message={message} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function MessageGrid({
  messages,
  emptyClassName,
}: {
  messages: Message[];
  /** Text color for the empty-state message (needs to match the surface behind it). */
  emptyClassName: string;
}) {
  if (messages.length === 0) {
    return (
      <p className={`text-center text-sm opacity-80 ${emptyClassName}`}>
        아직 메시지가 없어요. 첫 메시지를 남겨보세요!
      </p>
    );
  }

  // True masonry (cards packed tightly, no leftover gap next to a shorter
  // neighbor) needs the column split decided ahead of render — it can't
  // respond to viewport width without either client JS or this. So each
  // breakpoint's column count is rendered once and toggled via CSS only;
  // no JS, no flash, and (unlike CSS `columns` + break-inside-avoid) no
  // browser column-balancing to get wrong on an unusually tall card.
  return (
    <>
      <MasonryColumns messages={messages} columnCount={1} className="flex sm:hidden" />
      <MasonryColumns messages={messages} columnCount={2} className="hidden sm:flex lg:hidden" />
      <MasonryColumns messages={messages} columnCount={3} className="hidden lg:flex" />
    </>
  );
}
