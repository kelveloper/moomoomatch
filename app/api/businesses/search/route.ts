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

    // Build strict search conditions focusing on key columns
    let whereConditions: string[] = []

    // Borough filter (exact match)
    if (borough) {
      whereConditions.push(`upper(borough) = '${borough.toUpperCase()}'`)
    }

    // Industry/business type filter (strict matching on key columns)
    if (industry) {
      const industryConditions = [
        `upper(naics_sector) like upper('%${industry}%')`,
        `upper(naics_subsector) like upper('%${industry}%')`,
        `upper(naics_title) like upper('%${industry}%')`,
        `upper(business_description) like upper('%${industry}%')`
      ]
      whereConditions.push(`(${industryConditions.join(" OR ")})`)
    }

    // Additional search terms (strict matching)
    if (searchTerms.length > 0) {
      const termConditions = searchTerms.map(term => {
        return `(upper(naics_sector) like upper('%${term}%') OR upper(naics_subsector) like upper('%${term}%') OR upper(naics_title) like upper('%${term}%') OR upper(business_description) like upper('%${term}%'))`
      })
      whereConditions.push(`(${termConditions.join(" OR ")})`)
    }

    // Build the API query with strict filtering
    let apiUrl =
      "https://data.cityofnewyork.us/resource/ci93-uc8s.json?$limit=50"

    if (whereConditions.length > 0) {
      const whereClause = whereConditions.join(" AND ")
      apiUrl += `&$where=${encodeURIComponent(whereClause)}`
    }

    console.log("API URL:", apiUrl)

    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const businesses: Business[] = await response.json()

    // Strict filtering and relevance scoring
    const scoredBusinesses = businesses
      .filter(business => business.vendor_formal_name && business.address1)
      .map(business => ({
        ...business,
        relevanceScore: calculateRelevanceScore(
          business,
          query,
          industry,
          searchTerms
        )
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)

    // Only return highly relevant results (score > 0.3) or top 10 max
    const relevantBusinesses = scoredBusinesses
      .filter(business => business.relevanceScore > 0.3)
      .slice(0, 10)

    // If no highly relevant results, try a broader search for suggestions
    let suggestions: Business[] = []
    if (relevantBusinesses.length === 0) {
      suggestions = await findClosestMatches(industry, borough, searchTerms)
    }

    return NextResponse.json({
      businesses: relevantBusinesses,
      suggestions: suggestions,
      count: relevantBusinesses.length,
      query: query,
      hasExactMatches: relevantBusinesses.length > 0
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { error: "Failed to search businesses" },
      { status: 500 }
    )
  }
}

// Calculate relevance score based on exact matches in key fields
function calculateRelevanceScore(
  business: Business,
  query: string,
  industry: string | null,
  searchTerms: string[]
): number {
  let score = 0
  const queryLower = query.toLowerCase()

  // Exact matches in key fields get highest scores
  if (
    business.naics_title &&
    business.naics_title.toLowerCase().includes(queryLower)
  )
    score += 1.0
  if (
    business.naics_sector &&
    business.naics_sector.toLowerCase().includes(queryLower)
  )
    score += 0.8
  if (
    business.naics_subsector &&
    business.naics_subsector.toLowerCase().includes(queryLower)
  )
    score += 0.7
  if (
    business.business_description &&
    business.business_description.toLowerCase().includes(queryLower)
  )
    score += 0.6

  // Industry-specific scoring
  if (industry) {
    const industryLower = industry.toLowerCase()
    if (
      business.naics_title &&
      business.naics_title.toLowerCase().includes(industryLower)
    )
      score += 0.9
    if (
      business.naics_sector &&
      business.naics_sector.toLowerCase().includes(industryLower)
    )
      score += 0.7
    if (
      business.business_description &&
      business.business_description.toLowerCase().includes(industryLower)
    )
      score += 0.5
  }

  // Search terms scoring
  searchTerms.forEach(term => {
    const termLower = term.toLowerCase()
    if (
      business.naics_title &&
      business.naics_title.toLowerCase().includes(termLower)
    )
      score += 0.4
    if (
      business.business_description &&
      business.business_description.toLowerCase().includes(termLower)
    )
      score += 0.3
  })

  return score
}

// Find closest matches when no exact matches are found
async function findClosestMatches(
  industry: string | null,
  borough: string | null,
  searchTerms: string[]
): Promise<Business[]> {
  try {
    let broadSearchUrl =
      "https://data.cityofnewyork.us/resource/ci93-uc8s.json?$limit=20"

    // Broader search for suggestions
    if (industry) {
      const broadIndustrySearch = `upper(naics_sector) like upper('%${industry.split(" ")[0]}%')`
      broadSearchUrl += `&$where=${encodeURIComponent(broadIndustrySearch)}`
    } else if (searchTerms.length > 0) {
      const broadTermSearch = `upper(naics_title) like upper('%${searchTerms[0]}%')`
      broadSearchUrl += `&$where=${encodeURIComponent(broadTermSearch)}`
    }

    const response = await fetch(broadSearchUrl)
    if (!response.ok) return []

    const suggestions: Business[] = await response.json()
    return suggestions.slice(0, 5) // Max 5 suggestions
  } catch (error) {
    console.error("Error finding suggestions:", error)
    return []
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
