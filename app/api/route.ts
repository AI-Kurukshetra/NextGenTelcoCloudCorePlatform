import type { NextRequest } from "next/server";
import { handleApiRoute } from "@/lib/api/router";

export async function GET(request: NextRequest) {
  return handleApiRoute(request, [], "GET");
}

export async function POST(request: NextRequest) {
  return handleApiRoute(request, [], "POST");
}
