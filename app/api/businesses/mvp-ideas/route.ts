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
}

export async function POST(request: NextRequest) {
  try {
    const { business }: { business: Business } = await request.json()

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY
    if (!apiKey) {
      throw new Error("Google Gemini API key not configured")
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const businessName = business.vendor_dba || business.vendor_formal_name
    const businessType = business.naics_title
    const businessSector = business.naics_sector
    const businessDescription =
      business.business_description || "No description available"

    const prompt = `You are MooMooMatch, helping Pursuit builders identify MVP opportunities.

Business: ${businessName}
Type: ${businessType}
Sector: ${businessSector}
Description: ${businessDescription}
Location: ${business.borough || business.city}

As a Pursuit builder, provide exactly 3 specific MVP ideas that could solve real bottlenecks for this business. For each idea:

1. **Problem**: What specific bottleneck/pain point does this business likely face?
2. **MVP Solution**: A simple tech solution a builder could create in 2-4 weeks
3. **Tech Stack**: Suggested technologies (keep it simple)

Format as:
**MVP Idea 1: [Title]**
Problem: [specific pain point]
Solution: [simple MVP description]
Tech: [suggested stack]

**MVP Idea 2: [Title]**
Problem: [specific pain point]
Solution: [simple MVP description]
Tech: [suggested stack]

**MVP Idea 3: [Title]**
Problem: [specific pain point]
Solution: [simple MVP description]
Tech: [suggested stack]

Keep each idea under 40 words. Focus on realistic, buildable solutions.`

    const result = await model.generateContent(prompt)
    const mvpIdeas = result.response.text()

    return NextResponse.json({
      business: businessName,
      mvpIdeas: mvpIdeas
    })
  } catch (error) {
    console.error("MVP ideas error:", error)
    return NextResponse.json(
      { error: "Failed to generate MVP ideas" },
      { status: 500 }
    )
  }
}
