import { searchCities } from "@/lib/data/india-cities";
import { successResponse } from "@/lib/utils/api-response";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const cities = searchCities(q, 10);
  return successResponse(cities);
}
