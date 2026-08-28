import type { Metadata } from "next";
import Link from "next/link";
import { CreateForm } from "@/app/create/CreateForm";

export const metadata: Metadata = {
  title: "새 롤링페이퍼 만들기 | 롤링페이퍼",
};

export default function CreatePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-8 px-6 py-12">
      <div>
        <Link href="/" className="text-sm text-slate-500 hover:underline">
          ← 처음으로
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">새 롤링페이퍼 만들기</h1>
        <p className="mt-1 text-sm text-slate-500">
          만들고 나면 친구들에게 공유할 링크와, 나만 볼 수 있는 관리 링크가 생성돼요.
        </p>
      </div>
      <CreateForm />
    </main>
  );
}
