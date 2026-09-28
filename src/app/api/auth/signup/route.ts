import { signUp } from "@/lib/server/auth"

export async function POST(req: Request) {
  return signUp(await req.json().catch(() => null))
}
