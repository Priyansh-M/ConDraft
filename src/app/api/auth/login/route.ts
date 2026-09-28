import { logIn } from "@/lib/server/auth"

export async function POST(req: Request) {
  return logIn(await req.json().catch(() => null))
}
