"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/brand/logo";
import { useSidebar } from "@/context/sidebar-context";
import {
  LayoutDashboard,
  Megaphone,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/campanhas", label: "Campanhas", Icon: Megaphone },
  { href: "/contactos", label: "Contactos", Icon: Users },
  { href: "/relatorios", label: "Relatórios", Icon: BarChart3 },
  { href: "/configuracoes", label: "Configurações", Icon: Settings },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { isExpanded, isMobileOpen, closeMobile } = useSidebar();

  const width = isExpanded ? "w-72" : "w-24";

  return (
    <>
      {/* Desktop */}
      <aside
        className={`hidden lg:flex fixed left-0 top-0 bottom-0 z-20 ${width}
                    bg-[var(--color-surface)] dark:bg-black/20
                    border-r border-black/5 dark:border-white/10
                    transition-all duration-300`}
      >
        <div className="flex flex-col w-full">
          <div className="h-[73px] px-4 flex items-center border-b border-black/5 dark:border-white/10">
            <div className={`${isExpanded ? "block" : "hidden"}`}>
              <BrandLogo />
            </div>
            <div className={`${isExpanded ? "hidden" : "block"} mx-auto`}>
              <BrandLogo variant="symbol" />
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {nav.map(({ href, label, Icon }) => {
              const isActive = pathname === href || pathname?.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    "flex items-center gap-3 px-3 py-3 rounded-2xl transition",
                    isActive
                      ? "bg-[rgba(0,195,173,0.14)] text-[var(--color-ink)]"
                      : "text-black/70 dark:text-white/70 hover:bg-black/[0.03] dark:hover:bg-white/[0.06]",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className={`${isExpanded ? "block" : "hidden"} text-sm font-semibold`}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto p-3 border-t border-black/5 dark:border-white/10">
            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-red-600 hover:bg-red-500/10 transition">
              <LogOut className="h-5 w-5 shrink-0" />
              <span className={`${isExpanded ? "block" : "hidden"} text-sm font-semibold`}>
                Sair
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile */}
      <aside
        className={`lg:hidden fixed left-0 top-0 bottom-0 z-40 w-72
                    bg-[var(--color-surface)] dark:bg-black/30
                    border-r border-black/5 dark:border-white/10
                    transition-transform duration-300
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="h-[73px] px-4 flex items-center justify-between border-b border-black/5 dark:border-white/10">
            <BrandLogo />
            <button
              onClick={closeMobile}
              className="h-10 w-10 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/[0.03] dark:hover:bg-white/[0.06] transition"
              aria-label="Fechar menu"
            >
              ✕
            </button>
          </div>

          <nav className="p-3 space-y-1">
            {nav.map(({ href, label, Icon }) => {
              const isActive = pathname === href || pathname?.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMobile}
                  className={[
                    "flex items-center gap-3 px-3 py-3 rounded-2xl transition",
                    isActive
                      ? "bg-[rgba(0,195,173,0.14)] text-[var(--color-ink)]"
                      : "text-black/70 dark:text-white/70 hover:bg-black/[0.03] dark:hover:bg-white/[0.06]",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-semibold">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
