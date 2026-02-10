"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  toast: (type: ToastType, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors: Record<ToastType, string> = {
  success: "border-green-500 bg-green-50 dark:bg-green-950/30",
  error: "border-red-500 bg-red-50 dark:bg-red-950/30",
  warning: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30",
  info: "border-blue-500 bg-blue-50 dark:bg-blue-950/30",
};

const iconColors: Record<ToastType, string> = {
  success: "text-green-600",
  error: "text-red-600",
  warning: "text-yellow-600",
  info: "text-blue-600",
};

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              className={cn("pointer-events-auto border-l-4 rounded-lg p-4 shadow-lg flex gap-3 animate-in slide-in-from-right", colors[t.type])}
            >
              <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", iconColors[t.type])} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--color-ink)]">{t.title}</p>
                {t.message && <p className="text-sm text-[var(--color-muted)] mt-0.5">{t.message}</p>}
              </div>
              <button onClick={() => dismiss(t.id)} className="shrink-0">
                <X className="h-4 w-4 text-[var(--color-muted)]" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}