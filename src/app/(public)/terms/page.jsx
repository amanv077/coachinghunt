export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <div className="prose mt-6 space-y-4 text-muted">
        <p>By using CoachingHunt, you agree to use the platform responsibly and provide accurate information.</p>
        <p>Coaching institutes are responsible for the accuracy of their listings and demo session details.</p>
        <p>CoachingHunt facilitates discovery and booking but is not responsible for the quality of coaching services.</p>
      </div>
    </div>
  );
}
