import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getCourseBySlugOrId } from "@/modules/courses/courses.service";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { BookDemoButton } from "@/components/shared/BookDemoButton";
import { RequestDemoButton } from "@/components/shared/RequestDemoButton";

import { buildOgMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = await getCourseBySlugOrId(slug, false);
  if (!course) return { title: "Course Not Found" };
  return buildOgMetadata({
    title: course.title,
    description: course.description?.slice(0, 160),
    path: `/courses/${slug}`,
  });
}

export default async function CourseDetailPage({ params }) {
  const { slug } = await params;
  const session = await getSession();
  const course = await getCourseBySlugOrId(slug, !!session?.user);

  if (!course) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Card>
        <Link href={`/coaching/${course.coaching.slug}`} className="text-sm text-primary hover:underline">
          {course.coaching.name}
        </Link>
        <h1 className="mt-2 text-3xl font-bold">{course.title}</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="primary">{course.targetExam}</Badge>
          <Badge>{course.courseType}</Badge>
          {course.classLevel && <Badge>{course.classLevel}</Badge>}
        </div>
        {course.description && <p className="mt-4 text-muted leading-relaxed">{course.description}</p>}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {course.fees && <div><p className="text-sm text-muted">Fees</p><p className="font-semibold text-primary">₹{course.fees.toLocaleString()}</p></div>}
          {course.durationText && <div><p className="text-sm text-muted">Duration</p><p className="font-medium">{course.durationText}</p></div>}
          {course.scheduleSummary && <div><p className="text-sm text-muted">Schedule</p><p className="font-medium">{course.scheduleSummary}</p></div>}
        </div>
      </Card>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Demo Slots</h2>
        {!session?.user ? (
          <p className="mt-4 text-muted"><Link href="/login" className="text-primary underline">Login</Link> to book a demo session.</p>
        ) : course.demoSlots?.length === 0 ? (
          <Card className="mt-4 space-y-4">
            <p className="text-muted">
              No upcoming demo slots. Request a date and the coaching will confirm or suggest another time.
            </p>
            {session.user.role === "STUDENT" && (
              <RequestDemoButton
                coachingId={course.coachingId}
                courseId={course.id}
                coachingName={course.coaching.name}
                courseTitle={course.title}
                className="min-h-11 w-full sm:w-auto"
                size="md"
                label="Request a demo"
              />
            )}
          </Card>
        ) : (
          <div className="mt-4 space-y-3">
            {course.demoSlots.map((slot) => (
              <Card key={slot.id} className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{slot.topic}</p>
                  <p className="text-sm text-muted">
                    {new Date(slot.demoDate).toLocaleDateString()} · {slot.startTime}-{slot.endTime}
                  </p>
                </div>
                <BookDemoButton demoSlotId={slot.id} disabled={slot.status !== "OPEN"} />
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
