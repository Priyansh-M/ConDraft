import { DisclaimerGate } from "@/components/DisclaimerGate"
import { InterviewClient } from "@/components/InterviewClient"
import { Suspense } from "react"

export default function StepsPage() {
  return (
    <DisclaimerGate>
      <Suspense fallback={<main className="hub">Loading…</main>}>
        <InterviewClient />
      </Suspense>
    </DisclaimerGate>
  )
}
