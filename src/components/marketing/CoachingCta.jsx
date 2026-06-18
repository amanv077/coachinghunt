import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function CoachingCta() {
  return (
    <section className="navy-gradient relative overflow-hidden py-20 text-white sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_50%)]" />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to grow your institute?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
          Join CoachingHunt to showcase your courses, publish demo slots, and receive qualified student leads every week.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/signup/coaching">
            <Button size="lg" className="min-w-[200px] bg-white text-secondary hover:bg-secondary-light">
              List your coaching — free
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              size="lg"
              variant="ghost"
              className="min-w-[200px] border border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              Talk to us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
