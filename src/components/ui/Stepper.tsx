"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepperStep {
  label: string;
  description?: string;
}

interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full">
      {/* Desktop */}
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition",
                  i < currentStep
                    ? "bg-green-500 text-white"
                    : i === currentStep
                    ? "bg-[var(--color-brand-500)] text-white"
                    : "bg-black/5 dark:bg-white/10 text-[var(--color-muted)]"
                )}
              >
                {i < currentStep ? <Check className="h-5 w-5" /> : i + 1}
              </div>
              <div>
                <p className={cn("text-sm font-semibold", i <= currentStep ? "text-[var(--color-ink)]" : "text-[var(--color-muted)]")}>
                  {step.label}
                </p>
                {step.description && <p className="text-xs text-[var(--color-muted)]">{step.description}</p>}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("flex-1 h-0.5 mx-4", i < currentStep ? "bg-green-500" : "bg-black/10 dark:bg-white/10")} />
            )}
          </div>
        ))}
      </div>
      {/* Mobile */}
      <div className="sm:hidden flex items-center gap-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-1 flex-1 last:flex-none">
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                i < currentStep
                  ? "bg-green-500 text-white"
                  : i === currentStep
                  ? "bg-[var(--color-brand-500)] text-white"
                  : "bg-black/5 dark:bg-white/10 text-[var(--color-muted)]"
              )}
            >
              {i < currentStep ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            {i === currentStep && (
              <span className="text-xs font-semibold text-[var(--color-ink)] truncate">{step.label}</span>
            )}
            {i < steps.length - 1 && (
              <div className={cn("flex-1 h-0.5", i < currentStep ? "bg-green-500" : "bg-black/10 dark:bg-white/10")} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}