import { getCoachingDashboard } from "@/modules/admin/admin.service";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function CoachingDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const data = await getCoachingDashboard(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{data.profile.name}</h1>
        <p className="text-muted">Coaching dashboard overview</p>
        <Badge variant={data.profile.listingStatus === "ACTIVE" ? "success" : "warning"} className="mt-2">
          {data.profile.listingStatus}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><p className="text-sm text-muted">Active Courses</p><p className="text-2xl font-bold">{data.courseCount}</p></Card>
        <Card><p className="text-sm text-muted">Open Demo Slots</p><p className="text-2xl font-bold">{data.activeDemoSlots}</p></Card>
        <Card><p className="text-sm text-muted">Total Bookings</p><p className="text-2xl font-bold">{data.bookingSummary}</p></Card>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Recent Leads</h2>
        {data.recentBookings.length === 0 ? (
          <Card><p className="text-muted">No bookings yet.</p></Card>
        ) : (
          <div className="space-y-3">
            {data.recentBookings.map((b) => (
              <Card key={b.id}>
                <p className="font-medium">{b.student.user.name}</p>
                <p className="text-sm text-muted">{b.student.user.email} · {b.demoSlot.topic}</p>
                <Badge variant="primary" className="mt-2">{b.bookingCode}</Badge>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
