const benefits = [
  {
    title: "For Students",
    subtitle: "Find clarity before you commit",
    items: [
      "Search coachings by city, exam & subject",
      "Compare courses, fees & demo slots",
      "Book demos with email confirmation",
      "Track all bookings in one dashboard",
    ],
    cta: { label: "Create student account", href: "/signup/student" },
    gradient: true,
  },
  {
    title: "For Coaching Institutes",
    subtitle: "Get discovered. Get leads.",
    items: [
      "Create a professional institute profile",
      "Publish courses, batches & demo slots",
      "Receive qualified student bookings",
      "Manage leads from your dashboard",
    ],
    cta: { label: "List your coaching", href: "/signup/coaching" },
    gradient: false,
  },
];

function CheckIcon() {
  return (
    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function BenefitsSection() {
  return (
    <section className="bg-surface-muted py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
            Built for both sides
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Why CoachingHunt?
          </h2>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {benefits.map((block) => (
            <div
              key={block.title}
              className={`rounded-2xl border border-secondary/10 bg-white p-8 shadow-sm transition hover:shadow-md ${
                block.gradient ? "relative overflow-hidden" : ""
              }`}
            >
              {block.gradient && (
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-secondary/5 blur-2xl" />
              )}
              <div className="relative">
                <div className="h-1 w-12 rounded-full bg-secondary" />
                <h3 className="mt-5 text-xl font-bold text-foreground">{block.title}</h3>
                <p className="mt-1 text-secondary">{block.subtitle}</p>
                <ul className="mt-6 space-y-3">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary-light text-secondary">
                        <CheckIcon />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={block.cta.href}
                  className="mt-8 inline-flex min-h-11 items-center text-sm font-semibold text-secondary hover:underline"
                >
                  {block.cta.label} →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
