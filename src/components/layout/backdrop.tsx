"use client";

import { useSidebar } from "@/context/sidebar-context";

export default function Backdrop() {
  const { isMobileOpen, closeMobile } = useSidebar();

  if (!isMobileOpen) return null;

  return (
    <button
      aria-label="Fechar menu"
      onClick={closeMobile}
      className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px] lg:hidden"
    />
  );
}
