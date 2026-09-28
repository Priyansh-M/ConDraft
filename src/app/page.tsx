import { DisclaimerGate } from "@/components/DisclaimerGate"
import { DraftList } from "@/components/DraftList"
import { Shell } from "@/components/Shell"
import { KIND_GROUPS, KIND_LABEL } from "@/lib/kinds"
import Link from "next/link"

export default function Home() {
  return (
    <DisclaimerGate>
      <Shell>
        <main className="hub">
          <section className="hero">
            <p className="eyebrow">India · deed-format · India Code citations</p>
            <h1>Draft an agreement, one question at a time.</h1>
            <p className="lede">
              Pick a contract type, answer plain questions, and get a stamp-ready deed with recitals, witnesses and
              statute footnotes.
            </p>
          </section>

          <section className="home-drafts">
            <div className="section-head">
              <h2 className="section-title">Continue where you left off</h2>
              <Link href="/drafts">All drafts</Link>
            </div>
            <DraftList filter="draft" limit={4} empty="No drafts on this account. Sign in to save; unsigned work is not kept." />
          </section>

          <div className="cards">
            <Link href="/steps" className="card featured">
              <p className="eyebrow">Recommended</p>
              <h2>From the start</h2>
              <p>
                Choose from {Object.keys(KIND_LABEL).length} agreement types, then answer each fact one by one. The
                panel on the right explains every question in plain English.
              </p>
              <ul className="kind-chips">
                {KIND_GROUPS.map((g) => (
                  <li key={g.id}>
                    {g.label} · {g.kinds.length}
                  </li>
                ))}
              </ul>
              <span className="card-cta">Start drafting →</span>
            </Link>
            <Link href="/blank" className="card">
              <p className="eyebrow">Advanced</p>
              <h2>Blank builder</h2>
              <p>Write your own clauses and attach citations from the India Code library.</p>
              <span className="card-cta">Open builder →</span>
            </Link>
          </div>

          <section className="home-drafts">
            <h2 className="section-title">Completed contracts</h2>
            <DraftList filter="completed" limit={6} empty="Downloaded contracts are kept here." />
          </section>
        </main>
      </Shell>
    </DisclaimerGate>
  )
}
