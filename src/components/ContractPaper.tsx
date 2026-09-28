"use client"

import { citationById } from "@/data/citations"
import type { AssembledClause } from "@/types"

type Props = {
  title: string
  intro?: string
  clauses: AssembledClause[]
  onCite?: (id: string) => void
  activeId?: string | null
}

export function ContractPaper({ title, intro, clauses, onCite, activeId }: Props) {
  const ids = [...new Set(clauses.flatMap((c) => c.citationIds))]

  return (
    <article id="contract-paper" className="paper">
      <p className="paper-kicker">India · reference draft · not legal advice</p>
      <h1 className="paper-title">{title}</h1>
      {intro ? <p className="paper-intro">{intro}</p> : null}
      {clauses.map((clause) => (
        <section key={clause.id} className="paper-clause">
          <h2>{clause.heading}</h2>
          <p>{clause.body}</p>
          <p className="paper-cites">
            {clause.citationIds.map((id, i) => {
              const c = citationById(id)
              if (!c) return null
              const n = ids.indexOf(id) + 1
              return (
                <button
                  key={`${clause.id}-${id}`}
                  type="button"
                  className={activeId === id ? "cite is-on" : "cite"}
                  onClick={() => onCite?.(id)}
                >
                  [{n}] {c.short}
                  {i < clause.citationIds.length - 1 ? " " : ""}
                </button>
              )
            })}
          </p>
        </section>
      ))}
      <ol className="footnotes">
        {ids.map((id, i) => {
          const c = citationById(id)
          if (!c) return null
          return (
            <li key={id}>
              <strong>
                [{i + 1}] {c.act}, s. {c.section}.
              </strong>{" "}
              {c.summary}{" "}
              <a href={c.sourceUrl} target="_blank" rel="noreferrer">
                Official text (India Code)
              </a>
              . Last checked {c.lastChecked}.
            </li>
          )
        })}
      </ol>
      <div className="signs">
        <div>
          <p>Licensor / First party</p>
          <span />
          <p>Name · Signature · Date · Place</p>
        </div>
        <div>
          <p>Licensee / Second party</p>
          <span />
          <p>Name · Signature · Date · Place</p>
        </div>
        <div>
          <p>Witness 1</p>
          <span />
          <p>Name · Signature · Date</p>
        </div>
        <div>
          <p>Witness 2</p>
          <span />
          <p>Name · Signature · Date</p>
        </div>
      </div>
    </article>
  )
}
