# CoachingHunt Implementation Backlog

## Phase 1 Backlog - Foundation

### 1. Project Setup

- create fresh Next.js app with App Router and JavaScript
- configure Tailwind CSS
- configure folder structure
- setup global styles

### 2. Theme System

- create central `theme.css`
- map semantic theme tokens in Tailwind config
- define blue and white brand system
- create base motion rules

### 3. Shared UI

- Button
- Input
- Textarea
- Select
- Card
- Badge
- Loader
- Skeleton
- EmptyState

### 4. Data Layer

- setup Prisma
- create schema
- create seed script
- configure DB client helper

### 5. Auth

- setup NextAuth
- credentials provider
- session role fields
- login page
- student signup endpoint/page
- coaching signup endpoint/page
- auth redirects
- middleware role guards

### 6. Base App Shell

- public layout
- auth layout
- dashboard layouts
- navbar
- footer
- sidebar shell

## Phase 2 Backlog - Core Features

### 1. Coaching Profile

- coaching profile create API
- coaching profile edit API
- coaching profile page
- logo upload
- cover upload
- gallery support

### 2. Course/Batch Module

- course create API
- course edit API
- course archive API
- course list UI
- course create/edit forms

### 3. Demo Slot Module

- demo slot create API
- demo slot edit API
- slot status update API
- slot list UI
- demo slot form

### 4. Public Discovery

- homepage
- featured coachings section
- public search page
- search filters
- coaching detail page
- course detail page

### 5. Booking

- booking create API
- capacity checks
- duplicate prevention
- booking code generation
- booking success UI
- booking email send service

### 6. Dashboards

- student dashboard
- student bookings page
- coaching dashboard
- coaching booking list

## Phase 3 Backlog - Pilot Readiness

### 1. Admin

- admin dashboard
- analytics API
- user list management
- coaching moderation

### 2. Reviews and Offers

- review create/list
- review moderation
- offers list

### 3. UX Polish

- loaders
- skeleton states
- empty states
- toast messages
- form errors polish

### 4. SEO and Content

- metadata
- slugs
- about page
- contact page
- privacy policy page
- terms page

### 5. QA and Hardening

- responsive QA
- authorization QA
- booking flow QA
- email flow QA
- seed improvements
