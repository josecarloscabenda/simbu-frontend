"use client";

import { cn } from "@/lib/utils";
import type { SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  onChange: (value: string) => void;
  value: string;
}

export default function Select({ label, error, options, placeholder, onChange, value, className, ...props }: SelectProps) {
  return (
    <div>
      {label && <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full px-3 py-2.5 rounded-xl border text-sm bg-[var(--color-surface)] text-[var(--color-ink)] outline-none transition appearance-none cursor-pointer",
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
            : "border-black/10 dark:border-white/10 focus:border-[var(--color-brand-500)] focus:ring-2 focus:ring-[var(--color-brand-500)]/20",
          !value && "text-[var(--color-muted)]",
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}