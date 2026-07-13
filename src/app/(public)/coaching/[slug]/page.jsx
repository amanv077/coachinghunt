import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getCoachingBySlugOrId, recordProfileView } from "@/modules/coachings/coachings.service";
import { getSavedCoachingIds } from "@/modules/saved-coachings/saved-coachings.service";
import { getStudentBookings } from "@/modules/bookings/bookings.service";
import { studentCanReviewCoaching } from "@/modules/reviews/reviews.service";
import { listActiveOffers } from "@/modules/offers/offers.service";
import { CoachingProfileView } from "@/components/marketing/CoachingProfileView";
import { TrackRecentlyViewed } from "@/components/shared/TrackRecentlyViewed";
import { buildOgMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const coaching = await getCoachingBySlugOrId(slug, false);
  if (!coaching) return { title: "Coaching Not Found" };
  return buildOgMetadata({
    title: coaching.name,
    description: coaching.tagline || coaching.description?.slice(0, 160),
    image: coaching.coverImageUrl || coaching.logoUrl,
    path: `/coaching/${slug}`,
  });
}

export default async function CoachingDetailPage({ params }) {
  const { slug } = await params;
  const session = await getSession();
  const coaching = await getCoachingBySlugOrId(slug, !!session?.user);

  if (!coaching) notFound();

  await recordProfileView(coaching.id);

  const offers = await listActiveOffers(coaching.id);

  let isSaved = false;
  let studentBookings = [];
  let canReview = false;
  if (session?.user?.role === "STUDENT") {
    const [savedIds, bookings, reviewEligible] = await Promise.all([
      getSavedCoachingIds(session.user.id),
      getStudentBookings(session.user.id),
      studentCanReviewCoaching(session.user.id, coaching.id),
    ]);
    isSaved = savedIds.includes(coaching.id);
    studentBookings = bookings.filter(
      (b) => b.coachingId === coaching.id && b.status === "CONFIRMED"
    );
    canReview = reviewEligible;
  }

  return (
    <>
      <TrackRecentlyViewed
        coaching={{
          id: coaching.id,
          slug: coaching.slug,
          name: coaching.name,
          city: coaching.city,
          logoUrl: coaching.logoUrl,
          avgRating: coaching.avgRating,
        }}
      />
      <CoachingProfileView
        coaching={coaching}
        session={session}
        isSaved={isSaved}
        studentBookings={studentBookings}
        canReview={canReview}
        offers={offers}
      />
    </>
  );
}
