import { verifyEmail } from "@/modules/auth/verification.service";
import { redirect } from "next/navigation";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  try {
    await verifyEmail({ email, token });
    redirect("/login?verified=1");
  } catch {
    redirect("/login?verified=0");
  }
}
