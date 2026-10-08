"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Home, BarChart2, CreditCard, MessageSquare, User, Users, LogOut } from "lucide-react";
import { navItems } from "./PortalNavigation";
import { logout } from "@/app/actions/auth";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    
    const handleOpenEvent = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleOpenEvent);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleOpenEvent);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const actions = [
    ...navItems.map((item) => ({
      id: item.href,
      name: item.label,
      icon: item.icon,
      perform: () => {
        router.push(item.href);
        setIsOpen(false);
      },
    })),
    {
      id: "switch-student",
      name: "Switch Student",
      icon: Users,
      perform: () => {
        // Implement switch student logic or navigation
        console.log("Switch student");
        setIsOpen(false);
      },
    },
    {
      id: "logout",
      name: "Sign Out",
      icon: LogOut,
      perform: async () => {
        await logout();
        router.push("/login");
        setIsOpen(false);
      },
    },
  ];

  const filteredActions = query === ""
    ? actions
    : actions.filter((action) => action.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 sm:pt-32">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Palette */}
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 transition-all animate-in fade-in zoom-in-95 duration-200 mx-4">
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-4">
          <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
          <input
            ref={inputRef}
            className="w-full bg-transparent border-0 px-4 py-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-0 sm:text-sm"
            placeholder="Search commands... (Cmd+K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="text-xs text-slate-400 dark:text-slate-500 font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">ESC</div>
        </div>

        {filteredActions.length > 0 ? (
          <ul className="max-h-72 overflow-y-auto p-2 space-y-1">
            {filteredActions.map((action) => {
              const Icon = action.icon;
              return (
                <li key={action.id}>
                  <button
                    onClick={action.perform}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <Icon className="h-5 w-5 opacity-70" />
                    <span className="font-medium">{action.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-6 text-center text-sm text-slate-500">
            No results found for "{query}".
          </div>
        )}
      </div>
    </div>
  );
}
