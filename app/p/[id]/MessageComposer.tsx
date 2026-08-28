"use client";

import { useState, useTransition } from "react";
import { addMessage } from "@/app/p/[id]/actions";
import { AUTHOR_MAX, MESSAGE_MAX } from "@/lib/validation";

export function MessageComposer({
  paperId,
  cardColors,
  textClassName,
}: {
  paperId: string;
  cardColors: string[];
  textClassName: string;
}) {
  const [open, setOpen] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [cardColor, setCardColor] = useState(cardColors[0]);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await addMessage(paperId, { authorName, content, cardColor });
      if (result.error) {
        setError(result.error);
        return;
      }
      setAuthorName("");
      setContent("");
      setDone(true);
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setDone(false);
          }}
          className="rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100"
        >
          ✏️ 메시지 남기기
        </button>
        {done && (
          <p className={`text-sm font-medium ${textClassName}`}>메시지를 남겼어요. 고마워요! 🎉</p>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
    >
      <div className="mb-3">
        <label htmlFor="authorName" className="mb-1 block text-sm font-semibold text-slate-700">
          이름
        </label>
        <input
          id="authorName"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          maxLength={AUTHOR_MAX}
          required
          placeholder="누가 남기나요?"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="content" className="mb-1 block text-sm font-semibold text-slate-700">
          메시지
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={MESSAGE_MAX}
          required
          rows={4}
          placeholder="축하 메시지를 남겨주세요"
          className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <span className="mb-1 block text-sm font-semibold text-slate-700">카드 색상</span>
        <div className="flex gap-2">
          {cardColors.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`카드 색상 ${color}`}
              aria-pressed={cardColor === color}
              onClick={() => setCardColor(color)}
              className={`h-8 w-8 rounded-full border-2 ${
                cardColor === color ? "border-slate-900" : "border-slate-200"
              }`}
              style={{ background: color }}
            />
          ))}
        </div>
      </div>

      {error && (
        <p role="alert" className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isPending ? "남기는 중..." : "남기기"}
        </button>
      </div>
    </form>
  );
}
