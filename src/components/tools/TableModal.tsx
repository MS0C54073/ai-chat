"use client";

import React, { useMemo, useState } from "react";

export type TableModalSelection = {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
};

export type TableModalProps = {
  isOpen: boolean;
  sheetName: string;
  columns: string[];
  rows: Array<Array<string | number | null>>;
  onClose: () => void;
  onInsert: (rangeRef: string) => void;
};

function columnToLetter(index: number) {
  let result = "";
  let value = index + 1;
  while (value > 0) {
    const modulo = (value - 1) % 26;
    result = String.fromCharCode(65 + modulo) + result;
    value = Math.floor((value - 1) / 26);
  }
  return result;
}

function toA1(row: number, col: number) {
  return `${columnToLetter(col)}${row + 1}`;
}

export default function TableModal({
  isOpen,
  sheetName,
  columns,
  rows,
  onClose,
  onInsert,
}: TableModalProps) {
  const [anchor, setAnchor] = useState<{ row: number; col: number } | null>(
    null
  );
  const [hover, setHover] = useState<{ row: number; col: number } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const selection = useMemo<TableModalSelection | null>(() => {
    if (!anchor || !hover) {
      return null;
    }
    return {
      startRow: Math.min(anchor.row, hover.row),
      startCol: Math.min(anchor.col, hover.col),
      endRow: Math.max(anchor.row, hover.row),
      endCol: Math.max(anchor.col, hover.col),
    };
  }, [anchor, hover]);

  const rangeRef = useMemo(() => {
    if (!selection) {
      return null;
    }
    const start = toA1(selection.startRow, selection.startCol);
    const end = toA1(selection.endRow, selection.endCol);
    return `@${sheetName}!${start}:${end}`;
  }, [selection, sheetName]);

  function handleMouseDown(row: number, col: number) {
    setAnchor({ row, col });
    setHover({ row, col });
    setIsSelecting(true);
  }

  function handleMouseEnter(row: number, col: number) {
    if (!isSelecting) {
      return;
    }
    setHover({ row, col });
  }

  function handleMouseUp() {
    setIsSelecting(false);
  }

  function isCellSelected(row: number, col: number) {
    if (!selection) {
      return false;
    }
    return (
      row >= selection.startRow &&
      row <= selection.endRow &&
      col >= selection.startCol &&
      col <= selection.endCol
    );
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="flex w-full max-w-4xl flex-col rounded-2xl border border-gray-800 bg-gray-950">
        <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
          <div className="text-sm font-semibold text-gray-100">
            Select cells from {sheetName}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-700 px-2 py-1 text-xs text-gray-300 hover:bg-gray-900"
          >
            Close
          </button>
        </div>
        <div className="overflow-auto p-4">
          <div className="inline-block min-w-full">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `48px repeat(${columns.length}, minmax(120px, 1fr))`,
              }}
            >
              <div className="sticky left-0 top-0 z-10 bg-gray-950" />
              {columns.map((column, colIndex) => (
                <div
                  key={`col-${colIndex}`}
                  className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950 px-2 py-1 text-xs text-gray-400"
                >
                  {columnToLetter(colIndex)}
                </div>
              ))}
              {rows.map((row, rowIndex) => (
                <React.Fragment key={`row-${rowIndex}`}>
                  <div className="sticky left-0 z-10 border-r border-gray-800 bg-gray-950 px-2 py-1 text-xs text-gray-400">
                    {rowIndex + 1}
                  </div>
                  {row.map((cell, colIndex) => {
                    const selected = isCellSelected(rowIndex, colIndex);
                    return (
                      <div
                        key={`cell-${rowIndex}-${colIndex}`}
                        onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                        onMouseUp={handleMouseUp}
                        className={[
                          "border-b border-r border-gray-900 px-2 py-1 text-xs text-gray-200",
                          "cursor-pointer select-none",
                          selected ? "bg-blue-500/30" : "hover:bg-gray-900",
                        ].join(" ")}
                      >
                        {cell ?? ""}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-gray-800 px-4 py-3 text-xs text-gray-400">
          <div>
            {rangeRef ? `Selected: ${rangeRef}` : "Select a range."}
          </div>
          <button
            type="button"
            onClick={() => (rangeRef ? onInsert(rangeRef) : undefined)}
            disabled={!rangeRef}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-blue-900"
          >
            Insert into chat
          </button>
        </div>
      </div>
    </div>
  );
}
