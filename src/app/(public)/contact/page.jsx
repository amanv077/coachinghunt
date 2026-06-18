export const metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <p className="mt-4 text-muted">Have questions? Reach out to our team.</p>
      <div className="mt-8 space-y-4 rounded-xl bg-white p-6 shadow-sm">
        <p><strong>Email:</strong> support@coachinghunt.com</p>
        <p><strong>For Coaching Institutes:</strong> institutes@coachinghunt.com</p>
        <p className="text-sm text-muted">We typically respond within 24-48 hours.</p>
      </div>
    </div>
  );
}
