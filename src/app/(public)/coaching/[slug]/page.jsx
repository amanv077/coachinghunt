import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getCoachingBySlugOrId } from "@/modules/coachings/coachings.service";
import { getSavedCoachingIds } from "@/modules/saved-coachings/saved-coachings.service";
import { CoachingProfileView } from "@/components/marketing/CoachingProfileView";

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

  let isSaved = false;
  if (session?.user?.role === "STUDENT") {
    const savedIds = await getSavedCoachingIds(session.user.id);
    isSaved = savedIds.includes(coaching.id);
  }

  return <CoachingProfileView coaching={coaching} session={session} isSaved={isSaved} />;
}
