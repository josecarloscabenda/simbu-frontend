"use client";

import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div>
      {label && <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">{label}</label>}
      <input
        className={cn(
          "w-full px-3 py-2.5 rounded-xl border text-sm bg-[var(--color-surface)] text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted)]",
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
            : "border-black/10 dark:border-white/10 focus:border-[var(--color-brand-500)] focus:ring-2 focus:ring-[var(--color-brand-500)]/20",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}