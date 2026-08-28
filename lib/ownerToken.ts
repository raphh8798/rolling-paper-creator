"use client";

/**
 * The real credential is always the `owner_token` value itself (carried
 * in the manage URL's `?token=` query param and verified against the DB
 * server-side). localStorage is only a same-browser convenience so the
 * creator doesn't have to keep re-pasting the link — see manage/page.tsx.
 */
function storageKey(paperId: string) {
  return `rp_owner_token_${paperId}`;
}

export function saveOwnerToken(paperId: string, token: string) {
  try {
    localStorage.setItem(storageKey(paperId), token);
  } catch {
    // localStorage can be unavailable (private mode, disabled storage) — non-fatal.
  }
}

export function readOwnerToken(paperId: string): string | null {
  try {
    return localStorage.getItem(storageKey(paperId));
  } catch {
    return null;
  }
}

/** Accepts either a bare token or a full manage link and extracts the token. */
export function extractToken(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    return url.searchParams.get("token");
  } catch {
    return trimmed;
  }
}
