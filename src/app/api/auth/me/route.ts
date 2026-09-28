import { currentUser } from "@/lib/server/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const user = await currentUser()
  return NextResponse.json(user ? { email: user.email } : null)
}
