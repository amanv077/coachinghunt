# Cursor Auto Instructions

## Goal

Use Cursor Auto to implement CoachingHunt feature by feature in a controlled order, with clean commits after every completed feature.

## Core Instruction

Build the project as a fresh codebase using:

- Next.js App Router
- JavaScript only
- Tailwind CSS
- Prisma
- PostgreSQL
- NextAuth
- Nodemailer
- Cloudinary

## Non-Negotiable Rules

- do not reuse old messy code
- keep backend in same repo
- use modular monolith structure
- pages must stay thin
- services must hold business logic
- use reusable UI components
- centralize theme values
- validate every mutation server-side
- enforce role authorization on server
- commit after every completed feature

## Feature Execution Order

1. project scaffold
2. theme system
3. shared UI components
4. Prisma + schema + seed
5. auth + login/signup + middleware
6. public layouts + dashboard shells
7. coaching profile module
8. course/batch module
9. demo slot module
10. homepage
11. search page
12. coaching detail page
13. course detail page
14. booking flow
15. booking confirmation email
16. student dashboard
17. coaching dashboard
18. admin dashboard
19. moderation and analytics
20. polish, SEO, and QA

## Commit Requirement

After each feature:

- run local verification
- fix obvious issues
- create a focused commit

Examples:

- `feat(ui): add theme tokens and shared components`
- `feat(auth): implement credentials auth and role middleware`
- `feat(coaching): add coaching profile management`
- `feat(booking): implement booking flow and email confirmation`

## Definition of Ready

Before starting a feature, Cursor should confirm:

- required schema exists
- required routes exist
- shared UI dependencies are ready
- feature boundaries are clear

## Definition of Done

A feature is complete only when:

- UI is implemented
- backend logic is implemented
- validation is implemented
- authorization is implemented
- loading and error states exist
- feature is committed

## Guardrails

Cursor should not:

- create one huge PR-style commit at the end
- leave half-finished modules
- hardcode secrets in code
- over-engineer with unnecessary abstractions
- introduce TypeScript

## Escalation Rule

If a decision materially changes product behavior, Cursor should stop and request clarification. Otherwise, continue feature-by-feature.
