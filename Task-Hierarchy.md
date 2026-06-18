# CoachingHunt Task Hierarchy

## Epic 1 - Project Foundation

### Feature 1.1 - App Initialization

- create fresh Next.js app with JavaScript
- configure Tailwind CSS
- configure base linting and formatting
- create initial folder structure

### Feature 1.2 - Theme and Design System

- create `theme.css`
- map semantic colors in Tailwind
- create reusable button/input/card/badge components
- create loading and skeleton components

### Feature 1.3 - Core Infrastructure

- setup Prisma
- configure PostgreSQL connection
- add base schema
- add seed data support

### Feature 1.4 - Authentication

- setup NextAuth credentials auth
- session role handling
- login page
- logout flow
- route guards

## Epic 2 - User Onboarding

### Feature 2.1 - Student Signup

- student signup page
- validation
- profile creation
- redirect into student flow

### Feature 2.2 - Coaching Signup

- coaching-specific signup page
- required institute fields
- validation
- redirect into coaching onboarding

## Epic 3 - Coaching Marketplace Supply

### Feature 3.1 - Coaching Profile

- create profile form
- edit profile
- upload logo and cover
- gallery support
- profile completeness state

### Feature 3.2 - Course/Batch Management

- create course/batch
- edit course/batch
- list course/batch
- archive course/batch

### Feature 3.3 - Demo Slot Management

- create demo slot
- edit demo slot
- list demo slots
- change slot status

## Epic 4 - Student Discovery

### Feature 4.1 - Homepage

- hero section
- search bar
- featured sections
- how it works
- CTA sections

### Feature 4.2 - Search

- search results page
- keyword search
- filters
- pagination
- empty state

### Feature 4.3 - Detail Pages

- coaching detail page
- course detail page
- limited anonymous view
- full authenticated view

## Epic 5 - Demo Booking

### Feature 5.1 - Booking API

- booking create endpoint
- duplicate prevention
- capacity check
- booking code generation

### Feature 5.2 - Booking UI

- book CTA
- confirmation state
- success summary

### Feature 5.3 - Email Confirmation

- SMTP service setup
- booking email template
- send and persist email status

## Epic 6 - Dashboards

### Feature 6.1 - Student Dashboard

- booked demos
- offers
- top coachings
- profile section

### Feature 6.2 - Coaching Dashboard

- course count
- demo slot count
- booking list
- recent leads

### Feature 6.3 - Admin Dashboard

- total users
- total coachings
- total bookings
- moderation lists

## Epic 7 - Admin and Moderation

### Feature 7.1 - Coaching Management

- listing visibility
- verification state
- status updates

### Feature 7.2 - User Management

- active/inactive user control
- basic user table

### Feature 7.3 - Reviews and Offers

- review moderation
- offer listing basics

## Epic 8 - Polish and Launch Readiness

### Feature 8.1 - UX Polish

- loaders
- skeletons
- empty states
- error states

### Feature 8.2 - SEO

- metadata
- slugs
- public page optimization

### Feature 8.3 - QA

- responsive fixes
- permission testing
- booking path verification
