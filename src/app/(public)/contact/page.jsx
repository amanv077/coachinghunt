import { ContactForm } from "@/components/marketing/ContactForm";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Contact Us</h1>
        <p className="mt-3 text-muted">
          Have questions? Our team is here to help students and coaching institutes.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ContactForm />
        </div>
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <h3 className="font-semibold text-foreground">General support</h3>
            <p className="mt-2 text-sm text-muted">
              <a href="mailto:support@coachinghunt.com" className="text-secondary hover:underline">
                support@coachinghunt.com
              </a>
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold text-foreground">For coaching institutes</h3>
            <p className="mt-2 text-sm text-muted">
              <a href="mailto:institutes@coachinghunt.com" className="text-secondary hover:underline">
                institutes@coachinghunt.com
              </a>
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold text-foreground">Response time</h3>
            <p className="mt-2 text-sm text-muted">
              We typically respond within 24 hours on business days.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
