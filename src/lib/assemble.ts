import { stateInfo } from "@/data/states"
import type { AssembledClause, RentAnswers, Tone } from "@/types"

export function rupees(value: string) {
  const raw = String(value).replace(/,/g, "").trim()
  if (!raw) return "[amount]"
  const n = Number(raw)
  if (!Number.isFinite(n) || n < 0) return "[amount]"
  return `₹${n.toLocaleString("en-IN")}`
}

export function formatDate(iso: string) {
  if (!iso) return "[start date]"
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
}

export function monthsFrom(raw: string, fallback = 11) {
  const n = Math.round(Number(String(raw).replace(/[^\d.]/g, "")))
  return Number.isFinite(n) && n > 0 ? n : fallback
}

export function termEnd(iso: string, monthsRaw: string, fallback = 11) {
  if (!iso) return ""
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return ""
  d.setMonth(d.getMonth() + monthsFrom(monthsRaw, fallback))
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

export function elevenMonthEnd(iso: string) {
  return termEnd(iso, "11")
}

function depositClause(tone: Tone, a: RentAnswers) {
  const amount = rupees(a.deposit)
  const days = a.depositRefundDays || "30"
  if (tone === "strict") {
    return `The Licensee shall pay an interest-free security deposit of ${amount} on or before the start date. The Licensor may deduct unpaid licence fee, electricity, water, damages beyond ordinary wear, and other sums due under this agreement. The balance, if any, shall be refunded within ${days} days of vacant handover of the keys and premises, subject to production of paid utility bills.`
  }
  if (tone === "lenient") {
    return `The Licensee shall pay an interest-free security deposit of ${amount}. The deposit shall be refunded in full within ${days} days of the Licensee handing over vacant possession, except for a written and itemised deduction for damage beyond ordinary wear and tear.`
  }
  return `The Licensee shall pay an interest-free security deposit of ${amount}. The Licensor may deduct only documented arrears of licence fee, unpaid utilities in the Licensee's name, and damage beyond ordinary wear and tear. The balance shall be refunded within ${days} days of vacant handover of the premises and keys.`
}

function noticeClause(tone: Tone, a: RentAnswers) {
  const days = a.noticeDays || "30"
  const lock = monthsFrom(a.lockInMonths || "0", 0)
  const lockLine =
    lock > 0
      ? ` During the first ${lock} month(s) (the lock-in), neither party shall terminate except for material breach.`
      : ""
  if (tone === "strict") {
    return `Either party may terminate this agreement by giving ${days} days' prior written notice.${lockLine} If the Licensee leaves without the required notice, the Licensee shall pay licence fee in lieu of the unexpired notice period. The Licensor may terminate with immediate effect for non-payment of licence fee for more than 15 days after it is due, or for unlawful use of the premises.`
  }
  if (tone === "lenient") {
    return `Either party may terminate this agreement by giving ${days} days' prior written notice.${lockLine} The parties shall cooperate in a joint inspection at handover.`
  }
  return `Either party may terminate this agreement by giving ${days} days' prior written notice.${lockLine} The Licensor may also terminate earlier if the licence fee remains unpaid for 15 days after the due date, after giving a further 7 days' written reminder.`
}

export function assembleRent(a: RentAnswers): { title: string; intro: string; clauses: AssembledClause[] } {
  const months = monthsFrom(a.durationMonths || "11")
  const start = formatDate(a.startDate)
  const end = formatDate(termEnd(a.startDate, a.durationMonths || "11"))
  const state = a.state || "[State]"
  const info = stateInfo(a.state)
  const stampLine = a.stampDutyAmount.trim()
    ? `The parties record that they will use stamp paper / e-stamp of ${rupees(a.stampDutyAmount)} as the amount they have themselves checked against the current official schedule for ${state}.`
    : `The parties shall pay stamp duty as applicable under the stamp law in force in ${state}. The exact rupee amount is left blank for the parties to fill after checking the current official schedule.`

  const instrument =
    a.stampInstrument === "e-stamp"
      ? "The duty is intended to be paid by e-stamp."
      : a.stampInstrument === "stamp-paper"
        ? "The duty is intended to be paid on non-judicial stamp paper."
        : "The parties will arrange the prescribed stamp paper or e-stamp before signing."

  return {
    title: `Leave and Licence Agreement (Residential, ${months} months)`,
    intro: `This Leave and Licence Agreement is made at ${a.city || "[city]"}, ${state}, on ${start}, BETWEEN ${a.landlordName || "[Licensor]"} of ${a.landlordAddress || "[licensor address]"} (the "Licensor") AND ${a.tenantName || "[Licensee]"} of ${a.tenantAddress || "[licensee address]"} (the "Licensee").`,
    clauses: [
      {
        id: "nature",
        heading: "1. Nature of this document",
        body: `The Licensor grants the Licensee a personal, non-transferable leave and licence to use the premises described below. This is not a lease intended to create an interest in immovable property beyond a licence to occupy for the term stated here.`,
        citationIds: ["tpa-105", "ica-10"],
        explanation:
          "Whether a court treats a document as a lease or a licence depends on the facts (exclusive possession, rent, term), not only the title ‘leave and licence’.",
      },
      {
        id: "premises",
        heading: "2. Premises",
        body: `The premises are: ${a.propertyAddress || "[full address of the flat / house]"}, ${a.city || "[city]"}, ${state}. The premises are licensed ${a.furnished ? "in a furnished condition, as inspected by the Licensee" : "unfurnished, except fixtures that form part of the building"}. Pets are ${a.petsAllowed ? "permitted, subject to society or building rules" : "not permitted"}.`,
        citationIds: ["tpa-105", "tpa-108"],
        explanation: "Identify the property clearly. Society bye-laws can still restrict pets, cooking, or sub-letting even if this paper allows them.",
      },
      {
        id: "term",
        heading: "3. Term",
        body: `The licence begins on ${start} and ends on ${end} (${months} month${months === 1 ? "" : "s"}, unless ended earlier under this agreement). It does not automatically renew. Any extension must be in a fresh writing signed by both parties.${
          months >= 12
            ? " The term is 12 months or more: Registration Act, 1908, section 17 generally requires registration of leases from year to year or exceeding one year."
            : " A term under 12 months is often chosen so Registration Act s. 17 (term exceeding one year) is not itself the reason for registration; State leave-and-licence rules can still require registration."
        }`,
        citationIds: ["reg-17", "tpa-105"],
        explanation:
          "Registration Act s. 17 generally requires registration of leases from year to year or for a term exceeding one year. Some States still require registration of leave-and-licence documents even under 12 months.",
      },
      {
        id: "fee",
        heading: "4. Licence fee",
        body: `The Licensee shall pay a monthly licence fee of ${rupees(a.rent)}, due on or before day ${a.rentDueDay || "5"} of each English calendar month, in Indian rupees, to the Licensor by bank transfer or UPI to an account nominated in writing.`,
        citationIds: ["ica-10", "tpa-105"],
        explanation: "The fee is the consideration that helps the arrangement look like a contract under the Contract Act.",
      },
      {
        id: "deposit",
        heading: "5. Security deposit",
        body: depositClause(a.tone, a),
        citationIds: ["ica-10", "ica-73"],
        explanation: "Deposit refund timing is contractual. There is no single all-India statute that fixes 30 or 60 days for private residential deposits.",
      },
      {
        id: "use",
        heading: "6. Use and upkeep",
        body: `The Licensee shall use the premises only as a private residence, keep them in a tenantable condition, and not assign, sub-licence, or part with possession without the Licensor's prior written consent. ${
          a.maintenanceBy === "landlord"
            ? "The Licensor shall bear society maintenance / building maintenance charges. The Licensee shall pay electricity, water, gas, and internet used at the premises."
            : a.maintenanceBy === "tenant"
              ? "The Licensee shall pay society maintenance / building maintenance charges together with electricity, water, gas, and internet used at the premises."
              : "Society maintenance shall be shared as the parties agree in writing. The Licensee shall pay electricity, water, gas, and internet used at the premises."
        }`,
        citationIds: ["tpa-108"],
        explanation: "TPA s. 108 sets default lessor/lessee duties if the contract is silent. Spell out maintenance so you are not relying on the default.",
      },
      {
        id: "notice",
        heading: "7. Termination and notice",
        body: noticeClause(a.tone, a),
        citationIds: ["tpa-106", "ica-73"],
        explanation: "If you fix notice in the contract, you are not relying on the TPA s. 106 default notice period.",
      },
      {
        id: "stamp",
        heading: "8. Stamp duty",
        body: `${stampLine} ${instrument} Stamp duty is a State subject in practice: rates and procedures differ by State and change. The parties—not this generator—must check the current official schedule for ${state}${info ? ` (${info.lookupLabel})` : ""} and pay the duty that is actually due. An inadequately stamped instrument may be inadmissible in evidence until duty and penalty are paid.`,
        citationIds: ["stamp-3", "stamp-35"],
        explanation:
          "You look up your State's current rate on the official portal. Maharashtra leave-and-licence may show a verified estimate you can accept; other States are not auto-calculated.",
      },
      {
        id: "registration",
        heading: "9. Registration",
        body: `The parties have chosen a term of ${months} month${months === 1 ? "" : "s"}. That does not decide every State requirement. ${
          info?.extraNote ?? "If local law or the registering authority requires this document to be registered, the parties shall register it at their cost."
        } An unregistered document that was required to be registered may be useless as evidence of a transaction in immovable property.`,
        citationIds: ["reg-17", "reg-49"],
        explanation: "A short term is not a universal exemption from registration. Maharashtra is a common example where leave-and-licence registration is still expected.",
      },
      {
        id: "law",
        heading: "10. Governing law",
        body: `This agreement is governed by the laws of India. Subject to any mandatory special court or forum, courts at ${a.city || "[city]"}, ${state} shall have jurisdiction.`,
        citationIds: ["ica-10", "ica-23"],
        explanation: "Jurisdiction clauses cannot always override exclusive statutory forums, but naming a city is still useful.",
      },
    ],
  }
}
