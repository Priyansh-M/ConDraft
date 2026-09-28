import { DisclaimerGate } from "@/components/DisclaimerGate"
import { Shell, TemplateGrid } from "@/components/Shell"
import { KIND_LABEL } from "@/lib/kinds"

export default function TemplatesPage() {
  return (
    <DisclaimerGate>
      <Shell>
        <main className="hub">
          <p className="eyebrow">{Object.keys(KIND_LABEL).length} types</p>
          <h1>Templates</h1>
          <p className="lede">
            Every agreement type uses the same top bar and the same one-question-at-a-time flow. Pick one to start.
          </p>
          <TemplateGrid />
        </main>
      </Shell>
    </DisclaimerGate>
  )
}
