import { getFeaturedCoachings } from "@/modules/coachings/coachings.service";
import { HomepageHero } from "@/components/marketing/HomepageHero";
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
  const featured = await getFeaturedCoachings(6);

  return (
    <>
      <HomepageHero />
      <HowItWorks />
      <FeaturedCoachings coachings={featured} />
      <TestimonialsSection />
      <BenefitsSection />
      <CoachingCta />
    </>
  );
}
