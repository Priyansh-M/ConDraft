import { logOut } from "@/lib/server/auth"

export async function POST() {
  return logOut()
}
