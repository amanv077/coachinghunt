export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">About CoachingHunt</h1>
      <p className="mt-4 text-muted leading-relaxed">
        CoachingHunt is a marketplace platform that helps students discover, compare, and book demo sessions
        with offline coaching institutes. We connect aspiring students with quality coaching options in their city,
        making it easier to evaluate institutes before committing.
      </p>
      <p className="mt-4 text-muted leading-relaxed">
        For coaching institutes, CoachingHunt provides a structured way to showcase courses, publish demo slots,
        and receive qualified student leads through demo bookings.
      </p>
    </div>
  );
}
