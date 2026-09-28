import type { SavedDraft } from "@/types"

const DISCLAIMER_KEY = "condraft-disclaimer-v1"
const SAVE_GATE_KEY = "condraft-save-gate-v1"

export async function signedInEmail(): Promise<string | null> {
  try {
    const res = await fetch("/api/auth/me", { cache: "no-store" })
    if (!res.ok) return null
    const body = (await res.json()) as { email?: string } | null
    return body?.email ?? null
  } catch {
    return null
  }
}

/** Account drafts only. Guests get nothing saved. */
export async function saveDraft(draft: SavedDraft): Promise<"account" | "none"> {
  try {
    const res = await fetch("/api/drafts", { method: "POST", body: JSON.stringify(draft) })
    if (res.ok) return "account"
  } catch {
    /* signed out or offline */
  }
  return "none"
}

export function deleteDraft(id: string) {
  void fetch(`/api/drafts?id=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {})
}

export async function listAllDrafts(): Promise<SavedDraft[]> {
  try {
    const res = await fetch("/api/drafts", { cache: "no-store" })
    if (!res.ok) return []
    const rows = (await res.json()) as SavedDraft[]
    return Array.isArray(rows) ? rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)) : []
  } catch {
    return []
  }
}

export function openDraft(draft: SavedDraft) {
  sessionStorage.setItem("condraft-open", JSON.stringify(draft))
  if (draft.kind === "interview") return "/steps"
  if (draft.kind === "rent") return "/rent"
  return "/blank"
}

export function hasEntered(): boolean {
  return typeof window !== "undefined" && sessionStorage.getItem(DISCLAIMER_KEY) === "yes"
}

export function markEntered() {
  sessionStorage.setItem(DISCLAIMER_KEY, "yes")
}

export function hasPassedSaveGate(): boolean {
  return typeof window !== "undefined" && sessionStorage.getItem(SAVE_GATE_KEY) === "yes"
}

export function markSaveGate() {
  sessionStorage.setItem(SAVE_GATE_KEY, "yes")
}
