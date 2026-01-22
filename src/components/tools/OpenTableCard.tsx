"use client";

import React from "react";

export type OpenTableArgs = {
  title?: string;
  columns: string[];
  rows: Array<Array<string | number | null>>;
};

export type OpenTableCardProps = {
  args: OpenTableArgs;
};

export default function OpenTableCard({ args }: OpenTableCardProps) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950 p-4 text-sm text-gray-100">
      <div className="text-base font-semibold">{args.title ?? "Table"}</div>
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
                {row.map((cell, cellIndex) => (
                  <td key={`cell-${rowIndex}-${cellIndex}`} className="px-2 py-1">
                    {cell ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
