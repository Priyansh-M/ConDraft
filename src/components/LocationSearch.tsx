"use client"

import { searchLocations, type LocationHit } from "@/data/states"
import { useMemo, useState } from "react"

export function LocationSearch({
  city,
  state,
  onPick,
}: {
  city: string
  state: string
  onPick: (city: string, state: string) => void
}) {
  const [q, setQ] = useState(city && state ? `${city}, ${state}` : state)
  const [open, setOpen] = useState(false)
  const hits = useMemo(() => searchLocations(q), [q])

  return (
    <div className="loc">
      <input
        value={q}
        placeholder="Search city or State — e.g. Pune, Bengaluru, Delhi"
        onChange={(e) => {
          setQ(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
      />
      {open ? (
        <ul className="loc-list">
          {hits.map((hit: LocationHit) => (
            <li key={hit.label}>
              <button
                type="button"
                onClick={() => {
                  onPick(hit.city || city, hit.state)
                  setQ(hit.city ? `${hit.city}, ${hit.state}` : hit.state)
                  setOpen(false)
                }}
              >
                {hit.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="hint">
        Selected: {city || "city not set"} · {state || "State not set"}
      </p>
    </div>
  )
}
