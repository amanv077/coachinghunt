import { searchExams } from "@/lib/data/exams";
import { successResponse } from "@/lib/utils/api-response";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const exams = searchExams(q, 10);
  return successResponse(exams);
}
