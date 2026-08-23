"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Monitor, Building2, Wrench, ClipboardList, ShieldAlert, Plus } from "lucide-react";

export default function AssetsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Asset Register", icon: Monitor, href: "/dashboard/operations/assets/register" },
    { name: "Facilities", icon: Building2, href: "/dashboard/operations/assets/facilities" },
    { name: "Maintenance", icon: Wrench, href: "/dashboard/operations/assets/maintenance" },
    { name: "Work Orders", icon: ClipboardList, href: "/dashboard/operations/assets/workorders" },
    { name: "Inspections", icon: ShieldAlert, href: "/dashboard/operations/assets/inspections" }
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Primary Color Hero Banner */}
      <div className="bg-primary-900 rounded-3xl p-6 shadow-sm text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Assets & Facilities</h1>
            <p className="text-sm font-medium mt-1 text-primary-100">Manage the school's physical infrastructure, maintenance, and work orders.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-sm transition-all shadow-sm">
              <Plus className="w-4 h-4" />
              Add Asset
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
                    ? "bg-secondary-500 text-white shadow-md shadow-secondary-500/20 border border-secondary-400/50"
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
