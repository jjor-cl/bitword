# BitWord - Bitcoin Terminology Learning Game

## Overview

BitWord is an educational word guessing game focused on Bitcoin terminology. Players learn about Bitcoin concepts, economics, and technical aspects through engaging gameplay across three difficulty levels. The application combines educational content with interactive gameplay, featuring daily challenges, statistics tracking, and social sharing functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS with shadcn/ui components for consistent design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state and local React state for UI state
- **Animations**: Framer Motion for smooth UI transitions
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **Language**: TypeScript throughout the entire stack
- **Database Integration**: Drizzle ORM for type-safe database operations
- **Validation**: Zod for runtime schema validation
- **Session Management**: Express sessions with PostgreSQL store

### Database Design
- **Primary Database**: PostgreSQL with Neon serverless connection
- **ORM**: Drizzle ORM with schema-first approach
- **Tables**:
  - `users`: User accounts (optional authentication)
  - `games`: Individual game sessions and results
  - `game_stats`: Aggregated statistics per difficulty level
  - `bit_words`: Curated Bitcoin terminology database

## Key Components

### Game Logic
- **Word Selection**: Daily deterministic word selection based on date and difficulty
- **Game State**: Comprehensive state management including guessed letters, attempts, timing
- **Difficulty Levels**: Three tiers (Beginner, Intermediate, Advanced) with progressive complexity
- **Statistics Tracking**: Win rates, streaks, average completion times per difficulty

### Educational Content
- **Terminology Database**: 90 curated Bitcoin terms with definitions, hints, and fun facts
- **Progressive Learning**: Concepts range from basic (wallet, mining) to advanced (UTXO, Schnorr)
- **Contextual Information**: Each word includes category, detailed definition, and educational hints

### User Interface
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Dark Theme**: Bitcoin-themed color scheme with crypto-inspired gradients
- **Interactive Elements**: Animated letter grid, progress indicators, modal dialogs
- **Accessibility**: Proper ARIA labels, keyboard navigation, screen reader support

## Data Flow

### Game Session Flow
1. User selects difficulty level
2. System fetches today's word for selected difficulty
3. Game state initializes with empty guessed letters array
4. User interactions update game state locally
5. Game completion triggers statistics update via API
6. Results stored in database for persistence

### Statistics Management
- Real-time statistics calculation during gameplay
- Aggregated stats stored per difficulty level per user
- Streak tracking with automatic reset on failed games
- Average time calculation across completed games

### Daily Challenge System
- Deterministic word selection ensures same word for all players daily
- Date-based seeding prevents replay of completed challenges
- Progress validation prevents multiple attempts per day

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection via serverless Neon
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI component primitives
- **drizzle-orm**: Type-safe database ORM
- **wouter**: Lightweight React routing
- **zod**: Runtime type validation

### Development Dependencies
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for Node.js
- **tailwindcss**: Utility-first CSS framework
- **@types/***: TypeScript definitions

### UI Component System
- **shadcn/ui**: Pre-built accessible component library
- **Tailwind CSS**: Utility-first styling with custom Bitcoin theme
- **Lucide React**: Consistent icon system

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon PostgreSQL with connection pooling
- **Environment Variables**: Database credentials and configuration

### Production Deployment
- **Platform**: Designed for Replit deployment with automatic environment detection
- **Build Process**: Vite builds client-side assets, esbuild bundles server
- **Static Assets**: Served from Express with Vite integration in development
- **Database Migrations**: Drizzle Kit for schema management and deployments

### Performance Optimizations
- **Client-Side Caching**: TanStack Query with infinite stale time for static content
- **Bundle Splitting**: Vite automatic code splitting for optimal loading
- **Database Queries**: Optimized with proper indexing and query patterns
- **Static Asset Optimization**: Vite handles asset optimization and bundling

### Security Considerations
- **Input Validation**: Zod schemas validate all API inputs
- **SQL Injection Prevention**: Drizzle ORM provides parameterized queries
- **CORS Configuration**: Proper origin handling for API endpoints
- **Session Security**: Secure session configuration with PostgreSQL storage