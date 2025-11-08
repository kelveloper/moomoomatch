# MooMooMatch - AI-Powered NYC Business Discovery Platform
## Product Requirements Document (PRD)

### Executive Summary
MooMooMatch is an AI-powered conversational interface that connects Pursuit builders with NYC small businesses through natural language search. Built on top of NYC Open Data's 500,000+ SBS-certified businesses, it eliminates hours of manual dataset navigation and gets builders from idea to action in under 2 minutes.

---

## Problem Statement
Builders at Pursuit are unable to efficiently connect with Small Businesses (SBS) in NYC. Builders are forced to manually search through large, unstructured datasets (over 500,000 potential small businesses from NYC OpenData), which is time-consuming and inefficient, preventing them from building a portfolio of real-world, problem-solving MVPs.

### Supporting Context
- Pursuit has 300 builders who have joined the AI fellowship program with new technical skills
- NYC Open Data has 500,000+ SBS-certified businesses, but no easy way to discover them by need
- Tech hiring increasingly values demonstrated problem-solving over credentials

---

## Opportunity
Create a natural language search tool that connects Pursuit builders with NYC small businesses in under 5 minutes, auto-generating industry-specific MVP ideas so builders can start solving real problems the same day.

### Market Opportunity
- 500,000+ SBS-certified businesses in NYC (immediate addressable market)
- 300 Pursuit builders ready to build
- Link to Pursuit's strategic goals around portfolio development

---

## Users & Needs

### Primary Users: Builders
**Key Needs:**
- As a builder, I need to quickly discover NYC small businesses by industry, location, or challenge because manually searching datasets wastes hours I could spend building
- As a builder, I need to understand what problems specific business types commonly face so I can ideate relevant MVP solutions without deep domain knowledge
- As a builder, I need to see potential MVP ideas tailored to a business's industry and my skillset so I can rapidly validate if a project is worth pursuing

### Secondary Users: Small business owners (future state, not MVP)

---

## Proposed Solution
An AI-powered conversational interface that lets builders query "Italian restaurants in Brooklyn" or "accounting firms in Manhattan" and instantly get:
1. A filtered list of relevant SBS-certified businesses with key details
2. AI-generated contextual responses about business opportunities
3. Business cards with contact information and industry insights

This eliminates hours of manual dataset navigation, getting builders from idea to action in under 2 minutes.

### Top 3 MVP Value Props
1. **[The Vitamin]** - Access 500,000+ NYC businesses by industry/location in 30 seconds vs. hours of manual CSV downloads and filtering
2. **[The Painkiller]** - Natural language search eliminates the need to understand dataset schemas or write complex queries
3. **[The Steroid]** - Get immediate, clean results so you can spend time building solutions, not hunting for businesses

---

## Goals & Non-Goals

### Hackathon Demo Goals
- Successfully demonstrate natural language search that finds relevant NYC businesses in <30 seconds
- Enable 10+ builders at the demo to test the search and find businesses they'd want to help
- Prove the core value prop: eliminate hours of manual dataset navigation

### Post-Hackathon Goals (Week 1)
- Enable 20+ Pursuit builders to identify potential business partners using the tool
- Reduce time from "I want to build something" to "I found a business to help" from hours to <2 minutes
- Collect feedback from 15+ builders to prioritize Phase 2 features

### Non-Goals for Hackathon MVP
- AI-generated MVP ideas or solution recommendations (Phase 2)
- Filtering by business challenges or operational needs (requires additional data)
- Map visualization of results (nice-to-have, not critical for demo)
- User accounts, saved searches, or project tracking (future phase)

---

## Success Metrics

| Goal | Signal | Metric | Target |
|------|--------|--------|--------|
| Discovery | Builders find businesses fast | Avg. time to first business match | <30 sec |
| Usability | Search understands intent | % of searches returning relevant results | >80% |
| Demo Impact | Judges see the value | Successful demo run without errors | 100% |

---

## Requirements (Hackathon-Ready)

### User Journey: Finding Businesses to Help

#### Finding Businesses [P0]
- User can query SBS businesses using natural language queries
  - "Italian restaurants in Brooklyn"
  - "accounting firms in Manhattan"
  - "retail stores in Queens"
- Search returns relevant businesses with:
  - Address_Line_1
  - City
  - Category (NAICS_Sector)
  - Borough (Mailing_City)
  - Website
  - Telephone
  - First_name
  - Last_name
  - Vendor_Formal_Name
- Results are displayed in a clean, scannable list (max 20 results)
- AI-powered conversational responses provide context and insights

