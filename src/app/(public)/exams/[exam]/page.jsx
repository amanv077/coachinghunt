import Link from "next/link";
import { listPublicCoachings, getCityExamCombos } from "@/modules/coachings/coachings.service";
import { CoachingCardGrid } from "@/components/marketing/CoachingCardGrid";
import { KNOWN_EXAMS, examToSlug, slugToExam, buildCityExamSlug } from "@/lib/seo/constants";
import { examBelongsToCategory } from "@/lib/seo/exam-match";
import { buildOgMetadata } from "@/lib/seo/metadata";
import { Card } from "@/components/ui/Card";

export async function generateStaticParams() {
  return KNOWN_EXAMS.map((exam) => ({ exam: examToSlug(exam) }));
}

export async function generateMetadata({ params }) {
  const { exam: examSlug } = await params;
  const exam = slugToExam(examSlug);
  return buildOgMetadata({
    title: `Best ${exam} Coachings in India`,
    description: `Compare ${exam} coaching institutes, explore courses, and book free demo sessions.`,
    path: `/exams/${examSlug}`,
  });
}

export default async function ExamLandingPage({ params, searchParams }) {
  const { exam: examSlug } = await params;
  const sp = await searchParams;
  const exam = slugToExam(examSlug);
  const page = Number(sp.page || 1);

  const [result, cityCombos] = await Promise.all([
    listPublicCoachings({ targetExam: exam, page, limit: 12 }),
    getCityExamCombos(),
  ]);

  const citiesForExam = cityCombos
    .filter((c) => examBelongsToCategory(c.exam, exam))
    .slice(0, 12);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">{exam} Coachings</h1>
      <p className="mt-2 text-muted">{result.total} institutes offering {exam} preparation</p>

      {citiesForExam.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-foreground">Popular cities</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {citiesForExam.map(({ city, count }) => (
              <Link
                key={city}
                href={`/coaching-in/${buildCityExamSlug(exam, city)}`}
                className="min-h-9 rounded-full border border-secondary/20 bg-white px-3 py-1.5 text-xs font-medium text-secondary"
              >
                {city} ({count})
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        {result.items.length === 0 ? (
          <Card><p className="text-muted">No coachings found for {exam} yet.</p></Card>
        ) : (
          <CoachingCardGrid coachings={result.items} showActions />
        )}
      </div>
    </div>
  );
}
