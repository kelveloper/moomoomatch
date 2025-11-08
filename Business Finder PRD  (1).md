**Problem statement:** 

Builders at Pursuit are unable to efficiently connect with Small Businesses (SBS) in NYC. Builders are forced to manually search through large, unstructured datasets (over 500,000 potential small businesses from NYC OpenData), which is time-consuming and inefficient, preventing them from building a portfolio of real-world, problem-solving MVPs. 

**Supporting Context:**

* Pursuit has 300 builders who have joined the AI fellowship program with new technical skills  
* NYC Open Data has 500,000+ SBS-certified businesses, but no easy way to discover them by need  
* Tech hiring increasingly values demonstrated problem-solving over credentials.

**Opportunity**  
Create a natural language search tool that connects Pursuit builders with NYC small businesses in under 5 minutes, auto-generating industry-specific MVP ideas so builders can start solving real problems the same day.

**Market Opportunity:**

* 500,000+ SBS-certified businesses in NYC (immediate addressable market)  
* 300 Pursuit builders ready to build  
* Link to Pursuit's strategic goals around portfolio development

Users & Needs

**Who:** Builders  
**Primary users:** Builders

**Key Needs:**

* As a builder, I need to **quickly discover NYC small businesses by industry, location, or challenge** because manually searching datasets wastes hours I could spend building  
* As a builder, I need to **understand what problems specific business types commonly face** so I can ideate relevant MVP solutions without deep domain knowledge  
* As a builder, I need to **see potential MVP ideas tailored to a business's industry and my skillset** so I can rapidly validate if a project is worth pursuing

**Secondary Users:** Small business owners (future state, not MVP)

### **Proposed Solution**

A conversational AI chatbot that helps builders discover NYC small businesses through natural dialogue. Builders can type queries like "Show me Italian restaurants in Brooklyn" or "I want to help accounting firms" and the chatbot instantly responds with a curated list of relevant SBS-certified businesses, complete with contact details and business information. The chatbot understands context, asks clarifying questions when needed, and guides builders from vague interest to specific business targets in under 2 minutes.

---

## **Top 3 MVP Value Props:**

**\[The Vitamin\]** \- Chat naturally about what you're looking for instead of learning complex dataset schemas or writing filtered queries

**\[The Painkiller\]** \- Get from "I want to build something" to "Here are 10 specific businesses you could help" in a single conversation

**\[The Steroid\]** \- The chatbot asks smart follow-up questions to narrow your search, acting like a knowledgeable guide who knows NYC's entire small business landscape

---

## **Requirements (Updated for Chatbot Interface)**

### **User Journey: Finding Businesses Through Conversation**

**Initiating Conversation**

* \[P0\] User sees a welcoming chat interface with suggested starter prompts:  
  * "Show me restaurants in Brooklyn"  
  * "Find me retail businesses in Queens"  
  * "I want to help accounting firms"  
* \[P0\] User can type natural language queries in a chat input  
* \[P0\] Chatbot responds within 3 seconds with relevant results or clarifying questions

**Conversational Search**

* \[P0\] Chatbot understands queries like:  
  * "Italian restaurants in Brooklyn"  
  * "accounting firms in Manhattan"  
  * "retail stores in Queens"  
  * "coffee shops near me" (assumes NYC context)  
* \[P0\] Chatbot asks clarifying questions when query is vague:  
  * User: "restaurants" → Bot: "Which borough are you interested in? Brooklyn, Manhattan, Queens, Bronx, or Staten Island?"  
  * User: "businesses I could help" → Bot: "What industry interests you? Retail, food services, professional services, or something else?"  
* \[P0\] Chatbot can handle follow-up queries in context:  
  * User: "show me restaurants" → Bot: \[shows results\]  
  * User: "now just Brooklyn" → Bot: \[filters to Brooklyn restaurants\]

**Displaying Results**

* \[P0\] Chatbot presents businesses in a structured message with:  
  * Business name (Vendor\_Formal\_Name)  
  * Address (Address\_Line\_1, City, Borough)  
  * Category (NAICS\_Sector)  
  * Contact info (Telephone, Website if available)  
  * Contact person (First\_name, Last\_name)  
* \[P0\] Results are limited to 10 businesses per response (prevents overwhelming)  
* \[P0\] Chatbot offers to show more results if \>10 found: "I found 47 Italian restaurants in Brooklyn. Showing the first 10\. Would you like to see more?"  
* \[P1\] Each business result has a "Tell me more" button for additional context  
* \[P2\] User can ask chatbot to "save this business" for later

**Handling Edge Cases**

* \[P0\] Chatbot gracefully handles no results: "I couldn't find any \[query\] in \[location\]. Would you like to try a different location or business type?"  
* \[P0\] Chatbot handles errors: "I'm having trouble accessing the business database right now. Let me try that again."  
* \[P1\] Chatbot can explain what it can/can't do when asked

**Getting MVP Ideas** *(MOVED TO P1 \- POST-HACKATHON)*

* \[P1\] User can ask "What could I build for this business?" and get AI-generated MVP ideas  
* \[P1\] MVP ideas show problem, complexity, time estimate  
* \[P2\] Chatbot can generate ideas based on business category without selecting specific business

## **2-Hour Build Plan**

