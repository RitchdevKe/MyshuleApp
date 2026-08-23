"use client";
import React, { useState, useRef, useEffect } from "react";
import { Search, Menu, Bell, MessageSquare, User, GraduationCap, ChevronDown, School } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { useSchoolLevel, SchoolLevel } from "@/contexts/SchoolLevelContext";

const LEVELS: { value: SchoolLevel; label: string; color: string; dot: string }[] = [
  { value: "All",         label: "All Schools",          color: "bg-white/15 text-white border-white/25",                    dot: "bg-secondary-400" },
  { value: "Pre-Primary", label: "Pre-Primary School",   color: "bg-emerald-500/25 text-emerald-200 border-emerald-400/40",  dot: "bg-emerald-400" },
  { value: "Primary",     label: "Primary School",       color: "bg-amber-500/25 text-amber-200 border-amber-400/40",        dot: "bg-amber-400" },
  { value: "Junior",      label: "Junior School",        color: "bg-sky-500/25 text-sky-200 border-sky-400/40",              dot: "bg-sky-400" },
  { value: "Senior",      label: "Senior School",        color: "bg-violet-500/25 text-violet-200 border-violet-400/40",     dot: "bg-violet-400" },
];

const Header = ({ tenantName, logoUrl }: { tenantName?: string, logoUrl?: string }) => {
  const { toggleSidebar } = useSidebar();
  const { schoolLevel, setSchoolLevel } = useSchoolLevel();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const formattedDate = `${today.getDate().toString().padStart(2, "0")}/${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getFullYear().toString().slice(-2)}`;

  const active = LEVELS.find((l) => l.value === schoolLevel) ?? LEVELS[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="flex h-16 w-full items-center justify-between bg-primary-950 px-4 shadow-md z-10 border-b-4 border-secondary-500 rounded-b-2xl">
      {/* Left side: Hamburger, Logo, School Name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={toggleSidebar}
          className="text-white hover:bg-white/10 p-2 rounded-md transition-colors flex-shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 overflow-hidden">
          {/* Logo mark */}
          <div className="h-10 w-10 bg-white border border-white/20 rounded-lg flex-shrink-0 overflow-hidden shadow-inner flex items-center justify-center">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
            ) : (
              <School className="w-6 h-6 text-primary-900" />
            )}
          </div>
          <div className="flex flex-col text-white hidden md:flex truncate">
            <span className="font-black text-[11px] lg:text-xs leading-tight tracking-widest uppercase text-white/90 truncate">
              {tenantName ? tenantName.split(' ')[0] : 'EDU'}
            </span>
            <span className="font-black text-[11px] lg:text-xs leading-tight tracking-widest uppercase text-white/90 truncate">
              {tenantName ? tenantName.split(' ').slice(1).join(' ') : 'SYSTEM'}
            </span>
          </div>
        </div>
      </div>

      {/* Center: MyShule App and School Level Filter */}
      <div className="flex-1 flex justify-center flex-shrink-0">
        <div className="relative flex items-center">
          
          {/* ── School Level Filter ── */}
          <div className="absolute right-full mr-2 w-[140px] hidden md:block" ref={dropdownRef}>
            <button
              id="school-level-switcher"
              onClick={() => setDropdownOpen((o) => !o)}
              className="w-full flex items-center justify-between bg-primary-900/50 hover:bg-primary-900 px-3 py-1.5 rounded-lg transition-colors text-xs font-bold border border-primary-900 shadow-inner text-white"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${active.dot}`} />
                <span className="truncate">{active.value === "All" ? "All Schools" : active.label}</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-primary-900 border border-white/15 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <p className="px-3 pt-2.5 pb-1 text-[9px] font-black uppercase tracking-widest text-white/40">
                  School Section
                </p>
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl.value}
                    onClick={() => { setSchoolLevel(lvl.value); setDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold transition-colors ${
                      schoolLevel === lvl.value
                        ? "bg-white/10 text-white"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${lvl.dot}`} />
                    {lvl.label}
                    {schoolLevel === lvl.value && (
                      <span className="ml-auto text-[10px] text-secondary-400 font-black">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
            <span className="font-black text-sm lg:text-base leading-tight tracking-[0.2em] text-white uppercase">
              My<span className="text-secondary-500">Shule</span> App
            </span>
          </div>
        </div>
      </div>

      {/* Right side: Search, Date, Icons, Profile */}
      <div className="flex items-center justify-end gap-2 sm:gap-3 flex-1">
        {/* Minimized Search */}
        <div className="relative hidden lg:block w-40 xl:w-56 transition-all duration-300 focus-within:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Quick search..."
            className="w-full pl-9 pr-4 py-1.5 text-xs font-bold bg-white/10 border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:bg-white/20 transition-all text-white placeholder-slate-400 shadow-inner"
          />
        </div>

        {/* Date Badge */}
        <div className="hidden sm:flex items-center bg-white/10 px-3 py-1.5 rounded-full text-white/90 text-xs font-black border border-white/10 shadow-inner">
          {formattedDate}
        </div>

        {/* Message Icon */}
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 transition-colors">
          <MessageSquare className="w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 transition-colors relative">
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary-500 rounded-full border border-primary-950 animate-pulse" />
          <Bell className="w-4 h-4" />
        </button>

        {/* Profile Logo */}
        <div className="h-8 w-8 ml-1 bg-gradient-to-br from-secondary-500 to-secondary-600 border border-secondary-400 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg transition-all">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
    </header>
  );
};

export default Header;
