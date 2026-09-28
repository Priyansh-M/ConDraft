import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import type { SavedDraft } from "@/types"

type User = { id: string; email: string; salt: string; hash: string; createdAt: string }
type Db = { users: User[]; drafts: (SavedDraft & { userId: string })[] }

const DIR = path.join(process.cwd(), ".data")
const FILE = path.join(DIR, "db.json")

export async function readDb(): Promise<Db> {
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as Db
  } catch {
    return { users: [], drafts: [] }
  }
}

export async function writeDb(db: Db) {
  await mkdir(DIR, { recursive: true })
  await writeFile(FILE, JSON.stringify(db, null, 2))
}

async function secret() {
  if (process.env.CONDRAFT_SECRET) return process.env.CONDRAFT_SECRET
  const file = path.join(DIR, "secret")
  try {
    return await readFile(file, "utf8")
  } catch {
    const value = randomBytes(32).toString("hex")
    await mkdir(DIR, { recursive: true })
    await writeFile(file, value)
    return value
  }
}

export function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  return { salt, hash: scryptSync(password, salt, 64).toString("hex") }
}

export function checkPassword(password: string, user: User) {
  const attempt = Buffer.from(hashPassword(password, user.salt).hash, "hex")
  const stored = Buffer.from(user.hash, "hex")
  return attempt.length === stored.length && timingSafeEqual(attempt, stored)
}

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000

export async function signSession(userId: string) {
  const expires = Date.now() + THIRTY_DAYS
  const mac = createHmac("sha256", await secret()).update(`${userId}.${expires}`).digest("hex")
  return `${userId}.${expires}.${mac}`
}

export async function verifySession(token: string | undefined) {
  if (!token) return null
  const [userId, expires, mac] = token.split(".")
  if (!userId || !expires || !mac || Number(expires) < Date.now()) return null
  const expected = createHmac("sha256", await secret()).update(`${userId}.${expires}`).digest("hex")
  if (expected.length !== mac.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(mac))) return null
  const db = await readDb()
  return db.users.find((u) => u.id === userId) ?? null
}

export const SESSION_COOKIE = "condraft_session"
export const SESSION_MAX_AGE = THIRTY_DAYS / 1000
