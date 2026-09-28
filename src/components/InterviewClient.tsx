"use client"

import { FormalPaper } from "@/components/FormalPaper"
import { LocationSearch } from "@/components/LocationSearch"
import { Shell } from "@/components/Shell"
import { citationById } from "@/data/citations"
import { STEPS, stepsFor, type StepDef, type StepHelp } from "@/data/steps"
import { stateInfo } from "@/data/states"
import { DISCLAIMER_BODY } from "@/lib/disclaimer"
import { assembleInterview, type InterviewMap } from "@/lib/interview"
import { KIND_GROUPS, KIND_INFO, KIND_LABEL, KIND_ROLES, type ContractKind } from "@/lib/kinds"
import { downloadElementPdf } from "@/lib/pdf"
import { estimateStamp } from "@/lib/stamp"
import { saveDraft } from "@/lib/storage"
import type { SavedDraft } from "@/types"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"

const empty: InterviewMap = {
  kind: "",
  draftingFor: "balanced",
  tone: "balanced",
  state: "Maharashtra",
  city: "",
  furnished: "no",
  petsAllowed: "no",
  rentDueDay: "5",
  noticeDays: "30",
  depositRefundDays: "30",
  durationMonths: "11",
  lockInMonths: "0",
  maintenanceBy: "shared",
  stampInstrument: "to-be-arranged",
  ipOwner: "client",
  interest: "0",
  wantLiquidated: "no",
  arbitration: "no",
  prepay: "yes",
  rollover: "no",
  titlePass: "payment",
  mouBinding: "no",
}

const genericKindHelp: StepHelp = KIND_INFO.rent
  ? {
      means: "Pick the type that matches the real deal. Each type has its own clauses and citations.",
      why: "Wrong type means the wrong law on the page — a loan paper will not help you occupy a flat.",
      does: "Unlocks the rest of the questions. Tap a type to read what it means on this panel.",
    }
  : { means: "", why: "", does: "" }

