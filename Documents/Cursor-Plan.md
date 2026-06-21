# CoachingHunt Cursor Plan

## 1. Objective

This document tells Cursor exactly how to execute the build.

## 2. Cursor Working Rules

Cursor should:

- build a fresh application, not reuse messy old structure
- use JavaScript only
- use Next.js App Router
- keep backend in the same repo
- use Prisma for DB access
- use Tailwind CSS with central theme tokens
- keep pages thin and move business logic into modules/services
- create reusable UI components
- maintain role-based route protection
- commit after every completed feature

## 3. Commit Rule

After each completed feature, Cursor should:

1. verify the feature locally
2. ensure no unrelated files are broken
3. create a focused commit with a clear message

Suggested commit message style:

- `feat(auth): add student and coaching signup flows`
- `feat(coaching): add coaching profile management`
- `feat(course): add batch and course CRUD`
- `feat(booking): add demo slot booking and email confirmation`

## 4. Feature-by-Feature Execution Order

### Foundation

1. initialize Next.js app with Tailwind and JavaScript
2. setup folder structure
3. add theme tokens and base layout system
4. setup Prisma and DB
5. setup NextAuth

### Auth

6. build login page
7. build student signup
8. build coaching signup
9. add route guards and role-aware redirects

### Coaching Marketplace

10. build coaching profile setup/edit
11. build branch structure if included in MVP
12. build course/batch CRUD
13. build demo slot CRUD

### Public Product

14. build homepage
15. build search page with filters
16. build coaching detail page
17. build course detail page

### Student Booking

18. build booking flow
19. send booking confirmation email
20. build student dashboard

### Coaching Operations

21. build coaching dashboard
22. show bookings/leads

### Admin

23. build admin dashboard
24. build coaching/user management
25. add analytics cards and tables

### Polish

26. add loaders and skeletons
27. add empty states and error states
28. add SEO metadata
29. responsive QA

## 5. Definition of a Completed Feature

A feature is complete only when:

- UI exists
- backend/API exists if needed
- validation exists
- authorization exists
- success/error states exist
- basic QA is done
- code is committed

## 6. Required Build Standards

- no giant page files
- no direct DB code inside UI components
- no hardcoded theme values everywhere
- no skipped validation on server
- no mixed admin/student/coaching logic in one place

## 7. Required Review Checklist Per Feature

- does the feature follow the folder structure?
- are role permissions enforced?
- are forms validated?
- is the UI reusable and consistent?
- is the API response shape consistent?
- is the commit focused and meaningful?

## 8. When Cursor Should Stop and Ask

Cursor should pause only if:

- business rule conflict appears
- env setup is missing required values
- schema change has major side effects
- UI direction must change significantly

Otherwise, Cursor should continue executing feature by feature.
