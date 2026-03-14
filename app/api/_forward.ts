import type { NextRequest } from "next/server";
import { handleApiRoute } from "@/lib/api/router";

export function forwardGet(request: NextRequest, segments: string[]) {
  return handleApiRoute(request, segments, "GET");
}

export function forwardPost(request: NextRequest, segments: string[]) {
  return handleApiRoute(request, segments, "POST");
}

export function forwardPut(request: NextRequest, segments: string[]) {
  return handleApiRoute(request, segments, "PUT");
}

export function forwardDelete(request: NextRequest, segments: string[]) {
  return handleApiRoute(request, segments, "DELETE");
}

export function forwardPatch(request: NextRequest, segments: string[]) {
  return handleApiRoute(request, segments, "PATCH");
}

export type ParamsContext<T extends Record<string, string>> = {
  params: Promise<T>;
};
