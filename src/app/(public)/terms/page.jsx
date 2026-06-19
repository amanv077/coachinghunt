export const metadata = { title: "Terms of Service" };

const LAST_UPDATED = "June 19, 2026";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted">Last updated: {LAST_UPDATED}</p>

      <div className="prose mt-8 space-y-6 text-muted">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing or using CoachingHunt (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">2. Platform Role</h2>
          <p>
            CoachingHunt is a discovery and booking marketplace. We connect students with coaching institutes and facilitate demo session bookings. We are not a coaching provider and do not guarantee the quality, accuracy, or outcomes of any coaching service listed on the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">3. Account Registration</h2>
          <p>
            You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account. Notify us immediately of any unauthorized use.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Student Obligations</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>Provide accurate profile and booking information</li>
            <li>Attend booked demo sessions or cancel in advance when unable to attend</li>
            <li>Submit honest and fair reviews based on genuine experience</li>
            <li>Not misuse the Platform for spam, harassment, or fraudulent activity</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">5. Coaching Institute Obligations</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>Maintain accurate listings including fees, schedules, and contact details</li>
            <li>Honor confirmed demo bookings and respond to demo requests promptly</li>
            <li>Not misrepresent qualifications, results, or institute credentials</li>
            <li>Handle student data received through the Platform responsibly</li>
            <li>Comply with all applicable education and consumer protection laws</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">6. Demo Bookings</h2>
          <p>
            Demo bookings are subject to availability. A booking confirmation does not guarantee enrollment in a course. Coaching institutes may cancel or reschedule demo sessions with reasonable notice. CoachingHunt is not liable for cancellations or no-shows by either party.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">7. Content and Reviews</h2>
          <p>
            Users may submit reviews and profile content. We reserve the right to moderate, edit, or remove content that violates these Terms or is false, misleading, or abusive. By submitting content, you grant CoachingHunt a non-exclusive license to display it on the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">8. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Scrape, copy, or redistribute Platform data without permission</li>
            <li>Impersonate another person or institute</li>
            <li>Post false reviews or manipulate ratings</li>
            <li>Attempt to bypass Platform security or access unauthorized areas</li>
            <li>Use the Platform for any unlawful purpose</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">9. Intellectual Property</h2>
          <p>
            The CoachingHunt name, logo, and Platform design are our intellectual property. Coaching institutes retain ownership of their own logos, content, and branding uploaded to the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">10. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, CoachingHunt shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform or any coaching services booked through it. Our total liability shall not exceed the amount you paid to us (if any) in the preceding 12 months.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">11. Termination</h2>
          <p>
            We may suspend or terminate accounts that violate these Terms. You may delete your account at any time by contacting support. Upon termination, your right to use the Platform ceases immediately.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">12. Governing Law</h2>
          <p>
            These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in India.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">13. Contact</h2>
          <p>
            Questions about these Terms? Email{" "}
            <a href="mailto:support@coachinghunt.com" className="text-secondary hover:underline">
              support@coachinghunt.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
