import { DisclaimerGate } from "@/components/DisclaimerGate"
import { DraftList } from "@/components/DraftList"
import { Shell } from "@/components/Shell"

export default function DraftsPage() {
  return (
    <DisclaimerGate>
      <Shell>
        <main className="hub">
          <p className="eyebrow">Your work</p>
          <h1>Drafts</h1>
          <p className="lede">Only drafts saved while you were signed in to this account. They are not visible to anyone else.</p>
          <h2 className="section-title">In progress</h2>
          <DraftList filter="draft" empty="Nothing in progress on this account. Sign in to save drafts." />
          <h2 className="section-title">Completed contracts</h2>
          <DraftList filter="completed" empty="Completed contracts appear here after you download a PDF while signed in." />
        </main>
      </Shell>
    </DisclaimerGate>
  )
}
