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

    // Fetch full business data from NYC OpenData
    const businessName = business.vendor_dba || business.vendor_formal_name

    // Search for the exact business in the NYC OpenData API
    const searchQuery = encodeURIComponent(
      `vendor_formal_name="${business.vendor_formal_name}"`
    )
    const apiUrl = `https://data.cityofnewyork.us/resource/ci93-uc8s.json?$where=${searchQuery}&$limit=1`

    console.log("Fetching full business data:", apiUrl)

    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch business data: ${response.status}`)
    }

    const businessData = await response.json()
    if (!businessData || businessData.length === 0) {
      throw new Error("Business not found in NYC OpenData")
    }

    const fullBusiness = businessData[0]

    // Generate AI analysis using Google Gemini
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY
    if (!apiKey) {
      throw new Error("Google Gemini API key not configured")
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    // Create comprehensive business context from all available data
    const businessContext = `
Business Name: ${fullBusiness.vendor_dba || fullBusiness.vendor_formal_name}
Legal Name: ${fullBusiness.vendor_formal_name}
Industry: ${fullBusiness.naics_title}
Sector: ${fullBusiness.naics_sector}
Subsector: ${fullBusiness.naics_subsector || "N/A"}
Description: ${fullBusiness.business_description || "No description available"}
Location: ${fullBusiness.address1}, ${fullBusiness.city}, ${fullBusiness.borough || fullBusiness.state}
Phone: ${fullBusiness.telephone || "N/A"}
Website: ${fullBusiness.website || "N/A"}
Certification: ${fullBusiness.certification || "N/A"}
Primary Contact: ${fullBusiness.primary_contact_first_name || ""} ${fullBusiness.primary_contact_last_name || ""}
Email: ${fullBusiness.email || "N/A"}
Year Established: ${fullBusiness.year_established || "N/A"}
Employee Count: ${fullBusiness.employee_count || "N/A"}
Annual Revenue: ${fullBusiness.annual_revenue || "N/A"}
`.trim()

    const prompt = `You are MooMooMatch, analyzing NYC small businesses for Pursuit builders.

Here's the complete business information from NYC OpenData:
${businessContext}

Provide a business analysis in this exact format:

**Business Summary:**
[Write 2-3 sentences summarizing this business based ONLY on the data provided above. Focus on what they do, their industry, and key characteristics.]

**Potential Problems:**

**Problem 1:** [2-3 sentences describing a specific operational challenge this type of business likely faces]

**Problem 2:** [2-3 sentences describing a different business challenge they might encounter]

**Problem 3:** [2-3 sentences describing another potential problem area]

Keep it concise and realistic. Base problems on the business type and industry, not on solutions.`

    const result = await model.generateContent(prompt)
    const analysis = result.response.text()

    return NextResponse.json({
      business: businessName,
      fullBusinessData: fullBusiness,
      analysis: analysis
    })
  } catch (error) {
    console.error("Business analysis error:", error)
    return NextResponse.json(
      { error: "Failed to analyze business" },
      { status: 500 }
    )
  }
}
