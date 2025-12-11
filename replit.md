# Overview

SmartHire is an intelligent recruitment platform designed to streamline the hiring process for candidates, hiring managers, and administrators. The application provides role-based dashboards, AI-powered chatbot assistance, comprehensive candidate profile management, and job application tracking with status workflows.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework & Build System**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server, providing fast hot module replacement
- Wouter for lightweight client-side routing instead of React Router
- Tailwind CSS with custom design system based on shadcn/ui component library

**UI Component Strategy**
- Radix UI primitives for accessible, unstyled components (dialogs, dropdowns, tabs, etc.)
- Custom design system using shadcn/ui "new-york" style variant
- Class Variance Authority (CVA) for managing component variants
- CSS variables for theming with support for light/dark modes
- Design follows Material Design and modern enterprise patterns (Linear, Notion) optimized for data-dense interfaces

**State Management**
- TanStack Query (React Query) for server state management and caching
- Local React Context for authentication state (AuthProvider)
- React Hook Form with Zod validation for form state and validation
- Mock data layer during development with in-memory storage

**Design System**
- Typography: Inter/SF Pro Display via Google Fonts with defined hierarchy (H1-H3, body, small/meta)
- Spacing: Tailwind units of 2, 4, 6, 8, 12, 16
- Color system: HSL-based with CSS custom properties for dynamic theming
- Component padding: p-4 to p-6, section margins: mb-8/mt-6
- Border radius: Custom values (lg: 9px, md: 6px, sm: 3px)

## Backend Architecture

**Server Framework**
- Express.js with TypeScript for the REST API
- HTTP server creation using Node's native `createServer`
- Session management using express-session (configured for connect-pg-simple for PostgreSQL sessions)
- Middleware: JSON body parsing, URL-encoded forms, CORS support, rate limiting

**Database Layer**
- PostgreSQL as the primary relational database
- Neon serverless PostgreSQL driver (@neondatabase/serverless) for database connections
- Drizzle ORM for type-safe database queries and schema management
- Drizzle-Kit for schema migrations and database push operations
- Schema-first approach with TypeScript types generated from database schema

**Storage Pattern**
- Storage interface abstraction (IStorage) for data operations
- MemStorage implementation for development/testing (in-memory)
- Production implementation would use Drizzle ORM queries against PostgreSQL
- CRUD methods defined in storage interface: getUser, getUserByUsername, createUser, etc.

**Authentication & Authorization**
- Role-based access control (RBAC) with three roles: candidate, admin, client
- Session-based authentication with localStorage persistence on client
- Protected routes using custom ProtectedRoute component with role validation
- Demo accounts for testing different user roles

## Data Model & Schema

**Core Entities**
- Users: Base user entity with email, password (hashed), fullName, phone, role
- Candidate Profiles: Extended profile data including KTP number, personal details, CV file storage
- Education Records: Academic history with level, institution, field, dates
- Experience Records: Work history with company, position, dates, description
- Skills & Training: Professional skills and certifications
- Jobs: Job postings with department, position, requirements, salary range
- Applications: Job applications linking candidates to jobs with status tracking
- Application History: Audit trail of status changes with timestamps and notes

**Status Workflow**
- Application statuses: Applied → Processing → Passed Selection → Accepted/Rejected
- Status tracking with history for audit trail
- Color-coded badges for visual status representation

**Relationships**
- One-to-One: User to CandidateProfile
- One-to-Many: User to Education/Experience/Skills/Training
- One-to-Many: Job to Applications
- Many-to-One: Applications to User (candidate)
- Many-to-Many: Jobs and Candidates (through Applications)

**ML-Based Candidate Matching**
- Matching algorithm in `client/src/lib/matchingAlgorithm.ts`
- Weighted scoring: Education (25%), Skills (35%), Experience (25%), Training (15%)
- Match scores above 75% flagged as "Good Fit"
- Admin Candidates panel shows "Best Match" column with best-suited job for each candidate
- Tooltip breakdown shows individual scores for each category

## External Dependencies

**UI Component Libraries**
- @radix-ui/* (19+ packages): Accessible, unstyled UI primitives for building design system
- shadcn/ui: Pre-built component patterns built on Radix UI
- lucide-react: Icon library for consistent iconography
- embla-carousel-react: Carousel/slider component functionality

**Form Management & Validation**
- react-hook-form: Performant form state management with minimal re-renders
- @hookform/resolvers: Integration layer for validation libraries
- zod: TypeScript-first schema validation
- drizzle-zod: Automatic Zod schema generation from Drizzle ORM schemas

**Data Fetching & State**
- @tanstack/react-query: Server state management, caching, synchronization
- date-fns: Date manipulation and formatting

**Styling & CSS**
- tailwindcss: Utility-first CSS framework
- class-variance-authority: Type-safe component variant management
- clsx + tailwind-merge: Conditional className merging

**Database & Backend**
- @neondatabase/serverless: Serverless PostgreSQL driver
- drizzle-orm: TypeScript ORM with type inference
- drizzle-kit: Schema migrations and database management CLI
- connect-pg-simple: PostgreSQL session store for express-session

**Development Tools**
- Replit-specific plugins: vite-plugin-runtime-error-modal, cartographer, dev-banner
- tsx: TypeScript execution for development and build scripts
- esbuild: Fast JavaScript bundler for production builds

**Potential AI Integration**
- Package manifest includes @google/generative-ai and openai (not yet implemented)
- Designed for chatbot functionality with message schema defined
- Could enable AI-powered candidate screening and interview assistance

**File Handling**
- multer: Multipart form data handling for CV/resume uploads
- XLSX: Spreadsheet parsing for bulk data import

**Security & Communication**
- express-rate-limit: API rate limiting
- passport + passport-local: Authentication strategies
- jsonwebtoken: JWT token generation (for API authentication)
- nodemailer: Email notification capability
- bcrypt: Password hashing (implied by authentication setup)

**Third-party Services (Future)**
- Stripe: Payment processing integration prepared
- WebSocket (ws): Real-time communication capability
