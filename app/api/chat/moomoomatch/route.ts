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

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    // Search for businesses
    const businessResponse = await fetch(
      `${request.nextUrl.origin}/api/businesses/search?q=${encodeURIComponent(message)}`
    )
    const businessData = await businessResponse.json()
    const businesses: Business[] = businessData.businesses || []

    // Generate AI response
    let aiResponse = ""

    if (businesses.length > 0) {
      const businessCount = businesses.length
      const topBusinesses = businesses.slice(0, 3)

      // Extract key info for AI response
      const businessSummary = topBusinesses
        .map(
          b =>
            `${b.vendor_dba || b.vendor_formal_name} (${b.naics_title}) in ${b.city}`
        )
        .join(", ")

      aiResponse = `Great! I found ${businessCount} businesses matching your search. Here are some top matches:

${businessSummary}

These businesses could be perfect opportunities for Pursuit builders to create MVPs and solve real problems. Each business has unique challenges that could benefit from tech solutions.

Would you like me to search for a different type of business or location?`
    } else {
      aiResponse = `I couldn't find any businesses matching "${message}". Try searching for:

• Different business types (restaurants, retail, consulting, etc.)
• Specific NYC boroughs (Manhattan, Brooklyn, Queens, Bronx, Staten Island)
• Industry terms (accounting, construction, beauty, tech)

For example: "Find accounting firms in Manhattan" or "Show me restaurants in Brooklyn"`
    }

    return NextResponse.json({
      content: aiResponse,
      businesses: businesses.slice(0, 6) // Limit to 6 for display
    })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json(
      {
        content: "Sorry, I'm having trouble right now. Please try again!",
        businesses: []
      },
      { status: 500 }
    )
  }
}
