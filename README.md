ClaimsCompanion MVP - Complete Development Instructions
PROJECT OVERVIEW

You are tasked with building ClaimsCompanion, an AI-powered insurance claims platform that revolutionizes the customer experience from claim submission to resolution. This is a 2-week MVP addressing the "SMARTER CLAIMS FROM START TO FINISH" challenge from Ireland's National AI Challenge.
PROBLEM STATEMENT

Insurance claims are the most critical customer touchpoint, but current experiences are fragmented. Customers face uncertainty and silence after submitting claims, while staff are overwhelmed by manual processes. ClaimsCompanion solves this through intelligent automation and transparent communication.
TARGET PERSONAS

Primary Users:

    Aisling (58): Filed motor claim, no updates, feels lost
    Maya (29): Submitted health claim via app, no visibility on progress
    Mark (42): Claims handler managing high volume, time pressured
    Elena (38): Assesses critical illness claims, overwhelmed by medical files

TECHNICAL REQUIREMENTS
TECH STACK

Frontend:

    React.js with Next.js (TypeScript preferred)
    Tailwind CSS for styling
    Lucide React for icons
    Socket.io-client for real-time updates

Backend:

    Node.js with Express.js OR Python with FastAPI
    PostgreSQL or Firebase/Supabase for database
    Socket.io for real-time communication
    JWT for authentication

AI Services:

    OpenAI GPT-4 API for chatbot and content generation
    Google Vision API or AWS Textract for OCR
    Twilio for SMS notifications
    SendGrid for email notifications

Deployment:

    Frontend: Vercel or Netlify
    Backend: Railway, Render, or AWS
    Database: Supabase or Firebase

CORE FEATURES TO IMPLEMENT
1. SMART CLAIMS SUBMISSION

Requirements:

    Multi-step form with dynamic validation
    Real-time AI guidance and suggestions
    OCR-powered document scanning
    Photo quality validation
    Instant claim number generation
    Automatic confirmation emails/SMS

Implementation Details:
javascript

// Key Components Needed:
- ClaimsSubmissionWizard
  - Step1: ClaimTypeSelection 
  - Step2: IncidentDetails
  - Step3: DocumentUpload
  - Step4: ContactInfo
  - Step5: ReviewAndSubmit
- DocumentValidator (OCR integration)
- PhotoQualityChecker
- AIGuidancePanel

AI Integration Points:

    Validate document completeness
    Suggest missing information
    Check photo quality and provide feedback
    Generate claim summaries

2. REAL-TIME PROGRESS TRACKING

Requirements:

    Visual progress timeline
    Status updates with explanations
    Estimated completion dates
    Document status tracking
    Mobile-responsive design
    Push/SMS notifications for status changes

Implementation Details:
javascript

// Key Components:
- ProgressDashboard
- TimelineView
- StatusCard
- NotificationCenter
- EstimatedCompletion
- DocumentStatusTracker

Data Structure:
json

{
  "claimId": "CLM2025001",
  "status": "assessment_in_progress",
  "progress": {
    "steps": [
      {
        "id": "submitted",
        "title": "Claim Submitted",
        "status": "completed",
        "date": "2025-01-15T14:30:00Z",
        "description": "Your claim has been received and assigned number CLM2025001"
      },
      {
        "id": "initial_review",
        "title": "Initial Review",
        "status": "completed", 
        "date": "2025-01-16T10:00:00Z",
        "description": "Our team has reviewed your submission for completeness"
      },
      {
        "id": "assessment",
        "title": "Assessment in Progress",
        "status": "active",
        "date": "2025-01-18T09:00:00Z",
        "description": "An assessor has been assigned and will contact you within 2 business days"
      }
    ]
  },
  "estimatedCompletion": "2025-03-15",
  "nextAction": "Assessor will call you tomorrow at 2pm"
}

3. AI-POWERED CHAT ASSISTANT

Requirements:

    Context-aware responses based on specific claim
    Natural language processing
    Proactive notifications
    Handoff to human agents when needed
    Chat history persistence
    Multi-language support (English/Irish)

Implementation Details:
javascript

// Key Components:
- ChatInterface
- MessageBubble
- TypingIndicator
- AIResponse
- ChatHistory
- EscalationButton

AI Prompt Engineering:

You are ClaimsCompanion AI, an intelligent assistant for insurance claims. 

Context: You have access to the user's claim details including:
- Claim ID: {claimId}
- Claim Type: {claimType}  
- Current Status: {currentStatus}
- Timeline: {progressSteps}
- Documents: {documentStatus}

Guidelines:
- Be empathetic and reassuring
- Provide specific, actionable information
- Reference their exact claim details
- Explain insurance processes in simple terms
- Offer next steps when appropriate
- Escalate to human agents for complex issues

User Question: {userMessage}

DATABASE SCHEMA
REQUIRED TABLES
sql

