# Business Finder Custom Chat Modes

This directory contains custom chat modes specifically designed for the **Business Finder** project - a conversational AI tool that connects Pursuit builders with NYC small businesses.

## Available Chat Modes

### 1. 🎯 Business Finder Planner (`business-finder-planner.chatmode.md`)
**Purpose**: Generate comprehensive implementation plans for Business Finder features

**Use When**:
- Starting work on new Business Finder features
- Need to break down complex requirements from the PRD
- Planning technical architecture and component structure
- Analyzing data integration requirements

**Tools**: `fetch`, `search`, `usages`

**Key Capabilities**:
- Analyzes PRD requirements and creates actionable plans
- Focuses on Next.js/React component architecture
- Plans database schema and API endpoint structure
- Considers integration with existing chat infrastructure
- Provides risk assessment and testing strategies

---

### 2. 🔨 Business Finder Implementation (`business-finder-implementation.chatmode.md`)
**Purpose**: Implement planned features with actual code creation and integration

**Use When**:
- Converting plans into working code
- Creating React components and API endpoints
- Integrating with existing chatbot infrastructure
- Building database operations and queries

**Tools**: `fetch`, `search`, `usages`, `edit`

**Key Capabilities**:
- Creates production-ready TypeScript/React code
- Follows existing project patterns and conventions
- Integrates seamlessly with current chat infrastructure
- Focuses on code quality and maintainability
- Implements proper error handling and type safety

---

### 3. 🔌 Business Finder API & Data Integration (`business-finder-api-integration.chatmode.md`)
**Purpose**: Design and implement robust API integrations and data processing

**Use When**:
- Working with NYC OpenData integration
- Designing efficient search APIs
- Optimizing database performance
- Implementing data synchronization strategies

**Tools**: `fetch`, `search`, `usages`

**Key Capabilities**:
- Specializes in large dataset handling (500K+ businesses)
- Designs performant API endpoints and database queries
- Implements caching and optimization strategies
- Handles data validation, sync, and error recovery
- Focuses on scalability and security

## Usage Workflow

### Recommended Sequence:
1. **Start with Planning Mode** → Generate comprehensive feature plans
2. **Move to Implementation Mode** → Convert plans to working code  
3. **Use API Integration Mode** → Optimize data handling and performance

### Example Workflow:
```
Planning Mode: "Plan the conversational business search feature"
↓
Implementation Mode: "Implement the business search components planned above"
↓
API Integration Mode: "Optimize the NYC OpenData integration for performance"
```

## Project Context

### Business Finder Goals:
- Connect Pursuit builders with NYC small businesses in under 5 minutes
- Process natural language queries like "Italian restaurants in Brooklyn"
- Handle 500,000+ SBS-certified businesses from NYC OpenData
- Provide conversational interface with smart follow-up questions

### Technical Stack:
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Supabase
- **AI**: OpenAI/Anthropic for natural language processing
- **Data**: NYC OpenData API integration

### Key Requirements:
- Conversational AI interface
- Natural language query processing
- Business search with contact details
- Error handling and edge cases
- Integration with existing chat infrastructure

## Getting Started

1. **Select a Chat Mode**: Choose the appropriate mode from the VS Code Chat view
2. **Review Project Context**: Each mode includes relevant project information
3. **Start with Clear Objectives**: Be specific about what you want to plan or implement
4. **Iterate**: Use multiple modes in sequence for comprehensive development

## Tips for Effective Usage

- **Be Specific**: Provide clear requirements and context in your prompts
- **Reference the PRD**: Modes are designed around the Business Finder PRD requirements
- **Leverage Existing Code**: Modes understand the current chatbot infrastructure
- **Think in Phases**: Use planning → implementation → optimization workflow
- **Test Early**: Each mode emphasizes testing and quality assurance

These custom chat modes are specifically tailored to the Business Finder project requirements and will help you efficiently develop features that connect builders with NYC small businesses through conversational AI.