export type StateInfo = {
  name: string
  kind: "State" | "UT"
  lookupLabel: string
  lookupUrl: string
  extraNote: string
}

export const INDIAN_STATES: StateInfo[] = [
  { name: "Andhra Pradesh", kind: "State", lookupLabel: "Registration & Stamps, Andhra Pradesh", lookupUrl: "https://registration.ap.gov.in/", extraNote: "Stamp duty follows the Andhra Pradesh schedule. Leases over one year generally need registration under the Registration Act; confirm leave-and-licence practice locally." },
  { name: "Arunachal Pradesh", kind: "State", lookupLabel: "SHCIL e-Stamping", lookupUrl: "https://www.shcilestamp.com/", extraNote: "Use the State registration office / SHCIL for current stamp practice. Confirm whether your instrument must be registered." },
  { name: "Assam", kind: "State", lookupLabel: "Inspector General of Registration, Assam", lookupUrl: "https://igr.assam.gov.in/", extraNote: "Assam stamp and registration practice is on the IGR portal. Rates are not calculated by ConDraft." },
  { name: "Bihar", kind: "State", lookupLabel: "e-Nibandhan, Bihar", lookupUrl: "https://enibandhan.bihar.gov.in/", extraNote: "Check Bihar registration for stamp and whether the instrument is compulsorily registrable." },
  { name: "Chhattisgarh", kind: "State", lookupLabel: "SHCIL e-Stamping", lookupUrl: "https://www.shcilestamp.com/", extraNote: "Chhattisgarh has its own stamp schedule. Confirm with the local Sub-Registrar / SHCIL." },
  { name: "Goa", kind: "State", lookupLabel: "Registration Department, Goa", lookupUrl: "https://registration.goa.gov.in/", extraNote: "Goa stamp duty and registration are handled through the State registration department." },
  { name: "Gujarat", kind: "State", lookupLabel: "GARVI, Gujarat", lookupUrl: "https://garvi.gujarat.gov.in/", extraNote: "Use GARVI for stamps and registration. Leave-and-licence / lease practice should be confirmed for the district." },
  { name: "Haryana", kind: "State", lookupLabel: "IGR Haryana", lookupUrl: "https://igrharyana.gov.in/", extraNote: "Haryana stamp and registration are district-based. Confirm the instrument type with the Sub-Registrar." },
  { name: "Himachal Pradesh", kind: "State", lookupLabel: "SHCIL e-Stamping", lookupUrl: "https://www.shcilestamp.com/", extraNote: "Confirm HP stamp schedule and registration at the local Sub-Registrar." },
  { name: "Jharkhand", kind: "State", lookupLabel: "SHCIL e-Stamping", lookupUrl: "https://www.shcilestamp.com/", extraNote: "Jharkhand stamp duty is State-scheduled. Confirm registration requirement locally." },
  { name: "Karnataka", kind: "State", lookupLabel: "Kaveri Online Services", lookupUrl: "https://kaverionline.karnataka.gov.in/", extraNote: "Karnataka Stamp Act schedule applies. Kaveri is the usual portal for stamps and registration." },
  { name: "Kerala", kind: "State", lookupLabel: "Registration Department, Kerala", lookupUrl: "https://keralaregistration.gov.in/", extraNote: "Kerala stamp and registration are on the State registration portal. Confirm leave-and-licence practice." },
  { name: "Madhya Pradesh", kind: "State", lookupLabel: "IGR Madhya Pradesh", lookupUrl: "https://www.mpigr.gov.in/", extraNote: "MP stamp schedule and registration are through IGR MP / the local SRO." },
  { name: "Maharashtra", kind: "State", lookupLabel: "IGR Maharashtra", lookupUrl: "https://igrmaharashtra.gov.in/", extraNote: "Maharashtra commonly requires registration of leave-and-licence agreements even for 11-month terms (see Maharashtra Rent Control Act practice and IGR). Do not assume 11 months avoids registration." },
  { name: "Manipur", kind: "State", lookupLabel: "SHCIL e-Stamping", lookupUrl: "https://www.shcilestamp.com/", extraNote: "Confirm Manipur stamp and registration at the local office / SHCIL." },
  { name: "Meghalaya", kind: "State", lookupLabel: "SHCIL e-Stamping", lookupUrl: "https://www.shcilestamp.com/", extraNote: "Confirm Meghalaya stamp and registration locally." },
  { name: "Mizoram", kind: "State", lookupLabel: "SHCIL e-Stamping", lookupUrl: "https://www.shcilestamp.com/", extraNote: "Confirm Mizoram stamp and registration locally." },
  { name: "Nagaland", kind: "State", lookupLabel: "SHCIL e-Stamping", lookupUrl: "https://www.shcilestamp.com/", extraNote: "Confirm Nagaland stamp and registration locally. Special local laws may apply." },
  { name: "Odisha", kind: "State", lookupLabel: "IGR Odisha", lookupUrl: "https://www.igrodisha.gov.in/", extraNote: "Odisha stamp and registration through IGR Odisha. Confirm instrument type." },
  { name: "Punjab", kind: "State", lookupLabel: "IGR Punjab", lookupUrl: "https://igrpunjab.gov.in/", extraNote: "Punjab stamp schedule and registration via IGR Punjab." },
  { name: "Rajasthan", kind: "State", lookupLabel: "eGRAS / Registration, Rajasthan", lookupUrl: "https://egras.rajasthan.gov.in/", extraNote: "Rajasthan stamp duty is commonly paid through eGRAS. Confirm registration." },
  { name: "Sikkim", kind: "State", lookupLabel: "SHCIL e-Stamping", lookupUrl: "https://www.shcilestamp.com/", extraNote: "Confirm Sikkim stamp and registration locally." },
  { name: "Tamil Nadu", kind: "State", lookupLabel: "TNREGINET", lookupUrl: "https://tnreginet.gov.in/", extraNote: "Tamil Nadu stamp and registration through TNREGINET. Confirm lease / licence practice." },
  { name: "Telangana", kind: "State", lookupLabel: "Registration & Stamps, Telangana", lookupUrl: "https://registration.telangana.gov.in/", extraNote: "Telangana stamp schedule applies. Confirm registration of the instrument." },
  { name: "Tripura", kind: "State", lookupLabel: "SHCIL e-Stamping", lookupUrl: "https://www.shcilestamp.com/", extraNote: "Confirm Tripura stamp and registration locally." },
  { name: "Uttar Pradesh", kind: "State", lookupLabel: "IGRS Uttar Pradesh", lookupUrl: "https://igrsup.gov.in/", extraNote: "UP stamp and registration through IGRS-UP. Confirm whether the instrument is compulsorily registrable." },
  { name: "Uttarakhand", kind: "State", lookupLabel: "Registration, Uttarakhand", lookupUrl: "https://registration.uk.gov.in/", extraNote: "Uttarakhand stamp and registration through the State registration portal." },
  { name: "West Bengal", kind: "State", lookupLabel: "Registration & Stamp Revenue, West Bengal", lookupUrl: "https://wbregistration.gov.in/", extraNote: "West Bengal stamp and registration through the Directorate portal. Confirm licence vs lease practice." },
  { name: "Andaman and Nicobar Islands", kind: "UT", lookupLabel: "SHCIL e-Stamping", lookupUrl: "https://www.shcilestamp.com/", extraNote: "UT stamp/registration via the local administration / SHCIL." },
  { name: "Chandigarh", kind: "UT", lookupLabel: "SHCIL e-Stamping", lookupUrl: "https://www.shcilestamp.com/", extraNote: "Chandigarh often follows Punjab-style stamp practice; confirm with the local Sub-Registrar." },
  { name: "Dadra and Nagar Haveli and Daman and Diu", kind: "UT", lookupLabel: "SHCIL e-Stamping", lookupUrl: "https://www.shcilestamp.com/", extraNote: "Confirm UT stamp and registration locally." },
  { name: "Delhi", kind: "UT", lookupLabel: "SHCIL e-Stamping / Delhi", lookupUrl: "https://www.shcilestamp.com/", extraNote: "Delhi stamp is typically via SHCIL e-stamp. Delhi Rent Control does not apply to many newer premises; still confirm licence vs tenancy with an advocate." },
  { name: "Jammu and Kashmir", kind: "UT", lookupLabel: "SHCIL e-Stamping", lookupUrl: "https://www.shcilestamp.com/", extraNote: "Confirm J&K stamp and registration with the local registering authority." },
  { name: "Ladakh", kind: "UT", lookupLabel: "SHCIL e-Stamping", lookupUrl: "https://www.shcilestamp.com/", extraNote: "Confirm Ladakh stamp and registration locally." },
  { name: "Lakshadweep", kind: "UT", lookupLabel: "SHCIL e-Stamping", lookupUrl: "https://www.shcilestamp.com/", extraNote: "Confirm Lakshadweep stamp and registration with the UT administration." },
  { name: "Puducherry", kind: "UT", lookupLabel: "SHCIL e-Stamping", lookupUrl: "https://www.shcilestamp.com/", extraNote: "Puducherry has its own stamp practice; confirm at the local Sub-Registrar." },
]

