import {
  getFeaturedCoachings,
  getFeaturedReviews,
  getPlatformStats,
  getExamCoachingCounts,
} from "@/modules/coachings/coachings.service";
import { HomepageHero } from "@/components/marketing/HomepageHero";
import { ExamCategories } from "@/components/marketing/ExamCategories";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { BenefitsSection } from "@/components/marketing/BenefitsSection";
import { FeaturedCoachings } from "@/components/marketing/FeaturedCoachings";
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection";
import { CoachingCta } from "@/components/marketing/CoachingCta";

export const metadata = {
  title: "Find & Book Demo Sessions with Top Coachings",
  description: "Discover offline coaching institutes, compare courses, and book demo sessions with confidence.",
};

export default async function HomePage() {
  const [featured, stats, reviews, examCounts] = await Promise.all([
    getFeaturedCoachings(6),
    getPlatformStats(),
    getFeaturedReviews(3),
    getExamCoachingCounts(),
  ]);

  return (
    <>
      <HomepageHero stats={stats} />
      <ExamCategories counts={examCounts} />
      <HowItWorks />
      <FeaturedCoachings coachings={featured} />
      <TestimonialsSection reviews={reviews} />
      <BenefitsSection />
      <CoachingCta />
    </>
  );
}
