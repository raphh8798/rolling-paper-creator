type Message = {
  id: string;
  author_name: string;
  content: string;
  card_color: string | null;
  created_at: string;
};

/** Deterministic small rotation from the id, so it's stable between server and client renders. */
function rotationFor(id: string) {
  const sum = [...id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const angle = (sum % 9) - 4; // -4..4 degrees
  return angle;
}

export function MessageCard({ message }: { message: Message }) {
  const rotation = rotationFor(message.id);
  const background = message.card_color || "#FFFFFF";
  const date = new Date(message.created_at).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="w-full rounded-lg p-4 shadow-lg transition-transform hover:z-10 hover:scale-[1.03] hover:rotate-0"
      style={{ background, transform: `rotate(${rotation}deg)` }}
    >
      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-800">
        {message.content}
      </p>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span className="font-semibold text-slate-700">From. {message.author_name}</span>
        <span>{date}</span>
      </div>
    </div>
  );
}
