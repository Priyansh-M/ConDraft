import { DisclaimerGate } from "@/components/DisclaimerGate"
import { RentClient } from "@/components/RentClient"

export default function RentPage() {
  return (
    <DisclaimerGate>
      <RentClient />
    </DisclaimerGate>
  )
}
