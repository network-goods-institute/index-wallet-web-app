# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack (runs on http://localhost:3000)
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code linting

## Architecture Overview

This is a Next.js 15 application called "Index Wallets" that enables users to fund public goods. The app connects users to causes/public goods where they can make donations and track impact.

### Key Architecture Components

**Frontend Stack:**
- Next.js 15 with App Router
- TypeScript with strict mode
- Tailwind CSS v4 for styling
- shadcn/ui component library (New York style)
- Lucide React for icons
- Next.js themes for dark/light mode

**Project Structure:**
- `/src/app/` - Next.js App Router pages and API routes
- `/src/components/` - React components (includes shadcn/ui components in `/ui/`)
- `/src/lib/` - Utility functions and shared logic
- `@/` path alias points to `/src/`

**Backend Integration:**
- API routes in `/src/app/api/` proxy to external backend at `http://127.0.0.1:8080`
- Primary data model is "causes" (public goods) with associated tokens
- External Stripe integration for payments

**Key Features:**
- Browse and filter public goods/causes
- Individual cause detail pages with donation functionality
- Create new public goods
- User authentication modal
- Theme switching (light/dark mode)
- Responsive design with mobile-first approach

### Component Patterns

**Data Flow:**
- API routes fetch from external backend and transform data
- Components receive props with explicit TypeScript interfaces
- Uses inline interfaces rather than separate type files
- shadcn/ui components provide consistent design system

**Styling Approach:**
- Tailwind utility classes with custom CSS variables for theming
- Font setup: Plus Jakarta Sans (sans) + Playfair Display (serif)
- Consistent spacing and component patterns following shadcn/ui conventions

**Navigation:**
- Header with main navigation, auth modal, and theme toggle
- Link components for client-side routing
- Sticky header with backdrop blur effect

### Backend API Integration

The app connects to a backend API running on localhost:8080 with these endpoints:
- `GET /causes` - Fetch all causes/public goods
- Individual cause management and creation
- Stripe payment processing integration

Each cause includes token information (name, symbol) and tracks total funds raised.