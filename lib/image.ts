/**
 * Client-side image validation + compression for custom theme backgrounds.
 * Runs entirely in the browser before anything is uploaded to Cloudinary
 * — the unsigned upload preset itself (see README.md setup steps) also
 * enforces a hard size/mime limit as a backstop.
 */

export const MAX_ORIGINAL_BYTES = 5 * 1024 * 1024; // 5MB
export const MAX_OUTPUT_BYTES = 2 * 1024 * 1024; // 2MB
export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_DIMENSION = 1920;

export class ImageValidationError extends Error {}

export async function prepareBackgroundImage(file: File): Promise<Blob> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new ImageValidationError(
      "JPG, PNG, WEBP 이미지만 업로드할 수 있어요."
    );
  }
  if (file.size > MAX_ORIGINAL_BYTES) {
    throw new ImageValidationError(
      "이미지 용량이 너무 커요. 5MB 이하의 이미지를 선택해주세요."
    );
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new ImageValidationError("이미지를 처리할 수 없어요.");
  ctx.drawImage(bitmap, 0, 0, width, height);

  for (const quality of [0.82, 0.6, 0.4]) {
    const blob = await canvasToBlob(canvas, quality);
    if (blob.size <= MAX_OUTPUT_BYTES) return blob;
  }

  throw new ImageValidationError(
    "이미지를 충분히 압축하지 못했어요. 다른 이미지를 선택해주세요."
  );
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("이미지 변환에 실패했어요."))),
      "image/webp",
      quality
    );
  });
}
