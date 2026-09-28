import { SiteNav } from "@/components/SiteNav"
import type { Metadata } from "next"
import { Libre_Baskerville, Source_Sans_3 } from "next/font/google"
import "./globals.css"

const sans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
})

const serif = Libre_Baskerville({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: "ConDraft",
  description: "India-only contract drafting aid with public statute citations. Not legal advice.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} h-full antialiased`}>
      <body className="min-h-full app-body">
        <SiteNav />
        {children}
        <footer className="foot">
          Reference drafts only, not legal advice. Citations link to India Code. Verify stamp duty and registration with
          your State before signing.
        </footer>
      </body>
    </html>
  )
}
