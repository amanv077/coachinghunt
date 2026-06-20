import Link from "next/link";
import { getExamCoachingCounts } from "@/modules/coachings/coachings.service";
import { KNOWN_EXAMS, examToSlug } from "@/lib/seo/constants";
import { Card } from "@/components/ui/Card";
import { buildOgMetadata } from "@/lib/seo/metadata";

export const metadata = buildOgMetadata({
  title: "Exam Coaching Guides",
  description: "Find top coaching institutes for JEE, NEET, Boards, and more across India.",
  path: "/exams",
});

export default async function ExamsPage() {
  const counts = await getExamCoachingCounts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Find coaching by exam</h1>
      <p className="mt-2 max-w-2xl text-muted">Browse institutes by the exam you are preparing for.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {KNOWN_EXAMS.map((exam) => (
          <Link key={exam} href={`/exams/${examToSlug(exam)}`}>
            <Card className="h-full transition hover:shadow-md">
              <p className="text-lg font-semibold text-foreground">{exam}</p>
              <p className="mt-1 text-sm text-muted">{counts[exam] || 0} coachings listed</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
