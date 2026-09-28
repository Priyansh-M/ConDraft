export type ContractKind =
  | "rent"
  | "commercial-licence"
  | "paying-guest"
  | "freelance"
  | "consultancy"
  | "employment"
  | "intern"
  | "retainer"
  | "vendor"
  | "agency"
  | "commission"
  | "loan"
  | "promissory"
  | "settlement"
  | "guarantee"
  | "indemnity"
  | "gift-movable"
  | "nda"
  | "founders"
  | "partnership"
  | "mou"
  | "referral"
  | "amc"
  | "software-dev"
  | "software-licence"
  | "photography"
  | "influencer"
  | "content-licence"
  | "tuition"
  | "sale-goods"
  | "equipment-hire"

export type KindInfo = {
  label: string
  group: string
  blurb: string
  means: string
  why: string
  does: string
  roles: [string, string]
}

export const KIND_INFO: Record<ContractKind, KindInfo> = {
  rent: {
    label: "Residential leave & licence",
    group: "Home and premises",
    blurb: "A flat or house to live in, for a term you choose.",
    means: "A personal permission to occupy a home. Indian practice usually calls this leave and licence, not a lease, so it is harder to treat as a tenancy.",
    why: "You need a writing that names the premises, fee, deposit, term, and notice. Courts look at the facts, not only the title of the paper.",
    does: "Builds a deed with recitals, occupation clauses, stamp box, and witnesses. Duration is asked — it is not assumed to be 11 months. A term of 12 months or more often must be registered.",
    roles: ["Licensor", "Licensee"],
  },
  "commercial-licence": {
    label: "Shop / office leave & licence",
    group: "Home and premises",
    blurb: "A shop, cabin, or office to use for work.",
    means: "Leave and licence of premises for business, not a sale of the shop and not a residential PG.",
    why: "Commercial use, lock-in, and permitted activity need to be written. Many States still expect registration and a different stamp article than a home.",
    does: "Drafts a commercial licence with use restriction, fee, deposit, and a warning to check IGR. Not for selling goodwill or a running business.",
    roles: ["Licensor", "Licensee"],
  },
  "paying-guest": {
    label: "Paying guest / roommate",
    group: "Home and premises",
    blurb: "A room in someone’s home, with house rules.",
    means: "A domestic permission to occupy a room, sharing kitchen or bath, not a lease of the whole flat.",
    why: "If it looks like a tenancy (exclusive possession, long term, no house rules), a court may still treat it as one.",
    does: "Records the room, shared areas, monthly charge, and rules. Keep it genuinely domestic.",
    roles: ["House-owner", "Paying Guest"],
  },
  freelance: {
    label: "Freelance / services",
    group: "Work",
    blurb: "A named piece of work for a fee, not a job.",
    means: "An independent contractor does defined work for a Client. It is not employment unless the facts look like a job.",
    why: "Scope, fee, timeline, and who owns the copyright after payment must be in writing. Copyright assignment is valid only if written (Copyright Act s. 19).",
    does: "Adds work, payment, IP assignment on payment, and contractor status. GST invoices stay your job.",
    roles: ["Client", "Freelancer"],
  },
  consultancy: {
    label: "Consultancy",
    group: "Work",
    blurb: "Advice or professional time, not a product.",
    means: "A consultant gives advice as an independent professional, not as an employee.",
    why: "Without a scope and fee, unpaid ‘advice’ is hard to recover. Confidentiality is usually needed.",
    does: "Records scope, period, fee, and a simple confidence duty.",
    roles: ["Client", "Consultant"],
  },
  employment: {
    label: "Private employment letter",
    group: "Work",
    blurb: "A private-sector job or appointment letter.",
    means: "A private engagement letter for role, pay, and term. It cannot contract out of mandatory labour law.",
    why: "You still need something in writing for pay and notice. PF, gratuity, shops & establishment, and state labour rules can still apply.",
    does: "Writes role, pay, hours, work product, and notice. Do not use this for a child or a government post.",
    roles: ["Organisation", "Employee"],
  },
  intern: {
    label: "Internship letter",
    group: "Work",
    blurb: "A training stint with stipend, not a disguised job.",
    means: "A training engagement. Calling someone an intern does not by itself avoid labour law if they are doing a regular job.",
    why: "Stipend, duration, college (if any), and that it is training should be on paper. Minors need a different process — this draft is 18+ only.",
    does: "Records role, stipend, term, and that work product is for the organisation. Not a promise of a job afterwards unless you write one.",
    roles: ["Organisation", "Intern"],
  },
  retainer: {
    label: "Monthly retainer / advisory",
    group: "Work",
    blurb: "A monthly fee for a set number of hours.",
    means: "The advisor keeps time available each month for a fixed fee.",
    why: "Without hours, rollover, and notice, retainers turn into fights about unused time.",
    does: "Sets monthly hours, fee, rollover, and how either side can end it.",
    roles: ["Client", "Advisor"],
  },
  vendor: {
    label: "Vendor / small supply",
    group: "Work",
    blurb: "A vendor supplying services to a customer.",
    means: "A business-to-business services supply for a fee, with invoices.",
    why: "Scope and payment dates keep GST invoices aligned with the paper.",
    does: "Writes services, charges, and timing. Not a sale of goods and not employment.",
    roles: ["Customer", "Vendor"],
  },
  agency: {
    label: "Agency / sales representative",
    group: "Work",
    blurb: "Someone sells or represents you, for commission or fee.",
    means: "An agent acts for a principal (Contract Act s. 182). The agent does not buy the goods unless you say so.",
    why: "Territory, commission, and that the agent cannot bind you beyond written authority need to be clear.",
    does: "Records appointment, territory, commission, and limits on authority. Not a franchise.",
    roles: ["Principal", "Agent"],
  },
  commission: {
    label: "Commission sales",
    group: "Work",
    blurb: "Pay a % when a sale actually happens.",
    means: "Commission is earned only on the sales you describe (closed, paid, or invoiced).",
    why: "People fight over when commission is due — intro, invoice, or money in the bank.",
    does: "Writes the rate, the trigger, and that it is not employment.",
    roles: ["Principal", "Agent"],
  },
  loan: {
    label: "Personal loan",
    group: "Money",
    blurb: "Money lent to a person, to be repaid.",
    means: "An unsecured loan, not a gift and not a mortgage of a house.",
    why: "Without a writing and a traceable transfer, it is hard to prove it was a loan. High interest can be cut down by a court.",
    does: "Records amount, mode, due date, interest, and prepayment. Not a cheque-bounce strategy and not a charge on property.",
    roles: ["Lender", "Borrower"],
  },
  promissory: {
    label: "Promissory note",
    group: "Money",
    blurb: "An unconditional promise to pay a sum of money.",
    means: "A promissory note under the Negotiable Instruments Act is an unconditional written promise to pay a certain sum.",
    why: "It is a different instrument from a loan agreement. Stamp duty and format are strict; a messy note may not be a note at all.",
    does: "Drafts a simple note plus a short covering record. Have an advocate check stamp before you sign. Not a cheque.",
    roles: ["Maker", "Payee"],
  },
  settlement: {
    label: "Settlement and release",
    group: "Money",
    blurb: "End a dispute for a sum, without admitting fault.",
    means: "A compromise: money (or other terms) in exchange for dropping claims, with no admission of liability.",
    why: "If a suit is pending, this paper alone may not close the case — you usually need a compromise in that court.",
    does: "Writes the dispute, the sum, the due date, and a release. Do not use it to settle crimes that cannot be compounded.",
    roles: ["First Party", "Second Party"],
  },
  guarantee: {
    label: "Personal guarantee",
    group: "Money",
    blurb: "You promise to pay if someone else does not.",
    means: "A contract of guarantee (Contract Act s. 126): the guarantor answers for the debt of a principal debtor to a creditor.",
    why: "Guarantees are strictly construed. You must name the debtor, the limit, and whether it is continuing.",
    does: "Records the three parties, the cap, and that it is a guarantee, not a gift. The guarantor should take independent advice.",
    roles: ["Guarantor", "Creditor"],
  },
  indemnity: {
    label: "Deed of indemnity",
    group: "Money",
    blurb: "A promise to make good a named loss.",
    means: "Indemnity (Contract Act s. 124) is a promise to save someone from loss caused by the promisor or by someone else.",
    why: "Used when one person asks another to take a risk (lost share certificate, bank, a third-party claim).",
    does: "Writes who indemnifies whom, for what, and a cap if you name one. Not insurance.",
    roles: ["Indemnifier", "Indemnified"],
  },
  "gift-movable": {
    label: "Gift of movable goods",
    group: "Money",
    blurb: "Give a phone, jewellery, or other movable as a gift.",
    means: "A gift of movable property is usually completed by delivery, with a writing as a record. This is not a gift of land or a flat.",
    why: "Families later fight over whether it was a loan, a sale, or a gift. A signed record plus photos of handover helps.",
    does: "Records donor, donee, the goods, and that no price is paid. Do not use this to gift immovable property (that needs a registered deed).",
    roles: ["Donor", "Donee"],
  },
  nda: {
    label: "Non-disclosure / confidentiality",
    group: "Business",
    blurb: "Keep someone else’s secrets, for a purpose.",
    means: "A promise not to use or share confidential information except for a stated purpose. An NDA is valid without a ‘price’ for breach.",
    why: "You want a paper trail of what was shared and for how long. A named rupee sum is optional (Contract Act s. 74).",
    does: "Defines the information, the purpose, the duration, and return of files. It is not a non-compete (those are often void under s. 27).",
    roles: ["Disclosing Party", "Receiving Party"],
  },
  founders: {
    label: "Founders' agreement",
    group: "Business",
    blurb: "Two people starting a venture, before a company.",
    means: "A private record of roles, split, and what happens if someone leaves. It does not incorporate a company.",
    why: "Handshake equity evaporates. You still need a company or LLP and a SHA later.",
    does: "Writes split, roles, IP for the venture, and a leaver note. Bare non-competes are often void in India (s. 27).",
    roles: ["Founder A", "Founder B"],
  },
  partnership: {
    label: "Partnership (two persons)",
    group: "Business",
    blurb: "A two-person firm sharing profits.",
    means: "A partnership under the Indian Partnership Act, 1932 — not an LLP and not a company.",
    why: "Unregistered firms are restricted in suing on contracts (s. 69). Profit share and capital should be written.",
    does: "Names the firm, capital, profit share, and a duty to register. Add a third partner only with an advocate.",
    roles: ["Partner A", "Partner B"],
  },
  mou: {
    label: "Memorandum of understanding",
    group: "Business",
    blurb: "A heads-of-terms paper — binding only if you say so.",
    means: "An MoU can be a contract or only a record of talks. Indian courts look at intention, not the label ‘MoU’.",
    why: "People sign MoUs and then argue they were (or were not) bound. You should say which it is.",
    does: "Asks if it is meant to be legally binding. If not, it says so in the recitals, except for confidentiality if you add it.",
    roles: ["First Party", "Second Party"],
  },
  referral: {
    label: "Referral / introduction",
    group: "Business",
    blurb: "A fee for introducing a client or deal.",
    means: "A success fee for a named introduction, not a retainer and not employment.",
    why: "Without a trigger (signed deal / money received) referral fights are common.",
    does: "Writes who is introduced, the rate, and when it is payable. Not a bribe and not a government tender arrangement.",
    roles: ["Referrer", "Recipient"],
  },
  amc: {
    label: "Annual maintenance (AMC)",
    group: "Business",
    blurb: "Yearly upkeep of a machine, site, or software.",
    means: "A service contract to maintain named assets for a period, usually with response times you write.",
    why: "Scope of visits, parts, and what is excluded (misuse, old hardware) needs to be on paper.",
    does: "Records the assets, period, fee, and a simple service standard. Not a warranty of the original manufacturer unless you say so.",
    roles: ["Customer", "Service Provider"],
  },
  "software-dev": {
    label: "Website / software development",
    group: "Creative and goods",
    blurb: "Build a site or app for a client.",
    means: "A contractor builds custom software. Copyright in custom work should be assigned in writing after payment.",
    why: "Scope creep, acceptance, open-source, and who owns the repo are the usual fights.",
    does: "Writes scope, milestones, acceptance, and written IP assignment on full payment. Hosting and third-party licences are extra unless listed.",
    roles: ["Client", "Developer"],
  },
  "software-licence": {
    label: "Software licence (use, not sale)",
    group: "Creative and goods",
    blurb: "Permission to use software, not a transfer of the code.",
    means: "A licence to use, not an assignment of copyright. The licensor keeps the IP.",
    why: "Users think they ‘bought the software’. A licence says how many seats, for how long, and what they must not do.",
    does: "Records the product, seats, term, and that no copyright is assigned. Not a SaaS master if you need SLAs and DPA — say so in extras.",
    roles: ["Licensor", "Licensee"],
  },
  photography: {
    label: "Photography / shoot",
    group: "Creative and goods",
    blurb: "A shoot, with who may use the photos.",
    means: "The photographer is usually first owner of copyright (s. 17) unless assigned in writing (s. 19).",
    why: "Clients assume they own every file. You must say usage (wedding album vs ads) and whether raw files are included.",
    does: "Writes the event, fee, deliverables, and a written licence or assignment as you choose.",
    roles: ["Client", "Photographer"],
  },
  influencer: {
    label: "Influencer / brand content",
    group: "Creative and goods",
    blurb: "A creator posts for a brand, for a fee.",
    means: "A short services + licence deal: deliver posts, licence the brand to use them, follow ad disclosure rules.",
    why: "ASCI / influencer guidelines expect disclosure. Who may reuse the content on ads needs a writing.",
    does: "Records deliverables, fee, usage, and that the creator is not an employee. You still follow platform and ad rules.",
    roles: ["Brand", "Creator"],
  },
  "content-licence": {
    label: "Content / photo licence",
    group: "Creative and goods",
    blurb: "Licence existing photos, copy, or art — not a work-for-hire.",
    means: "The owner keeps copyright and grants a limited right to use (territory, media, term).",
    why: "A WhatsApp ‘you can use this’ is a poor licence. Exclusive vs non-exclusive should be written.",
    does: "Writes the work, permitted use, term, and fee. Assignment (if you wanted to sell the copyright) is a different paper.",
    roles: ["Licensor", "Licensee"],
  },
  tuition: {
    label: "Coaching / tuition",
    group: "Creative and goods",
    blurb: "Private classes for a student, with a fee.",
    means: "A services agreement for teaching. It is not a school admission and not a job for the tutor.",
    why: "Fees, missed classes, and refunds should be written. Do not use this for a minor without a parent/guardian as party.",
    does: "Records subject, hours, fee, and that materials stay with the tutor unless assigned. Parent should be the contracting party if the student is under 18.",
    roles: ["Tutor", "Student / Parent"],
  },
  "sale-goods": {
    label: "Sale of movable goods",
    group: "Creative and goods",
    blurb: "Sell a phone, bike, laptop, or other movable.",
    means: "A sale of movable goods (Sale of Goods Act). Property passes when the parties intend (s. 19).",
    why: "Without a writing, ‘as-is’ and when title passes are unclear. This paper does not sell a flat or land.",
    does: "Describes the goods, price, condition, passing of property, and documents. Vehicles still need RTO transfer.",
    roles: ["Seller", "Buyer"],
  },
  "equipment-hire": {
    label: "Hire of equipment / goods",
    group: "Creative and goods",
    blurb: "Lend a camera, tool, or machine for a fee.",
    means: "Hire (bailment for reward) of movables, not a sale and not a lease of a building.",
    why: "Care, return date, and deposit need to be written. If you meant to sell it, use the sale draft.",
    does: "Records the goods, period, hire charges, deposit, and return condition.",
    roles: ["Owner of goods", "Hirer"],
  },
}

