# CoachingHunt PRD

## 1. Product Overview

### Product Name

`CoachingHunt`

### Product Type

Marketplace platform for offline coaching institutes and students.

### Product Goal

CoachingHunt helps students discover, compare, and book demo sessions with coaching institutes. It also gives coaching institutes a marketplace where they can create listings, publish courses or batches, and generate leads.

### Initial Focus

Phase 1 launch focuses only on **offline coaching institutes**.

### Future Scope

Later phases can support:

- online coachings
- live session links
- paid leads or subscriptions
- premium listings
- verified reviews
- favorite and compare tools

## 2. Problem Statement

Students often find it difficult to:

- compare coaching institutes in one place
- understand course and batch differences
- know which demo session to attend
- trust marketing claims without structured information

Coaching institutes often struggle to:

- build discoverability online
- capture interested students
- present offerings clearly
- manage demo inquiries in a structured way

## 3. Product Vision

Build a clean, trustworthy, and easy-to-use platform where students can evaluate coaching options with confidence and coaching institutes can get qualified leads through demo bookings.

## 4. Target Users

### Students

Students looking for local offline coaching for:

- school subjects
- entrance exams
- foundation batches
- competitive exams

### Coaching Institutes

Offline coaching owners or staff who want to:

- list their institute
- create courses and batches
- publish demo slots
- receive student leads

### Admin

Platform operator who manages:

- quality control
- analytics
- moderation
- listing health

## 5. User Roles

### Admin

- manage users
- manage coachings
- see analytics
- review platform activity
- moderate reviews and listings

### Coaching

- create and manage coaching profile
- create and manage courses or batches
- create and manage demo slots
- see booked demos and leads
- view basic analytics

### Student

- signup/login easily
- search coachings, courses, and batches
- view details and reviews
- book demo slots
- receive email confirmation
- view bookings in dashboard

## 6. Core User Stories

### Student Stories

- As a student, I want to search coachings by keyword, city, subject, or exam so I can find relevant institutes.
- As a student, I want to compare courses and batches so I can make a better decision.
- As a student, I want to see demo slots with teacher, topic, date, and time so I can book a relevant session.
- As a student, I want to receive booking details over email so I do not miss the demo.
- As a student, I want a dashboard with my booked demos so I can track them easily.

### Coaching Stories

- As a coaching user, I want a dedicated signup flow so I can submit institute-specific information.
- As a coaching user, I want to create my coaching profile so students can discover us.
- As a coaching user, I want to create courses or batches with details so students can understand our offerings.
- As a coaching user, I want to publish demo slots so students can book sessions.
- As a coaching user, I want to see bookings and leads so I can follow up.

### Admin Stories

- As an admin, I want to see platform analytics so I can track growth and quality.
- As an admin, I want to manage coachings and users so I can maintain trust.
- As an admin, I want moderation controls so low-quality or abusive content can be handled.

## 7. Scope

## In Scope for MVP

- public homepage
- public search page
- coaching detail page
- course/batch detail page
- student signup/login
- coaching signup/login
- role-based dashboards
- coaching profile creation and edit
- course/batch CRUD
- demo slot CRUD
- student demo booking
- booking confirmation email
- admin analytics basics
- about us, contact us, privacy policy

## Out of Scope for MVP

- payments
- online live classes
- video conferencing
- subscription billing
- mobile app
- advanced recommendation engine
- chat support

## 8. Main Features

### 1. Homepage

- platform positioning
- explanation of how it works
- search bar
- featured coachings
- benefits for students and coaching institutes

### 2. Search and Discovery

- search by keyword
- search by city/locality
- search by subject/exam/class
- visible listing cards
- logged-out limited details
- logged-in full details

### 3. Coaching Onboarding

- dedicated coaching signup
- institute details
- contact person details
- branding assets
- address and location
- subject and exam coverage

### 4. Course/Batch Management

- create course or batch
- set description, schedule, fees, duration, branch/location
- attach demo slots

### 5. Demo Slot Booking

- topic
- teacher
- date
- day
- time
- duration
- venue details
- booking confirmation

### 6. Dashboards

Student:

- upcoming booked demos
- latest offers
- top coachings
- profile management

Coaching:

- profile status
- course listings
- demo slots
- booked demos
- basic analytics

Admin:

- users
- coachings
- demo bookings
- basic platform insights

## 9. Business Rules

- anonymous users can browse but see limited listing details
- only logged-in students can book demo slots
- a student cannot book the same demo slot twice
- a demo slot cannot exceed capacity
- every demo slot must belong to a course or batch
- a course or batch must belong to a coaching
- coaching users can only manage their own data
- admin can manage all data

## 10. Success Metrics

### Platform Metrics

- number of coaching signups
- number of published coachings
- number of active courses/batches
- number of demo slots created
- total demo bookings
- student signup count

### Engagement Metrics

- homepage to search conversion
- search to detail view conversion
- detail view to booking conversion
- repeat student visits

### Coaching Value Metrics

- leads generated per coaching
- bookings per course
- bookings per demo slot

## 11. UX Direction

- simple modern premium UI
- white primary background
- premium blue secondary theme
- reusable components
- no clutter
- clear cards and sections
- smooth homepage scroll animations
- fun loading animations without being distracting
- centralized theme configuration for easy updates

## 12. Non-Functional Requirements

- mobile responsive
- SEO-friendly public pages
- maintainable code structure
- role-based authorization
- basic analytics
- clean modular architecture
- same-repo backend for simplicity

## 13. Risks

- messy codebase if structure is not enforced
- poor listing quality if coaching onboarding is weak
- low trust if reviews or details are unreliable
- role bugs if authorization is not strict

## 14. Product Recommendation

Build as a **modular monolith** in one Next.js repo using JavaScript, Tailwind CSS, Prisma, PostgreSQL, NextAuth, Cloudinary, and SMTP mail.

This gives the best balance of:

- fast build speed
- simple maintenance
- pilot readiness
- clean future scalability
