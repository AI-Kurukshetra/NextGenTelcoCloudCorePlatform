import type { NextRequest } from "next/server";
import { forwardDelete, forwardGet, forwardPatch, forwardPost, forwardPut } from "@/app/api/_forward";

const segments = ["topology", "regions"];

export function GET(request: NextRequest) {
  return forwardGet(request, segments);
}

export function POST(request: NextRequest) {
  return forwardPost(request, segments);
}

export function PUT(request: NextRequest) {
  return forwardPut(request, segments);
}

export function DELETE(request: NextRequest) {
  return forwardDelete(request, segments);
}

export function PATCH(request: NextRequest) {
  return forwardPatch(request, segments);
}
