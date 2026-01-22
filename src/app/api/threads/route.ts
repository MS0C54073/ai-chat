import { NextResponse } from "next/server";
import { createThread, getThreads } from "@/lib/db";

export async function GET() {
  const threads = await getThreads();
  return NextResponse.json(threads);
}

export async function POST(request: Request) {
  const body = (await request.json()) as { title?: string };
  const title = body.title?.trim() || "New Chat";
  const thread = await createThread({ title });
  return NextResponse.json(thread, { status: 201 });
}
