"use client"

import { AccountLink } from "@/components/AccountLink"
import { KIND_GROUPS, KIND_INFO } from "@/lib/kinds"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const LINKS = [
  { href: "/templates", label: "Templates", menu: true },
  { href: "/steps", label: "From the start" },
  { href: "/blank", label: "Blank" },
  { href: "/drafts", label: "Drafts" },
] as const

export function SiteNav() {
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOpen(false)
  }, [path])

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [])

  return (
    <header className="top">
      <Link href="/" className="brand">
        Con<span>Draft</span>
      </Link>
      <nav>
        <div className="nav-templates" ref={wrap}>
          <button
            type="button"
            className={path === "/templates" || open ? "is-on" : ""}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            Templates
          </button>
          {open ? (
            <div className="nav-mega">
              <p className="nav-mega-lead">
                All {Object.keys(KIND_INFO).length} agreement types. Each one opens the same question flow.
              </p>
              <div className="nav-mega-grid">
                {KIND_GROUPS.map((g) => (
                  <div key={g.id}>
                    <p className="eyebrow">{g.label}</p>
                    <ul>
                      {g.kinds.map((id) => (
                        <li key={id}>
                          <Link href={`/steps?kind=${id}`}>{KIND_INFO[id].label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <Link href="/templates" className="nav-mega-all">
                View all templates →
              </Link>
            </div>
          ) : null}
        </div>
        {LINKS.filter((l) => !("menu" in l)).map((l) => (
          <Link key={l.href} href={l.href} className={path === l.href ? "is-on" : ""}>
            {l.label}
          </Link>
        ))}
        <AccountLink />
      </nav>
    </header>
  )
}
