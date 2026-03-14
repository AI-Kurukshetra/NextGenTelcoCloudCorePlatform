import type { NextRequest } from "next/server";
import { forwardDelete, forwardGet, forwardPatch, forwardPost, forwardPut, type ParamsContext } from "@/app/api/_forward";

type Params = {
  key: string;
};

async function buildSegments(context: ParamsContext<Params>) {
  const { key } = await context.params;
  return [...["configurations"], key, ...["rollback"]];
}

export async function GET(request: NextRequest, context: ParamsContext<Params>) {
  return forwardGet(request, await buildSegments(context));
}

export async function POST(request: NextRequest, context: ParamsContext<Params>) {
  return forwardPost(request, await buildSegments(context));
}

export async function PUT(request: NextRequest, context: ParamsContext<Params>) {
  return forwardPut(request, await buildSegments(context));
}

export async function DELETE(request: NextRequest, context: ParamsContext<Params>) {
  return forwardDelete(request, await buildSegments(context));
}

export async function PATCH(request: NextRequest, context: ParamsContext<Params>) {
  return forwardPatch(request, await buildSegments(context));
}
