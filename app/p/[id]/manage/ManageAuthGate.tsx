"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { extractToken, readOwnerToken } from "@/lib/ownerToken";

export function ManageAuthGate({ paperId }: { paperId: string }) {
  const router = useRouter();
  // Lazy-initialized so this only touches localStorage during the client
  // render pass (a no-op returning null during SSR), and synchronously —
  // no separate "checking" state/render needed.
  const [savedToken] = useState<string | null>(() =>
    typeof window === "undefined" ? null : readOwnerToken(paperId)
  );
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (savedToken) router.replace(`/p/${paperId}/manage?token=${savedToken}`);
  }, [savedToken, paperId, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = extractToken(input);
    if (!token) {
      setError("관리 링크 또는 코드를 입력해주세요.");
      return;
    }
    router.replace(`/p/${paperId}/manage?token=${token}`);
  }

  if (savedToken) {
    return <p className="text-center text-sm text-slate-500">확인 중...</p>;
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-4 px-6">
      <h1 className="text-xl font-bold text-slate-900">관리자 인증이 필요해요</h1>
      <p className="text-sm text-slate-500">
        롤링페이퍼를 만들 때 받은 관리 링크(또는 그 안의 코드)를 붙여넣어주세요.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="관리 링크 붙여넣기"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-slate-900 focus:outline-none"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
        >
          확인
        </button>
      </form>
    </div>
  );
}
