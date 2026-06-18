import { getAdminAnalytics } from "@/modules/admin/admin.service";
import { Card } from "@/components/ui/Card";

export default async function AdminDashboardPage() {
  const analytics = await getAdminAnalytics();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card><p className="text-sm text-muted">Total Students</p><p className="text-2xl font-bold">{analytics.totalStudents}</p></Card>
        <Card><p className="text-sm text-muted">Total Coachings</p><p className="text-2xl font-bold">{analytics.totalCoachings}</p></Card>
        <Card><p className="text-sm text-muted">Active Courses</p><p className="text-2xl font-bold">{analytics.activeCourses}</p></Card>
        <Card><p className="text-sm text-muted">Open Demo Slots</p><p className="text-2xl font-bold">{analytics.activeDemoSlots}</p></Card>
        <Card><p className="text-sm text-muted">Total Bookings</p><p className="text-2xl font-bold">{analytics.totalBookings}</p></Card>
      </div>
      {analytics.bookingsByCity.length > 0 && (
        <Card>
          <h2 className="font-semibold">Bookings by City</h2>
          <div className="mt-4 space-y-2">
            {analytics.bookingsByCity.map((item) => (
              <div key={item.city} className="flex justify-between text-sm">
                <span>{item.city}</span>
                <span className="font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
