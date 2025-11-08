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

      const prompt = `You are MooMooMatch, an AI assistant helping Pursuit builders connect with NYC small businesses to create meaningful MVPs and tech solutions.

User searched for: "${message}"

I found ${businessCount} highly relevant businesses that closely match the search criteria. Here are the top matches:
${businessDetails}

Please provide a focused, enthusiastic response that:
1. Acknowledges the quality matches found
2. Highlights specific opportunities for tech builders based on their business types
3. Suggests potential MVP ideas or problems these specific businesses might face
4. Maintains an encouraging, builder-focused tone
5. Asks if they want to explore these businesses further or refine their search

Keep it conversational and under 150 words. Focus on quality over quantity.`

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

      const prompt = `You are MooMooMatch, an AI assistant helping Pursuit builders find NYC small businesses.

The user searched for: "${message}" but I couldn't find exact matches. However, I found some related businesses that might interest them:
${suggestionDetails}

Please provide a helpful response that:
1. Acknowledges no exact matches were found
2. Presents the closest alternatives I found
3. Suggests how to refine their search for better results
4. Maintains an encouraging, supportive tone
5. Offers specific examples of successful search terms

Keep it conversational and under 120 words. Be honest about the lack of exact matches but helpful with alternatives.`

      const result = await model.generateContent(prompt)
      aiResponse = result.response.text()
    } else {
      const prompt = `You are MooMooMatch, an AI assistant helping Pursuit builders find NYC small businesses.

The user searched for: "${message}" but I couldn't find any matching businesses in our database of 11,328 NYC small businesses.

Please provide a helpful response that:
1. Acknowledges no matches were found
2. Suggests alternative search approaches (try different industry terms, broader categories, or specific NYC boroughs)
3. Gives 3-4 specific examples of successful searches like "restaurants in Brooklyn", "accounting firms in Manhattan", "construction companies in Queens"
4. Maintains an encouraging, supportive tone
5. Reminds them our database focuses on SBS-certified small businesses

Keep it conversational and under 100 words.`

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
