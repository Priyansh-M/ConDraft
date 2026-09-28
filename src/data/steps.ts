import { ALL_KINDS, type ContractKind } from "@/lib/kinds"

export type StepHelp = { means: string; why: string; does: string }

export type StepDef = {
  id: string
  question: string
  hint?: string
  kinds: Array<ContractKind | "all">
  input: "kind" | "side" | "text" | "textarea" | "date" | "select" | "yesno" | "location"
  options?: { value: string; label: string }[]
  placeholder?: string
  help: StepHelp
}

const skip: ContractKind[] = ["rent", "paying-guest", "gift-movable", "tuition"]
const commercial: ContractKind[] = ALL_KINDS.filter((k) => !skip.includes(k))

const h = (means: string, why: string, does: string): StepHelp => ({ means, why, does })

export const STEPS: StepDef[] = [
  {
    id: "kind",
    question: "What kind of agreement is this?",
    hint: "Search or tap a type. Land, wills, and property powers of attorney are not offered.",
    kinds: ["all"],
    input: "kind",
    help: h(
      "This picks the shape of the deed: title, who is who, and which India Code sections we cite.",
      "A loan paper is the wrong tool if you needed a rent paper. Wrong type means wrong clauses.",
      "It unlocks only the questions for that type, then builds a deed-style draft with footnotes.",
    ),
  },
  {
    id: "draftingFor",
    question: "Whose side is this draft from?",
    hint: "The names on the deed stay the same. This only tilts extra protection and a short recital.",
    kinds: ["all"],
    input: "side",
    help: h(
      "Whose interests this paper should slightly protect: first party, second party, or both equally.",
      "A freelancer drafting for themselves wants payment and IP held until paid. A client wants delivery dates and assignment.",
      "If you pick a side, the next question asks for extra lines for that person. It does not swap Licensor and Licensee.",
    ),
  },
  {
    id: "sideExtra",
    question: "Anything extra to protect that side?",
    hint: "Optional. Examples: lock-in, late fee, extra rounds of edits, no sub-letting, independent legal advice.",
    kinds: ["all"],
    input: "textarea",
    placeholder: "Leave blank if the usual clauses are enough",
    help: h(
      "Free-text terms that will be pasted into the deed as ‘further protective terms’.",
      "The standard template cannot guess every risk. This is where you add the one thing you actually care about.",
      "It becomes a numbered clause. Keep it lawful — a court will not enforce a penalty or a void non-compete.",
    ),
  },
  {
    id: "tone",
    question: "How strict should the wording be?",
    kinds: ["rent", "paying-guest", "commercial-licence"],
    input: "select",
    options: [
      { value: "balanced", label: "Balanced" },
      { value: "strict", label: "Stricter for the owner" },
      { value: "lenient", label: "Gentler for the occupant" },
    ],
    help: h(
      "How hard the deposit refund and notice clauses read.",
      "Owners want deductions and short notice for non-payment. Occupants want a full refund and time to move.",
      "It only changes those few sentences. Stamp, registration, and the rest stay the same.",
    ),
  },
  {
    id: "partyAName",
    question: "First party's full legal name?",
    hint: "As on PAN / Aadhaar / company CIN. This is the first role (for example Licensor, Client, Lender).",
    kinds: ["all"],
    input: "text",
    help: h(
      "The official name that will appear after BETWEEN on the deed.",
      "A nickname or UPI name can make the paper hard to enforce.",
      "Printed on the first party block and the signature table.",
    ),
  },
  {
    id: "partyAParent",
    question: "First party: son / daughter / wife of? (optional)",
    hint: "Usual in Indian deeds. Skip for a company.",
    kinds: ["all"],
    input: "text",
    help: h(
      "A parent or spouse line used to identify a person in Indian stamp and registration practice.",
      "Optional, but sub-registrars and banks often expect it for individuals.",
      "Inserted after the name as ‘, son/daughter/wife of …’. Left blank if you skip it.",
    ),
  },
  {
    id: "partyAAge",
    question: "First party's age in years? (Must be 18+.)",
    kinds: ["all"],
    input: "text",
    help: h(
      "Age in completed years. Both parties must be adults (18+) for this tool.",
      "A contract with a minor is not treated like an adult contract. This draft is not for minors.",
      "Printed as ‘aged about X years’. We do not verify age.",
    ),
  },
  {
    id: "partyAAddress",
    question: "First party's address?",
    kinds: ["all"],
    input: "textarea",
    help: h(
      "Where notices can be sent, as a full postal address.",
      "Notices and jurisdiction need a place to serve papers.",
      "Goes into the party block on the deed.",
    ),
  },
  {
    id: "partyBName",
    question: "Second party's full legal name?",
    kinds: ["all"],
    input: "text",
    help: h(
      "The other person’s or company’s official name (Licensee, Freelancer, Borrower, and so on).",
      "Same reason as the first party — the deed has to identify both sides.",
      "Printed on the AND block and the second signature line.",
    ),
  },
  {
    id: "partyBParent",
    question: "Second party: son / daughter / wife of?",
    kinds: ["all"],
    input: "text",
    help: h(
      "Identifier line for the second individual. Skip for a company.",
      "Same registration practice as the first party.",
      "Inserted after the second party’s name if you fill it.",
    ),
  },
  {
    id: "partyBAge",
    question: "Second party's age in years? (Must be 18+.)",
    kinds: ["all"],
    input: "text",
    help: h(
      "Age of the second party. Must be 18 or over for this draft.",
      "Same competence rule as the first party.",
      "Printed as ‘aged about X years’.",
    ),
  },
  {
    id: "partyBAddress",
    question: "Second party's address?",
    kinds: ["all"],
    input: "textarea",
    help: h(
      "Full postal address of the second party.",
      "Needed for notices and to show they are a real identified person.",
      "Goes into the second party block.",
    ),
  },
  {
    id: "location",
    question: "Where is this being made — city and State?",
    hint: "Search a city or State. This picks the stamp portal and the court-city line.",
    kinds: ["all"],
    input: "location",
    help: h(
      "Place of execution and, for premises papers, where the property is.",
      "Stamp duty and registration are State subjects. The governing-law clause names this city.",
      "Fills ‘THIS AGREEMENT is made at …’ and links the official stamp / IGR site. It does not fill the rupee stamp amount except a Maharashtra rent estimate.",
    ),
  },
  {
    id: "dateOfAgreement",
    question: "Date of this agreement?",
    kinds: ["all"],
    input: "date",
    help: h(
      "The date written at the top of the deed — usually the day you sign.",
      "Stamp, limitation, and ‘from the date hereof’ clauses run from a date.",
      "Printed in the opening sentence. If you also give a start date for occupation or work, that can be different.",
    ),
  },
  {
    id: "propertyAddress",
    question: "Full address of the premises?",
    kinds: ["rent", "commercial-licence", "paying-guest"],
    input: "textarea",
    help: h(
      "The flat, shop, or room being occupied, as a survey / society / door number address.",
      "If the premises are vague, the paper is weak as evidence of which property.",
      "Inserted in the premises clause. Annex a floor plan or inventory later if you have one.",
    ),
  },
  {
    id: "furnished",
    question: "Is it furnished?",
    kinds: ["rent"],
    input: "yesno",
    help: h(
      "Whether the occupant gets furniture and appliances with the home.",
      "Fights at handover are often about what was there on day one.",
      "Writes furnished or unfurnished. Take photos and an inventory anyway.",
    ),
  },
  {
    id: "petsAllowed",
    question: "Are pets allowed?",
    kinds: ["rent", "paying-guest"],
    input: "yesno",
    help: h(
      "Whether animals may be kept at the premises.",
      "Society bye-laws can still ban pets even if this paper allows them.",
      "A one-line permission or ban. The society can still overrule it.",
    ),
  },
  {
    id: "permittedUse",
    question: "What business may be carried on there?",
    kinds: ["commercial-licence"],
    input: "text",
    placeholder: "e.g. retail clothing, CA office, clinic (with licences)",
    help: h(
      "The only permitted commercial use of the shop or office.",
      "Using the premises as a godown, kitchen, or clinic without writing it (and licences) causes notices from the society or municipality.",
      "Inserted as a use restriction. Change of use needs a fresh writing.",
    ),
  },
  {
    id: "shared",
    question: "Which areas are shared (kitchen, bath, hall)?",
    kinds: ["paying-guest"],
    input: "text",
    help: h(
      "Which parts of the home the guest may use besides their room.",
      "Exclusive possession of the whole flat looks like a tenancy.",
      "Listed in the occupation clause.",
    ),
  },
  {
    id: "rules",
    question: "House rules (guests, cooking, silence hours)?",
    kinds: ["paying-guest"],
    input: "textarea",
    help: h(
      "Domestic rules the guest agrees to follow.",
      "Written rules support that this is a PG arrangement, not a silent tenancy.",
      "Copied into the charges / rules clause.",
    ),
  },
  {
    id: "rent",
    question: "Monthly licence / PG charge (₹)?",
    kinds: ["rent", "paying-guest", "commercial-licence"],
    input: "text",
    help: h(
      "The monthly rupee amount the occupant pays.",
      "This is the consideration that makes the arrangement a contract.",
      "Printed as the monthly fee, due on the day you pick next.",
    ),
  },
  {
    id: "deposit",
    question: "Security deposit (₹)?",
    kinds: ["rent", "paying-guest", "commercial-licence", "equipment-hire"],
    input: "text",
    help: h(
      "Interest-free money held against unpaid fee or damage.",
      "There is no single all-India statute that fixes 30 or 60 days for refund of a private deposit.",
      "Written into the deposit clause with the refund days you give.",
    ),
  },
  {
    id: "rentDueDay",
    question: "Due on which day of the month?",
    kinds: ["rent", "paying-guest", "commercial-licence", "equipment-hire"],
    input: "text",
    help: h(
      "Calendar day each month when the fee must land in the owner’s account.",
      "Without a due day, ‘late’ is an argument.",
      "Inserted next to the monthly amount.",
    ),
  },
  {
    id: "durationMonths",
    question: "How many months should this last?",
    hint: "Type a number. 11 is common for homes so Registration Act s. 17 (over one year) is less likely — some States still require registration anyway, including Maharashtra.",
    kinds: ["rent", "commercial-licence"],
    input: "text",
    placeholder: "e.g. 11",
    help: h(
      "The length of the licence in months, counted from the start date.",
      "A term of 12 months or more, or year-to-year, generally needs registration under Registration Act s. 17. Eleven months is a practice, not a magic exemption. Maharashtra still expects leave-and-licence registration.",
      "The deed states the start and end dates. If you later extend, sign a fresh writing.",
    ),
  },
  {
    id: "lockInMonths",
    question: "Lock-in period (months, 0 if none)?",
    kinds: ["rent", "commercial-licence"],
    input: "text",
    help: h(
      "Months at the start during which neither side may end the arrangement except for breach.",
      "Owners use it to avoid empty months. Occupants should not agree to a long lock-in without a break clause.",
      "If greater than zero, it is written into the notice clause. 0 means ordinary notice applies from day one.",
    ),
  },
  {
    id: "startDate",
    question: "Start date?",
    kinds: ["rent", "paying-guest", "commercial-licence", "employment", "intern", "equipment-hire", "software-dev", "sale-goods", "amc", "photography"],
    input: "date",
    help: h(
      "The day occupation, work, hire, or the sale handover begins.",
      "Term, notice, and ‘from the commencement’ language need a date.",
      "Used to compute the end date where you also gave a number of months.",
    ),
  },
  {
    id: "noticeDays",
    question: "Notice period (days) to end?",
    kinds: ["rent", "paying-guest", "commercial-licence", "retainer", "employment", "intern"],
    input: "text",
    help: h(
      "How many days’ written notice either side must give to end it (after any lock-in).",
      "If you stay silent, Transfer of Property Act s. 106 defaults can surprise you on leases.",
      "Written into the termination clause.",
    ),
  },
  {
    id: "depositRefundDays",
    question: "Days after handover to refund the deposit?",
    kinds: ["rent", "commercial-licence"],
    input: "text",
    help: h(
      "How long the owner has, after keys are returned, to send the deposit back (minus documented deductions).",
      "Unwritten ‘we will see’ refunds are the most common rent fight.",
      "Goes into the deposit clause.",
    ),
  },
  {
    id: "maintenanceBy",
    question: "Who pays society / building maintenance?",
    kinds: ["rent", "commercial-licence"],
    input: "select",
    options: [
      { value: "shared", label: "Shared / to be agreed" },
      { value: "landlord", label: "Owner" },
      { value: "tenant", label: "Occupant" },
    ],
    help: h(
      "Who bears society or building maintenance, as opposed to electricity used inside.",
      "Transfer of Property Act s. 108 has defaults if you stay silent. Spell it out.",
      "A sentence in the use-and-upkeep clause. Utilities used at the premises still sit with the occupant unless you say otherwise in extras.",
    ),
  },
  {
    id: "purpose",
    question: "Purpose / description (what is this about, in 1–3 sentences)?",
    kinds: ["nda", "founders", "partnership", "settlement", "mou", "indemnity", "referral", "guarantee"],
    input: "textarea",
    help: h(
      "A short plain description of the deal, dispute, or information.",
      "Recitals tell a later reader why this paper exists.",
      "Copied into the WHEREAS section and the first operative clause.",
    ),
  },
  {
    id: "ndaItems",
    question: "What information is covered (code, customer list, designs)?",
    kinds: ["nda"],
    input: "textarea",
    help: h(
      "Types of secret you are actually sharing.",
      "A vague ‘all information’ NDA is weaker than naming the categories.",
      "Folded into the definition of confidential information, with the usual public-domain exceptions.",
    ),
  },
  {
    id: "duration",
    question: "How long does this last (months / timeline)?",
    kinds: [
      "nda",
      "freelance",
      "employment",
      "intern",
      "consultancy",
      "founders",
      "vendor",
      "software-dev",
      "equipment-hire",
      "software-licence",
      "content-licence",
      "amc",
      "agency",
      "photography",
      "influencer",
      "tuition",
    ],
    input: "text",
    help: h(
      "Months, a date range, or a project timeline in your own words.",
      "Duties need an end, or they look perpetual.",
      "Printed in the term / timeline clause. For NDAs, this is how long secrecy lasts.",
    ),
  },
  {
    id: "wantLiquidated",
    question: "Name a rupee amount if someone breaks the deal? (Not required.)",
    hint: "Contract Act s. 74: optional. A court may still award only reasonable compensation up to that sum.",
    kinds: ["nda", "freelance", "software-dev", "consultancy", "vendor", "loan", "influencer", "agency"],
    input: "yesno",
    help: h(
      "Whether to write a cap on money if there is a breach — often called liquidated damages.",
      "Indian law does not require a ‘price’ for an NDA or a services deal to be valid. If you name a sum, s. 74 caps recovery at reasonable compensation not exceeding that sum.",
      "If you say yes, the next question asks the figure and a clause is added. If no, nothing extra is added.",
    ),
  },
  {
    id: "liquidatedAmount",
    question: "Named compensation on breach (₹)?",
    kinds: ["nda", "freelance", "software-dev", "consultancy", "vendor", "loan", "influencer", "agency"],
    input: "text",
    placeholder: "Only if you answered yes",
    help: h(
      "The rupee figure you want written as a pre-estimate of loss.",
      "A figure that looks like a penalty can be cut down. Keep it realistic.",
      "Inserted as an optional clause citing s. 74.",
    ),
  },
  {
    id: "work",
    question: "Describe the work / services / founder A role?",
    kinds: ["freelance", "consultancy", "vendor", "software-dev", "retainer", "founders", "amc", "photography", "influencer", "agency", "tuition", "intern"],
    input: "textarea",
    help: h(
      "What the person is actually supposed to do, in ordinary English.",
      "‘As discussed on WhatsApp’ is not a scope.",
      "Becomes the services / role clause. You can add more in ‘any more terms’ at the end.",
    ),
  },
  {
    id: "fee",
    question: "Fee / price / settlement / retainer amount (₹)?",
    kinds: [
      "freelance",
      "consultancy",
      "vendor",
      "software-dev",
      "retainer",
      "sale-goods",
      "settlement",
      "equipment-hire",
      "amc",
      "photography",
      "influencer",
      "content-licence",
      "software-licence",
      "tuition",
      "referral",
      "agency",
      "commission",
    ],
    input: "text",
    help: h(
      "The main rupee figure: fee, price, or settlement sum.",
      "Consideration should be certain, or the contract is harder to enforce.",
      "Printed with GST ‘if applicable’. Raise real invoices yourself.",
    ),
  },
  {
    id: "milestones",
    question: "Payment milestones (or write 'one invoice')?",
    kinds: ["freelance", "vendor", "software-dev", "photography", "influencer"],
    input: "textarea",
    help: h(
      "When money is actually due — advance, on delivery, 15 days after invoice.",
      "Most unpaid-invoice fights are about when ‘done’ happened.",
      "Copied under the fee clause.",
    ),
  },
  {
    id: "ipOwner",
    question: "After payment, who owns the deliverables?",
    kinds: ["freelance", "software-dev", "photography"],
    input: "select",
    options: [
      { value: "client", label: "Client owns them after full payment (written assignment)" },
      { value: "freelancer", label: "Maker keeps IP until paid, then client" },
    ],
    help: h(
      "Who gets copyright in custom work once the fee is paid.",
      "Copyright Act s. 17: the author is first owner. s. 19: assignment must be in writing.",
      "Writes an assignment or a ‘held until paid’ sentence. Pre-existing tools stay with the maker.",
    ),
  },
  {
    id: "acceptance",
    question: "How is the work accepted?",
    kinds: ["software-dev"],
    input: "text",
    placeholder: "e.g. 7 days after staging link, or deemed accepted",
    help: h(
      "The test for ‘finished’ — written sign-off or a silence period.",
      "Without this, clients delay payment by never accepting.",
      "Inserted in the scope clause.",
    ),
  },
  {
    id: "hours",
    question: "Hours per month / expected hours?",
    kinds: ["employment", "retainer", "intern", "tuition"],
    input: "text",
    help: h(
      "Rough time commitment.",
      "Retainer unused-hours fights, and intern vs employee facts, both turn on hours.",
      "Printed in the role or retainer clause.",
    ),
  },
  {
    id: "rollover",
    question: "Do unused retainer hours roll over one month?",
    kinds: ["retainer"],
    input: "yesno",
    help: h(
      "Whether leftover hours survive into the next month.",
      "If you stay silent, each side will assume the answer that helps them.",
      "A yes or no sentence in the retainer clause.",
    ),
  },
  {
    id: "loanAmount",
    question: "Loan amount (₹)?",
    kinds: ["loan", "promissory"],
    input: "text",
    help: h(
      "The principal sum being advanced or promised.",
      "The number must match the bank / UPI transfer you will actually make.",
      "Printed as the advance or the note amount.",
    ),
  },
  {
    id: "loanMode",
    question: "How will the money be transferred?",
    kinds: ["loan"],
    input: "text",
    placeholder: "UPI / NEFT / cheque",
    help: h(
      "UPI, NEFT, cheque — something traceable.",
      "Cash loans are harder to prove and can raise other law issues.",
      "Written next to the advance.",
    ),
  },
  {
    id: "interest",
    question: "Interest % per year (0 if none)?",
    kinds: ["loan", "promissory"],
    input: "text",
    help: h(
      "Simple interest per year, or 0.",
      "Very high rates can be treated as a penalty or opposed to public policy.",
      "If greater than zero, added to the repayment sentence.",
    ),
  },
  {
    id: "dueDate",
    question: "Repayment / settlement due date?",
    kinds: ["loan", "settlement", "promissory"],
    input: "date",
    help: h(
      "The calendar date money must be paid.",
      "Limitation and default need a date.",
      "Printed in the repayment or settlement clause.",
    ),
  },
  {
    id: "prepay",
    question: "May the borrower prepay without penalty?",
    kinds: ["loan"],
    input: "yesno",
    help: h(
      "Whether the borrower can pay early without an extra charge.",
      "Some lenders want interest for the full period; borrowers want to close early.",
      "A yes or no line in the repayment clause.",
    ),
  },
  {
    id: "role",
    question: "Job title / second person's role?",
    kinds: ["employment", "founders", "intern"],
    input: "text",
    help: h(
      "Designation or the other founder’s job.",
      "Role is part of whether someone looks like an employee.",
      "Printed in the role clause.",
    ),
  },
  {
    id: "pay",
    question: "Monthly stipend or pay (₹)?",
    kinds: ["employment", "intern"],
    input: "text",
    help: h(
      "Gross monthly rupees before TDS.",
      "Statutory minimums and stipend rules can still apply even if you write a number.",
      "The pay clause. Benefits are a separate question.",
    ),
  },
  {
    id: "benefits",
    question: "Any benefits besides pay?",
    kinds: ["employment"],
    input: "text",
    help: h(
      "Anything extra: laptop, leave, insurance — or write ‘none except as required by law’.",
      "Silent benefits become ‘you promised orally’ later.",
      "A short sentence under pay.",
    ),
  },
  {
    id: "college",
    question: "College / course (if this internship is for credit)?",
    kinds: ["intern"],
    input: "text",
    placeholder: "Skip if not a college intern",
    help: h(
      "Institute name if the internship is part of a course.",
      "Colleges often need a letter on letterhead; this is the record inside the deed.",
      "Mentioned in the recitals if you fill it.",
    ),
  },
  {
    id: "goods",
    question: "Describe the goods (make, serial, registration no.)?",
    kinds: ["sale-goods", "equipment-hire", "gift-movable"],
    input: "textarea",
    help: h(
      "Enough detail that a stranger could tell which item you mean.",
      "‘My old phone’ is not identification.",
      "The goods clause. Attach photos as an annex if you can.",
    ),
  },
  {
    id: "condition",
    question: "Condition of goods?",
    kinds: ["sale-goods"],
    input: "select",
    options: [
      { value: "as-is, where-is", label: "As-is, where-is (buyer inspected)" },
      { value: "working order", label: "Seller says they are in working order" },
    ],
    help: h(
      "Whether the buyer takes the item as inspected, or the seller says it works.",
      "Private sales of used goods are usually as-is. ‘Working order’ is a representation.",
      "Printed next to the goods description.",
    ),
  },
  {
    id: "titlePass",
    question: "When does ownership of the goods pass?",
    hint: "Sale of Goods Act s. 19: property passes when the parties intend.",
    kinds: ["sale-goods"],
    input: "select",
    options: [
      { value: "payment", label: "On full payment" },
      { value: "delivery", label: "On delivery and full payment" },
    ],
    help: h(
      "The moment the buyer becomes owner (and usually takes the risk).",
      "If someone crashes the bike before payment, you need to know who owned it.",
      "A sentence in the price clause.",
    ),
  },
  {
    id: "docs",
    question: "What documents will be handed over?",
    kinds: ["sale-goods"],
    input: "text",
    help: h(
      "Bills, keys, service records, Form 29/30 for a vehicle, and so on.",
      "This paper does not transfer RTO registration by itself.",
      "Listed in the delivery clause.",
    ),
  },
  {
    id: "equityA",
    question: "Founder A equity % or Partner A capital (₹)?",
    kinds: ["founders", "partnership"],
    input: "text",
    help: h(
      "A’s split or capital contribution.",
      "Unwritten 50-50 is still a fight when someone puts in more cash.",
      "Ownership / capital clause.",
    ),
  },
  {
    id: "equityB",
    question: "Founder B equity % or Partner B capital (₹)?",
    kinds: ["founders", "partnership"],
    input: "text",
    help: h("B’s split or capital.", "Same as A.", "Same clause, second figure."),
  },
  {
    id: "shareA",
    question: "Partner A profit share %?",
    kinds: ["partnership"],
    input: "text",
    help: h("A’s share of profits and losses.", "Partnership Act defaults if you stay silent may not match what you wanted.", "Printed with B’s share."),
  },
  {
    id: "shareB",
    question: "Partner B profit share %?",
    kinds: ["partnership"],
    input: "text",
    help: h("B’s share of profits and losses.", "Must add up to 100% in real life — we do not check the maths.", "Printed with A’s share."),
  },
  {
    id: "firm",
    question: "Proposed firm name?",
    kinds: ["partnership"],
    input: "text",
    help: h("Trading name of the firm.", "Needed to apply for registration.", "Firm-name clause. Check the name is available."),
  },
  {
    id: "vesting",
    question: "Any vesting (e.g. 4 years, 1 year cliff)?",
    kinds: ["founders"],
    input: "text",
    help: h(
      "Whether equity is earned over time.",
      "Without vesting, a co-founder who leaves in month two still owns their whole %.",
      "A sentence; company SHA should repeat it later.",
    ),
  },
  {
    id: "mouBinding",
    question: "Should this MoU be a legally binding contract?",
    kinds: ["mou"],
    input: "yesno",
    help: h(
      "Whether you intend legal relations, or only a record of talks.",
      "Indian courts look at intention, not the word ‘MoU’. If you do not want it to be a contract, say so.",
      "If no, the title and recitals say it is not a contract (except any confidentiality you add in extras). If yes, it is drafted as an agreement.",
    ),
  },
  {
    id: "principalName",
    question: "Name of the person whose debt is being guaranteed?",
    kinds: ["guarantee"],
    input: "text",
    help: h(
      "The principal debtor — the one who actually owes the money.",
      "A guarantee has three people: debtor, creditor, guarantor. Missing the debtor makes the paper confused.",
      "Named in the recitals and the operative clause.",
    ),
  },
  {
    id: "capAmount",
    question: "Maximum amount of the guarantee or indemnity (₹)?",
    kinds: ["guarantee", "indemnity"],
    input: "text",
    help: h(
      "A rupee cap so the guarantor / indemnifier is not signing a blank cheque.",
      "Open-ended guarantees are dangerous. Courts still read them strictly.",
      "Inserted as a limit. If you leave it blank, the draft says the amount is as written in extras / purpose.",
    ),
  },
  {
    id: "seats",
    question: "How many users / seats?",
    kinds: ["software-licence"],
    input: "text",
    help: h("How many people may use the software at once.", "Seat count is the usual licence metric.", "Printed in the licence grant."),
  },
  {
    id: "usage",
    question: "Where may the content be used (web, ads, print, term)?",
    kinds: ["photography", "influencer", "content-licence"],
    input: "textarea",
    help: h(
      "Media, territory, and how long the licence lasts.",
      "‘You can use the photos’ is not a licence. Ads vs a private album are different grants.",
      "The usage / licence clause. Exclusive vs non-exclusive: say it here or in extras.",
    ),
  },
  {
    id: "eventDate",
    question: "Date of the shoot / campaign / event?",
    kinds: ["photography", "influencer"],
    input: "date",
    help: h("When the work happens.", "The deliverable is tied to a day.", "Printed in the scope clause."),
  },
  {
    id: "territory",
    question: "Territory or city for the agent?",
    kinds: ["agency", "commission"],
    input: "text",
    help: h("Where the agent may solicit sales.", "Overlapping agents fight over the same customer.", "Appointment clause."),
  },
  {
    id: "commissionRate",
    question: "Commission rate (e.g. 10% of invoice paid)?",
    kinds: ["agency", "commission", "referral"],
    input: "text",
    help: h(
      "The % and the trigger — intro, invoice, or money received.",
      "Ambiguous ‘10% of the deal’ is the usual dispute.",
      "The commission clause. Prefer ‘of amounts actually received’.",
    ),
  },
  {
    id: "subject",
    question: "Subject / course being taught?",
    kinds: ["tuition"],
    input: "text",
    help: h("What is being taught.", "Scope of classes.", "Printed in the services clause."),
  },
  {
    id: "assets",
    question: "What is being maintained (machine, site, software)?",
    kinds: ["amc"],
    input: "textarea",
    help: h("The assets under AMC, with make/serial if any.", "Or the AMC covers ‘everything’ and nothing.", "Scope clause."),
  },
  {
    id: "extras",
    question: "Anything else to add to this agreement?",
    hint: "Optional. Extra clauses in plain English. Skip if you are done.",
    kinds: ["all"],
    input: "textarea",
    placeholder: "Leave blank if nothing more",
    help: h(
      "A last chance to add terms the questions did not cover.",
      "Real deals always have one odd point: parking, a second instalment, a parent as guarantor.",
      "Pasted as a ‘Further terms’ clause. Keep it lawful. Then we ask about arbitration and stamp.",
    ),
  },
  {
    id: "arbitration",
    question: "Add an arbitration clause (Arbitration Act, 1996)?",
    hint: "Must be in writing. Useful for commercial deals. Usually skip for a simple PG or small personal loan.",
    kinds: commercial,
    input: "yesno",
    help: h(
      "Whether disputes go to a private arbitrator instead of (or before) court, with seat in your city.",
      "Arbitration Act s. 7 requires writing. It does not block every urgent court order.",
      "If yes, a clause is added. If no, the governing-law clause keeps local courts.",
    ),
  },
  {
    id: "stampDutyAmount",
    question: "Stamp / e-stamp amount you will actually pay (₹)?",
    hint: "Optional. Look it up on your State's official site first. Leave blank if unknown. Never skip payment.",
    kinds: ["all"],
    input: "text",
    help: h(
      "The rupee duty you will pay, after checking the State schedule — not a guess from ConDraft.",
      "An under-stamped instrument is generally inadmissible in evidence until duty and penalty are paid (Stamp Act s. 35).",
      "Written in the stamp box on the deed. Maharashtra residential leave-and-licence may show a verified estimate you can accept. Other States are not auto-calculated.",
    ),
  },
  {
    id: "stampInstrument",
    question: "How will you stamp it?",
    kinds: ["all"],
    input: "select",
    options: [
      { value: "to-be-arranged", label: "Not arranged yet" },
      { value: "stamp-paper", label: "Non-judicial stamp paper" },
      { value: "e-stamp", label: "e-Stamp" },
    ],
    help: h(
      "Paper stamp vs e-stamp vs ‘we will arrange it before signing’.",
      "The method has to match what your State actually issues.",
      "A short line in the stamp box. Arranging the stamp is still your job.",
    ),
  },
]

export function stepsFor(kind: ContractKind | "", map: Record<string, string> = {}) {
  if (!kind) return STEPS.filter((s) => s.id === "kind")
  return STEPS.filter((step) => {
    if (step.id === "liquidatedAmount" && map.wantLiquidated !== "yes") return false
    if (step.id === "sideExtra" && map.draftingFor !== "partyA" && map.draftingFor !== "partyB") return false
    return step.kinds.includes("all") || step.kinds.includes(kind)
  })
}
