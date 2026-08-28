import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-bold text-slate-900">페이지를 찾을 수 없어요</h1>
      <p className="text-sm text-slate-500">
        롤링페이퍼 링크가 잘못되었거나 삭제되었을 수 있어요.
      </p>
      <Link href="/" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white">
        처음으로 돌아가기
      </Link>
    </main>
  );
}
