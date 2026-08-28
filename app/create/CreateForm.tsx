"use client";

import { useRef, useState, useTransition } from "react";
import { createPaper } from "@/app/create/actions";
import { ThemePicker } from "@/components/ThemePicker";
import { ALLOWED_MIME_TYPES, ImageValidationError, prepareBackgroundImage } from "@/lib/image";
import { uploadBackgroundImage } from "@/lib/cloudinary";
import { RECIPIENT_MAX, TITLE_MAX } from "@/lib/validation";
import type { ThemeId } from "@/lib/themes";

export function CreateForm() {
  const [title, setTitle] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [theme, setTheme] = useState<ThemeId>("birthday");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<File | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setError(null);
    if (!file) {
      fileRef.current = null;
      setPreviewUrl(null);
      return;
    }
    fileRef.current = file;
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (theme === "custom" && !fileRef.current) {
      setError("배경으로 사용할 이미지를 선택해주세요.");
      return;
    }

    let backgroundUrl = "";

    if (theme === "custom" && fileRef.current) {
      setUploading(true);
      try {
        const blob = await prepareBackgroundImage(fileRef.current);
        backgroundUrl = await uploadBackgroundImage(blob);
      } catch (err) {
        setError(
          err instanceof ImageValidationError
            ? err.message
            : "이미지 업로드에 실패했어요. 잠시 후 다시 시도해주세요."
        );
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    startTransition(async () => {
      const result = await createPaper({ title, recipientName, theme, backgroundUrl });
      if (result?.error) setError(result.error);
    });
  }

  const busy = uploading || isPending;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-semibold text-slate-700">
          제목
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={TITLE_MAX}
          required
          placeholder="예) 민수의 졸업을 축하해!"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-base focus:border-slate-900 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="recipient" className="mb-1 block text-sm font-semibold text-slate-700">
          받는 사람 (선택)
        </label>
        <input
          id="recipient"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          maxLength={RECIPIENT_MAX}
          placeholder="예) 민수"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-base focus:border-slate-900 focus:outline-none"
        />
      </div>

      <div>
        <span className="mb-2 block text-sm font-semibold text-slate-700">테마</span>
        <ThemePicker value={theme} onChange={setTheme} />
      </div>

      {theme === "custom" && (
        <div>
          <label htmlFor="background" className="mb-1 block text-sm font-semibold text-slate-700">
            배경 이미지
          </label>
          <input
            id="background"
            type="file"
            accept={ALLOWED_MIME_TYPES.join(",")}
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
          <p className="mt-1 text-xs text-slate-500">JPG/PNG/WEBP, 5MB 이하</p>
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="배경 미리보기"
              className="mt-3 h-40 w-full rounded-lg object-cover"
            />
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="rounded-lg bg-slate-900 px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {uploading ? "이미지 업로드 중..." : isPending ? "만드는 중..." : "롤링페이퍼 만들기"}
      </button>
    </form>
  );
}
