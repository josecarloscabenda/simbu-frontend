"use client";

import BrandLogo from "@/components/brand/logo";
import ThemeToggle from "@/components/theme/theme-togle";
import { useSidebar } from "@/context/sidebar-context";
import { Bell, Menu, Search } from "lucide-react";

export default function AppHeader() {
  const { toggleExpanded, openMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-20 border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/20 backdrop-blur">
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Mobile menu */}
          <button
            onClick={openMobile}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/[0.03] dark:hover:bg-white/[0.06] transition"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Desktop collapse */}
          <button
            onClick={toggleExpanded}
            className="hidden lg:inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/[0.03] dark:hover:bg-white/[0.06] transition"
            aria-label="Expandir/Colapsar sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden sm:block">
            <BrandLogo />
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/50 dark:text-white/50" />
            <input
              placeholder="Pesquisar..."
              className="w-full h-10 pl-10 pr-3 rounded-xl
                         bg-white dark:bg-white/10
                         border border-black/10 dark:border-white/10
                         focus:outline-none focus:ring-2 focus:ring-[rgba(0,195,173,0.35)]
                         text-sm"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/[0.03] dark:hover:bg-white/[0.06] transition">
            <Bell className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 pl-1">
            <div className="h-10 w-10 rounded-xl bg-[var(--color-brand-500)] text-white font-black flex items-center justify-center">
              U
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="text-sm font-bold">Utilizador</div>
              <div className="text-xs text-[var(--color-muted)]">Admin</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
