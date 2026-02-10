"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export default function Card({ children, className, padding = true }: CardProps) {
  return (
    <div className={cn("bg-[var(--color-surface)] rounded-2xl border border-black/5 dark:border-white/10 shadow-sm", padding && "p-6", className)}>
      {children}
    </div>
  );
}