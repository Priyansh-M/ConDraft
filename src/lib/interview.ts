import { assembleRent, formatDate, rupees } from "@/lib/assemble"
import { KIND_ROLES, type ContractKind } from "@/lib/kinds"
import { stateInfo } from "@/data/states"
import { estimateStamp } from "@/lib/stamp"
import type { AssembledClause, FormalDoc, FormalParty, RentAnswers, Tone } from "@/types"

export type InterviewMap = Record<string, string>

function tone(map: InterviewMap): Tone {
  if (map.tone === "strict" || map.tone === "lenient") return map.tone
  return "balanced"
}

export function mapToRent(map: InterviewMap): RentAnswers {
  return {
    landlordName: map.partyAName || map.landlordName || "",
    landlordAddress: map.partyAAddress || map.landlordAddress || "",
    tenantName: map.partyBName || map.tenantName || "",
    tenantAddress: map.partyBAddress || map.tenantAddress || "",
    propertyAddress: map.propertyAddress || "",
    city: map.city || "",
    state: map.state || "Maharashtra",
    rent: map.rent || map.fee || "",
    deposit: map.deposit || "",
    rentDueDay: map.rentDueDay || "5",
    startDate: map.startDate || "",
    durationMonths: map.durationMonths || map.duration || "11",
    lockInMonths: map.lockInMonths || "0",
    furnished: map.furnished === "yes",
    petsAllowed: map.petsAllowed === "yes",
    noticeDays: map.noticeDays || "30",
    depositRefundDays: map.depositRefundDays || "30",
    maintenanceBy:
      map.maintenanceBy === "landlord" || map.maintenanceBy === "tenant" ? map.maintenanceBy : "shared",
    stampDutyAmount: map.stampDutyAmount || "",
    stampInstrument:
      map.stampInstrument === "stamp-paper" || map.stampInstrument === "e-stamp"
        ? map.stampInstrument
        : "to-be-arranged",
    tone: tone(map),
  }
}

function person(map: InterviewMap, which: "A" | "B", capacity: string): FormalParty {
  const nameKey = which === "A" ? ["partyAName", "landlordName"] : ["partyBName", "tenantName"]
  const addrKey = which === "A" ? ["partyAAddress", "landlordAddress"] : ["partyBAddress", "tenantAddress"]
  const name = nameKey.map((k) => map[k]).find(Boolean) || ""
  const address = addrKey.map((k) => map[k]).find(Boolean) || ""
  return {
    capacity,
    name,
    parent: map[`party${which}Parent`] || "",
    age: map[`party${which}Age`] || "",
    address,
  }
}

function stampLine(map: InterviewMap) {
  const state = map.state || "[State]"
  const info = stateInfo(state)
  const estimate = estimateStamp((map.kind as ContractKind) || "", map)
  const amount = map.stampDutyAmount?.trim()
    ? `The parties shall affix stamp / e-stamp of ${rupees(map.stampDutyAmount)} as themselves verified against the current official schedule of ${state}.`
    : estimate
      ? `Stamp duty estimated at ${rupees(String(estimate.amount))} under ${estimate.source.split(".")[0]}; the parties shall confirm the figure on the ${state} IGR calculator before payment.`
      : `Stamp duty, if chargeable in ${state}, shall be paid by the parties after checking the current official schedule.`
  return {
    state,
    info,
    line: `${amount} Instrument: ${map.stampInstrument === "e-stamp" ? "e-stamp" : map.stampInstrument === "stamp-paper" ? "non-judicial stamp paper" : "to be arranged before execution"}.`,
    note: info?.extraNote || "",
  }
}

function arbClause(map: InterviewMap): AssembledClause | null {
  if (map.arbitration !== "yes") return null
  return {
    id: "arb",
    heading: "Arbitration",
    body: `Any dispute arising out of this Agreement shall be referred to a sole arbitrator appointed jointly by the parties, or failing agreement within 30 days, as per the Arbitration and Conciliation Act, 1996. The seat shall be ${map.city || "[city]"}, ${map.state || "[State]"}. The language shall be English. Subject thereto, courts at ${map.city || "[city]"} shall have jurisdiction.`,
    citationIds: ["arb-7", "ica-10"],
    explanation: "Arbitration must be in writing (s. 7). It does not bar urgent court relief in every case.",
  }
}

function ldClause(map: InterviewMap): AssembledClause | null {
  if (map.wantLiquidated !== "yes") return null
  return {
    id: "ld",
    heading: "Named compensation on breach",
    body: `Without prejudice to other rights, if a party commits a material breach, the defaulting party shall pay ${rupees(map.liquidatedAmount)} as a genuine pre-estimate of loss. Under the Indian Contract Act, 1872, section 74, the court may award reasonable compensation not exceeding this named sum; this clause does not permit a penalty beyond what is reasonable, and a named sum is not required by law for the rest of this Agreement to be valid.`,
    citationIds: ["ica-74", "ica-73"],
    explanation: "Liquidated damages are optional. s. 74 caps recovery at reasonable compensation not exceeding the named figure.",
  }
}

function extraClauses(map: InterviewMap): AssembledClause[] {
  const out: AssembledClause[] = []
  if (map.sideExtra?.trim()) {
    out.push({
      id: "side-extra",
      heading: "Further protective terms",
      body: `At the instance of the party who requested this draft, the parties further agree: ${map.sideExtra.trim()}`,
      citationIds: ["ica-10"],
      explanation: "Extra lines asked when the draft is prepared for one side. Keep them lawful.",
    })
  }
  if (map.extras?.trim()) {
    out.push({
      id: "extras",
      heading: "Further terms",
      body: `The parties further agree as follows: ${map.extras.trim()}`,
      citationIds: ["ica-10"],
      explanation: "",
    })
  }
  return out
}

function wrap(
  kind: ContractKind,
  map: InterviewMap,
  title: string,
  recitals: string[],
  clauses: AssembledClause[],
  tips: string[],
  date = formatDate(map.dateOfAgreement || map.startDate || map.dueDate || ""),
): FormalDoc {
  const [roleA, roleB] = KIND_ROLES[kind]
  const stamp = stampLine(map)
  const extra = [ldClause(map), arbClause(map)].filter(Boolean) as AssembledClause[]
  const recitalsOut = [...recitals]
  if (map.draftingFor === "partyA") recitalsOut.push(`This writing is prepared at the instance of the ${roleA}.`)
  if (map.draftingFor === "partyB") recitalsOut.push(`This writing is prepared at the instance of the ${roleB}.`)
  const sideTip =
    map.draftingFor === "partyA"
      ? `This draft leans toward the ${roleA}. Have the ${roleB} read it with their own advocate.`
      : map.draftingFor === "partyB"
        ? `This draft leans toward the ${roleB}. Have the ${roleA} read it with their own advocate.`
        : "This draft is written to be usable by both sides. Each should still take advice."
  return {
    title,
    place: [map.city, map.state].filter(Boolean).join(", ") || "[place]",
    date: date || "[date]",
    parties: [person(map, "A", roleA), person(map, "B", roleB)],
    recitals: recitalsOut,
    clauses: [...clauses, ...extraClauses(map), ...extra, lawClause(map)],
    tips: [sideTip, ...tips],
    stampLine: stamp.line,
    stateNote: stamp.note,
    roleA,
    roleB,
  }
}