-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Claims Table  
CREATE TABLE claims (
  id SERIAL PRIMARY KEY,
  claim_number VARCHAR(20) UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(id),
  claim_type VARCHAR(50) NOT NULL, -- 'motor', 'health', 'property', 'travel'
  status VARCHAR(50) DEFAULT 'submitted',
  incident_date DATE,
  incident_description TEXT,
  estimated_completion DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Claim Progress Table
CREATE TABLE claim_progress (
  id SERIAL PRIMARY KEY,
  claim_id INTEGER REFERENCES claims(id),
  step_id VARCHAR(50),
  step_title VARCHAR(200),
  status VARCHAR(20), -- 'pending', 'active', 'completed'
  completed_at TIMESTAMP,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents Table
CREATE TABLE claim_documents (
  id SERIAL PRIMARY KEY,
  claim_id INTEGER REFERENCES claims(id),
  file_name VARCHAR(255),
  file_url VARCHAR(500),
  document_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending_review',
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat Messages Table
CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  claim_id INTEGER REFERENCES claims(id),
  message_type VARCHAR(20), -- 'user', 'ai', 'agent'
  message_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  claim_id INTEGER REFERENCES claims(id),
  type VARCHAR(50), -- 'sms', 'email', 'push'
  title VARCHAR(200),
  message TEXT,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

API ENDPOINTS TO IMPLEMENT
Authentication

POST /api/auth/register
POST /api/auth/login  
POST /api/auth/logout
GET /api/auth/me

Claims Management

POST /api/claims - Create new claim
GET /api/claims - Get user's claims
GET /api/claims/:id - Get specific claim
PUT /api/claims/:id - Update claim
GET /api/claims/:id/progress - Get claim progress
POST /api/claims/:id/documents - Upload document

Chat & AI

POST /api/chat/:claimId/messages - Send message
GET /api/chat/:claimId/history - Get chat history
POST /api/ai/validate-document - Validate uploaded document
POST /api/ai/assess-photo-quality - Check photo quality

Notifications

GET /api/notifications - Get user notifications
POST /api/notifications/mark-read - Mark as read

WEEK-BY-WEEK IMPLEMENTATION PLAN
WEEK 1: CORE FUNCTIONALITY

Days 1-2: Project Setup & Authentication

    Initialize React + Next.js project with TypeScript
    Set up Tailwind CSS and component library
    Implement user authentication (register/login)
    Set up database schema and basic API structure
    Create responsive layout and navigation

Claims Submission System

    Build multi-step claim submission form
    Implement dynamic form validation
    Add file upload functionality with drag-and-drop
    Integrate OCR for document scanning
    Add photo quality validation
    Create claim number generation system
    Set up email/SMS confirmation system

 Progress Tracking Dashboard

    Create claims dashboard with timeline view
    Implement real-time status updates
    Build progress visualization components
    Add estimated completion date calculation
    Create notification system (email/SMS)
    Set up WebSocket for real-time updates

 AI INTEGRATION & POLISH

 AI Chat Assistant

    Integrate OpenAI GPT-4 API
    Build chat interface with message history
    Implement context-aware AI responses
    Add typing indicators and smooth UX
    Create escalation to human agents
    Add proactive notification triggers

 Mobile Optimization & Testing

    Ensure full mobile responsiveness
    Add PWA capabilities (service worker, offline support)
    Implement push notifications
    Performance optimization and caching
    User testing with personas
    Bug fixes and edge case handling
Demo Preparation & Final Polish

    Create demo data and scenarios
    Prepare live demonstration script
    Final UI/UX polish
    Documentation and deployment
    Load testing and security review

USER EXPERIENCE FLOWS
Flow 1: New Claim Submission (Aisling - Motor Claim)

    User selects "Motor Insurance" claim type
    AI asks: "I'll help you through this. Was anyone injured in the accident?"
    User provides incident details in guided form
    AI suggests: "For motor claims, I'll need photos of vehicle damage and your driving license"
    User uploads photos → AI validates quality: "Great photos! I can clearly see the damage"
    System generates claim number CLM2025001
    User receives SMS: "Claim CLM2025001 submitted. Track progress at [link]"

Flow 2: Progress Tracking (Maya - Health Claim)

    User opens app → sees claim dashboard
    Timeline shows: "Assessment in Progress" (animated indicator)
    Estimated completion: "Expected decision by March 15th"
    User taps "Why is this taking time?"
    AI explains: "Health claims require medical review. Your case is with our medical team - typical review time is 7-10 days"

Flow 3: AI Chat Support (Elena - Complex Query)

    User asks: "Can I add more medical documents?"
    AI responds: "Yes! You can upload additional documents anytime. Would you like me to guide you through what's most helpful for your type of claim?"
    AI provides specific document checklist
    User uploads → AI confirms: "Perfect! This will help speed up your assessment"

AI INTEGRATION SPECIFICATIONS
OpenAI Integration
javascript

// AI Service Implementation
class AIClaimsAssistant {
  async generateResponse(claimId, userMessage, claimContext) {
    const prompt = `
    You are ClaimsCompanion AI assistant. User claim details:
    - Claim ID: ${claimContext.claimNumber}
    - Type: ${claimContext.type}
    - Status: ${claimContext.status}
    - Days since submission: ${claimContext.daysSinceSubmission}
    
    User message: "${userMessage}"
    
    Provide helpful, specific response referencing their claim.
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 300
    });
    
    return response.choices[0].message.content;
  }
  
  async validateDocument(documentType, extractedText) {
    // OCR + AI validation logic
  }
  
  async assessPhotoQuality(imageUrl) {
    // Photo quality assessment logic
  }
}

Document Processing
javascript

// OCR Integration
async function processDocument(fileBuffer, documentType) {
  // Use Google Vision API or AWS Textract
  const extractedText = await ocrService.extractText(fileBuffer);
  
  // AI validation
  const validation = await aiService.validateDocument(documentType, extractedText);
  
  return {
    extractedText,
    isValid: validation.isValid,
    missingFields: validation.missingFields,
    suggestions: validation.suggestions
  };
}

TESTING REQUIREMENTS
Unit Tests

    API endpoint testing
    Component rendering tests
    AI service integration tests
    Database operation tests

Integration Tests

    Full user flow testing
    Real-time update testing
    File upload and processing
    Notification delivery

User Acceptance Testing

Create test scenarios for each persona:

Aisling Test Scenario:

    Submit motor claim with photos
    Check progress tracking works
    Ask AI about timeline
    Receive status notifications

Maya Test Scenario:

    Submit health claim via mobile
    Verify mobile responsiveness
    Test chat functionality
    Check notification preferences

DEMO PREPARATION
Demo Script (5-minute presentation)

    Opening (30s): "Meet Aisling, she just had a car accident..."
    Claim Submission (90s): Show AI-guided submission process
    Progress Tracking (90s): Demonstrate real-time updates and timeline
    AI Assistant (90s): Live chat interaction with context awareness
    Impact Summary (30s): "This eliminates customer uncertainty and reduces staff workload"

Demo Data Setup
javascript

// Create realistic demo claims
const demoClaimMotor = {
  claimNumber: "CLM2025001",
  type: "motor",
  status: "assessment_in_progress", 
  customerName: "Aisling Murphy",
  incidentDate: "2025-01-15",
  estimatedCompletion: "2025-03-15"
};

const demoClaimHealth = {
  claimNumber: "CLM2025002", 
  type: "health",
  status: "medical_review",
  customerName: "Maya Patel", 
  incidentDate: "2025-01-10",
  estimatedCompletion: "2025-02-28"
};

DEPLOYMENT INSTRUCTIONS
Environment Variables
bash

# .env file
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
SENDGRID_API_KEY=...
NEXTAUTH_SECRET=...
GOOGLE_VISION_API_KEY=...

Deployment Steps

    Database: Deploy PostgreSQL on Supabase/Railway
    Backend: Deploy API on Railway/Render
    Frontend: Deploy on Vercel/Netlify
    Domain: Set up custom domain if available
    SSL: Ensure HTTPS everywhere
    Monitoring: Set up basic error tracking

SUCCESS METRICS
Technical KPIs

    Page load time < 2 seconds
    API response time < 500ms
    99% uptime during demo period
    Mobile responsiveness score > 95

User Experience KPIs

    Claim submission completion rate > 90%
    Average time to submit claim < 5 minutes
    AI chat response accuracy > 85%
    User satisfaction score > 4.5/5

DELIVERABLES CHECKLIST
Week 1 Deliverables

    Functional claim submission system
    User authentication and dashboard
    Basic progress tracking
    File upload with validation
    Email/SMS notifications
    Responsive design

Week 2 Deliverables

    AI chat assistant fully integrated
    Real-time updates working
    Mobile PWA capabilities
    Complete user flows tested
    Demo environment prepared
    Documentation completed

Final Presentation Materials

    Live demo environment
    Demo script and talking points
    Technical architecture overview
    User persona journey maps
    Future roadmap and scaling plan

ADDITIONAL CONSIDERATIONS
Security Requirements

    Input validation and sanitization
    SQL injection prevention
    File upload security (type/size limits)
    Rate limiting on AI API calls
    GDPR compliance for data handling

Performance Optimization

    Image compression for uploaded photos
    Database query optimization
    CDN for static assets
    Caching strategy for API responses
    Lazy loading for components

Accessibility

    WCAG 2.1 AA compliance
    Screen reader compatibility
    Keyboard navigation support
    High contrast mode
    Font size adjustability

FINAL NOTE TO AI AGENT

This is a complete specification for building ClaimsCompanion MVP in 2 weeks. Focus on creating a working, demonstrable product that showcases the core value proposition. Prioritize functionality over perfection, but ensure the user experience is smooth and the AI integration is meaningful.

The goal is to create a compelling demo that shows how AI can transform insurance claims from a frustrating experience into an intelligent, transparent process that benefits both customers and insurance companies.

Start with Week 1 tasks and build incrementally. Document any deviations from this plan and communicate progress regularly.
