/**
 * Uploads an already resized/compressed background image straight from
 * the browser to Cloudinary using an unsigned upload preset — no server
 * round trip for the image bytes themselves.
 *
 * Set up the preset in the Cloudinary dashboard (Settings → Upload →
 * Upload presets) as "Unsigned", and restrict it there (allowed formats,
 * a max file size, a dedicated folder). Without those restrictions,
 * anyone who discovers the cloud name + preset name could upload
 * unrelated files through it — there's no login to stop them.
 */
export async function uploadBackgroundImage(blob: Blob): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary 설정이 없어요. .env.local에 NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / " +
        "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET을 채워주세요."
    );
  }

  const formData = new FormData();
  formData.append("file", blob);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "rolling-paper-backgrounds");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("이미지 업로드에 실패했어요. 잠시 후 다시 시도해주세요.");
  }

  const data = (await res.json()) as { secure_url?: string };
  if (!data.secure_url) {
    throw new Error("이미지 업로드에 실패했어요. 잠시 후 다시 시도해주세요.");
  }
  return data.secure_url;
}
