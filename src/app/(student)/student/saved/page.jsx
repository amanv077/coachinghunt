import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getLoginHref } from "@/lib/auth/login";
import { redirect } from "next/navigation";
import { listSavedCoachings } from "@/modules/saved-coachings/saved-coachings.service";
import { CoachingCardGrid } from "@/components/marketing/CoachingCardGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Saved Coachings" };

export default async function StudentSavedPage() {
  const session = await getSession();
  if (!session) redirect(getLoginHref("/student/saved"));

  const savedCoachings = await listSavedCoachings(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Saved coachings</h1>
        <p className="mt-1 text-sm text-muted">
          Shortlist institutes you like, then compare or book a demo.
        </p>
      </div>

      {savedCoachings.length === 0 ? (
        <div className="space-y-4">
          <EmptyState
            title="No saved coachings yet"
            description="Tap the heart on any coaching card while browsing to save it here."
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/search" className="w-full sm:w-auto">
              <Button className="min-h-11 w-full sm:w-auto">Find coachings</Button>
            </Link>
            <Link href="/compare" className="w-full sm:w-auto">
              <Button variant="secondary" className="min-h-11 w-full sm:w-auto">
                Open compare
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <CoachingCardGrid
          coachings={savedCoachings}
          savedIds={savedCoachings.map((c) => c.id)}
          showActions
        />
      )}
    </div>
  );
}
