# CoachingHunt API Spec

## 1. API Principles

- REST-style endpoints
- JSON responses
- role-based access control
- consistent success/error shape
- server-side validation for all mutations

## 2. Response Format

### Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

## 3. Auth

Authentication is managed by `NextAuth`.

### Login

Handled by credentials auth flow.

### Signup Endpoints

#### `POST /api/auth/signup/student`

Creates a student user and student profile.

Request:

```json
{
  "name": "Aman",
  "email": "aman@example.com",
  "phone": "9876543210",
  "password": "strong-password",
  "city": "Delhi",
  "targetExam": "JEE"
}
```

#### `POST /api/auth/signup/coaching`

Creates a coaching user and initial coaching profile.

Request:

```json
{
  "contactPersonName": "Rahul",
  "coachingName": "Excel Academy",
  "email": "owner@example.com",
  "phone": "9876543210",
  "password": "strong-password",
  "city": "Delhi",
  "locality": "Rohini",
  "category": "Engineering Entrance"
}
```

## 4. Public Coachings

### `GET /api/coachings`

Search and list coachings.

Query params:

- `q`
- `city`
- `locality`
- `subject`
- `targetExam`
- `page`
- `limit`
- `sort`

Response data:

- paginated coaching listing cards

### `GET /api/coachings/[id-or-slug]`

Get coaching detail.

Behavior:

- anonymous users get limited detail
- authenticated users get full detail

## 5. Coaching Management

### `POST /api/coachings`

Create coaching profile or complete setup if allowed by flow.

Role:

- `COACHING`

### `PATCH /api/coachings/[id]`

Update coaching profile.

Role:

- `COACHING` owner only

### `GET /api/coachings/me`

Return current coaching profile and summary.

Role:

- `COACHING`

## 6. Courses / Batches

### `POST /api/courses`

Create course or batch.

Role:

- `COACHING`

Request:

```json
{
  "title": "NEET Foundation Batch",
  "description": "Focused preparation for NEET aspirants",
  "courseType": "BATCH",
  "targetExam": "NEET",
  "branchId": "branch_123",
  "batchSize": 40,
  "fees": 25000,
  "durationText": "6 months",
  "scheduleSummary": "Mon to Sat, 4 PM to 6 PM"
}
```

### `GET /api/courses`

Public or filtered course list.

Filters:

- `coachingId`
- `targetExam`
- `classLevel`
- `courseType`

### `GET /api/courses/[id-or-slug]`

Get course detail.

### `PATCH /api/courses/[id]`

Update course.

Role:

- `COACHING` owner only

### `DELETE /api/courses/[id]`

Archive course.

Role:

- `COACHING` owner only

## 7. Demo Slots

### `POST /api/demo-slots`

Create a demo slot.

Role:

- `COACHING`

Request:

```json
{
  "courseId": "course_123",
  "topic": "Trigonometry Basics",
  "teacherName": "Ravi Sir",
  "demoDate": "2026-06-25",
  "startTime": "16:00",
  "endTime": "17:00",
  "durationMinutes": 60,
  "capacity": 30,
  "venueName": "Main Branch Hall",
  "venueAddress": "Sector 10, Noida",
  "instructions": "Please arrive 10 minutes early"
}
```

### `GET /api/demo-slots`

Public listing for available demo slots.

Filters:

- `courseId`
- `coachingId`
- `date`
- `city`

### `GET /api/demo-slots/[id]`

Get demo slot detail.

### `PATCH /api/demo-slots/[id]`

Update demo slot.

Role:

- `COACHING` owner only

### `PATCH /api/demo-slots/[id]/status`

Update slot status.

Role:

- `COACHING` owner only

## 8. Bookings

### `POST /api/bookings`

Book a demo slot.

Role:

- `STUDENT`

Request:

```json
{
  "demoSlotId": "slot_123"
}
```

Business rules:

- student must be logged in
- slot must be open
- slot must have capacity
- student must not already have a booking for the same slot

Response:

- booking record
- booking code
- email send status

### `GET /api/bookings?scope=mine`

Get current student bookings.

Role:

- `STUDENT`

### `GET /api/bookings?scope=coaching`

Get bookings for current coaching's courses/demo slots.

Role:

- `COACHING`

### `PATCH /api/bookings/[id]/cancel`

Cancel booking.

Role:

- `STUDENT` own booking or admin

## 9. Reviews

### `POST /api/reviews`

Create review.

Role:

- `STUDENT`

### `GET /api/reviews`

List reviews by coaching or course.

Filters:

- `coachingId`
- `courseId`
- `status`

### `PATCH /api/reviews/[id]/approve`

Approve review.

Role:

- `ADMIN`

## 10. Offers

### `GET /api/offers`

List active offers.

### `POST /api/offers`

Create offer.

Role:

- `COACHING` or `ADMIN` depending on final business rule

## 11. Student Profile

### `GET /api/student/profile`

Get current student profile.

Role:

- `STUDENT`

### `PATCH /api/student/profile`

Update profile.

Role:

- `STUDENT`

## 12. Coaching Dashboard

### `GET /api/coaching/dashboard`

Returns:

- profile summary
- course count
- active demo slots
- booking summary
- recent leads

Role:

- `COACHING`

## 13. Student Dashboard

### `GET /api/student/dashboard`

Returns:

- upcoming booked demos
- latest offers
- top coachings
- profile snapshot

Role:

- `STUDENT`

## 14. Admin

### `GET /api/admin/analytics`

Returns:

- total students
- total coachings
- active courses
- active demo slots
- total bookings
- bookings by city

Role:

- `ADMIN`

### `GET /api/admin/users`

List users.

### `GET /api/admin/coachings`

List coachings with moderation state.

### `PATCH /api/admin/coachings/[id]/verify`

Update verification status.

### `PATCH /api/admin/users/[id]/status`

Activate/deactivate user.

## 15. Uploads

### `POST /api/upload/signature`

Generate Cloudinary signed upload details.

Role:

- authenticated user

## 16. Validation Rules

- all required fields must be validated server-side
- email must be valid format
- password minimum length required
- demo date must not be in the past
- end time must be later than start time
- capacity must be positive
- fees must not be negative

## 17. Error Cases

Important error cases to handle:

- unauthenticated access
- forbidden role
- duplicate email signup
- duplicate demo booking
- slot full
- invalid course/slot ownership
- invalid or archived listing

## 18. Versioning Guidance

MVP can use unversioned internal API paths.

If external integrations expand later, move to:

- `/api/v1/...`
