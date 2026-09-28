"use client"

import { KIND_GROUPS, KIND_INFO } from "@/lib/kinds"
import Link from "next/link"

/** Page body only — the real nav lives in the root layout. */
export function Shell({ children }: { children: React.ReactNode }) {
  return <div className="shell-body">{children}</div>
}

export function TemplateGrid() {
  return (
    <div className="template-groups">
      {KIND_GROUPS.map((g) => (
        <section key={g.id}>
          <h2 className="section-title">{g.label}</h2>
          <div className="cards template-cards">
            {g.kinds.map((id) => (
              <Link key={id} href={`/steps?kind=${id}`} className="card">
                <p className="eyebrow">{g.label}</p>
                <h2>{KIND_INFO[id].label}</h2>
                <p>{KIND_INFO[id].blurb}</p>
                <span className="card-cta">Start this draft →</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
