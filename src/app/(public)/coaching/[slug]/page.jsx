import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getCoachingBySlugOrId } from "@/modules/coachings/coachings.service";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { BookDemoButton } from "@/components/shared/BookDemoButton";
import { ReviewForm } from "@/components/shared/ReviewForm";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const coaching = await getCoachingBySlugOrId(slug, false);
  if (!coaching) return { title: "Coaching Not Found" };
  return {
    title: coaching.name,
    description: coaching.tagline || coaching.description?.slice(0, 160),
  };
}

export default async function CoachingDetailPage({ params }) {
  const { slug } = await params;
  const session = await getSession();
  const coaching = await getCoachingBySlugOrId(slug, !!session?.user);

  if (!coaching) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{coaching.name}</h1>
            <p className="text-muted">{coaching.locality}, {coaching.city}</p>
            {coaching.tagline && <p className="mt-2 text-lg">{coaching.tagline}</p>}
          </div>
          <div className="text-right">
            <Badge variant="primary">★ {coaching.avgRating?.toFixed(1)} ({coaching.reviewCount} reviews)</Badge>
            {coaching.verificationStatus === "VERIFIED" && (
              <Badge variant="success" className="ml-2">Verified</Badge>
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {coaching.targetExams?.map((e) => <Badge key={e}>{e}</Badge>)}
          {coaching.subjects?.map((s) => <Badge key={s} variant="default">{s}</Badge>)}
        </div>
        {coaching.description && (
          <p className="mt-6 text-muted leading-relaxed">{coaching.description}</p>
        )}
        {!session?.user && (
          <p className="mt-4 rounded-lg bg-primary-light p-3 text-sm text-primary">
            <Link href="/login" className="font-medium underline">Login</Link> to see full details and book demo sessions.
          </p>
        )}
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Courses & Batches</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {coaching.courses?.map((course) => (
            <Link key={course.id} href={`/courses/${course.slug}`}>
              <Card className="hover:border-primary/30">
                <h3 className="font-medium">{course.title}</h3>
                <p className="text-sm text-muted">{course.targetExam} · {course.durationText}</p>
                {course.fees && <p className="mt-2 font-semibold text-primary">₹{course.fees.toLocaleString()}</p>}
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {session?.user && coaching.demoSlots?.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Upcoming Demo Slots</h2>
          <div className="mt-4 space-y-3">
            {coaching.demoSlots.map((slot) => (
              <Card key={slot.id} className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{slot.topic}</p>
                  <p className="text-sm text-muted">
                    {new Date(slot.demoDate).toLocaleDateString()} · {slot.startTime}-{slot.endTime} · {slot.teacherName}
                  </p>
                </div>
                <BookDemoButton demoSlotId={slot.id} disabled={slot.status !== "OPEN"} />
              </Card>
            ))}
          </div>
        </section>
      )}

      {session?.user?.role === "STUDENT" && (
        <section className="mt-8">
          <ReviewForm coachingId={coaching.id} />
        </section>
      )}

      {coaching.reviews?.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Reviews</h2>
          <div className="mt-4 space-y-3">
            {coaching.reviews.map((review) => (
              <Card key={review.id}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{review.student?.user?.name}</span>
                  <Badge variant="primary">★ {review.rating}</Badge>
                </div>
                {review.comment && <p className="mt-2 text-sm text-muted">{review.comment}</p>}
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
