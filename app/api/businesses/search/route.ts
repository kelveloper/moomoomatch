import { NextRequest, NextResponse } from "next/server"

interface Business {
  vendor_formal_name: string
  vendor_dba?: string
  address1: string
  city: string
  borough?: string
  naics_sector: string
  naics_title: string
  telephone?: string
  website?: string
  business_description?: string
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter required" },
      { status: 400 }
    )
  }

  try {
    // Parse the natural language query
    const { industry, borough, searchTerms } = parseQuery(query)

    // Build the API query
    let apiUrl =
      "https://data.cityofnewyork.us/resource/ci93-uc8s.json?$limit=100"

    // Add filters based on parsed query
    if (borough) {
      apiUrl += `&borough=${encodeURIComponent(borough.toUpperCase())}`
    }

    if (industry) {
      const whereClause = `upper(naics_title) like upper('%${industry}%') OR upper(naics_sector) like upper('%${industry}%')`
      apiUrl += `&$where=${encodeURIComponent(whereClause)}`
    } else if (searchTerms.length > 0) {
      const searchConditions = searchTerms
        .map(
          term =>
            `upper(vendor_formal_name) like upper('%${term}%') OR upper(vendor_dba) like upper('%${term}%') OR upper(naics_title) like upper('%${term}%')`
        )
        .join(" OR ")
      apiUrl += `&$where=${encodeURIComponent(searchConditions)}`
    }

    console.log("API URL:", apiUrl)

    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const businesses: Business[] = await response.json()

    // Filter and rank results
    const filteredBusinesses = businesses
      .filter(business => business.vendor_formal_name && business.address1)
      .slice(0, 50) // Limit to 50 results for performance

    return NextResponse.json({
      businesses: filteredBusinesses,
      count: filteredBusinesses.length,
      query: query
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { error: "Failed to search businesses" },
      { status: 500 }
    )
  }
}

function parseQuery(query: string): {
  industry: string | null
  borough: string | null
  searchTerms: string[]
} {
  const lowerQuery = query.toLowerCase()

  // Extract borough
  const boroughs = ["manhattan", "brooklyn", "queens", "bronx", "staten island"]
  const borough = boroughs.find(b => lowerQuery.includes(b))

  // Extract common industry terms
  const industryMap: { [key: string]: string } = {
    restaurant: "restaurant",
    restaurants: "restaurant",
    food: "food",
    italian: "restaurant",
    pizza: "restaurant",
    cafe: "restaurant",
    coffee: "restaurant",
    accounting: "accounting",
    accountant: "accounting",
    retail: "retail",
    store: "retail",
    shop: "retail",
    construction: "construction",
    contractor: "construction",
    consulting: "consulting",
    consultant: "consulting",
    tech: "technology",
    technology: "technology",
    software: "technology",
    marketing: "marketing",
    advertising: "marketing",
    legal: "legal",
    law: "legal",
    attorney: "legal",
    medical: "health",
    healthcare: "health",
    doctor: "health",
    fitness: "fitness",
    gym: "fitness",
    beauty: "beauty",
    salon: "beauty",
    barber: "beauty"
  }

  let industry: string | null = null
  for (const [key, value] of Object.entries(industryMap)) {
    if (lowerQuery.includes(key)) {
      industry = value
      break
    }
  }

  // Extract remaining search terms
  const searchTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter(
      term =>
        !boroughs.includes(term) &&
        !Object.keys(industryMap).includes(term) &&
        term.length > 2
    )

  return { industry, borough, searchTerms }
}
