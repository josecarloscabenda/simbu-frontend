"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface TabItem {
  key: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (key: string) => void;
  variant?: "underline" | "pills";
}

export default function Tabs({ tabs, activeTab, onTabChange, variant = "underline" }: TabsProps) {
  if (variant === "pills") {
    return (
      <div className="flex gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition",
              activeTab === tab.key
                ? "bg-[var(--color-brand-500)] text-white shadow-sm"
                : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-full text-xs font-bold",
                  activeTab === tab.key ? "bg-white/20 text-white" : "bg-black/10 dark:bg-white/10"
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="border-b border-black/5 dark:border-white/10">
      <div className="flex gap-0 -mb-px overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap",
              activeTab === tab.key
                ? "border-[var(--color-brand-500)] text-[var(--color-brand-600)] dark:text-[var(--color-brand-400)]"
                : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:border-black/10 dark:hover:border-white/10"
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && (
              <span className="px-1.5 py-0.5 rounded-full text-xs font-bold bg-black/10 dark:bg-white/10">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}