export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <div className="prose mt-6 space-y-4 text-muted">
        <p>CoachingHunt respects your privacy. We collect information you provide during signup, booking, and profile creation to deliver our services.</p>
        <p>We do not sell your personal data. Information may be shared with coaching institutes when you book a demo session.</p>
        <p>For questions about your data, contact support@coachinghunt.com.</p>
      </div>
    </div>
  );
}
