"use client"

import { FormalPaper } from "@/components/FormalPaper"
import { Shell } from "@/components/Shell"
import { citationById, citations } from "@/data/citations"
import { DISCLAIMER_BODY } from "@/lib/disclaimer"
import { downloadElementPdf } from "@/lib/pdf"
import { saveDraft } from "@/lib/storage"
import type { BlankDoc, FormalDoc, SavedDraft } from "@/types"
import { useEffect, useMemo, useState } from "react"

const empty: BlankDoc = {
  title: "Agreement",
  partyA: "",
  partyB: "",
  clauses: [{ heading: "1. ", body: "", citationIds: [] }],
}

export function BlankClient({ initial }: { initial?: BlankDoc }) {
  const [doc, setDoc] = useState<BlankDoc>(initial ?? empty)
  const [citeId, setCiteId] = useState<string | null>(citations[0]?.id ?? null)
  const [name, setName] = useState("Blank agreement")
  const [pdfOpen, setPdfOpen] = useState(false)
  const [pdfOk, setPdfOk] = useState(false)
  const [saved, setSaved] = useState("")

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("condraft-open")
      if (!raw) return
      const draft = JSON.parse(raw) as SavedDraft
      if (draft.kind === "blank" && draft.blank) {
        setDoc(draft.blank)
        setName(draft.name)
      }
      sessionStorage.removeItem("condraft-open")
    } catch {
      /* ignore */
    }
  }, [])

  const assembled = useMemo(
    () =>
      doc.clauses.map((c, i) => ({
        id: `c-${i}`,
        heading: c.heading || `Clause ${i + 1}`,
        body: c.body,
        citationIds: c.citationIds,
        explanation: "",
      })),
    [doc],
  )

  const formal: FormalDoc = {
    title: doc.title.toUpperCase(),
    place: "[place]",
    date: "[date]",
    parties: [
      { capacity: "First Party", name: doc.partyA, parent: "", age: "", address: "" },
      { capacity: "Second Party", name: doc.partyB, parent: "", age: "", address: "" },
    ],
    recitals: ["The parties wish to record the terms set out below."],
    clauses: assembled,
    tips: [],
    stampLine: "Stamp duty as applicable shall be paid by the parties after checking the official State schedule.",
    stateNote: "",
    roleA: "First Party",
    roleB: "Second Party",
  }

  return (
    <Shell>
      <div className="workspace">
        <form className="panel" onSubmit={(e) => e.preventDefault()}>
          <p className="eyebrow">Blank builder</p>
          <h1>Any kind of contract</h1>
          <p className="lede">
            Add your own clauses and attach citations from the India Code library. Nothing here invents a section number.
          </p>
          <label>
            Title
            <input value={doc.title} onChange={(e) => setDoc({ ...doc, title: e.target.value })} />
          </label>
          <label>
            Party A
            <input value={doc.partyA} onChange={(e) => setDoc({ ...doc, partyA: e.target.value })} />
          </label>
          <label>
            Party B
            <input value={doc.partyB} onChange={(e) => setDoc({ ...doc, partyB: e.target.value })} />
          </label>
          {doc.clauses.map((clause, i) => (
            <fieldset key={i}>
              <legend>Clause {i + 1}</legend>
              <label>
                Heading
                <input
                  value={clause.heading}
                  onChange={(e) => {
                    const clauses = [...doc.clauses]
                    clauses[i] = { ...clause, heading: e.target.value }
                    setDoc({ ...doc, clauses })
                  }}
                />
              </label>
              <label>
                Text
                <textarea
                  rows={4}
                  value={clause.body}
                  onChange={(e) => {
                    const clauses = [...doc.clauses]
                    clauses[i] = { ...clause, body: e.target.value }
                    setDoc({ ...doc, clauses })
                  }}
                />
              </label>
              <label>
                Citations
                <select
                  multiple
                  value={clause.citationIds}
                  onChange={(e) => {
                    const selected = [...e.target.selectedOptions].map((o) => o.value)
                    const clauses = [...doc.clauses]
                    clauses[i] = { ...clause, citationIds: selected }
                    setDoc({ ...doc, clauses })
                  }}
                >
                  {citations.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.short} — {c.act}
                    </option>
                  ))}
                </select>
              </label>
            </fieldset>
          ))}
          <div className="row">
            <button
              type="button"
              className="btn secondary"
              onClick={() =>
                setDoc({
                  ...doc,
                  clauses: [...doc.clauses, { heading: `${doc.clauses.length + 1}. `, body: "", citationIds: [] }],
                })
              }
            >
              Add clause
            </button>
            <button
              type="button"
              className="btn secondary"
              onClick={() => {
                saveDraft({
                  id: crypto.randomUUID(),
                  name,
                  kind: "blank",
                  updatedAt: new Date().toISOString(),
                  blank: doc,
                }).then((where) =>
                  setSaved(
                    where === "account"
                      ? "Saved to your account."
                      : "Not saved. Sign in — drafts are stored only on the signed-in account.",
                  ),
                )
              }}
            >
              Save draft
            </button>
            <button type="button" className="btn" onClick={() => setPdfOpen(true)}>
              Download PDF
            </button>
          </div>
          {saved ? <p className="hint">{saved}</p> : null}
          <label>
            Draft name
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
        </form>
        <div className="preview-col">
            <FormalPaper doc={formal} onCite={setCiteId} activeId={citeId} />
          {citeId && citationById(citeId) ? (
            <aside className="cite-card">
              <h2>{citationById(citeId)!.short}</h2>
              <p>{citationById(citeId)!.summary}</p>
              <a href={citationById(citeId)!.sourceUrl} target="_blank" rel="noreferrer">
                Official text
              </a>
            </aside>
          ) : null}
        </div>
      </div>
      {pdfOpen ? (
        <div className="modal" role="dialog">
          <div className="gate-card">
            <h2>Confirm before download</h2>
            <p className="gate-copy">{DISCLAIMER_BODY}</p>
            <label className="check">
              <input type="checkbox" checked={pdfOk} onChange={(e) => setPdfOk(e.target.checked)} />
              <span>I will not use this PDF as a finished legal filing without an advocate&apos;s review.</span>
            </label>
            <div className="row">
              <button type="button" className="btn secondary" onClick={() => setPdfOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn"
                disabled={!pdfOk}
                onClick={async () => {
                  const el = document.getElementById("contract-paper")
                  if (el) await downloadElementPdf(el, "condraft-agreement.pdf")
                  setPdfOpen(false)
                  setPdfOk(false)
                }}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </Shell>
  )
}