export const KIND_LABEL: Record<ContractKind, string> = Object.fromEntries(
  (Object.keys(KIND_INFO) as ContractKind[]).map((id) => [id, KIND_INFO[id].label]),
) as Record<ContractKind, string>

export const KIND_ROLES: Record<ContractKind, [string, string]> = Object.fromEntries(
  (Object.keys(KIND_INFO) as ContractKind[]).map((id) => [id, KIND_INFO[id].roles]),
) as Record<ContractKind, [string, string]>

export const KIND_GROUPS: { id: string; label: string; kinds: ContractKind[] }[] = [
  { id: "space", label: "Home and premises", kinds: ["rent", "commercial-licence", "paying-guest"] },
  {
    id: "work",
    label: "Work",
    kinds: ["freelance", "consultancy", "employment", "intern", "retainer", "vendor", "agency", "commission"],
  },
  { id: "money", label: "Money", kinds: ["loan", "promissory", "settlement", "guarantee", "indemnity", "gift-movable"] },
  { id: "business", label: "Business", kinds: ["nda", "founders", "partnership", "mou", "referral", "amc"] },
  {
    id: "creative",
    label: "Creative and goods",
    kinds: [
      "software-dev",
      "software-licence",
      "photography",
      "influencer",
      "content-licence",
      "tuition",
      "sale-goods",
      "equipment-hire",
    ],
  },
]

export const ALL_KINDS = Object.keys(KIND_INFO) as ContractKind[]
