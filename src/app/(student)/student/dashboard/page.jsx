import Link from "next/link";
import { getStudentDashboard } from "@/modules/admin/admin.service";
import { getPendingDemoRequestCount } from "@/modules/demo-requests/demo-requests.service";
import { listSavedCoachings } from "@/modules/saved-coachings/saved-coachings.service";
import { getSession } from "@/lib/auth/session";
import { getLoginHref } from "@/lib/auth/login";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CoachingCardGrid } from "@/components/marketing/CoachingCardGrid";
import { CancelBookingButton } from "@/components/shared/CancelBookingButton";
import { ProfileNudgeBanner } from "@/components/dashboard/ProfileNudgeBanner";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { PromoCodeChip } from "@/components/shared/PromoCodeChip";
import {
  buildSearchHref,
  formatDemoDate,
  getRelativeDateLabel,
} from "@/lib/utils/helpers";

function StatCard({ label, value, sublabel, href }) {
  return (
    <Link href={href} className="block h-full">
      <Card className="flex h-full flex-col justify-between border-l-4 border-secondary !p-4 transition hover:shadow-md">
        <p className="text-xs font-medium text-muted sm:text-sm">{label}</p>
        <p className="mt-2 truncate text-xl font-bold text-foreground sm:text-2xl">{value}</p>
        <p className="mt-1 text-xs text-muted">{sublabel}</p>
      </Card>
    </Link>
  );
}

export default async function StudentDashboardPage() {
  const session = await getSession();
  if (!session) redirect(getLoginHref("/student/dashboard"));

  const data = await getStudentDashboard(session.user.id);
  if (!data) redirect(getLoginHref("/student/dashboard"));

  const pendingRequestCount = await getPendingDemoRequestCount(session.user.id);
  const savedCoachings = await listSavedCoachings(session.user.id);

  const { profile, upcomingBookings, attendedCount, offers, topCoachings } = data;
  const primaryExam = profile.targetExams?.[0];
  const examLabel =
    profile.targetExams?.length > 1
      ? `${primaryExam} +${profile.targetExams.length - 1}`
      : primaryExam;

  const searchHref = buildSearchHref({
    targetExams: profile.targetExams,
    city: profile.city,
  });
  const profileIncomplete =
    !profile.city || !profile.targetExams || profile.targetExams.length === 0;
  const firstName = session.user.name?.split(" ")[0] || "there";

  const discoverTitle = [
    primaryExam ? `Top Coachings for ${primaryExam}` : "Top Coachings",
    profile.city ? `in ${profile.city}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {firstName}!</h1>
          <p className="mt-1 text-sm text-muted sm:text-base">
            {primaryExam
              ? `Ready to find the right coaching for ${primaryExam}?`
              : "Track your demos, explore offers, and find the right coaching."}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto lg:shrink-0">
          <Link href={searchHref} className="w-full sm:w-auto">
            <Button size="md" className="w-full min-h-11 sm:min-w-[148px]">
              Find Coachings
            </Button>
          </Link>
          <Link href="/student/saved" className="w-full sm:w-auto">
            <Button variant="secondary" size="md" className="w-full min-h-11 sm:min-w-[120px]">
              Saved
            </Button>
          </Link>
          <Link href="/compare" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="md"
              className="w-full min-h-11 border-2 border-secondary bg-secondary-light text-secondary sm:min-w-[120px]"
            >
              Compare
            </Button>
          </Link>
        </div>
      </div>

      {profileIncomplete && <ProfileNudgeBanner />}

      {pendingRequestCount > 0 && (
        <Link href="/student/bookings" className="block">
          <Card className="border-l-4 border-warning bg-amber-50/60 !p-4 transition hover:shadow-md">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-foreground">
                  {pendingRequestCount} demo request{pendingRequestCount !== 1 ? "s" : ""} pending
                </p>
                <p className="mt-1 text-sm text-muted">
                  Waiting for coaching to confirm or suggest another time.
                </p>
              </div>
              <span className="text-sm font-medium text-secondary">View requests →</span>
            </div>
          </Card>
        </Link>
      )}

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          label="Upcoming Demos"
          value={upcomingBookings.length}
          sublabel="confirmed ahead"
          href="/student/bookings"
        />
        <StatCard
          label="Target Exams"
          value={examLabel || "—"}
          sublabel={primaryExam ? `${attendedCount} attended` : "Set exams →"}
          href="/student/profile"
        />
        <StatCard
          label="City"
          value={profile.city || "—"}
          sublabel={profile.city ? "Your location" : "Set city →"}
          href="/student/profile"
        />
      </div>

      <section>
        <SectionHeader title="Upcoming Bookings" href="/student/bookings" />
        {upcomingBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-muted/50 px-6 py-12 text-center">
            <h3 className="text-lg font-semibold text-foreground">No upcoming demos</h3>
            <p className="mt-2 max-w-md text-sm text-muted">
              Book a free demo session to explore coachings near you.
            </p>
            <Link href={searchHref} className="mt-4 w-full sm:w-auto">
              <Button className="w-full min-h-11 sm:w-auto">Find Coachings</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
              <Card key={booking.id} className="!p-0 overflow-hidden">
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold text-foreground sm:text-lg">
                      {booking.coaching.name}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {booking.course?.title || "Demo"} · {booking.demoSlot.topic}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <p className="text-sm text-foreground">
                        {formatDemoDate(booking.demoSlot.demoDate)} · {booking.demoSlot.startTime}
                      </p>
                      <Badge variant="default">
                        {getRelativeDateLabel(booking.demoSlot.demoDate)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-border pt-4 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0 lg:flex-row lg:items-center">
                    <Badge variant="success">{booking.bookingCode}</Badge>
                    <CancelBookingButton bookingId={booking.id} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeader title={discoverTitle} href={searchHref} linkLabel="Browse all" />
        <CoachingCardGrid
          coachings={topCoachings}
          savedIds={savedCoachings.map((c) => c.id)}
          showActions
        />
      </section>

      <section>
        <SectionHeader title="Saved Coachings" href="/student/saved" linkLabel="View all" />
        {savedCoachings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-surface-muted/50 px-6 py-8 text-center">
            <p className="text-sm text-muted">Save coachings with the heart icon while browsing search results.</p>
            <Link href="/search" className="mt-4 inline-block">
              <Button variant="secondary" className="min-h-11">Browse coachings</Button>
            </Link>
          </div>
        ) : (
          <CoachingCardGrid
            coachings={savedCoachings.slice(0, 4)}
            savedIds={savedCoachings.map((c) => c.id)}
            showActions
          />
        )}
      </section>

      {offers.length > 0 && (
        <section>
          <SectionHeader title="Latest Offers" href="/student/offers" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {offers.map((offer) => (
              <Card key={offer.id} className="!p-4">
                <p className="font-medium text-foreground">{offer.title}</p>
                <p className="mt-1 text-sm text-secondary">{offer.coaching.name}</p>
                {offer.description && (
                  <p className="mt-2 text-sm text-muted">{offer.description}</p>
                )}
                <PromoCodeChip code={offer.promoCode} />
                <p className="mt-3 text-xs text-muted">
                  Valid till {new Date(offer.validTill).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