function Field({
  step,
  map,
  setMap,
  kindFilter,
  setKindFilter,
}: {
  step: StepDef
  map: InterviewMap
  setMap: (m: InterviewMap) => void
  kindFilter: string
  setKindFilter: (s: string) => void
}) {
  const value = map[step.id] || ""
  const onChange = (v: string) => setMap({ ...map, [step.id]: v })

  if (step.input === "kind") {
    const q = kindFilter.toLowerCase()
    return (
      <div>
        <input
          className="kind-search"
          placeholder="Search agreement type"
          value={kindFilter}
          onChange={(e) => setKindFilter(e.target.value)}
        />
        {KIND_GROUPS.map((group) => {
          const shown = group.kinds.filter((id) => {
            const info = KIND_INFO[id]
            if (!q) return true
            return (
              info.label.toLowerCase().includes(q) ||
              info.blurb.toLowerCase().includes(q) ||
              info.group.toLowerCase().includes(q)
            )
          })
          if (shown.length === 0) return null
          return (
            <div key={group.id} className="kind-group">
              <p className="eyebrow">{group.label}</p>
              <div className="choice-grid">
                {shown.map((id) => (
                  <button
                    key={id}
                    type="button"
                    className={map.kind === id ? "choice is-on" : "choice"}
                    onClick={() => setMap({ ...map, kind: id })}
                  >
                    <strong>{KIND_INFO[id].label}</strong>
                    <span className="choice-sub">{KIND_INFO[id].blurb}</span>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
  if (step.input === "side") {
    const kind = (map.kind as ContractKind) || "rent"
    const [a, b] = KIND_ROLES[kind] ?? ["First party", "Second party"]
    return (
      <div className="choice-grid">
        {(
          [
            ["partyA", `I am the ${a}`],
            ["partyB", `I am the ${b}`],
            ["balanced", "Keep it fair to both"],
          ] as const
        ).map(([id, label]) => (
          <button key={id} type="button" className={value === id ? "choice is-on" : "choice"} onClick={() => onChange(id)}>
            {label}
          </button>
        ))}
      </div>
    )
  }
  if (step.input === "location") {
    const st = stateInfo(map.state)
    return (
      <div>
        <LocationSearch
          city={map.city || ""}
          state={map.state || ""}
          onPick={(city, state) => setMap({ ...map, city, state })}
        />
        {st ? (
          <p className="hint">
            Official stamp / registration:{" "}
            <a href={st.lookupUrl} target="_blank" rel="noreferrer">
              {st.lookupLabel}
            </a>
            . {st.extraNote}
          </p>
        ) : null}
      </div>
    )
  }
  if (step.input === "yesno") {
    return (
      <div className="row">
        {["yes", "no"].map((v) => (
          <button key={v} type="button" className={value === v ? "choice is-on" : "choice"} onClick={() => onChange(v)}>
            {v === "yes" ? "Yes" : "No"}
          </button>
        ))}
      </div>
    )
  }
  if (step.input === "select") {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {(step.options ?? []).map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    )
  }
  if (step.input === "date") {
    return <input type="date" value={value} onChange={(e) => onChange(e.target.value)} />
  }
  if (step.input === "textarea") {
    return <textarea rows={4} value={value} placeholder={step.placeholder} onChange={(e) => onChange(e.target.value)} />
  }
  return <input value={value} placeholder={step.placeholder} onChange={(e) => onChange(e.target.value)} />
}

function HelpPanel({ help, title }: { help: StepHelp; title?: string }) {
  return (
    <aside className="help-card">
      <p className="eyebrow">In plain English</p>
      {title ? <p className="help-kicker">{title}</p> : null}
      <h2>What this means</h2>
      <p>{help.means}</p>
      <h2>Why we ask</h2>
      <p>{help.why}</p>
      <h2>What it will do</h2>
      <p>{help.does}</p>
    </aside>
  )
}

export function InterviewClient() {
  const [map, setMap] = useState<InterviewMap>(empty)
  const [i, setI] = useState(0)
  const [review, setReview] = useState(false)
  const [citeId, setCiteId] = useState<string | null>(null)
  const [pdfOpen, setPdfOpen] = useState(false)
  const [pdfOk, setPdfOk] = useState(false)
  const [kindFilter, setKindFilter] = useState("")
  const [draftId, setDraftId] = useState("")
  const [savedAt, setSavedAt] = useState("")
  const [savedWhere, setSavedWhere] = useState<"account" | "none" | "">("")
  const [email, setEmail] = useState<string | null>(null)
  const params = useSearchParams()

  const kind = (map.kind as ContractKind) || ""
  const queue = stepsFor(kind, map)
  const step = queue[Math.min(i, queue.length - 1)] ?? STEPS[0]
  const atLast = i >= queue.length - 1 && Boolean(kind)

  const doc = useMemo(() => (kind ? assembleInterview(kind, map) : null), [kind, map])
  const estimate = estimateStamp(kind, map)

  const help: StepHelp =
    step.id === "kind" && kind ? { means: KIND_INFO[kind].means, why: KIND_INFO[kind].why, does: KIND_INFO[kind].does } : step.help || genericKindHelp

  const question =
    step.id === "sideExtra" && kind
      ? `Anything extra to protect the ${map.draftingFor === "partyB" ? KIND_ROLES[kind][1] : KIND_ROLES[kind][0]}?`
      : step.question

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((u: { email?: string } | null) => setEmail(u?.email ?? null))
      .catch(() => setEmail(null))
  }, [])

  useEffect(() => {
    setDraftId((id) => id || crypto.randomUUID())
  }, [])

  useEffect(() => {
    const raw = sessionStorage.getItem("condraft-open")
    if (raw) {
      sessionStorage.removeItem("condraft-open")
      const draft = JSON.parse(raw) as SavedDraft
      if (draft.kind === "interview" && draft.interview) {
        setDraftId(draft.id)
        setMap({ ...empty, ...draft.interview.map })
        setI(draft.interview.step)
        return
      }
    }
    const k = params.get("kind")
    if (k && k in KIND_INFO) {
      setMap((m) => ({ ...m, kind: k }))
      setI(1)
    }
  }, [params])

  const persist = useCallback(
    async (status: "draft" | "completed" = "draft") => {
      if (!kind || !draftId) return "none" as const
      const party = map.partyBName || map.partyAName
      const where = await saveDraft({
        id: draftId,
        name: `${KIND_LABEL[kind]}${party ? ` · ${party}` : ""}`,
        kind: "interview",
        status,
        updatedAt: new Date().toISOString(),
        interview: { map, step: i },
      })
      setSavedAt(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }))
      setSavedWhere(where)
      return where
    },
    [draftId, i, kind, map],
  )

  useEffect(() => {
    if (kind && i > 0) void persist()
    // Autosave when moving between questions, not on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, review])

  const saveMsg =
    savedWhere === "account" ? (
      <p className="save-banner is-ok">Saved to your account{savedAt ? ` · ${savedAt}` : ""}.</p>
    ) : kind && email === null ? (
      <p className="save-banner">
        Not saved. <Link href="/account">Sign in to save this draft to your account</Link>. Without an account it is
        gone when you leave.
      </p>
    ) : savedWhere === "none" ? (
      <p className="save-banner">
        Could not save. <Link href="/account">Sign in</Link> — drafts are stored only on the signed-in account.
      </p>
    ) : savedAt ? (
      <p className="save-banner is-ok">Draft saved {savedAt}.</p>
    ) : null

  return (
    <Shell>
      {!review || !doc ? (
        <main className="hub step-wrap">
          <p className="eyebrow">
            From the start
            {savedWhere === "account" ? <span className="saved-pill">On your account</span> : null}
          </p>
          <p className="hint">
            {kind ? `${i + 1} of ${queue.length}` : "Start"}
            {kind ? ` · ${KIND_LABEL[kind]}` : ""}
          </p>
          <div className="progress" aria-hidden="true">
            <span style={{ width: kind ? `${((i + 1) / queue.length) * 100}%` : "8%" }} />
          </div>
          <div className="step-layout">
            <div>
              <h1>{question}</h1>
              {step.hint ? <p className="lede">{step.hint}</p> : null}
              <div className="step-field">
                <Field step={step} map={map} setMap={setMap} kindFilter={kindFilter} setKindFilter={setKindFilter} />
                {step.id === "stampDutyAmount" ? (
                  estimate ? (
                    <div className="stamp-estimate">
                      <strong>Estimated duty: ₹{estimate.amount.toLocaleString("en-IN")}</strong>
                      <p>{estimate.workings}</p>
                      <p className="hint">{estimate.source} Confirm on the IGR calculator before paying.</p>
                      <button
                        type="button"
                        className="btn secondary"
                        onClick={() => setMap({ ...map, stampDutyAmount: String(estimate.amount) })}
                      >
                        Use this amount
                      </button>
                    </div>
                  ) : (
                    <p className="hint">
                      No verified formula for this contract in {map.state || "this State"} yet, so ConDraft will not guess.
                      Use{" "}
                      {stateInfo(map.state) ? (
                        <a href={stateInfo(map.state)!.lookupUrl} target="_blank" rel="noreferrer">
                          {stateInfo(map.state)!.lookupLabel}
                        </a>
                      ) : (
                        "the State portal"
                      )}
                      .
                    </p>
                  )
                ) : null}
              </div>
              <div className="row">
                <button
                  type="button"
                  className="btn secondary"
                  disabled={i === 0}
                  onClick={() => {
                    setReview(false)
                    setI((n) => Math.max(0, n - 1))
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn"
                  disabled={step.id === "kind" && !kind}
                  onClick={() => (atLast ? setReview(true) : setI((n) => n + 1))}
                >
                  {atLast ? "Cite and show draft" : "Next"}
                </button>
                {kind ? (
                  <button
                    type="button"
                    className="btn ghost"
                    onClick={async () => {
                      await persist()
                    }}
                  >
                    Save draft
                  </button>
                ) : null}
              </div>
              {saveMsg}
            </div>
            <HelpPanel help={help} title={step.id === "kind" && kind ? KIND_LABEL[kind] : undefined} />
          </div>
        </main>
      ) : (
        <div className="workspace">
          <aside className="panel">
            <p className="eyebrow">Before you use this in real life</p>
            <h1>Recommendations</h1>
            <ol className="tips">
              {doc.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
            <div className="row">
              <button type="button" className="btn secondary" onClick={() => setReview(false)}>
                Back to questions
              </button>
              <button type="button" className="btn secondary" onClick={() => void persist()}>
                Save draft
              </button>
              <button type="button" className="btn" onClick={() => setPdfOpen(true)}>
                Download PDF
              </button>
            </div>
            {saveMsg}
          </aside>
          <div className="preview-col">
            <FormalPaper doc={doc} onCite={setCiteId} activeId={citeId} />
            {citeId && citationById(citeId) ? (
              <aside className="cite-card">
                <h2>
                  {citationById(citeId)!.act}, s. {citationById(citeId)!.section}
                </h2>
                <p>{citationById(citeId)!.summary}</p>
                <a href={citationById(citeId)!.sourceUrl} target="_blank" rel="noreferrer">
                  Official text on India Code
                </a>
              </aside>
            ) : null}
          </div>
        </div>
      )}

      {pdfOpen ? (
        <div className="modal" role="dialog">
          <div className="gate-card">
            <h2>Confirm before download</h2>
            <p className="gate-copy">{DISCLAIMER_BODY}</p>
            <label className="check">
              <input type="checkbox" checked={pdfOk} onChange={(e) => setPdfOk(e.target.checked)} />
              <span>I will not stamp, register, or sign this without an advocate reviewing it.</span>
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
                  await persist("completed")
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
