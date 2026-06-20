import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Compare Coachings" };

export default async function ComparePage({ searchParams }) {
  const params = await searchParams;
  const ids = (params.ids || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (ids.length < 2) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6">
        <h1 className="text-2xl font-bold">Compare coachings</h1>
        <p className="mt-3 text-muted">
          Add at least 2 coachings using the highlighted &ldquo;Add to compare&rdquo; button on search or coaching cards.
        </p>
        <p className="mt-2 text-sm text-secondary font-medium">Pick up to 3 coachings, then compare side by side.</p>
        <Link href="/search" className="mt-6 inline-block">
          <Button className="min-h-11">Find coachings</Button>
        </Link>
      </div>
    );
  }

  const coachings = await prisma.coachingProfile.findMany({
    where: { id: { in: ids }, listingStatus: "ACTIVE" },
    include: {
      _count: {
        select: {
          courses: { where: { status: "ACTIVE" } },
          demoSlots: { where: { status: "OPEN", demoDate: { gte: new Date() } } },
        },
      },
      courses: {
        where: { status: "ACTIVE" },
        select: { fees: true, discountedFees: true },
      },
    },
  });

  if (coachings.length < 2) notFound();

  const ordered = ids.map((id) => coachings.find((c) => c.id === id)).filter(Boolean);

  const rows = [
    {
      label: "Location",
      values: ordered.map((c) => [c.locality, c.city].filter(Boolean).join(", ") || "—"),
    },
    {
      label: "Exams",
      values: ordered.map((c) => c.targetExams?.join(", ") || "—"),
    },
    {
      label: "Mode",
      values: ordered.map((c) => c.mode || "—"),
    },
    {
      label: "Rating",
      values: ordered.map((c) => `${c.avgRating?.toFixed(1) || "0.0"} (${c.reviewCount} reviews)`),
    },
    {
      label: "Courses",
      values: ordered.map((c) => String(c._count.courses)),
    },
    {
      label: "Open demos",
      values: ordered.map((c) => String(c._count.demoSlots)),
    },
    {
      label: "Verified",
      values: ordered.map((c) => (c.verificationStatus === "VERIFIED" ? "Yes" : "No")),
    },
    {
      label: "Fee range",
      values: ordered.map((c) => {
        const fees = c.courses.map((course) => course.discountedFees || course.fees).filter(Boolean);
        if (!fees.length) return "Contact institute";
        const min = Math.min(...fees);
        const max = Math.max(...fees);
        return min === max ? `₹${min.toLocaleString()}` : `₹${min.toLocaleString()} – ₹${max.toLocaleString()}`;
      }),
    },
    {
      label: "Response time",
      values: ordered.map((c) =>
        c.avgResponseHours != null ? `~${c.avgResponseHours}h` : "—"
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Compare coachings</h1>
          <p className="mt-1 text-sm text-muted">Side-by-side view to help you decide faster.</p>
        </div>
        <Link href="/search">
          <Button variant="secondary" className="min-h-11 w-full sm:w-auto">
            Back to search
          </Button>
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-white p-3 text-left text-sm font-semibold text-muted" />
              {ordered.map((coaching) => (
                <th key={coaching.id} className="min-w-[200px] p-3 text-left align-top">
                  <Card className="!p-4">
                    <p className="font-semibold text-foreground">{coaching.name}</p>
                    {coaching.verificationStatus === "VERIFIED" && (
                      <Badge variant="success" className="mt-2">Verified</Badge>
                    )}
                    <Link href={`/coaching/${coaching.slug}`} className="mt-3 inline-block">
                      <Button size="sm" className="min-h-9 w-full">View profile</Button>
                    </Link>
                  </Card>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-border">
                <td className="sticky left-0 z-10 bg-white p-3 text-sm font-medium text-muted">{row.label}</td>
                {row.values.map((value, index) => (
                  <td key={`${row.label}-${index}`} className="p-3 text-sm text-foreground">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
