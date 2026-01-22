"use client";

import React from "react";

export type ConfirmActionArgs = {
  title?: string;
  description?: string;
  actionId?: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

export type ConfirmActionCardProps = {
  args: ConfirmActionArgs;
  onConfirm?: (actionId?: string) => void;
  onCancel?: (actionId?: string) => void;
  status?: "pending" | "confirmed" | "cancelled";
};

export default function ConfirmActionCard({
  args,
  onConfirm,
  onCancel,
  status = "pending",
}: ConfirmActionCardProps) {
  const title = args.title ?? "Confirm action";
  const description =
    args.description ??
    "This action requires confirmation before it can be executed.";
  const isPending = status === "pending";
  const statusLabel =
    status === "confirmed" ? "Confirmed" : status === "cancelled" ? "Cancelled" : null;

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950 p-4 text-sm text-gray-100">
      <div className="text-base font-semibold">{title}</div>
      <div className="mt-1 text-xs text-gray-400">{description}</div>
      {statusLabel ? (
        <div className="mt-3 text-xs text-gray-400">{statusLabel}</div>
      ) : null}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => (isPending ? onConfirm?.(args.actionId) : undefined)}
          disabled={!isPending}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-900"
        >
          {args.confirmLabel ?? "Confirm"}
        </button>
        <button
          type="button"
          onClick={() => (isPending ? onCancel?.(args.actionId) : undefined)}
          disabled={!isPending}
          className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-900 disabled:cursor-not-allowed disabled:border-gray-800 disabled:text-gray-500"
        >
          {args.cancelLabel ?? "Cancel"}
        </button>
      </div>
    </div>
  );
}
