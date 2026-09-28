# ConDraft

ConDraft is a guided drafting aid for legal agreements. You pick a contract type, answer questions in plain English, and get a deed-format draft with recitals, witnesses, and footnotes to public central Acts.

It is a student-built legal-reference tool. It is not a law firm, advocate, or notary. It does not give legal advice, does not create an attorney–client relationship, and does not stamp, register, notarise, or file anything.

**Available for India as of now.**

## What it does

- **31 agreement types**, grouped as Home and premises, Work, Money, Business, and Creative and goods
- **Question-by-question interview**, with a plain-English explanation of each field
- **Deed-format output** you can review on screen and download as PDF
- **India Code citations** attached as footnotes from a curated list of public central Acts
- **Account-only drafts**: nothing is saved unless you are signed in; each account sees only its own drafts
- **Blank builder** for people who want to write their own clauses and attach citations

Stamp duty is never calculated as a waiver or a “you may skip this” answer. You choose a State, check the official schedule, and type the amount yourself. Where a Maharashtra estimate is shown, it is an estimate only and must still be verified.

## Stack

- [Next.js](https://nextjs.org/) (App Router) and React
- [Supabase](https://supabase.com/) for auth and draft storage (row-level security)
- [Vercel](https://vercel.com/) for hosting

## Run locally

You need Node.js 20 or later.

```bash
npm install
cp env.example .env.local
