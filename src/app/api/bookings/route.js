import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { createBooking, getStudentBookings, getCoachingBookings, cancelBooking } from "@/modules/bookings/bookings.service";
import { rateLimit } from "@/lib/utils/rate-limit";

export async function POST(request) {
  const auth = await requireAuth(["STUDENT"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  const limited = rateLimit(request, "create-booking", 10, 15 * 60 * 1000);
  if (limited) return errorResponse("Too many booking attempts. Try again later.", [], 429);

  try {
    const { demoSlotId } = await request.json();
    const booking = await createBooking(auth.session.user.id, demoSlotId);
    return successResponse(booking, "Booking confirmed", 201);
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

export async function GET(request) {
  const auth = await requireAuth(["STUDENT", "COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const scope = new URL(request.url).searchParams.get("scope");
    if (scope === "coaching" && auth.session.user.role === "COACHING") {
      const bookings = await getCoachingBookings(auth.session.user.id);
      return successResponse(bookings);
    }
    const bookings = await getStudentBookings(auth.session.user.id);
    return successResponse(bookings);
  } catch (error) {
    return errorResponse("Failed to fetch bookings", [], 500);
  }
}
