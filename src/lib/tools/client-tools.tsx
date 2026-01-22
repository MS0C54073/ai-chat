"use client";

import React from "react";
import ConfirmActionCard, {
  type ConfirmActionArgs,
} from "@/components/tools/ConfirmActionCard";
import OpenTableCard, {
  type OpenTableArgs,
} from "@/components/tools/OpenTableCard";
import HighlightCellsCard, {
  type HighlightCellsArgs,
} from "@/components/tools/HighlightCellsCard";

export type ClientToolRenderContext = {
  onConfirm?: (payload?: unknown) => void;
  onCancel?: () => void;
};

export type ClientToolDefinition<TArgs> = {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  requiresConfirmation?: boolean;
  render: (args: TArgs, context?: ClientToolRenderContext) => React.ReactNode;
};

export const clientTools = {
  confirmAction: {
    name: "confirmAction",
    description: "Request explicit user confirmation before executing a step.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        actionId: { type: "string" },
        confirmLabel: { type: "string" },
        cancelLabel: { type: "string" },
      },
      required: [],
    },
    requiresConfirmation: true,
    render: (args: ConfirmActionArgs, context?: ClientToolRenderContext) => (
      <ConfirmActionCard
        args={args}
        onConfirm={(actionId) => context?.onConfirm?.({ actionId })}
        onCancel={() => context?.onCancel?.()}
      />
    ),
  } satisfies ClientToolDefinition<ConfirmActionArgs>,
  openTable: {
    name: "openTable",
    description: "Render a table preview for the user.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string" },
        columns: { type: "array", items: { type: "string" } },
        rows: { type: "array", items: { type: "array" } },
      },
      required: ["columns", "rows"],
    },
    render: (args: OpenTableArgs) => <OpenTableCard args={args} />,
  } satisfies ClientToolDefinition<OpenTableArgs>,
  highlightCells: {
    name: "highlightCells",
    description: "Highlight specific cells within a table preview.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string" },
        columns: { type: "array", items: { type: "string" } },
        rows: { type: "array", items: { type: "array" } },
        highlights: {
          type: "array",
          items: {
            type: "object",
            properties: {
              row: { type: "number" },
              col: { type: "number" },
              color: { type: "string" },
            },
            required: ["row", "col"],
          },
        },
      },
      required: ["columns", "rows", "highlights"],
    },
    render: (args: HighlightCellsArgs) => <HighlightCellsCard args={args} />,
  } satisfies ClientToolDefinition<HighlightCellsArgs>,
} as const;

export type ClientToolName = keyof typeof clientTools;
