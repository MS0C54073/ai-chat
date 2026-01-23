import { NextResponse } from "next/server";
import {
  deleteMessage,
  deleteMessagesAfter,
  getMessageById,
  getMessagesByThread,
  saveMessage,
  updateMessage,
} from "@/lib/db";

type RouteParams = {
  params: Promise<{
    threadId: string;
  }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  const { threadId } = await params;
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") ?? "200");
  const offset = Number(url.searchParams.get("offset") ?? "0");
  const messages = await getMessagesByThread(threadId, limit, offset);
  return NextResponse.json(messages);
}

export async function POST(request: Request, { params }: RouteParams) {
  const { threadId } = await params;
  const body = (await request.json()) as {
    role: "system" | "user" | "assistant" | "tool";
    content: string;
  };
  if (!body.role || !body.content) {
    return NextResponse.json(
      { error: "role and content are required" },
      { status: 400 }
    );
  }
  const message = await saveMessage({
    threadId,
    role: body.role,
    content: body.content,
  });
  return NextResponse.json(message, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as { id?: string; content?: string };
  if (!body.id || typeof body.content !== "string") {
    return NextResponse.json(
      { error: "id and content are required" },
      { status: 400 }
    );
  }
  await updateMessage({ id: body.id, content: body.content });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { threadId } = await params;
  const body = (await request.json()) as { id?: string; afterId?: string };

  if (body.afterId) {
    const target = await getMessageById(body.afterId);
    if (!target || target.thread_id !== threadId) {
      return NextResponse.json({ error: "message not found" }, { status: 404 });
    }
    await deleteMessagesAfter(threadId, target.created_at);
    return NextResponse.json({ ok: true });
  }

  if (!body.id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  await deleteMessage(body.id);
  return NextResponse.json({ ok: true });
}