function lawClause(map: InterviewMap): AssembledClause {
  return {
    id: "law",
    heading: "Governing law",
    body: `This Agreement shall be governed by the laws of India. Subject to any mandatory forum and to any arbitration clause herein, the courts at ${map.city || "[city]"}, ${map.state || "[State]"} shall have jurisdiction.`,
    citationIds: ["ica-10", "ica-23"],
    explanation: "",
  }
}

const commonTips = (map: InterviewMap) => [
  "Have a licensed advocate in this State read the paper before anyone signs, stamps, or registers it.",
  `Look up today's stamp-duty schedule for ${map.state || "your State"} on the official portal linked in the interview. Type that amount yourself. ConDraft never waives stamp duty.`,
  "Each party keeps a signed original. Photograph every page after execution.",
  "This is a reference draft, not legal advice.",
]

export function assembleInterview(kind: ContractKind, map: InterviewMap): FormalDoc {
  if (kind === "rent") return assembleRentFormal(map)
  const table: Record<Exclude<ContractKind, "rent">, (m: InterviewMap) => FormalDoc> = {
    nda,
    freelance,
    loan,
    employment,
    intern,
    "sale-goods": saleGoods,
    "paying-guest": pg,
    "commercial-licence": commercialLicence,
    consultancy,
    founders,
    vendor,
    "equipment-hire": hire,
    partnership,
    settlement,
    "software-dev": software,
    retainer,
    mou,
    promissory,
    photography,
    influencer,
    "software-licence": softwareLicence,
    amc,
    indemnity,
    guarantee,
    agency,
    commission,
    "content-licence": contentLicence,
    tuition,
    "gift-movable": giftMovable,
    referral,
  }
  return table[kind](map)
}

function assembleRentFormal(map: InterviewMap): FormalDoc {
  const rent = assembleRent(mapToRent(map))
  const stamp = stampLine(map)
  const [roleA, roleB] = KIND_ROLES.rent
  const months = map.durationMonths || "11"
  const recitals = [
    `The Licensor is entitled to grant a leave and licence in respect of the premises described herein.`,
    `The Licensee has requested a personal licence to occupy the premises as a residence for ${months} month(s), and the Licensor has agreed on the terms below.`,
    `The parties intend this writing to record a leave and licence and not a transfer of an interest in immovable property beyond such licence.`,
  ]
  if (map.draftingFor === "partyA") recitals.push(`This writing is prepared at the instance of the ${roleA}.`)
  if (map.draftingFor === "partyB") recitals.push(`This writing is prepared at the instance of the ${roleB}.`)
  return {
    title: rent.title.toUpperCase(),
    place: [map.city, map.state].filter(Boolean).join(", "),
    date: formatDate(map.dateOfAgreement || map.startDate),
    parties: [person(map, "A", roleA), person(map, "B", roleB)],
    recitals,
    clauses: [...rent.clauses.filter((c) => c.id !== "law"), ...extraClauses(map), lawClause(map)],
    tips: [
      ...commonTips(map),
      "Joint inventory and meter photos on move-in, annexed to this agreement.",
      "Society bye-laws can still restrict pets, guests, or sub-letting.",
      "Maharashtra: a short term does not by itself mean registration is unnecessary — check IGR Maharashtra and s. 55 of the Maharashtra Rent Control Act, 1999.",
      "Do not use this draft for shops, agricultural land, or a sale of the flat.",
    ],
    stampLine: stamp.line,
    stateNote: stamp.note,
    roleA,
    roleB,
  }
}

