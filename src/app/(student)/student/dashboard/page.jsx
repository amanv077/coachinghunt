import Link from "next/link";
import { getStudentDashboard } from "@/modules/admin/admin.service";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CoachingCardGrid } from "@/components/marketing/CoachingCardGrid";

export default async function StudentDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const data = await getStudentDashboard(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {session.user.name}</h1>
        <p className="text-muted">Track your demo bookings and explore offers</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><p className="text-sm text-muted">Upcoming Demos</p><p className="text-2xl font-bold">{data.bookings.length}</p></Card>
        <Card><p className="text-sm text-muted">Target Exam</p><p className="text-2xl font-bold">{data.profile?.targetExam || "—"}</p></Card>
        <Card><p className="text-sm text-muted">City</p><p className="text-2xl font-bold">{data.profile?.city || "—"}</p></Card>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Upcoming Bookings</h2>
          <Link href="/student/bookings" className="text-sm text-primary">View all</Link>
        </div>
        {data.bookings.length === 0 ? (
          <Card><p className="text-muted">No bookings yet. <Link href="/search" className="text-primary">Find coachings</Link></p></Card>
        ) : (
          <div className="space-y-3">
            {data.bookings.map((b) => (
              <Card key={b.id}>
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{b.coaching.name}</p>
                    <p className="text-sm text-muted">{b.demoSlot.topic} · {new Date(b.demoSlot.demoDate).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="success">{b.bookingCode}</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {data.offers.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">Latest Offers</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.offers.map((offer) => (
              <Card key={offer.id}>
                <p className="font-medium">{offer.title}</p>
                <p className="text-sm text-muted">{offer.coaching.name}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold">Top Coachings</h2>
        <CoachingCardGrid coachings={data.topCoachings} />
      </section>
    </div>
  );
}
