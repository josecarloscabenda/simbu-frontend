"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import BrandLogo from "@/components/brand/logo";
import ThemeToggle from "@/components/theme/theme-togle";
import { useAuthStore } from "@/lib/auth.store";

import {
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Users,
  UsersRound,
  FileText,
  BarChart3,
  Settings,
  ShieldCheck,
  Bell,
  LogOut,
} from "lucide-react";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/campanhas", label: "Campanhas", Icon: Megaphone },
  { href: "/mensagens", label: "Mensagens", Icon: MessageSquare },
  { href: "/contactos", label: "Contactos", Icon: Users },
  { href: "/contactos/grupos", label: "Grupos", Icon: UsersRound },
  { href: "/templates", label: "Templates", Icon: FileText },
  { href: "/relatorios", label: "Relatorios", Icon: BarChart3, adminOnly: true },
  { href: "/utilizadores", label: "Utilizadores", Icon: ShieldCheck, adminOnly: true },
  { href: "/configuracoes", label: "Configuracoes", Icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, initialize, logout } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isAdmin = user?.permissao_nome?.toUpperCase() === "ADMIN";

  const initials = user?.nome_completo
    ? user.nome_completo.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase()
    : user?.utilizador?.substring(0, 2).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-bg">
      {/* Topbar */}
      <header className="sticky top-0 z-20 border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/20 backdrop-blur">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BrandLogo />
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button className="p-2 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.06] transition">
              <Bell className="h-5 w-5 text-black/70 dark:text-white/70" />
            </button>

            <div className="flex items-center gap-2 pl-2">
              <div className="w-9 h-9 rounded-full bg-brand-500 text-white font-black flex items-center justify-center text-sm">
                {initials}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold leading-tight text-ink">
                  {user?.nome_completo || user?.utilizador || "Utilizador"}
                </div>
                <div className="text-xs text-muted">{user?.empresa || "Conta"}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-72 bg-surface dark:bg-black/20 border-r border-black/5 dark:border-white/10 min-h-[calc(100vh-73px)] p-4">
          <nav className="space-y-1">
            {menuItems
              .filter((item) => !item.adminOnly || isAdmin)
              .map(({ href, label, Icon }) => {
              const isActive = href === "/contactos/grupos"
                ? pathname === href
                : pathname === href || pathname?.startsWith(href + "/");

              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    "flex items-center gap-3 px-4 py-3 rounded-2xl transition",
                    isActive
                      ? "bg-[rgba(0,195,173,0.12)] text-ink"
                      : "text-black/70 dark:text-white/70 hover:bg-black/[0.03] dark:hover:bg-white/[0.06]",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-semibold">{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-500/10 transition"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-semibold">Sair</span>
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}