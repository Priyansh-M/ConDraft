import { currentUser } from "@/lib/server/auth"
import { readDb, writeDb } from "@/lib/server/db"
import { createSupabaseServer, supabaseConfigured } from "@/lib/supabase/server"
import type { SavedDraft } from "@/types"
import { NextResponse } from "next/server"

const unauthorized = () => NextResponse.json({ error: "Sign in to save drafts to your account." }, { status: 401 })

function fromRow(row: {
  id: string
  name: string
  kind: SavedDraft["kind"]
  status: SavedDraft["status"] | null
  payload: Omit<SavedDraft, "id" | "name" | "kind" | "status" | "updatedAt">
  updated_at: string
}): SavedDraft {
  return {
    ...row.payload,
    id: row.id,
    name: row.name,
    kind: row.kind,
    status: row.status ?? undefined,
    updatedAt: row.updated_at,
  }
}

function toRow(draft: SavedDraft, userId: string) {
  const { id, name, kind, status, updatedAt, ...payload } = draft
  return {
    id,
    user_id: userId,
    name,
    kind,
    status: status ?? null,
    payload,
    updated_at: updatedAt,
  }
}

export async function GET() {
  const user = await currentUser()
  if (!user) return unauthorized()
  if (supabaseConfigured()) {
    const supabase = await createSupabaseServer()
    if (!supabase) return NextResponse.json({ error: "Database is not configured." }, { status: 500 })
    const { data, error } = await supabase.from("drafts").select("*").eq("user_id", user.id).order("updated_at", { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json((data ?? []).map(fromRow))
  }
  const db = await readDb()
  const mine = db.drafts
    .filter((d) => d.userId === user.id)
    .map(({ userId: _userId, ...d }) => d)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  return NextResponse.json(mine)
}

export async function POST(req: Request) {
  const user = await currentUser()
  if (!user) return unauthorized()
  const body = (await req.json().catch(() => null)) as SavedDraft | SavedDraft[] | null
  const incoming = (Array.isArray(body) ? body : body ? [body] : []).filter((d) => d?.id && d?.name)
  if (supabaseConfigured()) {
    const supabase = await createSupabaseServer()
    if (!supabase) return NextResponse.json({ error: "Database is not configured." }, { status: 500 })
    for (const draft of incoming) {
      const { data: existing } = await supabase
        .from("drafts")
        .select("updated_at")
        .eq("id", draft.id)
        .eq("user_id", user.id)
        .maybeSingle()
      if (existing && existing.updated_at > draft.updatedAt) continue
      const { error } = await supabase.from("drafts").upsert(toRow(draft, user.id), { onConflict: "id" })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ saved: incoming.length })
  }
  const db = await readDb()
  for (const draft of incoming) {
    const existing = db.drafts.find((d) => d.id === draft.id && d.userId === user.id)
    if (existing && existing.updatedAt > draft.updatedAt) continue
    db.drafts = db.drafts.filter((d) => !(d.id === draft.id && d.userId === user.id))
    db.drafts.push({ ...draft, userId: user.id })
  }
  await writeDb(db)
  return NextResponse.json({ saved: incoming.length })
}

export async function DELETE(req: Request) {
  const user = await currentUser()
  if (!user) return unauthorized()
  const id = new URL(req.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 })
  if (supabaseConfigured()) {
    const supabase = await createSupabaseServer()
    if (!supabase) return NextResponse.json({ error: "Database is not configured." }, { status: 500 })
    const { error } = await supabase.from("drafts").delete().eq("id", id).eq("user_id", user.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }
  const db = await readDb()
  db.drafts = db.drafts.filter((d) => !(d.id === id && d.userId === user.id))
  await writeDb(db)
  return NextResponse.json({ ok: true })
}
