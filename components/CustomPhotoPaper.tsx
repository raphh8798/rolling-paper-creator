import type { ReactNode } from "react";

/**
 * Lays the whole paper out as a single card sized by the uploaded photo
 * itself (full width up to a max, height following the photo's own
 * aspect ratio — never cropped or stretched). Inside that exact box:
 * `header` (title + compose button/form) takes its natural height, and
 * `body` (the message grid) fills whatever's left down to the bottom of
 * the photo, scrolling internally if the messages don't fit.
 */
export function CustomPhotoPaper({
  backgroundUrl,
  header,
  body,
}: {
  backgroundUrl: string;
  header: ReactNode;
  body: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-slate-100 p-4 sm:p-8">
      <div className="relative w-[92vw] max-w-[1600px]">
        {/* Defines the card's size — full width (up to max-w-6xl), height
            from the photo's own aspect ratio. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={backgroundUrl} alt="" className="block h-auto w-full rounded-2xl" />
        <div className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl">
          <div className="shrink-0 bg-gradient-to-b from-black/55 via-black/20 to-transparent px-6 pb-6 pt-6">
            {header}
          </div>
          {/* pt-4: without top padding, the message cards start flush
              against this scroll box's clip edge, so their rounded
              corners/shadow get sliced off right at the header boundary. */}
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-4">{body}</div>
        </div>
      </div>
    </div>
  );
}
