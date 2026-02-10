"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type SidebarContextValue = {
  isExpanded: boolean;
  isMobileOpen: boolean;
  toggleExpanded: () => void;
  openMobile: () => void;
  closeMobile: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const value = useMemo(
    () => ({
      isExpanded,
      isMobileOpen,
      toggleExpanded: () => setIsExpanded((v) => !v),
      openMobile: () => setIsMobileOpen(true),
      closeMobile: () => setIsMobileOpen(false),
    }),
    [isExpanded, isMobileOpen]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}
