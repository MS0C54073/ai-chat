import "server-only";
import type { Database, Statement } from "sqlite";
import { getDb } from "./client";

export type Thread = {
  id: string;
  title: string;
  created_at: number;
};

export type MessageRole = "system" | "user" | "assistant" | "tool";

export type Message = {
  id: string;
  thread_id: string;
  role: MessageRole;
  content: string;
  created_at: number;
};

export type CreateThreadInput = {
  title: string;
  id?: string;
  createdAt?: number;
};

export type SaveMessageInput = {
  threadId: string;
  role: MessageRole;
  content: string;
  id?: string;
  createdAt?: number;
};

type DbStatement = Statement;

const statements = {
  insertThread: null as DbStatement | null,
  listThreads: null as DbStatement | null,
  insertMessage: null as DbStatement | null,
  listMessagesByThread: null as DbStatement | null,
  deleteThread: null as DbStatement | null,
};

async function getStatements() {
  const db = await getDb();

  if (!statements.insertThread) {
    statements.insertThread = await db.prepare(
      "INSERT INTO threads (id, title, created_at) VALUES (?, ?, ?)"
    );
  }

  if (!statements.listThreads) {
    statements.listThreads = await db.prepare(
      "SELECT id, title, created_at FROM threads ORDER BY created_at DESC LIMIT ? OFFSET ?"
    );
  }

  if (!statements.insertMessage) {
    statements.insertMessage = await db.prepare(
      "INSERT INTO messages (id, thread_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)"
    );
  }

  if (!statements.listMessagesByThread) {
    statements.listMessagesByThread = await db.prepare(
      "SELECT id, thread_id, role, content, created_at FROM messages WHERE thread_id = ? ORDER BY created_at ASC LIMIT ? OFFSET ?"
    );
  }

  if (!statements.deleteThread) {
    statements.deleteThread = await db.prepare(
      "DELETE FROM threads WHERE id = ?"
    );
  }

  return statements;
}

export async function createThread(input: CreateThreadInput): Promise<Thread> {
  const thread: Thread = {
    id: input.id ?? crypto.randomUUID(),
    title: input.title,
    created_at: input.createdAt ?? Date.now(),
  };

  const { insertThread } = await getStatements();
  await insertThread?.run(thread.id, thread.title, thread.created_at);

  return thread;
}

export async function getThreads(
  limit = 50,
  offset = 0
): Promise<Thread[]> {
  const { listThreads } = await getStatements();
  return (await listThreads?.all(limit, offset)) as Thread[];
}

export async function saveMessage(
  input: SaveMessageInput
): Promise<Message> {
  const message: Message = {
    id: input.id ?? crypto.randomUUID(),
    thread_id: input.threadId,
    role: input.role,
    content: input.content,
    created_at: input.createdAt ?? Date.now(),
  };

  const { insertMessage } = await getStatements();
  await insertMessage?.run(
    message.id,
    message.thread_id,
    message.role,
    message.content,
    message.created_at
  );

  return message;
}

export async function getMessagesByThread(
  threadId: string,
  limit = 200,
  offset = 0
): Promise<Message[]> {
  const { listMessagesByThread } = await getStatements();
  return (await listMessagesByThread?.all(threadId, limit, offset)) as Message[];
}

export async function deleteThread(threadId: string): Promise<void> {
  const { deleteThread: deleteThreadStatement } = await getStatements();
  await deleteThreadStatement?.run(threadId);
}
