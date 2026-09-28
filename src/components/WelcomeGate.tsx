"use client"

import { hasSeenWelcome, markWelcome } from "@/lib/storage"
import { useEffect, useState } from "react"

export function WelcomeGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [ok, setOk] = useState(false)

  useEffect(() => {
    setOk(hasSeenWelcome())
    setReady(true)
  }, [])

  if (!ready) return <main className="welcome" aria-busy="true" />

  if (!ok) {
    return (
      <main className="welcome">
        <div className="welcome-stack">
          <div className="welcome-sheet">
            <div className="welcome-deed">
              <div className="welcome-left">
                <p className="eyebrow">Welcome to</p>
                <h1 className="welcome-title">ConDraft</h1>
                <p className="welcome-tag">Your contract / agreement drafter for all your needs</p>
                <button
                  type="button"
                  className="btn welcome-next"
                  onClick={() => {
                    markWelcome()
                    setOk(true)
                  }}
                >
                  Next <span aria-hidden="true">→</span>
                </button>
              </div>
              <div className="welcome-right">
                <h2>How it works</h2>
                <ul className="welcome-items">
                  <li>
                    <span className="welcome-ic" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 5h16v11H9l-5 4z" />
                        <path d="M8 9.5h8M8 12.5h5" />
                      </svg>
                    </span>
                    <div>
                      <b>Answer simple questions</b>
                      <span>Each one explained in plain English on the side.</span>
                    </div>
                  </li>
                  <li>
                    <span className="welcome-ic" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3v18M5 21h14M4 7h16" />
                        <path d="M7 7l-3 7a3 3 0 006 0zM17 7l-3 7a3 3 0 006 0z" />
                      </svg>
                    </span>
                    <div>
                      <b>Grounded in real law</b>
                      <span>Clauses cite the relevant and stated Acts from actual legal code.</span>
                    </div>
                  </li>
                  <li>
                    <span className="welcome-ic" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 3h8l4 4v14H6z" />
                        <path d="M14 3v4h4M12 11v6M9.5 14.5L12 17l2.5-2.5" />
                      </svg>
                    </span>
                    <div>
                      <b>Download your PDF</b>
                      <span>A clean, print-ready agreement in deed format.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <p className="welcome-india">Available for India as of now</p>
      </main>
    )
  }

  return <>{children}</>
}
