import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  checkPassword,
  hashPassword,
  readDb,
  signSession,
  verifySession,
  writeDb,
} from "@/lib/server/db"
import { createSupabaseServer, supabaseConfigured } from "@/lib/supabase/server"

export type AuthUser = { id: string; email: string }

export async function currentUser(): Promise<AuthUser | null> {
  if (supabaseConfigured()) {
    const supabase = await createSupabaseServer()
    if (!supabase) return null
    const { data } = await supabase.auth.getUser()
    if (data.user?.id && data.user.email) return { id: data.user.id, email: data.user.email }
    return null
  }
  const jar = await cookies()
  const user = await verifySession(jar.get(SESSION_COOKIE)?.value)
  return user ? { id: user.id, email: user.email } : null
}

async function startSession(userId: string, email: string) {
  const res = NextResponse.json({ email })
  res.cookies.set(SESSION_COOKIE, await signSession(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  })
  return res
}

function parse(body: unknown) {
  const { email, password } = (body ?? {}) as { email?: string; password?: string }
  const cleanEmail = String(email ?? "").trim().toLowerCase()
  const pass = String(password ?? "")
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail)) return { error: "Enter a valid email." }
  if (pass.length < 8) return { error: "Password must be at least 8 characters." }
  return { email: cleanEmail, password: pass }
}

export async function signUp(body: unknown) {
  const input = parse(body)
  if ("error" in input) return NextResponse.json({ error: input.error }, { status: 400 })
  if (supabaseConfigured()) {
    const supabase = await createSupabaseServer()
    if (!supabase) return NextResponse.json({ error: "Auth is not configured." }, { status: 500 })
    const { data, error } = await supabase.auth.signUp({ email: input.email, password: input.password })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    if (!data.session) {
      return NextResponse.json({ email: input.email, needsConfirm: true })
    }
    return NextResponse.json({ email: data.user?.email ?? input.email })
  }
  const db = await readDb()
  if (db.users.some((u) => u.email === input.email)) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 })
  }
  const user = { id: crypto.randomUUID(), email: input.email, ...hashPassword(input.password), createdAt: new Date().toISOString() }
  db.users.push(user)
  await writeDb(db)
  return startSession(user.id, user.email)
}

export async function logIn(body: unknown) {
  const input = parse(body)
  if ("error" in input) return NextResponse.json({ error: input.error }, { status: 400 })
  if (supabaseConfigured()) {
    const supabase = await createSupabaseServer()
    if (!supabase) return NextResponse.json({ error: "Auth is not configured." }, { status: 500 })
    const { data, error } = await supabase.auth.signInWithPassword({ email: input.email, password: input.password })
    if (error || !data.user?.email) {
      return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 })
    }
    return NextResponse.json({ email: data.user.email })
  }
  const db = await readDb()
  const user = db.users.find((u) => u.email === input.email)
  if (!user || !checkPassword(input.password, user)) {
    return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 })
  }
  return startSession(user.id, user.email)
}

export async function logOut() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 })
  if (supabaseConfigured()) {
    const supabase = await createSupabaseServer()
    await supabase?.auth.signOut()
  }
  return res
}
