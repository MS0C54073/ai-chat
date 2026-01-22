import { NextResponse } from "next/server";
import { deleteThread } from "@/lib/db";

type RouteParams = {
  params: Promise<{
    threadId: string;
  }>;
};

export async function DELETE(request: Request, { params }: RouteParams) {
  const { threadId } = await params;
  if (!threadId) {
    return NextResponse.json({ error: "threadId is required" }, { status: 400 });
  }
  await deleteThread(threadId);
  return NextResponse.json({ ok: true });
}
