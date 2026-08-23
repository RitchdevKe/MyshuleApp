"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Terminal, BookOpen, Users, Wallet, Calendar, GraduationCap, Building2, Bell, FileText, ChevronRight, Calculator, UserPlus, FilePlus } from "lucide-react";
import { useRouter } from "next/navigation";

type Command = {
  id: string;
  name: string;
  icon: React.ElementType;
  section: "Modules" | "Pages" | "Quick Actions";
  href?: string;
  action?: () => void;
};

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Pre-defined commands
  const commands: Command[] = [
    // Modules
    { id: "m-reg", name: "Registration Module", icon: UserPlus, section: "Modules", href: "/dashboard/registration" },
    { id: "m-aca", name: "Academics Module", icon: GraduationCap, section: "Modules", href: "/dashboard/academics" },
    { id: "m-fin", name: "Finance Module", icon: Wallet, section: "Modules", href: "/dashboard/finance" },
    { id: "m-dash", name: "Executive Dashboard", icon: BookOpen, section: "Modules", href: "/dashboard" },
    
    // Pages
    { id: "p-stu", name: "Students Directory", icon: Users, section: "Pages", href: "/dashboard/registration/students" },
    { id: "p-adm", name: "Admissions", icon: FileText, section: "Pages", href: "/dashboard/registration/admissions" },
    { id: "p-inv", name: "Invoices & Billing", icon: Calculator, section: "Pages", href: "/dashboard/finance/student-billing" },
    { id: "p-cal", name: "School Calendar", icon: Calendar, section: "Pages", href: "/dashboard/calendar" },
    { id: "p-ai", name: "AI Insights Consultant", icon: Terminal, section: "Pages", href: "/dashboard/ai-insights" },
    
    // Quick Actions
    { id: "q-add-stu", name: "Add New Student", icon: UserPlus, section: "Quick Actions", href: "/dashboard/registration/admissions" },
    { id: "q-add-inv", name: "Create Invoice", icon: FilePlus, section: "Quick Actions", href: "/dashboard/finance/student-billing" },
    { id: "q-rec-pay", name: "Record Payment", icon: Wallet, section: "Quick Actions", href: "/dashboard/finance/payments-receipts" },
    { id: "q-lib", name: "Library Returns", icon: BookOpen, section: "Quick Actions", href: "/dashboard/operations" },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSearch("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredCommands = commands.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filteredCommands.reduce((acc, curr) => {
    if (!acc[curr.section]) acc[curr.section] = [];
    acc[curr.section].push(curr);
    return acc;
  }, {} as Record<string, Command[]>);

  const handleSelect = (cmd: Command) => {
    setIsOpen(false);
    if (cmd.href) {
      router.push(cmd.href);
    } else if (cmd.action) {
      cmd.action();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 px-4 py-2 text-lg text-slate-700 bg-transparent outline-none placeholder:text-slate-400"
            placeholder="Search anything... (Pages, Students, Invoices, Commands)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-1 shrink-0">
            <kbd className="px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-100 rounded border border-slate-200 shadow-sm">ESC</kbd>
          </div>
        </div>

        {/* Results list */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {Object.entries(grouped).map(([section, items]) => (
            <div key={section} className="mb-4 last:mb-0">
              <div className="px-3 py-1.5 text-xs font-bold tracking-wider text-slate-400 uppercase">
                {section}
              </div>
              <div className="mt-1 space-y-1">
                {items.map((item) => (
                  <button
                    key={item.id}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-primary-50 group transition-colors text-left"
                    onClick={() => handleSelect(item)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary-100 group-hover:text-primary-900 transition-colors">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-slate-700 group-hover:text-primary-900 transition-colors">
                        {item.name}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary-500 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          {filteredCommands.length === 0 && (
            <div className="py-14 text-center">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No results found for "{search}"</p>
              <p className="text-sm text-slate-400 mt-1">Try searching for a module or specific action.</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-slate-300 bg-white shadow-sm font-sans font-bold">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded border border-slate-300 bg-white shadow-sm font-sans font-bold">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-slate-300 bg-white shadow-sm font-sans font-bold">↵</kbd>
              Open
            </span>
          </div>
          <div className="font-semibold text-primary-900">MyShuleApp Command Center</div>
        </div>

      </div>
    </div>
  );
}
