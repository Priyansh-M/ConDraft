"use client"

import { KIND_LABEL, type ContractKind } from "@/lib/kinds"
import { deleteDraft, listAllDrafts, openDraft } from "@/lib/storage"
import type { SavedDraft } from "@/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

function progress(d: SavedDraft) {
  if (d.status === "completed") return "Completed"
  if (d.kind === "interview" && d.interview) {
    const kind = d.interview.map.kind as ContractKind
    return `${KIND_LABEL[kind] ?? "Draft"} · question ${d.interview.step + 1}`
  }
  return d.kind === "rent" ? "Residence form" : "Blank builder"
}

export function DraftList({ filter, limit, empty }: { filter?: "draft" | "completed"; limit?: number; empty?: string }) {
  const router = useRouter()
  const [items, setItems] = useState<SavedDraft[] | null>(null)

  useEffect(() => {
    listAllDrafts().then(setItems)
  }, [])

  if (!items) return null
  const shown = items
    .filter((d) => !filter || (filter === "completed" ? d.status === "completed" : d.status !== "completed"))
    .slice(0, limit)
  if (shown.length === 0) return empty ? <p className="muted">{empty}</p> : null

  return (
    <ul className="draft-list">
      {shown.map((d) => (
        <li key={d.id}>
          <button type="button" className="draft-open" onClick={() => router.push(openDraft(d))}>
            <strong>{d.name}</strong>
            <span>
              {progress(d)} · {new Date(d.updatedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            </span>
          </button>
          <div className="row">
            <button type="button" className="btn small" onClick={() => router.push(openDraft(d))}>
              {d.status === "completed" ? "Open" : "Continue"}
            </button>
            <button
              type="button"
              className="btn small ghost"
              onClick={() => {
                deleteDraft(d.id)
                setItems(items.filter((x) => x.id !== d.id))
              }}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