function nda(map: InterviewMap): FormalDoc {
  const months = map.duration || "24"
  return wrap(
    "nda",
    map,
    "NON-DISCLOSURE AGREEMENT",
    [
      `The Disclosing Party may share information concerning ${map.purpose || "[the purpose]"} with the Receiving Party.`,
      `The Receiving Party agrees to receive such information only for that purpose and to keep it confidential.`,
    ],
    [
      {
        id: "purpose",
        heading: "Purpose",
        body: `Confidential information may be used solely for: ${map.purpose || "[purpose]"}.`,
        citationIds: ["ica-10", "ica-23"],
        explanation: "",
      },
      {
        id: "def",
        heading: "Confidential information",
        body: `Confidential information means non-public information relating to the purpose, in any form, that is marked confidential or that a reasonable person would treat as confidential, including ${map.ndaItems || "business, technical, and customer information"}. It excludes information that is public, already known to the Receiving Party without duty, independently developed, or required to be disclosed by law or a competent authority (with prior notice where legally permitted).`,
        citationIds: ["ica-10"],
        explanation: "",
      },
      {
        id: "duty",
        heading: "Obligations",
        body: `The Receiving Party shall not disclose confidential information to third parties without prior written consent, shall use it only for the purpose, shall limit access to personnel with a need to know who are bound by written duties of confidence, and shall use at least reasonable care. These duties last ${months} months from the date of this Agreement. Trade secrets shall be kept secret for so long as they remain trade secrets.`,
        citationIds: ["ica-73"],
        explanation: "",
      },
      {
        id: "return",
        heading: "Return",
        body: `Upon written request or expiry of the purpose, the Receiving Party shall return or securely delete confidential materials, except copies required to be retained by law.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
      {
        id: "no-licence",
        heading: "No licence",
        body: `Nothing in this Agreement assigns intellectual property. No licence is granted except the limited right to use confidential information for the purpose.`,
        citationIds: ["cr-17", "ica-10"],
        explanation: "",
      },
    ],
    [
      ...commonTips(map),
      "A named 'price' for breach is optional. Indian law (Contract Act s. 74) does not require liquidated damages. If you name a sum, a court may still award only reasonable compensation up to that sum.",
      "Mark files Confidential when you send them.",
      "An NDA is not an employment contract, IP assignment, or a reliable non-compete (see Contract Act s. 27).",
    ],
  )
}

function freelance(map: InterviewMap): FormalDoc {
  const ip =
    map.ipOwner === "freelancer"
      ? "Until full payment, intellectual property in the deliverables remains with the Freelancer. Upon full payment, the Freelancer assigns the deliverables (excluding pre-existing tools) to the Client in writing."
      : "Upon full payment, the Freelancer assigns to the Client the copyright and other intellectual property in the deliverables created under this Agreement, excluding the Freelancer's pre-existing tools and libraries, by this written assignment."
  return wrap(
    "freelance",
    map,
    "FREELANCE SERVICES AGREEMENT",
    [
      `The Client wishes to engage the Freelancer to perform the work described herein.`,
      `The Freelancer has agreed to perform the work as an independent contractor and not as an employee.`,
    ],
    [
      {
        id: "work",
        heading: "Work and timeline",
        body: `The Freelancer shall perform: ${map.work || "[work]"}. Timeline: ${map.duration || "[timeline]"}. Changes require written agreement on scope and fee.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
      {
        id: "fee",
        heading: "Fee",
        body: `The Client shall pay ${rupees(map.fee)} plus GST if applicable, to the Freelancer's nominated account. ${map.milestones || "Payment is due as agreed in writing."} Deliverables need not be finally handed over until the agreed fee is paid.`,
        citationIds: ["ica-10", "ica-73"],
        explanation: "",
      },
      {
        id: "ip",
        heading: "Intellectual property",
        body: ip,
        citationIds: ["cr-17", "cr-19", "ica-10"],
        explanation: "Copyright assignment must be in writing (Copyright Act s. 19).",
      },
      {
        id: "status",
        heading: "Status",
        body: `The Freelancer is an independent contractor. This Agreement does not create employment, partnership, or agency. Mandatory labour statutes may still apply if the facts so require.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
      {
        id: "end",
        heading: "Termination",
        body: `Either party may end this Agreement by 7 days' written notice if the other materially breaches and does not cure, or by written agreement. Unpaid invoices remain due. Work in progress shall be handed over against payment for work reasonably done.`,
        citationIds: ["ica-73", "ica-10"],
        explanation: "",
      },
    ],
    [
      ...commonTips(map),
      "Raise GST invoices if registered.",
      "Labour law can still apply if the relationship looks like a job.",
    ],
  )
}

function loan(map: InterviewMap): FormalDoc {
  return wrap(
    "loan",
    map,
    "ACKNOWLEDGEMENT OF LOAN",
    [
      `The Lender has agreed to advance a sum of money to the Borrower as a loan and not as a gift.`,
      `The Borrower has agreed to repay the same on the terms below.`,
    ],
    [
      {
        id: "sum",
        heading: "Advance",
        body: `The Lender has advanced / shall advance ${rupees(map.loanAmount)} to the Borrower by ${map.loanMode || "bank transfer / UPI"}. The Borrower acknowledges the sum as a loan.`,
        citationIds: ["ica-10", "ica-23"],
        explanation: "",
      },
      {
        id: "repay",
        heading: "Repayment",
        body: `The Borrower shall repay the loan on or before ${formatDate(map.dueDate)}, together with simple interest at ${map.interest || "0"}% per year if such rate is greater than zero. Prepayment is ${map.prepay === "no" ? "not permitted without the Lender's written consent" : "permitted without penalty"}.`,
        citationIds: ["ica-73"],
        explanation: "",
      },
      {
        id: "unsecured",
        heading: "Unsecured",
        body: `This is an unsecured personal obligation. It does not create a mortgage, hypothecation, or charge over any property.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
      {
        id: "default",
        heading: "Default",
        body: `If the Borrower fails to repay on the due date, the outstanding sum shall remain due with the interest stated above (if any) until payment. The Lender's rights under the Indian Contract Act, 1872, including reasonable compensation for breach, are reserved. This paper is not a promise to initiate cheque-bounce or criminal process.`,
        citationIds: ["ica-73", "ica-10"],
        explanation: "",
      },
    ],
    [
      ...commonTips(map),
      "Transfer the money so the advance is traceable.",
      "Not a mortgage or a cheque-bounce strategy. High interest can be challenged.",
    ],
  )
}

function employment(map: InterviewMap): FormalDoc {
  return wrap(
    "employment",
    map,
    "PRIVATE ENGAGEMENT / INTERNSHIP LETTER",
    [
      `The Organisation wishes to engage the Individual for the role described herein.`,
      `The parties wish to record stipend or pay and the period of engagement, without contracting out of mandatory labour law.`,
    ],
    [
      {
        id: "role",
        heading: "Role and term",
        body: `The Individual is engaged as ${map.role || "[role]"} from ${formatDate(map.startDate)} for ${map.duration || "[duration]"}. Hours: ${map.hours || "as reasonably required"}. Either party may end this engagement by ${map.noticeDays || "30"} days' written notice, or earlier for misconduct. This letter does not by itself determine employee vs intern vs consultant status under labour statutes.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
      {
        id: "pay",
        heading: "Pay",
        body: `The Organisation shall pay ${rupees(map.pay)} per month as stipend or pay, subject to TDS if required. Benefits other than this sum are ${map.benefits || "nil unless required by law"}.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
      {
        id: "ip",
        heading: "Work product",
        body: `Subject to mandatory law, work created in the course of this engagement for the Organisation is intended to vest in the Organisation. Copyright assignment, where required, shall be in writing.`,
        citationIds: ["cr-17", "cr-19"],
        explanation: "",
      },
    ],
    [
      ...commonTips(map),
      "Labour statutes can apply despite the word intern. Do not use this for a minor.",
      "Companies still need their own appointment / statutory process.",
    ],
  )
}

function saleGoods(map: InterviewMap): FormalDoc {
  return wrap(
    "sale-goods",
    map,
    "AGREEMENT FOR SALE OF MOVABLE GOODS",
    [
      `The Seller is the owner of the movable goods described herein and wishes to sell them.`,
      `The Buyer wishes to buy the same for the price stated. This Agreement does not transfer land or a building.`,
    ],
    [
      {
        id: "goods",
        heading: "Goods",
        body: `The Seller sells and the Buyer buys: ${map.goods || "[description, make, serial / registration no.]"} (the "Goods"), in ${map.condition || "as-is, where-is"} condition as inspected by the Buyer.`,
        citationIds: ["sog-4", "ica-10"],
        explanation: "",
      },
      {
        id: "price",
        heading: "Price and passing of property",
        body: `The price is ${rupees(map.fee)}. Property in the Goods shall pass ${map.titlePass === "delivery" ? "on delivery and full payment" : "on full payment"}. Until then risk remains with the Seller unless the Goods have been delivered to the Buyer.`,
        citationIds: ["sog-19", "sog-4"],
        explanation: "",
      },
      {
        id: "delivery",
        heading: "Delivery",
        body: `Delivery shall take place at ${map.city || "[city]"} on ${formatDate(map.startDate) || "[date]"}. The Seller shall hand over ${map.docs || "available keys, invoices, and documents of title in the Seller's possession"}.`,
        citationIds: ["sog-4"],
        explanation: "",
      },
    ],
    [
      ...commonTips(map),
      "This is only for movable goods. Do not use it to sell a flat or land (that needs a registered conveyance).",
      "For vehicles, complete RTO transfer. This paper does not transfer registration by itself.",
    ],
  )
}

function pg(map: InterviewMap): FormalDoc {
  return wrap(
    "paying-guest",
    map,
    "PAYING GUEST / ROOM OCCUPANCY ARRANGEMENT",
    [
      `The House-owner has a residence at the premises and is willing to allow the Paying Guest to occupy a room as a domestic arrangement.`,
      `The parties do not intend to create a tenancy or a lease of the whole premises.`,
    ],
    [
      {
        id: "room",
        heading: "Occupation",
        body: `The Paying Guest may occupy: ${map.propertyAddress || "[room / bed description]"} at ${map.city || "[city]"}, ${map.state}. Shared areas: ${map.shared || "kitchen / bath as existing"}. This is a personal permission to occupy, not a lease of the dwelling as a whole.`,
        citationIds: ["tpa-105", "ica-10"],
        explanation: "",
      },
      {
        id: "fee",
        heading: "Charges",
        body: `The Paying Guest shall pay ${rupees(map.rent)} per month, due on day ${map.rentDueDay || "5"}, plus deposit ${rupees(map.deposit)}. House rules: ${map.rules || "as notified in writing"}.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
      {
        id: "term",
        heading: "Term",
        body: `The arrangement begins on ${formatDate(map.startDate)} and may be ended by ${map.noticeDays || "15"} days' written notice by either party, or immediately for misconduct or non-payment.`,
        citationIds: ["tpa-106", "ica-10"],
        explanation: "",
      },
    ],
    [
      ...commonTips(map),
      "A 'PG' label does not always defeat rent-control or tenancy claims if the facts look like a tenancy. Keep it genuinely domestic.",
      "Society rules still apply.",
    ],
  )
}

function consultancy(map: InterviewMap): FormalDoc {
  return wrap(
    "consultancy",
    map,
    "CONSULTANCY AGREEMENT",
    [
      `The Client wishes to obtain professional advice from the Consultant.`,
      `The Consultant agrees to provide such advice as an independent professional.`,
    ],
    [
      {
        id: "scope",
        heading: "Scope",
        body: `The Consultant shall provide: ${map.work || "[scope]"}. Period: ${map.duration || "[period]"}.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
      {
        id: "fee",
        heading: "Fee",
        body: `The Client shall pay ${rupees(map.fee)} ${map.milestones || ""}, plus GST if applicable.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
      {
        id: "conf",
        heading: "Confidence",
        body: `The Consultant shall keep the Client's non-public information confidential for ${map.duration || "24 months"}, with the usual legal-disclosure exceptions.`,
        citationIds: ["ica-10", "ica-73"],
        explanation: "",
      },
    ],
    [...commonTips(map), "This is not a full-time employment contract."],
  )
}

function founders(map: InterviewMap): FormalDoc {
  return wrap(
    "founders",
    map,
    "FOUNDERS' AGREEMENT",
    [
      `The Founders intend to carry on ${map.purpose || "[venture]"} together.`,
      `They wish to record ownership, roles, and what happens if a founder leaves. This does not by itself incorporate a company.`,
    ],
    [
      {
        id: "equity",
        heading: "Ownership",
        body: `The Founders intend ownership / equity as: Founder A ${map.equityA || "[%]"} and Founder B ${map.equityB || "[%]"}. Vesting: ${map.vesting || "as they later record in writing"}. A company, if formed, shall reflect this in its cap table subject to company law.`,
        citationIds: ["ica-10", "pa-4"],
        explanation: "",
      },
      {
        id: "roles",
        heading: "Roles",
        body: `Founder A: ${map.work || "[role]"}. Founder B: ${map.role || "[role]"}. Significant decisions (equity, debt, hiring, IP assignment) require written consent of both.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
      {
        id: "ip",
        heading: "IP",
        body: `Intellectual property created for the venture shall belong to the venture / company once formed, and each Founder shall execute written assignments as required by the Copyright Act.`,
        citationIds: ["cr-17", "cr-19"],
        explanation: "",
      },
      {
        id: "exit",
        heading: "Leaver",
        body: `If a Founder leaves, that Founder shall not solicit the venture's then-current customers for ${map.duration || "6"} months to the extent enforceable. Bare non-competes may be void under Contract Act s. 27.`,
        citationIds: ["ica-27", "ica-10"],
        explanation: "",
      },
    ],
    [
      ...commonTips(map),
      "Incorporate and put this into SHA / AOA. This paper is not a company.",
      "Non-competes are often void in India (s. 27).",
    ],
  )
}

function vendor(map: InterviewMap): FormalDoc {
  return wrap(
    "vendor",
    map,
    "VENDOR SERVICES AGREEMENT",
    [
      `The Customer wishes to purchase services from the Vendor.`,
      `The Vendor has agreed to supply those services for the fee stated.`,
    ],
    [
      {
        id: "scope",
        heading: "Services",
        body: `The Vendor shall supply: ${map.work || "[services]"}. SLA / timing: ${map.duration || "[timing]"}.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
      {
        id: "fee",
        heading: "Charges",
        body: `The Customer shall pay ${rupees(map.fee)} plus GST if applicable, against invoice. ${map.milestones || ""}`,
        citationIds: ["ica-10", "ica-73"],
        explanation: "",
      },
    ],
    [...commonTips(map), "Keep invoices and GST returns aligned with this paper."],
  )
}

function hire(map: InterviewMap): FormalDoc {
  return wrap(
    "equipment-hire",
    map,
    "AGREEMENT FOR HIRE OF MOVABLE GOODS",
    [
      `The Owner is willing to hire the goods described herein to the Hirer.`,
      `This is a hire of movables, not a sale and not a lease of immovable property.`,
    ],
    [
      {
        id: "goods",
        heading: "Goods and term",
        body: `The Owner hires to the Hirer: ${map.goods || "[equipment]"}. Period: ${formatDate(map.startDate)} to ${map.duration || "[end]"}. Hire charges: ${rupees(map.fee)} ${map.rentDueDay ? `due day ${map.rentDueDay}` : ""}.`,
        citationIds: ["sog-4", "ica-10"],
        explanation: "If this is truly a sale, use the sale-of-goods template instead.",
      },
      {
        id: "care",
        heading: "Care and return",
        body: `The Hirer shall use the goods with reasonable care, shall not part with possession, and shall return them in the same condition (fair wear excepted) on the end date. Deposit: ${rupees(map.deposit)}.`,
        citationIds: ["ica-10", "ica-73"],
        explanation: "",
      },
    ],
    [...commonTips(map), "If you meant to sell the item, use the sale-of-goods draft instead."],
  )
}

function partnership(map: InterviewMap): FormalDoc {
  return wrap(
    "partnership",
    map,
    "PARTNERSHIP DEED (TWO PARTNERS)",
    [
      `The Partners have agreed to carry on ${map.purpose || "[business]"} in partnership.`,
      `They wish to record profit sharing and management. The firm should be registered.`,
    ],
    [
      {
        id: "firm",
        heading: "Firm and business",
        body: `The firm name shall be ${map.firm || "[firm name]"}. Business: ${map.purpose || "[business]"} at ${map.city || "[city]"}, ${map.state}.`,
        citationIds: ["pa-4", "ica-10"],
        explanation: "",
      },
      {
        id: "share",
        heading: "Capital and shares",
        body: `Capital: Partner A ${rupees(map.equityA)} / Partner B ${rupees(map.equityB)} or as they contribute. Profits and losses: Partner A ${map.shareA || "50%"} and Partner B ${map.shareB || "50%"}.`,
        citationIds: ["pa-4"],
        explanation: "",
      },
      {
        id: "reg",
        heading: "Registration",
        body: `The Partners shall apply to register the firm under the Indian Partnership Act, 1932. Until registration, section 69 restricts suits by the firm on contracts.`,
        citationIds: ["pa-69"],
        explanation: "",
      },
    ],
    [
      ...commonTips(map),
      "Register the firm. Unregistered firms struggle to sue on contracts (s. 69).",
      "This is not an LLP or a company.",
    ],
  )
}

function settlement(map: InterviewMap): FormalDoc {
  return wrap(
    "settlement",
    map,
    "SETTLEMENT AND RELEASE",
    [
      `Disputes have arisen concerning ${map.purpose || "[the dispute]"}.`,
      `The parties wish to settle fully and finally without admission of liability.`,
    ],
    [
      {
        id: "pay",
        heading: "Settlement sum",
        body: `The Second Party shall pay / the First Party shall accept ${rupees(map.fee)} in full and final settlement of the claims described as: ${map.purpose || "[claims]"}. Payment by ${formatDate(map.dueDate) || "[date]"}.`,
        citationIds: ["ica-10", "ica-23"],
        explanation: "",
      },
      {
        id: "release",
        heading: "Release",
        body: `Upon receipt of the settlement sum, each party releases the other from claims arising out of the said dispute, except fraud or a written surviving obligation herein. This is a compromise, not an admission.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
    ],
    [
      ...commonTips(map),
      "If a court case exists, file a compromise in that proceeding. This paper alone may not close a suit.",
      "Do not use this to settle criminal offences that cannot be compounded.",
    ],
  )
}

function software(map: InterviewMap): FormalDoc {
  return wrap(
    "software-dev",
    map,
    "WEBSITE / SOFTWARE DEVELOPMENT AGREEMENT",
    [
      `The Client wishes the Developer to design and deliver software / a website as described.`,
      `The Developer agrees to do so as an independent contractor.`,
    ],
    [
      {
        id: "scope",
        heading: "Scope",
        body: `The Developer shall deliver: ${map.work || "[scope / stack / pages]"}. Timeline: ${map.duration || "[timeline]"}. Acceptance: ${map.acceptance || "written acceptance within 7 days of delivery or deemed accepted"}.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
      {
        id: "fee",
        heading: "Fee",
        body: `The Client shall pay ${rupees(map.fee)}. ${map.milestones || "As invoiced."} Hosting and third-party licences are extra unless listed in the scope.`,
        citationIds: ["ica-10", "ica-73"],
        explanation: "",
      },
      {
        id: "ip",
        heading: "IP",
        body: `Upon full payment, the Developer assigns to the Client copyright in custom code written for this project, excluding third-party open-source and the Developer's pre-existing libraries. Assignment is in writing as required by the Copyright Act.`,
        citationIds: ["cr-17", "cr-19"],
        explanation: "",
      },
      {
        id: "warranty",
        heading: "Limited correction",
        body: `For 30 days after written acceptance, the Developer shall correct defects in custom code that fail to match the written scope, excluding third-party outages, content supplied by the Client, and change requests. No other warranty is given.`,
        citationIds: ["ica-10", "ica-73"],
        explanation: "",
      },
    ],
    [...commonTips(map), "List open-source licences. Assignment of copyright must be written (s. 19)."],
  )
}

function retainer(map: InterviewMap): FormalDoc {
  return wrap(
    "retainer",
    map,
    "RETAINER / ADVISORY AGREEMENT",
    [
      `The Client wishes to retain the Advisor on a monthly basis.`,
      `The Advisor agrees to make reasonable time available as described.`,
    ],
    [
      {
        id: "scope",
        heading: "Retainer",
        body: `The Advisor shall provide ${map.work || "advisory services"} for about ${map.hours || "[n]"} hours per month. Unused hours ${map.rollover === "yes" ? "may roll over for one month" : "lapse at month-end"}.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
      {
        id: "fee",
        heading: "Fee",
        body: `The Client shall pay ${rupees(map.fee)} per month in advance, plus GST if applicable. Either party may end this retainer on ${map.noticeDays || "30"} days' written notice.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
    ],
    [...commonTips(map), "This is not an employment or partnership."],
  )
}

function intern(map: InterviewMap): FormalDoc {
  return wrap(
    "intern",
    map,
    "INTERNSHIP LETTER",
    [
      `The Organisation is willing to offer a training internship to the Intern${map.college ? ` in connection with ${map.college}` : ""}.`,
      `The parties record stipend, duration, and that this is training. Labelling a person an intern does not by itself avoid labour statutes if the facts are those of employment.`,
    ],
    [
      {
        id: "role",
        heading: "Training and term",
        body: `The Intern is engaged to train as ${map.role || "[role]"} / to perform: ${map.work || "[training work]"}. Period: ${formatDate(map.startDate)} for ${map.duration || "[duration]"}. Hours: ${map.hours || "as reasonably required for training"}. Either party may end this internship by ${map.noticeDays || "7"} days' written notice.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
      {
        id: "pay",
        heading: "Stipend",
        body: `The Organisation shall pay a stipend of ${rupees(map.pay)} per month, subject to TDS if required. This letter is not a promise of employment at the end of the term unless separately agreed in writing.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
      {
        id: "ip",
        heading: "Work product",
        body: `Subject to mandatory law, work created in the course of this internship for the Organisation is intended to vest in the Organisation. Copyright assignment, where required, shall be in writing.`,
        citationIds: ["cr-17", "cr-19"],
        explanation: "",
      },
    ],
    [...commonTips(map), "Do not use this for a person under 18. A college may still need its own form."],
  )
}

function commercialLicence(map: InterviewMap): FormalDoc {
  const months = map.durationMonths || map.duration || "[months]"
  return wrap(
    "commercial-licence",
    map,
    "LEAVE AND LICENCE AGREEMENT (COMMERCIAL PREMISES)",
    [
      `The Licensor is entitled to grant a leave and licence of the commercial premises described herein.`,
      `The Licensee has requested a personal licence to use the premises only for ${map.permittedUse || "[permitted business]"} for ${months} month(s).`,
    ],
    [
      {
        id: "premises",
        heading: "Premises and use",
        body: `The premises are: ${map.propertyAddress || "[shop / office address]"} at ${map.city || "[city]"}, ${map.state || "[State]"}. The Licensee shall use them only for ${map.permittedUse || "[permitted use]"} and shall keep all municipal, GST, shop, and professional licences required for that use. This is a personal licence, not a lease intended to create an interest in immovable property beyond the licence, and not a sale of goodwill.`,
        citationIds: ["tpa-105", "ica-10"],
        explanation: "Facts (exclusive possession, rent, term) still decide lease vs licence.",
      },
      {
        id: "fee",
        heading: "Licence fee and deposit",
        body: `Monthly licence fee: ${rupees(map.rent)}, due on day ${map.rentDueDay || "5"}. Security deposit: ${rupees(map.deposit)}, refundable within ${map.depositRefundDays || "30"} days of vacant handover except documented arrears and damage beyond ordinary wear. ${
          map.maintenanceBy === "landlord"
            ? "The Licensor shall bear society maintenance. The Licensee shall pay electricity and other consumption at the premises."
            : map.maintenanceBy === "tenant"
              ? "The Licensee shall bear society maintenance together with consumption charges at the premises."
              : "Society maintenance shall be as the parties agree in writing. Consumption charges at the premises are paid by the Licensee."
        }`,
        citationIds: ["ica-10", "tpa-108"],
        explanation: "",
      },
      {
        id: "term",
        heading: "Term and notice",
        body: `The licence begins on ${formatDate(map.startDate)} for ${months} month(s). ${
          Number(map.lockInMonths) > 0 ? `Lock-in: ${map.lockInMonths} month(s). ` : ""
        }Thereafter either party may end it by ${map.noticeDays || "30"} days' written notice. A term of 12 months or more generally requires registration under Registration Act s. 17. State commercial-licence practice may require registration even for a shorter term.`,
        citationIds: ["reg-17", "tpa-106"],
        explanation: "",
      },
    ],
    [
      ...commonTips(map),
      "Check whether your society / municipality allows this use.",
      "Maharashtra: confirm Article 36 vs 36A and s. 55 practice on the IGR calculator.",
    ],
  )
}

function mou(map: InterviewMap): FormalDoc {
  const binding = map.mouBinding === "yes"
  return wrap(
    "mou",
    map,
    binding ? "MEMORANDUM OF UNDERSTANDING" : "MEMORANDUM OF UNDERSTANDING (NOT A CONTRACT)",
    [
      `The parties have been discussing ${map.purpose || "[the subject]"}.`,
      binding
        ? `They intend this writing to be a legally binding contract under the Indian Contract Act, 1872.`
        : `They do not intend this writing to create legal relations or a contract, except any confidentiality they record in further terms. The label “MoU” is not by itself decisive; this recital records their intention.`,
    ],
    [
      {
        id: "record",
        heading: binding ? "Agreed outline" : "Record of talks",
        body: `${map.purpose || "[outline]"}. ${binding ? "Each party shall act in good faith to perform this outline." : "This is a record of current understanding only. A contract, if any, shall be a later signed writing."}`,
        citationIds: binding ? ["ica-10", "ica-2"] : ["ica-2", "ica-10"],
        explanation: "Courts look at intention to create legal relations, not the title of the paper.",
      },
    ],
    [
      ...commonTips(map),
      binding
        ? "If you meant only a term sheet, go back and answer that this MoU should not be binding."
        : "If you later want a binding deal, sign a proper agreement — this paper says you do not intend one yet.",
    ],
  )
}

function promissory(map: InterviewMap): FormalDoc {
  return wrap(
    "promissory",
    map,
    "PROMISSORY NOTE",
    [
      `The Maker is indebted to the Payee and wishes to record an unconditional promise to pay.`,
      `The parties understand that a promissory note is a negotiable instrument; stamp duty and form are strict.`,
    ],
    [
      {
        id: "promise",
        heading: "Promise to pay",
        body: `The Maker hereby unconditionally promises to pay to the Payee, or order, the sum of ${rupees(map.loanAmount)} ${Number(map.interest) > 0 ? `with simple interest at ${map.interest}% per year` : "without interest"} on ${formatDate(map.dueDate) || "[due date]"} at ${map.city || "[city]"}, ${map.state || "[State]"}.`,
        citationIds: ["ni-4", "ica-10"],
        explanation: "Negotiable Instruments Act s. 4: a promissory note is an unconditional written promise to pay a certain sum.",
      },
      {
        id: "cover",
        heading: "Covering record",
        body: `This note records the Maker's promise only. It is not a mortgage or a cheque. The Maker shall pay stamp duty as required for a promissory note in ${map.state || "[State]"} before execution.`,
        citationIds: ["stamp-3", "ni-4"],
        explanation: "",
      },
    ],
    [
      ...commonTips(map),
      "Have an advocate check the stamp and the exact NI Act form for your State before anyone signs.",
      "A messy ‘note’ that adds conditions may not be a promissory note at all.",
    ],
  )
}

function photography(map: InterviewMap): FormalDoc {
  const ip =
    map.ipOwner === "freelancer"
      ? "Copyright in the photographs remains with the Photographer until full payment. Upon full payment, the Photographer grants the usage licence below and, if so stated in further terms, assigns copyright in writing."
      : "Upon full payment, the Photographer assigns to the Client copyright in photographs delivered under this Agreement, by this writing, excluding the Photographer's unused out-takes unless listed. Until then, copyright remains with the Photographer as author (Copyright Act s. 17)."
  return wrap(
    "photography",
    map,
    "PHOTOGRAPHY AGREEMENT",
    [
      `The Client wishes to engage the Photographer for a shoot on ${formatDate(map.eventDate) || formatDate(map.startDate) || "[date]"}.`,
      `The Photographer agrees to attend and deliver the work described, as an independent contractor.`,
    ],
    [
      {
        id: "scope",
        heading: "Shoot",
        body: `The Photographer shall cover: ${map.work || "[event / hours / locations]"} on ${formatDate(map.eventDate) || "[date]"}. Deliverables and timeline: ${map.duration || "[e.g. edited gallery in 21 days]"}.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
      {
        id: "fee",
        heading: "Fee",
        body: `The Client shall pay ${rupees(map.fee)}. ${map.milestones || "As invoiced."}`,
        citationIds: ["ica-10"],
        explanation: "",
      },
      {
        id: "ip",
        heading: "Copyright and usage",
        body: `${ip} Permitted use: ${map.usage || "[e.g. personal album / website / paid ads — specify]"}.`,
        citationIds: ["cr-17", "cr-19"],
        explanation: "Assignment must be in writing (s. 19). A licence is enough if the client only needs to use the photos.",
      },
    ],
    [...commonTips(map), "Say whether raw files are included. Ads vs a private album are different grants."],
  )
}

function influencer(map: InterviewMap): FormalDoc {
  return wrap(
    "influencer",
    map,
    "INFLUENCER / BRAND CONTENT AGREEMENT",
    [
      `The Brand wishes the Creator to produce and publish content as described.`,
      `The Creator agrees to do so as an independent contractor, and to disclose the paid partnership as required by applicable advertising guidelines.`,
    ],
    [
      {
        id: "scope",
        heading: "Deliverables",
        body: `The Creator shall deliver: ${map.work || "[number of posts / reels / stories, platforms]"}. Campaign date: ${formatDate(map.eventDate) || "[date]"}. Timeline: ${map.duration || "[timeline]"}.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
      {
        id: "fee",
        heading: "Fee",
        body: `The Brand shall pay ${rupees(map.fee)}. ${map.milestones || "On completion of deliverables."}`,
        citationIds: ["ica-10"],
        explanation: "",
      },
      {
        id: "use",
        heading: "Usage and disclosure",
        body: `The Brand may use the delivered content as follows: ${map.usage || "[organic social / paid ads / term]"}. The Creator shall keep moral rights except as waived in writing where permitted. The Creator shall disclose the commercial relationship in the manner required by applicable ASCI / influencer guidelines and platform rules.`,
        citationIds: ["cr-17", "cr-19", "ica-10"],
        explanation: "",
      },
    ],
    [...commonTips(map), "Disclosure of paid content is not optional because this paper is silent — follow live ad rules."],
  )
}

function softwareLicence(map: InterviewMap): FormalDoc {
  return wrap(
    "software-licence",
    map,
    "SOFTWARE LICENCE AGREEMENT",
    [
      `The Licensor owns or is entitled to license the software described herein.`,
      `The Licensee wishes a limited right to use it, not an assignment of copyright.`,
    ],
    [
      {
        id: "grant",
        heading: "Licence",
        body: `The Licensor grants the Licensee a non-exclusive, non-transferable licence to use ${map.work || "[product name]"} for ${map.seats || "[n]"} concurrent users / seats, for ${map.duration || "[term]"}, solely for the Licensee's internal business at ${map.city || "[city]"}. No copyright is assigned. The Licensee shall not reverse engineer except to the extent mandatory law allows, nor sublicense without written consent.`,
        citationIds: ["cr-17", "cr-19", "ica-10"],
        explanation: "This is a licence, not a sale of the code.",
      },
      {
        id: "fee",
        heading: "Fee",
        body: `The Licensee shall pay ${rupees(map.fee)} plus GST if applicable.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
    ],
    [...commonTips(map), "If you need a DPA, SLA, or source-code escrow, add them under further terms or use a specialist paper."],
  )
}

function amc(map: InterviewMap): FormalDoc {
  return wrap(
    "amc",
    map,
    "ANNUAL MAINTENANCE AGREEMENT",
    [
      `The Customer wishes the Service Provider to maintain the assets described herein.`,
      `The Service Provider agrees to do so for the period and fee stated, as an independent contractor.`,
    ],
    [
      {
        id: "scope",
        heading: "Assets and service",
        body: `Assets: ${map.assets || map.work || "[machines / site / software]"}. Period: from ${formatDate(map.startDate)} for ${map.duration || "12 months"}. The Service Provider shall attend with reasonable skill. Consumables, spare parts, damage from misuse, and manufacturer warranty work are excluded unless listed in further terms.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
      {
        id: "fee",
        heading: "Fee",
        body: `The Customer shall pay ${rupees(map.fee)} plus GST if applicable, in advance for the period unless milestones are stated: ${map.milestones || "annual in advance"}.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
    ],
    [...commonTips(map), "List serial numbers. This is not the manufacturer's warranty unless you say so."],
  )
}

function indemnity(map: InterviewMap): FormalDoc {
  return wrap(
    "indemnity",
    map,
    "DEED OF INDEMNITY",
    [
      `The Indemnified has asked the Indemnifier to save it from loss in connection with ${map.purpose || "[the matter]"}.`,
      `The Indemnifier has agreed to give this indemnity under the Indian Contract Act, 1872, section 124.`,
    ],
    [
      {
        id: "promise",
        heading: "Indemnity",
        body: `The Indemnifier shall indemnify and keep indemnified the Indemnified against loss, cost, and reasonable legal expense arising out of ${map.purpose || "[the stated matter]"}, caused by the Indemnifier or by a person for whom the Indemnifier is responsible, up to a maximum of ${rupees(map.capAmount || map.fee)}${map.capAmount || map.fee ? "" : " (amount to be read with the purpose above)"}. This is not a contract of insurance.`,
        citationIds: ["ica-124", "ica-10"],
        explanation: "s. 124: a contract of indemnity is a promise to save from loss caused by the promisor or another person.",
      },
    ],
    [...commonTips(map), "The indemnifier should take independent advice. Caps matter."],
  )
}

function guarantee(map: InterviewMap): FormalDoc {
  return wrap(
    "guarantee",
    map,
    "DEED OF PERSONAL GUARANTEE",
    [
      `${map.principalName || "[Principal debtor]"} (the "Principal Debtor") is or will be indebted to the Creditor in connection with ${map.purpose || "[the underlying deal]"}.`,
      `The Guarantor has agreed to guarantee that debt under the Indian Contract Act, 1872, section 126.`,
    ],
    [
      {
        id: "promise",
        heading: "Guarantee",
        body: `The Guarantor hereby guarantees to the Creditor due payment by the Principal Debtor (${map.principalName || "[name]"}) of amounts due in connection with ${map.purpose || "[the deal]"}, up to ${rupees(map.capAmount || map.fee)}. This is a contract of guarantee, not a gift and not a mortgage. The Guarantor shall pay on written demand if the Principal Debtor defaults. The Guarantor confirms they have had the opportunity to take independent legal advice.`,
        citationIds: ["ica-126", "ica-10"],
        explanation: "s. 126: a guarantee is a contract to perform the promise, or discharge the liability, of a third person in case of default.",
      },
    ],
    [
      ...commonTips(map),
      "Name the principal debtor clearly. Open-ended guarantees are dangerous.",
      "The guarantor should not sign under pressure and should keep a copy of the underlying loan or supply contract.",
    ],
  )
}

function agency(map: InterviewMap): FormalDoc {
  return wrap(
    "agency",
    map,
    "AGENCY / SALES REPRESENTATIVE AGREEMENT",
    [
      `The Principal wishes to appoint the Agent to solicit business in the territory stated.`,
      `The Agent agrees to do so as an agent under the Indian Contract Act, 1872, section 182, and not as an employee or a buyer of the goods.`,
    ],
    [
      {
        id: "appoint",
        heading: "Appointment",
        body: `The Principal appoints the Agent as its ${map.work || "sales representative"} for the territory of ${map.territory || map.city || "[territory]"} for ${map.duration || "[term]"}. The Agent shall not bind the Principal to any contract except as written authority allows. The Agent shall not describe themselves as a partner.`,
        citationIds: ["ica-182", "ica-10"],
        explanation: "s. 182: an agent is a person employed to do any act for another or to represent another in dealings with third persons.",
      },
      {
        id: "fee",
        heading: "Commission",
        body: `Commission: ${map.commissionRate || "[rate and trigger, e.g. 8% of amounts actually received]"}. Other fee if any: ${map.fee ? rupees(map.fee) : "nil"}. GST if applicable. This is not employment.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
    ],
    [...commonTips(map), "This is not a franchise. Authority to sign for the principal should stay narrow."],
  )
}

function commission(map: InterviewMap): FormalDoc {
  return wrap(
    "commission",
    map,
    "COMMISSION SALES AGREEMENT",
    [
      `The Principal wishes to pay the Agent a commission if described sales complete.`,
      `The Agent is not an employee and does not buy the goods unless a separate sale is signed.`,
    ],
    [
      {
        id: "rate",
        heading: "Commission",
        body: `The Principal shall pay the Agent ${map.commissionRate || "[rate]"} on ${map.work || "sales in the stated territory"} in ${map.territory || map.city || "[territory]"}. Unless further terms say otherwise, commission is due only on amounts actually received by the Principal, and is payable within 15 days of receipt. Other fee: ${map.fee ? rupees(map.fee) : "nil"}.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
    ],
    [...commonTips(map), "Write the trigger: intro, invoice, or money in the bank. Prefer money received."],
  )
}

function contentLicence(map: InterviewMap): FormalDoc {
  return wrap(
    "content-licence",
    map,
    "CONTENT LICENCE AGREEMENT",
    [
      `The Licensor owns copyright in the work described herein.`,
      `The Licensee wishes a limited licence to use that work, not an assignment of copyright.`,
    ],
    [
      {
        id: "grant",
        heading: "Licence",
        body: `The Licensor grants the Licensee a ${map.duration || "[term]"} licence to use: ${map.work || "[describe the work / files]"} as follows: ${map.usage || "[media, territory, exclusive or not]"}. Copyright remains with the Licensor. The Licensee shall not register the work as their own or sublicense except as this licence allows.`,
        citationIds: ["cr-17", "cr-19", "ica-10"],
        explanation: "A licence is not an assignment. Selling the copyright needs a separate written assignment (s. 19).",
      },
      {
        id: "fee",
        heading: "Fee",
        body: `The Licensee shall pay ${rupees(map.fee)} plus GST if applicable.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
    ],
    [...commonTips(map), "Say exclusive vs non-exclusive. Credit line, if required, belongs in further terms."],
  )
}

function tuition(map: InterviewMap): FormalDoc {
  return wrap(
    "tuition",
    map,
    "COACHING / TUITION AGREEMENT",
    [
      `The Student / Parent wishes to obtain private tuition in ${map.subject || "[subject]"}.`,
      `The Tutor agrees to teach as an independent service provider, not as a school or an employee.`,
    ],
    [
      {
        id: "scope",
        heading: "Classes",
        body: `Subject: ${map.subject || "[subject]"}. Teaching: ${map.work || "[online / in person, syllabus]"}. Hours: ${map.hours || "[hours]"}. Period: ${map.duration || "[term]"}. Teaching materials remain the Tutor's unless assigned in writing.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
      {
        id: "fee",
        heading: "Fee",
        body: `The Student / Parent shall pay ${rupees(map.fee)} plus GST if applicable. Missed classes are not refunded unless further terms say so. If the student is under 18, the contracting party must be the parent or guardian — this tool is for 18+ parties only.`,
        citationIds: ["ica-10"],
        explanation: "",
      },
    ],
    [...commonTips(map), "Do not use this if the student is a minor unless a parent/guardian is the named party and an advocate reviews it."],
  )
}

function giftMovable(map: InterviewMap): FormalDoc {
  return wrap(
    "gift-movable",
    map,
    "RECORD OF GIFT OF MOVABLE GOODS",
    [
      `The Donor wishes to give the movable goods described herein to the Donee as a gift, not as a loan or a sale.`,
      `The parties wish to record delivery. This writing does not gift land, a flat, or any immovable property.`,
    ],
    [
      {
        id: "gift",
        heading: "Gift and delivery",
        body: `The Donor hereby gives to the Donee, by way of gift and without price, the following movable goods: ${map.goods || "[description, serial / identification]"}. The Donee acknowledges receipt / delivery of the goods. No consideration is paid. This is not a sale under the Sale of Goods Act and not a gift of immovable property.`,
        citationIds: ["ica-10", "ica-23"],
        explanation: "A gift of land or a flat needs a registered gift deed. This draft is only for movables.",
      },
    ],
    [
      ...commonTips(map),
      "Photograph handover. Jewellery and vehicles still have their own transfer formalities.",
      "Do not use this to disguise a sale or to gift a house.",
    ],
  )
}

function referral(map: InterviewMap): FormalDoc {
  return wrap(
    "referral",
    map,
    "REFERRAL / INTRODUCTION AGREEMENT",
    [
      `The Recipient wishes to receive introductions from the Referrer in connection with ${map.purpose || "[the business]"}.`,
      `The Referrer agrees to introduce, for a success fee, and is not an employee or a partner.`,
    ],
    [
      {
        id: "fee",
        heading: "Referral fee",
        body: `If a person introduced by the Referrer ${map.work || "enters a paid contract with the Recipient"}, the Recipient shall pay the Referrer ${map.commissionRate || "[rate]"} ${map.fee ? `(or ${rupees(map.fee)} if a flat fee is intended)` : ""}. Unless further terms say otherwise, the fee is due only when the Recipient actually receives the corresponding payment from the introduced person. This arrangement is not a bribe, not a government-tender commission, and not employment.`,
        citationIds: ["ica-10", "ica-23"],
        explanation: "",
      },
    ],
    [...commonTips(map), "Illegal commissions (public servants, some tenders) stay illegal even if you write them here."],
  )
}

