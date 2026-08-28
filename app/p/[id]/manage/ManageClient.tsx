"use client";

import { useEffect, useState, useTransition } from "react";
import { deleteMessage, deletePaper, setLocked } from "@/app/p/[id]/manage/actions";
import { saveOwnerToken } from "@/lib/ownerToken";
import { ConfirmDialog } from "@/components/ConfirmDialog";

type Message = {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
};

function CopyField({ label, value, warning }: { label: string; value: string; warning?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API can be unavailable; the value is still selectable/visible.
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="mb-1 text-sm font-semibold text-slate-700">{label}</p>
      <div className="flex gap-2">
        <input
          readOnly
          value={value}
          onFocus={(e) => e.currentTarget.select()}
          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          {copied ? "복사됨!" : "복사"}
        </button>
      </div>
      {warning && <p className="mt-2 text-xs font-medium text-amber-600">⚠️ {warning}</p>}
    </div>
  );
}

export function ManageClient({
  paperId,
  token,
  title,
  isLocked,
  messages,
  isFresh,
}: {
  paperId: string;
  token: string;
  title: string;
  isLocked: boolean;
  messages: Message[];
  isFresh: boolean;
}) {
  const [locked, setLockedState] = useState(isLocked);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    saveOwnerToken(paperId, token);
  }, [paperId, token]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = `${origin}/p/${paperId}`;
  const manageUrl = `${origin}/p/${paperId}/manage?token=${token}`;

  function handleToggleLock() {
    setError(null);
    const next = !locked;
    startTransition(async () => {
      const result = await setLocked(paperId, token, next);
      if (result.error) {
        setError(result.error);
        return;
      }
      setLockedState(next);
    });
  }

  function handleDeleteMessage(messageId: string) {
    setError(null);
    startTransition(async () => {
      const result = await deleteMessage(paperId, token, messageId);
      if (result.error) setError(result.error);
    });
  }

  function handleDeletePaper() {
    setConfirmDeleteOpen(true);
  }

  function confirmDeletePaper() {
    setConfirmDeleteOpen(false);
    setError(null);
    startTransition(async () => {
      const result = await deletePaper(paperId, token);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-6 px-6 py-12">
      <div>
        {isFresh && (
          <p className="mb-2 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            🎉 롤링페이퍼가 만들어졌어요!
          </p>
        )}
        <h1 className="text-2xl font-bold text-slate-900">{title} · 관리</h1>
      </div>

      <CopyField label="공유 링크 (참여자에게 보내주세요)" value={shareUrl} />
      <CopyField
        label="관리 링크 (나만 보관하세요)"
        value={manageUrl}
        warning="다른 기기에서도 관리하려면 이 링크를 꼭 저장해두세요. 잃어버리면 되찾을 수 없어요."
      />

      <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
        <div>
          <p className="text-sm font-semibold text-slate-700">메시지 작성 마감</p>
          <p className="text-xs text-slate-500">마감하면 더 이상 새 메시지를 남길 수 없어요.</p>
        </div>
        <button
          type="button"
          onClick={handleToggleLock}
          disabled={isPending}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            locked ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
          }`}
        >
          {locked ? "마감됨" : "받는 중"}
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">메시지 ({messages.length})</h2>
        {messages.length === 0 ? (
          <p className="text-sm text-slate-500">아직 메시지가 없어요.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {messages.map((message) => (
              <li
                key={message.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-700">{message.author_name}</p>
                  <p className="whitespace-pre-wrap break-words text-sm text-slate-600">
                    {message.content}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteMessage(message.id)}
                  disabled={isPending}
                  className="shrink-0 text-sm font-medium text-red-600 hover:underline"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-red-200 p-4">
        <p className="mb-2 text-sm font-semibold text-red-700">위험 구역</p>
        <button
          type="button"
          onClick={handleDeletePaper}
          disabled={isPending}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
        >
          롤링페이퍼 전체 삭제
        </button>
      </div>

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="정말 삭제할까요?"
        description="모든 메시지가 함께 삭제되고 되돌릴 수 없어요."
        confirmLabel="삭제"
        danger
        onConfirm={confirmDeletePaper}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </main>
  );
}
