"use client";

import React from "react";

export type HighlightCell = {
  row: number;
  col: number;
  color?: string;
};

export type HighlightCellsArgs = {
  title?: string;
  columns: string[];
  rows: Array<Array<string | number | null>>;
  highlights: HighlightCell[];
};

export type HighlightCellsCardProps = {
  args: HighlightCellsArgs;
};

function highlightClass(highlight?: HighlightCell) {
  if (!highlight) {
    return "";
  }
  if (highlight.color === "yellow") {
    return "bg-yellow-500/30 text-yellow-100";
  }
  if (highlight.color === "green") {
    return "bg-emerald-500/30 text-emerald-100";
  }
  if (highlight.color === "red") {
    return "bg-rose-500/30 text-rose-100";
  }
  return "bg-blue-500/25 text-blue-100";
}

export default function HighlightCellsCard({ args }: HighlightCellsCardProps) {
  const highlightMap = new Map<string, HighlightCell>();
  for (const highlight of args.highlights) {
    highlightMap.set(`${highlight.row}:${highlight.col}`, highlight);
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950 p-4 text-sm text-gray-100">
      <div className="text-base font-semibold">
        {args.title ?? "Highlighted cells"}
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead className="bg-gray-900 text-gray-300">
            <tr>
              {args.columns.map((column, index) => (
                <th key={`${column}-${index}`} className="px-2 py-1 text-left">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {args.rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="odd:bg-gray-900/40">
                {row.map((cell, cellIndex) => {
                  const highlight = highlightMap.get(
                    `${rowIndex}:${cellIndex}`
                  );
                  return (
                    <td
                      key={`cell-${rowIndex}-${cellIndex}`}
                      className={[
                        "px-2 py-1",
                        highlightClass(highlight),
                      ].join(" ")}
                    >
                      {cell ?? ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
