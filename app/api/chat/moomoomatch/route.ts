import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

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

    if (businesses.length > 0) {
      const businessCount = businesses.length
      const topBusinesses = businesses.slice(0, 3)

      // Create detailed business context for AI
      const businessDetails = topBusinesses
        .map(
          b => `
- ${b.vendor_dba || b.vendor_formal_name}
  Type: ${b.naics_title}
  Location: ${b.address1}, ${b.city}
  Borough: ${b.borough || "N/A"}
  Description: ${b.business_description || "No description available"}
  Phone: ${b.telephone || "N/A"}
  Website: ${b.website || "N/A"}`
        )
        .join("\n")

      const prompt = `You are MooMooMatch, an AI assistant helping Pursuit builders connect with NYC small businesses to create meaningful MVPs and tech solutions.

User searched for: "${message}"

I found ${businessCount} businesses. Here are the top 3:
${businessDetails}

Please provide a helpful, enthusiastic response that:
1. Acknowledges the search results
2. Highlights interesting opportunities for tech builders
3. Suggests potential MVP ideas or problems these businesses might face
4. Maintains an encouraging, builder-focused tone
5. Asks if they want to explore more businesses or different search criteria

Keep it conversational and under 150 words.`

      const result = await model.generateContent(prompt)
      aiResponse = result.response.text()
    } else {
      const prompt = `You are MooMooMatch, an AI assistant helping Pursuit builders find NYC small businesses.

The user searched for: "${message}" but I couldn't find any matching businesses.

Please provide a helpful response that:
1. Acknowledges no results were found
2. Suggests alternative search terms or approaches
3. Gives specific examples of successful searches
4. Maintains an encouraging, supportive tone
5. Focuses on helping builders find opportunities

Keep it conversational and under 100 words.`

      const result = await model.generateContent(prompt)
      aiResponse = result.response.text()
    }

    return NextResponse.json({
      content: aiResponse,
      businesses: businesses.slice(0, 6) // Limit to 6 for display
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
