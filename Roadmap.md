# CoachingHunt Roadmap

## 1. Roadmap Objective

Ship a pilot-ready version of CoachingHunt with the smallest clean feature set that proves value for both students and coaching institutes.

## 2. Delivery Strategy

Build in three phases:

- Phase 1: foundation and core auth
- Phase 2: marketplace and booking flows
- Phase 3: admin, polish, and pilot readiness

## 3. Phase 1 - Foundation

### Goals

- setup fresh project
- define theme system
- setup auth and DB
- build base layouts and shared components

### Scope

- Next.js app setup with JavaScript
- Tailwind CSS setup
- central theme file and tokens
- Prisma schema
- database connection
- NextAuth credentials auth
- role-based layouts
- navbar, footer, shell, loading components
- student signup
- coaching signup
- login flow

### Exit Criteria

- app runs cleanly
- auth works
- sessions include roles
- route guards exist
- theme is centrally controlled

## 4. Phase 2 - Marketplace Core

### Goals

- enable coaching listings
- enable search and discovery
- enable demo booking

### Scope

- coaching profile CRUD
- branch structure
- course/batch CRUD
- demo slot CRUD
- homepage
- search page
- coaching details page
- course details page
- booking flow
- confirmation email
- student dashboard basics
- coaching dashboard basics

### Exit Criteria

- coachings can create listings
- students can browse and search
- students can book demo slots
- email confirmation works
- dashboards reflect real data

## 5. Phase 3 - Operations and Pilot

### Goals

- make the product operationally usable
- improve trust and admin control
- polish the experience for launch

### Scope

- admin dashboard
- analytics
- moderation tools
- offer listing
- review flow basics
- loading skeletons
- empty states
- SEO metadata
- responsive QA
- archive/soft delete flows

### Exit Criteria

- admin can manage the platform
- mobile and desktop feel complete
- key metrics are visible
- pilot demo is launch-ready

## 6. Future Phase 4 Ideas

- online coaching support
- compare feature
- favorites/wishlist
- lead notifications on WhatsApp
- premium listings
- payment integration
- subscriptions for coaching institutes
- verified review workflows

## 7. Recommended Build Sequence

1. app scaffold
2. theme/design system
3. auth and roles
4. database schema and seed
5. coaching onboarding
6. course and batch management
7. demo slot management
8. public search and detail pages
9. booking flow and email
10. dashboards
11. admin operations
12. polish and QA

## 8. Timeline Suggestion

If Cursor is used effectively:

- Phase 1: 4 to 6 working days
- Phase 2: 7 to 12 working days
- Phase 3: 5 to 8 working days

This depends on how much manual review and polish is added.
