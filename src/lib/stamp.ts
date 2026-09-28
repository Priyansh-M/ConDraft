import type { ContractKind } from "@/lib/kinds"
import { monthsFrom } from "@/lib/assemble"

export type StampEstimate = { amount: number; workings: string; source: string }

const num = (v: string | undefined) => Number(String(v ?? "").replace(/[^\d.]/g, "")) || 0

/**
 * Only formulas verified against the State's own schedule are encoded. Every other State/instrument
 * returns null so the UI asks the user to look the figure up instead of guessing.
 */
export function estimateStamp(kind: ContractKind | "", map: Record<string, string>): StampEstimate | null {
  if (map.state === "Maharashtra" && (kind === "rent" || kind === "commercial-licence")) {
    return maharashtraLeaveLicence(map, kind)
  }
  return null
}

/** Maharashtra Stamp Act, Schedule I, Article 36A; terms up to 12 months are commonly assessed as one year. */
function maharashtraLeaveLicence(map: Record<string, string>, kind: ContractKind): StampEstimate | null {
  const rent = num(map.rent)
  if (!rent) return null
  const deposit = num(map.deposit)
  const months = monthsFrom(map.durationMonths || "11")
  const considered = months <= 12 ? 12 : months
  const years = Math.max(1, Math.ceil(months / 12))
  const base = rent * considered + deposit * 0.1 * years
  const raw = base * 0.0025
  const amount = Math.max(100, Math.round(raw / 100) * 100)
  const commercialNote =
    kind === "commercial-licence" ? " Confirm whether Article 36 or 36A applies for this commercial use." : ""
  return {
    amount,
    workings: `0.25% × (₹${rent.toLocaleString("en-IN")} × ${considered} month${considered === 1 ? "" : "s"} treated for duty${months <= 12 ? " (terms of 1–12 months counted as 12)" : ""} + 10% notional interest on ₹${deposit.toLocaleString("en-IN")} deposit × ${years} year${years === 1 ? "" : "s"}) = ₹${raw.toFixed(0)}, rounded to the hundred (minimum ₹100).`,
    source: `Maharashtra Stamp Act, Sch. I, Art. 36A.${commercialNote} Registration is compulsory under s. 55 of the Maharashtra Rent Control Act, 1999 for the residential form; registration fee is extra. Confirm on the IGR calculator before paying.`,
  }
}