#### Enhanced Features [P1]
- User can filter by borough
- User can see business on a map view
- User can save businesses to a list

#### Getting MVP Ideas [P1 - POST-HACKATHON]
- User can click a business and get AI-generated MVP ideas
- MVP ideas show problem, complexity, time estimate
- User can regenerate or rate MVP ideas

---

## Technical Architecture

### Core Components
1. **Frontend**: Next.js 14 with React chatbot interface
2. **Backend**: Next.js API routes
3. **Data Source**: NYC Open Data API (500k+ businesses)
4. **AI Integration**: Conversational responses for business discovery
5. **Database**: Supabase (for future user data, not required for MVP)

### API Integration
- **NYC Open Data API**: `https://data.cityofnewyork.us/resource/ci93-uc8s.json`
- **Search Endpoint**: `/api/businesses/search`
- **Chat Endpoint**: `/api/chat/moomoomatch`

### Key Features Implemented
- Natural language query parsing
- Borough detection and filtering
- Industry/business type matching
- Real-time search results
- Conversational AI responses
- Business card display with contact info

---

## Implementation Plan

### Phase 1: Core Search (30 minutes) ✅
- [x] Remove authentication (5 min)
- [x] Create NYC Business Search API (10 min)
- [x] Build search interface (10 min)
- [x] Display business results (5 min)

### Phase 2: AI Enhancement (30 minutes) ✅
- [x] Add conversational AI interface (15 min)
- [x] Improve UI for business discovery (10 min)
- [x] Add natural language processing (5 min)

### Phase 3: Polish & Demo Ready ✅
- [x] Error handling and edge cases
- [x] Performance optimization
- [x] Responsive design
- [x] Integration testing

---

## Technical Specifications

### Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OLLAMA_URL=http://localhost:11434
```

### API Endpoints

#### Business Search API
- **Endpoint**: `GET /api/businesses/search`
- **Parameters**: `q` (query string)
- **Response**: JSON with businesses array and count
- **Features**: 
  - Natural language parsing
  - Borough filtering
  - Industry matching
  - Fuzzy search capabilities

#### Chat API
- **Endpoint**: `POST /api/chat/moomoomatch`
- **Body**: `{ message: string }`
- **Response**: AI-generated response with business data
- **Features**:
  - Conversational interface
  - Business context understanding
  - Pursuit builder-focused responses

### Data Schema
Each business record includes:
- `vendor_formal_name`: Official business name
- `vendor_dba`: "Doing business as" name
- `address1`: Street address
- `city`, `state`, `zip`: Location details
- `borough`: NYC borough
- `telephone`: Contact number
- `website`: Business website
- `naics_sector`: Industry category
- `naics_title`: Specific business type
- `business_description`: What the business does
- `certification`: MBE, WBE, etc.
- `ethnicity`: Owner demographics

---

## Deployment & Operations

### Local Development
```bash
npm install
npm run dev
# App runs on http://localhost:3000
```

### Repository
- **GitHub**: https://github.com/kelveloper/moomoomatch
- **Branch**: development (active development)
- **Main**: production-ready code

### Performance Targets
- Search response time: <500ms
- Page load time: <2 seconds
- API availability: 99.9%

---

## Future Roadmap

### Phase 2: Enhanced Discovery
- AI-generated MVP ideas based on business needs
- Business challenge identification
- Skill-to-opportunity matching
- Project complexity estimation

### Phase 3: Community Features
- User accounts and saved searches
- Builder-business connection tracking
- Success story sharing
- Portfolio integration

### Phase 4: Advanced Analytics
- Business trend analysis
- Market opportunity scoring
- Builder success metrics
- ROI tracking for built solutions

---

## Risk Assessment

### Technical Risks
- NYC Open Data API rate limits or downtime
- AI response quality and relevance
- Search accuracy for natural language queries

### Mitigation Strategies
- Implement caching for frequently searched businesses
- Fallback to basic search if AI fails
- User feedback loop for search improvement

### Business Risks
- Low adoption by Pursuit builders
- Insufficient business data quality
- Competition from existing business directories

---

## Conclusion

MooMooMatch successfully transforms the tedious process of finding NYC small businesses into a conversational, AI-powered experience. By leveraging NYC's comprehensive business database and natural language processing, it empowers Pursuit builders to quickly identify real-world problems they can solve, accelerating their journey from learning to building impactful solutions.

The MVP is hackathon-ready and demonstrates clear value in reducing discovery time from hours to seconds, setting the foundation for a comprehensive builder-business connection platform.

---

**Document Version**: 1.0  
**Last Updated**: November 8, 2024  
**Status**: Implementation Complete - Ready for Demo