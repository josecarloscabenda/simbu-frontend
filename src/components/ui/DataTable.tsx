"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  loading?: boolean;
}

export default function DataTable<T>({ columns, data, keyExtractor, emptyMessage = "Sem dados", loading = false }: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="bg-[var(--color-surface)] rounded-2xl border border-black/5 dark:border-white/10 p-12 text-center">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-black/5 dark:bg-white/5 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] rounded-2xl border border-black/5 dark:border-white/10 p-12 text-center">
        <p className="text-[var(--color-muted)]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black/5 dark:border-white/10">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn("px-4 py-3 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider", col.className)}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {data.map((item) => (
              <tr key={keyExtractor(item)} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
                {columns.map((col) => (
                  <td key={col.key} className={cn("px-4 py-3 text-sm text-[var(--color-ink)]", col.className)}>
                    {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as ReactNode}
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