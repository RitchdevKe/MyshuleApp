"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, RefreshCcw, Users, MonitorSmartphone, ScanLine } from "lucide-react";

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Library Catalogue", icon: BookOpen, href: "/dashboard/operations/library/catalogue" },
    { name: "Circulation", icon: RefreshCcw, href: "/dashboard/operations/library/circulation" },
    { name: "Members", icon: Users, href: "/dashboard/operations/library/members" },
    { name: "Digital Library", icon: MonitorSmartphone, href: "/dashboard/operations/library/digital" }
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Primary Color Hero Banner */}
      <div className="bg-primary-900 rounded-3xl p-6 shadow-sm text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Library</h1>
            <p className="text-sm font-medium mt-1 text-primary-100">Manage catalogue, book circulation, and library members.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-sm transition-all shadow-sm">
              <ScanLine className="w-4 h-4" />
              Scan Book
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mt-6 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? "bg-secondary-500 text-white shadow-sm border border-secondary-400"
                    : "bg-white/10 text-white hover:bg-white/20 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div>
        {children}
      </div>
    </div>
  );
}
