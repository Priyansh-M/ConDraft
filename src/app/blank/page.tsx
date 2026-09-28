import { BlankClient } from "@/components/BlankClient"
import { DisclaimerGate } from "@/components/DisclaimerGate"

export default function BlankPage() {
  return (
    <DisclaimerGate>
      <BlankClient />
    </DisclaimerGate>
  )
}
