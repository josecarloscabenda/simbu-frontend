"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { countryCodes, getCountryByIso, type CountryCode } from "@/utils/countryCodes";

interface PhoneInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  defaultCountry?: string;
}

export default function PhoneInput({ label, value, onChange, error, defaultCountry = "AO" }: PhoneInputProps) {
  const [selected, setSelected] = useState<CountryCode>(getCountryByIso(defaultCountry) || countryCodes[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Extract the local number (remove country code if present)
  const localNumber = value.startsWith(selected.code)
    ? value.slice(selected.code.length).trim()
    : value.startsWith("+")
    ? ""
    : value;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (dropdownOpen && searchRef.current) searchRef.current.focus();
  }, [dropdownOpen]);

  const filtered = search
    ? countryCodes.filter(
        (c) =>
          c.country.toLowerCase().includes(search.toLowerCase()) ||
          c.code.includes(search)
      )
    : countryCodes;

  const handleCountrySelect = (c: CountryCode) => {
    setSelected(c);
    setDropdownOpen(false);
    setSearch("");
    onChange(localNumber ? `${c.code}${localNumber}` : "");
  };

  const handleNumberChange = (num: string) => {
    const digits = num.replace(/[^0-9]/g, "");
    onChange(digits ? `${selected.code}${digits}` : "");
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">{label}</label>
      )}
      <div className="flex">
        {/* Country selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2.5 rounded-l-xl border border-r-0 bg-black/[0.02] dark:bg-white/[0.03] text-sm transition",
              error
                ? "border-red-500"
                : "border-black/10 dark:border-white/10 hover:bg-black/[0.05] dark:hover:bg-white/[0.05]"
            )}
          >
            <span className="text-base">{selected.flag}</span>
            <span className="text-[var(--color-muted)] text-sm">{selected.code}</span>
            <ChevronDown className="h-3.5 w-3.5 text-[var(--color-muted)]" />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 top-full mt-1 w-64 bg-[var(--color-surface)] rounded-xl border border-black/10 dark:border-white/10 shadow-xl z-50 max-h-64 flex flex-col">
              <div className="p-2 border-b border-black/5 dark:border-white/5">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-muted)]" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Pesquisar..."
                    className="w-full pl-8 pr-3 py-1.5 text-sm bg-black/[0.03] dark:bg-white/[0.05] rounded-lg border-0 outline-none text-[var(--color-ink)] placeholder:text-[var(--color-muted)]"
                  />
                </div>
              </div>
              <div className="overflow-y-auto flex-1">
                {filtered.map((c) => (
                  <button
                    key={c.iso}
                    type="button"
                    onClick={() => handleCountrySelect(c)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition text-left",
                      c.iso === selected.iso && "bg-[var(--color-brand-500)]/5"
                    )}
                  >
                    <span className="text-base">{c.flag}</span>
                    <span className="flex-1 text-[var(--color-ink)]">{c.country}</span>
                    <span className="text-[var(--color-muted)]">{c.code}</span>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="px-3 py-4 text-sm text-[var(--color-muted)] text-center">Nenhum resultado</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Number input */}
        <input
          type="tel"
          value={localNumber}
          onChange={(e) => handleNumberChange(e.target.value)}
          placeholder="9XX XXX XXX"
          className={cn(
            "flex-1 px-3 py-2.5 rounded-r-xl border text-sm bg-[var(--color-surface)] text-[var(--color-ink)] outline-none transition",
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-black/10 dark:border-white/10 focus:border-[var(--color-brand-500)] focus:ring-2 focus:ring-[var(--color-brand-500)]/20"
          )}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}