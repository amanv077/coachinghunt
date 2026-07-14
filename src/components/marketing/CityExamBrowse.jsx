"use client";

import Link from "next/link";
import { buildCityExamSlug } from "@/lib/seo/constants";

export function CityExamBrowse({ combos = [] }) {
  const sorted = [...combos]
    .filter((c) => c.count > 0 && c.city && c.exam)
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  if (sorted.length === 0) return null;

  return (
    <section className="border-b border-border bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center rounded-full bg-secondary-light px-3 py-1 text-xs font-semibold text-secondary">
            Browse locally
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Popular exam × city searches
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
            Jump straight to verified coachings in your city — real listings, not placeholders.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-2.5">
          {sorted.map((combo) => {
            const slug = buildCityExamSlug(combo.exam, combo.city);
            return (
              <Link
                key={`${combo.exam}-${combo.city}`}
                href={`/coaching-in/${slug}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface-muted px-3.5 py-2 text-sm font-medium text-foreground transition hover:border-secondary hover:bg-secondary-light hover:text-secondary"
              >
                <span>
                  {combo.exam} in {combo.city}
                </span>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-secondary shadow-xs">
                  {combo.count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
