# Antigravity Rules for CoachingHunt

This document outlines the core principles and rules for developing the CoachingHunt platform. **CoachingHunt** is a customer-facing marketplace for coaching discovery and demo booking, primarily accessed via mobile devices.

## 1. Mobile-First & Responsive Design
- **Default to Mobile**: Design and implement for small screens (320px–390px) first.
- **Tailwind Approach**: Default Tailwind classes must be for mobile. Use `md:`, `lg:`, etc., only to enhance for larger screens (e.g., adding columns, widening containers).
- **Layouts**: 
  - Use `grid-cols-1` moving to `md:grid-cols-2`.
  - Use `flex-col` moving to `md:flex-row`.
  - Ensure sticky bottom CTAs on mobile for key actions (`fixed bottom-0 inset-x-0`).
- **Touch & Readability**: Tap targets must be ≥ 44×44px. Use full-width primary actions on mobile (`w-full md:w-auto`). Ensure text size is readable (`text-sm` minimum).

## 2. Customer-First UX
- **Clarity over Cleverness**: Use plain labels ("Book free demo", "Search coachings") instead of internal jargon.
- **Minimal Friction**: Keep forms short, single column on mobile. Group related fields, show inline validation.
- **Feedback & States**: Never leave a dead screen. Always use `Loader`, `Skeleton`, `Toast`, and `EmptyState` where appropriate.
- **Trust Signals**: Display location, exams, ratings, verification, and clear booking confirmations.

## 3. UI Consistency & Design System
- **Shared Primitives**: Only use shared UI components from `src/components/ui/` (e.g., `Button`, `Input`, `Card`, `Badge`). Do not create raw HTML elements (`<button>`, `<input>`) with custom styles unless modifying the design system itself.
- **Theme Tokens**: Use semantic tokens from `src/styles/theme.css` (e.g., `bg-secondary`, `text-secondary`, `border-border`, `text-muted`, `text-foreground`). Avoid hardcoding hex colors.
- **Spacing & Typography**: 
  - Padding: `px-4 sm:px-6 lg:px-8` (never less than `px-4` on mobile).
  - Cards: `rounded-xl border border-border bg-white shadow-sm p-5`.
  - Headings: `text-2xl font-bold` (page), `text-lg font-semibold` (section).

## 4. Core Marketplace Flows
UI changes must support and not obscure these six core flows:
1. **Coaching Finding (Student Discovery)**: Prominent search/filters, scannable cards.
2. **Coaching Demo Booking**: One obvious "Book demo" action per slot. Gate login only at booking time.
3. **Student Onboarding**: Short signup, guide immediately toward search/discovery.
4. **Coaching Onboarding**: Step-by-step profile completion with clear progress indicators.
5. **Batches (Courses)**: Simple management for coaches; clear summary and link to demos for students.
6. **Demo Creation (Coaching Supply)**: Easy slot creation and clear status for coaches.

## 5. What to Avoid
- Dashboard/Admin patterns on public pages.
- Desktop-only flows; mobile is the default experience.
- Hover-only interactions (`:hover`-only affordances fail on touch devices).
- Multi-column forms or wide data tables on small screens (stack them or allow horizontal scroll).
