import { getSession } from "@/lib/auth/session";
import { getLoginHref } from "@/lib/auth/login";
import { redirect } from "next/navigation";
import { getStudentDashboard } from "@/modules/admin/admin.service";
import { StudentReferClient } from "@/components/student/StudentReferClient";

export default async function StudentReferPage() {
  const session = await getSession();
  if (!session) redirect(getLoginHref("/student/refer"));

  const data = await getStudentDashboard(session.user.id);
  if (!data) redirect(getLoginHref("/student/refer"));

  return (
    <StudentReferClient
      referralCode={data.referralCode}
      referralCount={data.referralCount}
    />
  );
}
