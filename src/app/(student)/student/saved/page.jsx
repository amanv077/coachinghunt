import { getSession } from "@/lib/auth/session";
import { getLoginHref } from "@/lib/auth/login";
import { redirect } from "next/navigation";
import { listSavedCoachings } from "@/modules/saved-coachings/saved-coachings.service";
import { SavedCoachingsClient } from "@/components/student/SavedCoachingsClient";

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
          Shortlist institutes you like, then compare side-by-side or book a demo.
        </p>
      </div>

      <SavedCoachingsClient coachings={savedCoachings} />
    </div>
  );
}