export const CITIES: { name: string; state: string; aliases?: string[] }[] = [
  { name: "Mumbai", state: "Maharashtra", aliases: ["Bombay"] },
  { name: "Pune", state: "Maharashtra" },
  { name: "Nagpur", state: "Maharashtra" },
  { name: "Nashik", state: "Maharashtra" },
  { name: "Thane", state: "Maharashtra" },
  { name: "Navi Mumbai", state: "Maharashtra" },
  { name: "Aurangabad", state: "Maharashtra", aliases: ["Chhatrapati Sambhajinagar"] },
  { name: "Bengaluru", state: "Karnataka", aliases: ["Bangalore"] },
  { name: "Mysuru", state: "Karnataka", aliases: ["Mysore"] },
  { name: "Mangaluru", state: "Karnataka", aliases: ["Mangalore"] },
  { name: "Hubballi", state: "Karnataka", aliases: ["Hubli"] },
  { name: "Hyderabad", state: "Telangana" },
  { name: "Warangal", state: "Telangana" },
  { name: "Chennai", state: "Tamil Nadu", aliases: ["Madras"] },
  { name: "Coimbatore", state: "Tamil Nadu" },
  { name: "Madurai", state: "Tamil Nadu" },
  { name: "Tiruchirappalli", state: "Tamil Nadu", aliases: ["Trichy"] },
  { name: "Kochi", state: "Kerala", aliases: ["Cochin", "Ernakulam"] },
  { name: "Thiruvananthapuram", state: "Kerala", aliases: ["Trivandrum"] },
  { name: "Kozhikode", state: "Kerala", aliases: ["Calicut"] },
  { name: "Kolkata", state: "West Bengal", aliases: ["Calcutta"] },
  { name: "Howrah", state: "West Bengal" },
  { name: "Siliguri", state: "West Bengal" },
  { name: "New Delhi", state: "Delhi", aliases: ["Delhi", "NCR"] },
  { name: "Noida", state: "Uttar Pradesh" },
  { name: "Ghaziabad", state: "Uttar Pradesh" },
  { name: "Lucknow", state: "Uttar Pradesh" },
  { name: "Kanpur", state: "Uttar Pradesh" },
  { name: "Varanasi", state: "Uttar Pradesh", aliases: ["Banaras"] },
  { name: "Prayagraj", state: "Uttar Pradesh", aliases: ["Allahabad"] },
  { name: "Agra", state: "Uttar Pradesh" },
  { name: "Gurugram", state: "Haryana", aliases: ["Gurgaon"] },
  { name: "Faridabad", state: "Haryana" },
  { name: "Chandigarh", state: "Chandigarh" },
  { name: "Jaipur", state: "Rajasthan" },
  { name: "Jodhpur", state: "Rajasthan" },
  { name: "Udaipur", state: "Rajasthan" },
  { name: "Ahmedabad", state: "Gujarat" },
  { name: "Surat", state: "Gujarat" },
  { name: "Vadodara", state: "Gujarat", aliases: ["Baroda"] },
  { name: "Rajkot", state: "Gujarat" },
  { name: "Bhopal", state: "Madhya Pradesh" },
  { name: "Indore", state: "Madhya Pradesh" },
  { name: "Gwalior", state: "Madhya Pradesh" },
  { name: "Patna", state: "Bihar" },
  { name: "Gaya", state: "Bihar" },
  { name: "Ranchi", state: "Jharkhand" },
  { name: "Jamshedpur", state: "Jharkhand" },
  { name: "Bhubaneswar", state: "Odisha" },
  { name: "Cuttack", state: "Odisha" },
  { name: "Guwahati", state: "Assam" },
  { name: "Shillong", state: "Meghalaya" },
  { name: "Imphal", state: "Manipur" },
  { name: "Aizawl", state: "Mizoram" },
  { name: "Kohima", state: "Nagaland" },
  { name: "Agartala", state: "Tripura" },
  { name: "Itanagar", state: "Arunachal Pradesh" },
  { name: "Gangtok", state: "Sikkim" },
  { name: "Panaji", state: "Goa", aliases: ["Panjim"] },
  { name: "Margao", state: "Goa" },
  { name: "Shimla", state: "Himachal Pradesh" },
  { name: "Dehradun", state: "Uttarakhand" },
  { name: "Haridwar", state: "Uttarakhand" },
  { name: "Amritsar", state: "Punjab" },
  { name: "Ludhiana", state: "Punjab" },
  { name: "Mohali", state: "Punjab" },
  { name: "Raipur", state: "Chhattisgarh" },
  { name: "Visakhapatnam", state: "Andhra Pradesh", aliases: ["Vizag"] },
  { name: "Vijayawada", state: "Andhra Pradesh" },
  { name: "Tirupati", state: "Andhra Pradesh" },
  { name: "Puducherry", state: "Puducherry", aliases: ["Pondicherry"] },
  { name: "Srinagar", state: "Jammu and Kashmir" },
  { name: "Jammu", state: "Jammu and Kashmir" },
  { name: "Leh", state: "Ladakh" },
  { name: "Port Blair", state: "Andaman and Nicobar Islands" },
  { name: "Kavaratti", state: "Lakshadweep" },
  { name: "Silvassa", state: "Dadra and Nagar Haveli and Daman and Diu" },
  { name: "Daman", state: "Dadra and Nagar Haveli and Daman and Diu" },
]

export function stateInfo(name: string) {
  return INDIAN_STATES.find((item) => item.name === name)
}

export type LocationHit = { label: string; city: string; state: string }

export function searchLocations(query: string): LocationHit[] {
  const q = query.trim().toLowerCase()
  if (!q) {
    return INDIAN_STATES.slice(0, 8).map((s) => ({ label: s.name, city: "", state: s.name }))
  }
  const hits: LocationHit[] = []
  for (const city of CITIES) {
    const blob = [city.name, city.state, ...(city.aliases ?? [])].join(" ").toLowerCase()
    if (blob.includes(q)) hits.push({ label: `${city.name}, ${city.state}`, city: city.name, state: city.state })
  }
  for (const s of INDIAN_STATES) {
    if (s.name.toLowerCase().includes(q)) hits.push({ label: s.name, city: "", state: s.name })
  }
  return hits.slice(0, 12)
}
