"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, CalendarClock, Monitor, BarChart3, Plus } from "lucide-react";

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Resource Calendar", icon: Calendar, href: "/dashboard/operations/resources/calendar" },
    { name: "Facility Bookings", icon: CalendarClock, href: "/dashboard/operations/resources/bookings" },
    { name: "Equipment Checkout", icon: Monitor, href: "/dashboard/operations/resources/equipment" },
    { name: "Utilization Reports", icon: BarChart3, href: "/dashboard/operations/resources/utilization" }
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Premium Glassmorphic Hero Banner */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Resources</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Manage facility bookings, equipment checkout, and resource utilization.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-3 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Plus className="w-4 h-4" />
              Book Resource
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-3 mt-8 overflow-x-auto hide-scrollbar pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? "bg-secondary-500 text-white shadow-md shadow-secondary-500/20 border border-secondary-400"
                    : "bg-primary-900 text-white hover:bg-primary-800 shadow-sm shadow-primary-900/20 border border-primary-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-primary-100'}`} />
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
