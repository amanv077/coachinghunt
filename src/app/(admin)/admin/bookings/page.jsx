import { prisma } from "@/lib/db/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      coaching: { select: { name: true } },
      student: { include: { user: { select: { name: true, email: true } } } },
      demoSlot: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">All Bookings</h1>
      <div className="mt-6 space-y-3">
        {bookings.map((b) => (
          <Card key={b.id}>
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="font-medium">{b.student.user.name}</p>
                <p className="text-sm text-muted">{b.coaching.name} · {b.demoSlot.topic}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant="primary">{b.bookingCode}</Badge>
                <Badge variant={b.status === "CONFIRMED" ? "success" : "default"}>{b.status}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
