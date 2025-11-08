import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

interface Business {
  vendor_formal_name: string
  vendor_dba?: string
  address1: string
  city: string
  borough?: string
  naics_sector: string
  naics_subsector?: string
  naics_title: string
  telephone?: string
  website?: string
  business_description?: string
  relevanceScore?: number
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    // Search for businesses
    const businessResponse = await fetch(
      `${request.nextUrl.origin}/api/businesses/search?q=${encodeURIComponent(message)}`
    )
    const businessData = await businessResponse.json()
    const businesses: Business[] = businessData.businesses || []

    // Generate AI response using Google Gemini
    let aiResponse = ""

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY
    if (!apiKey) {
      throw new Error("Google Gemini API key not configured")
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const hasExactMatches = businessData.hasExactMatches
    const suggestions = businessData.suggestions || []

    if (hasExactMatches && businesses.length > 0) {
      const businessCount = businesses.length
      const topBusinesses = businesses.slice(0, Math.min(3, businesses.length))

      // Create detailed business context for AI
      const businessDetails = topBusinesses
        .map(
          b => `
- ${b.vendor_dba || b.vendor_formal_name}
  Type: ${b.naics_title}
  Sector: ${b.naics_sector}
  Location: ${b.address1}, ${b.city}
  Borough: ${b.borough || "N/A"}
  Description: ${b.business_description || "No description available"}
  Phone: ${b.telephone || "N/A"}
  Website: ${b.website || "N/A"}`
        )
        .join("\n")

      const prompt = `You are MooMooMatch, helping Pursuit builders find NYC businesses for tech solutions.

Found ${businessCount} matches for "${message}":
${businessDetails}

Give a concise response (under 80 words) that:
- Confirms the matches found
- Mentions they're clickable for MVP ideas
- Asks if they want to search for something else

Be direct and builder-focused.`

      const result = await model.generateContent(prompt)
      aiResponse = result.response.text()
    } else if (suggestions.length > 0) {
      const suggestionDetails = suggestions
        .slice(0, 3)
        .map(
          b => `
- ${b.vendor_dba || b.vendor_formal_name}
  Type: ${b.naics_title}
  Sector: ${b.naics_sector}
  Borough: ${b.borough || "N/A"}`
        )
        .join("\n")

      const prompt = `You are MooMooMatch, helping Pursuit builders find NYC businesses.

No exact matches for "${message}", but found related options:
${suggestionDetails}

Give a concise response (under 60 words) that:
- Says no exact matches found
- Shows the alternatives
- Suggests trying "restaurants in Queens" or "tech companies in Brooklyn"

Be direct and helpful.`

      const result = await model.generateContent(prompt)
      aiResponse = result.response.text()
    } else {
      const prompt = `You are MooMooMatch, helping Pursuit builders find NYC businesses.

No matches found for "${message}" in our 11,328 SBS-certified businesses.

Give a concise response (under 50 words) that:
- Says no matches found
- Suggests trying: "restaurants in Queens", "tech companies in Brooklyn", "accounting firms in Manhattan"

Be direct and helpful.`

      const result = await model.generateContent(prompt)
      aiResponse = result.response.text()
    }

    return NextResponse.json({
      content: aiResponse,
      businesses: hasExactMatches
        ? businesses.slice(0, 6)
        : suggestions.slice(0, 6),
      hasExactMatches: hasExactMatches,
      isShowingSuggestions: !hasExactMatches && suggestions.length > 0
    })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json(
      {
        content:
          "Sorry, I'm having trouble connecting to my AI brain right now. Please try again!",
        businesses: []
      },
      { status: 500 }
    )
  }
}
