"use client"

import { FormalPaper } from "@/components/FormalPaper"
import { LocationSearch } from "@/components/LocationSearch"
import { Shell } from "@/components/Shell"
import { citationById, citations } from "@/data/citations"
import { stateInfo } from "@/data/states"
import { termEnd } from "@/lib/assemble"
import { DISCLAIMER_BODY } from "@/lib/disclaimer"
import { assembleInterview } from "@/lib/interview"
import { downloadElementPdf } from "@/lib/pdf"
import { saveDraft } from "@/lib/storage"
import type { RentAnswers, SavedDraft, Tone } from "@/types"
import { useEffect, useMemo, useState } from "react"

const empty: RentAnswers = {
  landlordName: "",
  landlordAddress: "",
  tenantName: "",
  tenantAddress: "",
  propertyAddress: "",
  city: "",
  state: "Maharashtra",
  rent: "",
  deposit: "",
  rentDueDay: "5",
  startDate: "",
  durationMonths: "11",
  lockInMonths: "0",
  furnished: false,
  petsAllowed: false,
  noticeDays: "30",
  depositRefundDays: "30",
  maintenanceBy: "shared",
  stampDutyAmount: "",
  stampInstrument: "to-be-arranged",
  tone: "balanced",
}

export function RentClient({ initial }: { initial?: RentAnswers }) {
  const [form, setForm] = useState<RentAnswers>(initial ?? empty)
  const [citeId, setCiteId] = useState<string | null>("reg-17")
  const [draftName, setDraftName] = useState("Residence leave & licence")
  const [pdfOpen, setPdfOpen] = useState(false)
  const [pdfOk, setPdfOk] = useState(false)
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState("")

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("condraft-open")
      if (!raw) return
      const draft = JSON.parse(raw) as SavedDraft
      if (draft.kind === "rent" && draft.rent) {
        setForm({ ...empty, ...draft.rent })
        setDraftName(draft.name)
      }
      sessionStorage.removeItem("condraft-open")
    } catch {
      /* ignore */
    }
  }, [])

  const doc = useMemo(
    () =>
      assembleInterview("rent", {
        partyAName: form.landlordName,
        partyAAddress: form.landlordAddress,
        partyBName: form.tenantName,
        partyBAddress: form.tenantAddress,
        city: form.city,
        state: form.state,
        propertyAddress: form.propertyAddress,
        rent: form.rent,
        deposit: form.deposit,
        rentDueDay: form.rentDueDay,
        startDate: form.startDate,
        durationMonths: form.durationMonths,
        lockInMonths: form.lockInMonths,
        furnished: form.furnished ? "yes" : "no",
        petsAllowed: form.petsAllowed ? "yes" : "no",
        noticeDays: form.noticeDays,
        depositRefundDays: form.depositRefundDays,
        maintenanceBy: form.maintenanceBy,
        stampDutyAmount: form.stampDutyAmount,
        stampInstrument: form.stampInstrument,
        tone: form.tone,
      }),
    [form],
  )
  const cite = citeId ? citationById(citeId) : null
  const st = stateInfo(form.state)
  const end = termEnd(form.startDate, form.durationMonths || "11")

  function set<K extends keyof RentAnswers>(key: K, value: RentAnswers[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function confirmPdf() {
    const el = document.getElementById("contract-paper")
    if (!el) return
    setBusy(true)
    try {
      await downloadElementPdf(el, "condraft-leave-licence.pdf")
      setPdfOpen(false)
      setPdfOk(false)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Shell>
      <div className="workspace">
        <form className="panel" onSubmit={(e) => e.preventDefault()}>
          <p className="eyebrow">Live template</p>
          <h1>Residential leave &amp; licence</h1>
          <p className="lede">
            India only. Fill the form; the paper on the right updates. You choose the duration — it is not assumed to be
            11 months.
          </p>

          <label>
            Wording
            <select value={form.tone} onChange={(e) => set("tone", e.target.value as Tone)}>
              <option value="strict">Strict (more protection for the licensor)</option>
              <option value="balanced">Balanced</option>
              <option value="lenient">Lenient (more protection for the occupant)</option>
            </select>
          </label>

          <fieldset>
            <legend>Parties</legend>
            <label>
              Licensor (owner) name
              <input value={form.landlordName} onChange={(e) => set("landlordName", e.target.value)} />
            </label>
            <label>
              Licensor address
              <input value={form.landlordAddress} onChange={(e) => set("landlordAddress", e.target.value)} />
            </label>
            <label>
              Licensee (occupant) name
              <input value={form.tenantName} onChange={(e) => set("tenantName", e.target.value)} />
            </label>
            <label>
              Licensee address
              <input value={form.tenantAddress} onChange={(e) => set("tenantAddress", e.target.value)} />
            </label>
          </fieldset>

          <fieldset>
            <legend>Premises</legend>
            <label>
              Property address
              <input value={form.propertyAddress} onChange={(e) => set("propertyAddress", e.target.value)} />
            </label>
            <p className="hint">City and State</p>
            <LocationSearch
              city={form.city}
              state={form.state}
              onPick={(city, state) => setForm((f) => ({ ...f, city: city || f.city, state }))}
            />
            <label className="inline">
              <input type="checkbox" checked={form.furnished} onChange={(e) => set("furnished", e.target.checked)} />
              Furnished
            </label>
            <label className="inline">
              <input type="checkbox" checked={form.petsAllowed} onChange={(e) => set("petsAllowed", e.target.checked)} />
              Pets allowed
            </label>
          </fieldset>

          <fieldset>
            <legend>Money and term</legend>
            <label>
              Monthly licence fee (₹)
              <input value={form.rent} onChange={(e) => set("rent", e.target.value)} />
            </label>
            <label>
              Security deposit (₹)
              <input value={form.deposit} onChange={(e) => set("deposit", e.target.value)} />
            </label>
            <label>
              Fee due on day
              <input value={form.rentDueDay} onChange={(e) => set("rentDueDay", e.target.value)} />
            </label>
            <label>
              Start date
              <input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
            </label>
            <label>
              Duration (months)
              <input value={form.durationMonths} onChange={(e) => set("durationMonths", e.target.value)} />
            </label>
            {end ? <p className="hint">End date: {end}</p> : null}
            <label>
              Lock-in (months, 0 if none)
              <input value={form.lockInMonths} onChange={(e) => set("lockInMonths", e.target.value)} />
            </label>
            <label>
              Notice (days)
              <input value={form.noticeDays} onChange={(e) => set("noticeDays", e.target.value)} />
            </label>
            <label>
              Deposit refund (days after handover)
              <input value={form.depositRefundDays} onChange={(e) => set("depositRefundDays", e.target.value)} />
            </label>
            <label>
              Maintenance
              <select
                value={form.maintenanceBy}
                onChange={(e) => set("maintenanceBy", e.target.value as RentAnswers["maintenanceBy"])}
              >
                <option value="landlord">Owner pays society maintenance</option>
                <option value="tenant">Occupant pays society maintenance</option>
                <option value="shared">Shared / to be agreed</option>
              </select>
            </label>
          </fieldset>

          <fieldset className="stamp-box">
            <legend>Stamp duty — you look it up</legend>
            <p className="hint">
              ConDraft does not know today&apos;s rate for {form.state} and will not guess it. Open the official portal,
              read the current schedule, then type the amount you will actually pay (or leave it blank to fill on the
              paper). Paying less than the law requires is not something this tool helps with.
            </p>
            {st ? (
              <p className="hint">
                <a href={st.lookupUrl} target="_blank" rel="noreferrer">
                  {st.lookupLabel}
                </a>
                {st.extraNote ? ` — ${st.extraNote}` : null}
              </p>
            ) : null}
            <label>
              Stamp / e-stamp amount you will pay (₹), optional
              <input
                value={form.stampDutyAmount}
                onChange={(e) => set("stampDutyAmount", e.target.value)}
                placeholder="Leave blank if you have not checked yet"
              />
            </label>
            <label>
              How you will stamp
              <select
                value={form.stampInstrument}
                onChange={(e) => set("stampInstrument", e.target.value as RentAnswers["stampInstrument"])}
              >
                <option value="to-be-arranged">Not arranged yet</option>
                <option value="stamp-paper">Non-judicial stamp paper</option>
                <option value="e-stamp">e-Stamp</option>
              </select>
            </label>
          </fieldset>

          <label>
            Save draft as
            <input value={draftName} onChange={(e) => setDraftName(e.target.value)} />
          </label>
          <div className="row">
            <button
              type="button"
              className="btn secondary"
              onClick={() => {
                saveDraft({
                  id: crypto.randomUUID(),
                  name: draftName || "Untitled rent draft",
                  kind: "rent",
                  updatedAt: new Date().toISOString(),
                  rent: form,
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
        </form>

        <div className="preview-col">
          <FormalPaper doc={doc} onCite={setCiteId} activeId={citeId} />
          {cite ? (
            <aside className="cite-card">
              <p className="eyebrow">Citation</p>
              <h2>
                {cite.act}, s. {cite.section}
              </h2>
              <p>{cite.summary}</p>
              <p>
                <a href={cite.sourceUrl} target="_blank" rel="noreferrer">
                  Open official text on India Code
                </a>
              </p>
              <p className="hint">Last checked {cite.lastChecked}. Always re-read the live Act; it can be amended.</p>
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
              <span>
                I understand this PDF is a reference draft. I will not stamp, register, or sign it as a finished legal
                document without an advocate&apos;s review. Stamp duty and registration remain my responsibility under
                the law of {form.state || "the relevant State"}.
              </span>
            </label>
            <div className="row">
              <button type="button" className="btn secondary" onClick={() => setPdfOpen(false)}>
                Cancel
              </button>
              <button type="button" className="btn" disabled={!pdfOk || busy} onClick={confirmPdf}>
                {busy ? "Preparing…" : "Download PDF"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <p className="sr-only">{citations.length} citations in library</p>
    </Shell>
  )
}
