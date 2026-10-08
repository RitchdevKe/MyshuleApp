"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart2, CreditCard, MessageSquare, User } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export const navItems = [
  { label: "Home", href: "/parent-portal/home", icon: Home },
  { label: "Analysis", href: "/parent-portal/analysis", icon: BarChart2 },
  { label: "Fees", href: "/parent-portal/fees", icon: CreditCard },
  { label: "Messages", href: "/parent-portal/messages", icon: MessageSquare },
  { label: "Account", href: "/parent-portal/account", icon: User },
];

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col bg-primary-900 dark:bg-primary-950 border-r border-slate-200/50 dark:border-slate-800/50 sticky top-14 h-[calc(100vh-3.5rem)]">
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-95 overflow-hidden",
                isActive 
                  ? "bg-primary-800 text-white font-bold shadow-sm" 
                  : "text-primary-100 hover:bg-primary-800/50 hover:text-white font-semibold hover:-translate-y-0.5"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
              )}
              <Icon className={cn("w-5 h-5 transition-transform", isActive ? "scale-110" : "group-hover:scale-110")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-6 left-4 right-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/50 rounded-[28px] shadow-2xl z-50 flex justify-around items-center h-16 px-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center justify-center w-full h-full transition-all active:scale-95",
              isActive 
                ? "text-primary-600 dark:text-primary-400" 
                : "text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-300"
            )}
          >
            {isActive && (
              <div className="absolute top-1 w-8 h-1 bg-primary-500 dark:bg-primary-400 rounded-full blur-[2px] opacity-60" />
            )}
            <Icon className={cn("w-5 h-5 mb-1 transition-transform", isActive && "scale-110")} />
            <span className={cn("text-[10px] transition-all", isActive ? "font-black" : "font-bold")}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
