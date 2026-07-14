import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TRUST_STATS_LIST } from "@/lib/marketing/trust-stats";

export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div>
      <section className="hero-gradient py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
            Our mission
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Making coaching discovery simple for every student
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
            CoachingHunt connects aspiring students with quality offline coaching institutes — helping
            families compare options and book demo sessions before they commit.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-white py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-6 px-4 sm:px-6">
          {TRUST_STATS_LIST.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-secondary sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs text-muted sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Our story</h2>
          <div className="mt-6 space-y-4 leading-relaxed text-muted">
            <p>
              Choosing the right coaching institute is one of the most important decisions a student
              makes. Yet for decades, families have relied on word-of-mouth, pamphlets, and random
              visits — with no easy way to compare options or try before they buy.
            </p>
            <p>
              CoachingHunt was built to change that. We give students a trusted marketplace to discover
              institutes by city, exam, and subject — then book free demo sessions to experience the
              teaching firsthand.
            </p>
            <p>
              For coaching institutes, we provide a structured platform to showcase courses, publish
              demo slots, and receive qualified student leads through demo bookings — not cold calls.
            </p>
          </div>
        </div>
      </section>

      <section className="navy-gradient py-16 text-center text-white sm:py-20">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to find your coaching?</h2>
          <p className="mt-3 text-white/80">
            Create a free student account and start booking demo sessions today.
          </p>
          <Link href="/signup" className="mt-6 inline-block">
            <Button size="lg" className="min-h-11 min-w-[200px] bg-white text-secondary hover:bg-secondary-light">
              Get started free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
