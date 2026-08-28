import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          🎉 롤링페이퍼
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          생일, 졸업, 크리스마스... 소중한 날을 위한 메시지를 모아보세요.
          <br />
          링크 하나로 누구나 참여할 수 있어요.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 text-3xl">
        <span title="생일">🎂</span>
        <span title="졸업">🎓</span>
        <span title="크리스마스">🎄</span>
        <span title="커스텀">🖼️</span>
      </div>

      <Link
        href="/create"
        className="rounded-full bg-slate-900 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-slate-700"
      >
        새 롤링페이퍼 만들기
      </Link>
    </main>
  );
}
