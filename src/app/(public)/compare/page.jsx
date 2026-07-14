import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CoachingLogo } from "@/components/shared/CoachingMedia";
import { CompareEmptyState } from "@/components/marketing/CompareEmptyState";
import { MobileCompareView } from "@/components/marketing/MobileCompareView";

export const metadata = { title: "Compare Coachings" };

function haversineKm(lat1, lon1, lat2, lon2) {
  if ([lat1, lon1, lat2, lon2].some((v) => v == null || Number.isNaN(Number(v)))) return null;
  const toRad = (d) => (Number(d) * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatFaculty(facultyProfiles) {
  if (!facultyProfiles) return "—";
  const list = Array.isArray(facultyProfiles)
    ? facultyProfiles
    : typeof facultyProfiles === "object"
      ? Object.values(facultyProfiles)
      : [];
  if (!list.length) return "—";
  const names = list
    .map((f) => (typeof f === "string" ? f : f?.name || f?.title))
    .filter(Boolean)
    .slice(0, 2);
  if (!names.length) return `${list.length} faculty listed`;
  return names.length < list.length ? `${names.join(", ")} +${list.length - names.length}` : names.join(", ");
}

function formatBatchSize(courses) {
  const sizes = courses.map((c) => c.batchSize).filter((n) => n != null && n > 0);
  if (!sizes.length) return "—";
  const min = Math.min(...sizes);
  const max = Math.max(...sizes);
  return min === max ? `~${min} students` : `${min}–${max} students`;
}

function formatSchedule(courses) {
  const summaries = courses.map((c) => c.scheduleSummary || c.durationText).filter(Boolean);
  if (!summaries.length) return "—";
  return summaries[0];
}

export default async function ComparePage({ searchParams }) {
  const params = await searchParams;
  const ids = (params.ids || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (ids.length < 2) {
    return <CompareEmptyState />;
  }

  const coachings = await prisma.coachingProfile.findMany({
    where: {
      id: { in: ids },
      listingStatus: "ACTIVE",
      verificationStatus: { in: ["VERIFIED", "PENDING"] },
    },
    include: {
      _count: {
        select: {
          courses: { where: { status: "ACTIVE" } },
          demoSlots: { where: { status: "OPEN", demoDate: { gte: new Date() } } },
        },
      },
      courses: {
        where: { status: "ACTIVE" },
        select: {
          fees: true,
          discountedFees: true,
          batchSize: true,
          scheduleSummary: true,
          durationText: true,
        },
      },
    },
  });

  if (coachings.length < 2) notFound();

  const ordered = ids.map((id) => coachings.find((c) => c.id === id)).filter(Boolean);

  // Relative distance between first and others when geo exists
  const origin = ordered.find((c) => c.latitude != null && c.longitude != null);

  const rows = [
    {
      label: "Location",
      values: ordered.map((c) => [c.locality, c.city].filter(Boolean).join(", ") || "—"),
    },
    {
      label: "Distance",
      values: ordered.map((c) => {
        if (!origin || c.id === origin.id) return origin && c.id === origin.id ? "Reference" : "—";
        const km = haversineKm(origin.latitude, origin.longitude, c.latitude, c.longitude);
        return km == null ? "—" : `~${km.toFixed(1)} km apart`;
      }),
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
      values: ordered.map((c) => `${c.avgRating?.toFixed(1) || "0.0"} (${c.reviewCount || 0})`),
    },
    {
      label: "Courses",
      values: ordered.map((c) => String(c._count.courses)),
    },
    {
      label: "Batch size",
      values: ordered.map((c) => formatBatchSize(c.courses)),
    },
    {
      label: "Schedule",
      values: ordered.map((c) => formatSchedule(c.courses)),
    },
    {
      label: "Open demos",
      values: ordered.map((c) => String(c._count.demoSlots)),
    },
    {
      label: "Faculty",
      values: ordered.map((c) => formatFaculty(c.facultyProfiles)),
    },
    {
      label: "Verified",
      values: ordered.map((c) => (c.verificationStatus === "VERIFIED" ? "Yes" : "Pending")),
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
          <p className="mt-1 text-sm text-muted">
            Side-by-side view of fees, batches, schedule, and demos.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/student/saved">
            <Button variant="secondary" className="min-h-11 w-full sm:w-auto">
              Saved list
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="secondary" className="min-h-11 w-full sm:w-auto">
              Back to search
            </Button>
          </Link>
        </div>
      </div>

      <MobileCompareView ordered={ordered} rows={rows} />

      <div className="mt-8 hidden overflow-x-auto md:block">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-white p-3 text-left text-sm font-semibold text-muted" />
              {ordered.map((coaching) => (
                <th key={coaching.id} className="min-w-[220px] p-3 text-left align-top">
                  <Card className="!p-4">
                    <div className="flex items-start gap-3">
                      <CoachingLogo src={coaching.logoUrl} name={coaching.name} size="sm" />
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground">{coaching.name}</p>
                        {coaching.verificationStatus === "VERIFIED" && (
                          <Badge variant="success" className="mt-2">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Link href={`/coaching/${coaching.slug}`} className="mt-3 inline-block w-full">
                      <Button size="sm" className="min-h-9 w-full">
                        View profile
                      </Button>
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
