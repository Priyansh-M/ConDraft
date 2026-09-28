"use client"

import { DISCLAIMER_BODY, DISCLAIMER_TITLE, SAVE_GATE_BODY, SAVE_GATE_TITLE } from "@/lib/disclaimer"
import { hasEntered, hasPassedSaveGate, markEntered, markSaveGate, signedInEmail } from "@/lib/storage"
import Link from "next/link"
import { useEffect, useState } from "react"

export function DisclaimerGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [ok, setOk] = useState(false)
  const [saveOk, setSaveOk] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setOk(hasEntered())
    setSaveOk(hasPassedSaveGate())
    signedInEmail().then((email) => {
      setSignedIn(Boolean(email))
      setReady(true)
    })
  }, [])

  if (!ready) return <main className="gate" aria-busy="true" />

  if (!ok) {
    return (
      <main className="gate">
        <div className="gate-card">
          <p className="eyebrow">ConDraft</p>
          <h1>{DISCLAIMER_TITLE}</h1>
          <p className="gate-copy">{DISCLAIMER_BODY}</p>
          <label className="check">
            <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
            <span>
              I have read this. I will use ConDraft only as a legal-reference drafting aid. I will not hold ConDraft or
              its author accountable for any document I stamp, register, file, or sign without a licensed advocate
              reviewing it.
            </span>
          </label>
          <button
            type="button"
            className="btn"
            disabled={!checked}
            onClick={() => {
              markEntered()
              setOk(true)
            }}
          >
            I agree — continue
          </button>
        </div>
      </main>
    )
  }

  if (!signedIn && !saveOk) {
    return (
      <main className="gate">
        <div className="gate-card">
          <p className="eyebrow">Your drafts</p>
          <h1>{SAVE_GATE_TITLE}</h1>
          <p className="gate-copy">{SAVE_GATE_BODY}</p>
          <div className="row">
            <Link href="/account" className="btn">
              Sign in / sign up
            </Link>
            <button
              type="button"
              className="btn secondary"
              onClick={() => {
                markSaveGate()
                setSaveOk(true)
              }}
            >
              Continue without saving
            </button>
          </div>
        </div>
      </main>
    )
  }

  return <>{children}</>
}
