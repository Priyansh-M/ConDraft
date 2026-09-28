"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export function AccountLink() {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((u: { email: string } | null) => setEmail(u?.email ?? null))
      .catch(() => {})
  }, [])

  return (
    <Link href="/account" className={email ? "nav-account is-in" : "nav-account"}>
      {email ? email.split("@")[0] : "Sign in"}
    </Link>
  )
}
