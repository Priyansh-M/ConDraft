"use client"

import { Shell } from "@/components/Shell"
import { markSaveGate } from "@/lib/storage"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function AccountPage() {
  const [me, setMe] = useState<{ email: string } | null | undefined>(undefined)
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then(setMe)
      .catch(() => setMe(null))
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError("")
    setInfo("")
    const res = await fetch(`/api/auth/${mode}`, { method: "POST", body: JSON.stringify({ email, password }) })
    const body = await res.json().catch(() => ({}))
    setBusy(false)
    if (!res.ok) return setError(body.error || "Something went wrong.")
    if (body.needsConfirm) {
      setInfo("Check your email to confirm the account, then sign in. Nothing is saved until you are signed in.")
      setMode("login")
      return
    }
    markSaveGate()
    window.location.href = "/"
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/"
  }

  return (
    <Shell>
      <main className="hub auth-wrap">
        {me === undefined ? null : me ? (
          <div className="auth-card">
            <p className="eyebrow">Signed in</p>
            <h1>{me.email}</h1>
            <p className="lede">
              Drafts and finished contracts on this account stay on this account only. Signing out hides them until you
              sign back in.
            </p>
            <div className="row">
              <Link href="/drafts" className="btn">
                My drafts
              </Link>
              <button type="button" className="btn secondary" onClick={logout}>
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <form className="auth-card" onSubmit={submit}>
            <div className="tabs">
              <button type="button" className={mode === "login" ? "is-on" : ""} onClick={() => setMode("login")}>
                Sign in
              </button>
              <button type="button" className={mode === "signup" ? "is-on" : ""} onClick={() => setMode("signup")}>
                Create account
              </button>
            </div>
            <p className="lede">
              {mode === "signup"
                ? "Create an account to keep drafts. They belong only to this email. Nothing from other people on this browser is added."
                : "Welcome back. You will only see drafts saved to this email."}
            </p>
            <label>
              Email
              <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
              Password
              <input
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            {info ? <p className="hint">{info}</p> : null}
            <button type="submit" className="btn" disabled={busy}>
              {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>
        )}
      </main>
    </Shell>
  )
}
