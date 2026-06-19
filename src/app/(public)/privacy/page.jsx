export const metadata = { title: "Privacy Policy" };

const LAST_UPDATED = "June 19, 2026";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted">Last updated: {LAST_UPDATED}</p>

      <div className="prose mt-8 space-y-6 text-muted">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Introduction</h2>
          <p>
            CoachingHunt (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates a marketplace that helps students discover coaching institutes and book demo sessions. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">2. Information We Collect</h2>
          <p>We collect information you provide directly, including:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Account details: name, email, phone number, password (stored securely hashed)</li>
            <li>Student profile: city, target exams, class level, school name</li>
            <li>Coaching profile: institute name, location, contact details, course information</li>
            <li>Booking and demo request data: preferred dates, messages, booking codes</li>
            <li>Reviews and ratings you submit</li>
            <li>Contact form submissions</li>
          </ul>
          <p className="mt-3">
            We also collect usage data such as pages visited, search queries, and device/browser information through standard server logs.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">3. How We Use Your Information</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>To create and manage your account</li>
            <li>To facilitate demo bookings between students and coaching institutes</li>
            <li>To send booking confirmations and important service notifications</li>
            <li>To display coaching listings and student reviews on the platform</li>
            <li>To improve search, recommendations, and platform features</li>
            <li>To respond to support requests and contact form messages</li>
            <li>To prevent fraud, abuse, and enforce our Terms of Service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Sharing with Coaching Institutes</h2>
          <p>
            When you book a demo or submit a demo request, we share relevant details (your name, contact information, preferred dates, and message) with the coaching institute you selected. Coaching institutes are responsible for handling your data in accordance with applicable laws.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">5. Cookies and Tracking</h2>
          <p>
            We use essential cookies to maintain your login session and remember preferences. We do not use third-party advertising cookies. You can disable cookies in your browser, but some features may not work correctly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">6. Data Retention</h2>
          <p>
            We retain your account and booking data for as long as your account is active or as needed to provide services. You may request account deletion by contacting us. Some data may be retained for legal or audit purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">7. Your Rights</h2>
          <p>Under applicable Indian data protection laws, you have the right to:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate information via your profile settings</li>
            <li>Request deletion of your account and associated data</li>
            <li>Withdraw consent for non-essential communications</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">8. Data Security</h2>
          <p>
            We use industry-standard measures including encrypted connections (HTTPS), hashed passwords, and access controls. No method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">9. Children&apos;s Privacy</h2>
          <p>
            Our platform is intended for students aged 13 and above. Users under 18 should use the platform with parental or guardian consent. We do not knowingly collect data from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will post the updated version on this page with a revised &quot;Last updated&quot; date. Continued use of the platform after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">11. Contact Us</h2>
          <p>
            For privacy-related questions or data requests, email us at{" "}
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
