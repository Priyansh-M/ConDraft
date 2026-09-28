export type Tone = "strict" | "balanced" | "lenient"

export type Citation = {
  id: string
  short: string
  act: string
  section: string
  summary: string
  sourceUrl: string
  lastChecked: string
}

export type AssembledClause = {
  id: string
  heading: string
  body: string
  citationIds: string[]
  explanation: string
}

export type RentAnswers = {
  landlordName: string
  landlordAddress: string
  tenantName: string
  tenantAddress: string
  propertyAddress: string
  city: string
  state: string
  rent: string
  deposit: string
  rentDueDay: string
  startDate: string
  durationMonths: string
  lockInMonths: string
  furnished: boolean
  petsAllowed: boolean
  noticeDays: string
  depositRefundDays: string
  maintenanceBy: "landlord" | "tenant" | "shared"
  stampDutyAmount: string
  stampInstrument: "stamp-paper" | "e-stamp" | "to-be-arranged"
  tone: Tone
}

export type SavedDraft = {
  id: string
  name: string
  kind: "rent" | "blank" | "interview"
  status?: "draft" | "completed"
  updatedAt: string
  rent?: RentAnswers
  blank?: BlankDoc
  interview?: { map: Record<string, string>; step: number }
}

export type FormalParty = {
  capacity: string
  name: string
  parent: string
  age: string
  address: string
}

export type FormalDoc = {
  title: string
  place: string
  date: string
  parties: FormalParty[]
  recitals: string[]
  clauses: AssembledClause[]
  tips: string[]
  stampLine: string
  stateNote: string
  roleA: string
  roleB: string
}

export type BlankDoc = {
  title: string
  partyA: string
  partyB: string
  clauses: { heading: string; body: string; citationIds: string[] }[]
}
