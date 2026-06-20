import Link from "next/link";
import { listPublicCoachings, getCityExamCombos } from "@/modules/coachings/coachings.service";
import { CoachingCardGrid } from "@/components/marketing/CoachingCardGrid";
import { parseCityExamSlug, buildCityExamSlug } from "@/lib/seo/constants";
import { buildOgMetadata } from "@/lib/seo/metadata";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";

export async function generateStaticParams() {
  const combos = await getCityExamCombos();
  return combos.slice(0, 100).map(({ exam, city }) => ({
    slug: buildCityExamSlug(exam, city),
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const parsed = parseCityExamSlug(slug);
  if (!parsed) return { title: "Coaching Not Found" };
  return buildOgMetadata({
    title: `Best ${parsed.exam} Coachings in ${parsed.city}`,
    description: `Find and compare ${parsed.exam} coaching institutes in ${parsed.city}. Book free demo sessions.`,
    path: `/coaching-in/${slug}`,
  });
}

export default async function CityExamLandingPage({ params }) {
  const { slug } = await params;
  const parsed = parseCityExamSlug(slug);
  if (!parsed) notFound();

  const result = await listPublicCoachings({
    targetExam: parsed.exam,
    city: parsed.city,
    limit: 24,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link href={`/exams/${parsed.exam.toLowerCase()}`} className="text-sm text-secondary hover:underline">
        ← All {parsed.exam} coachings
      </Link>
      <h1 className="mt-4 text-3xl font-bold">
        {parsed.exam} Coachings in {parsed.city}
      </h1>
      <p className="mt-2 text-muted">{result.total} institutes found</p>

      <div className="mt-8">
        {result.items.length === 0 ? (
          <Card>
            <p className="text-muted">No coachings found in {parsed.city} for {parsed.exam} yet.</p>
            <Link href="/search" className="mt-4 inline-block text-secondary hover:underline">
              Browse all coachings
            </Link>
          </Card>
        ) : (
          <CoachingCardGrid coachings={result.items} showActions />
        )}
      </div>
    </div>
  );
}
