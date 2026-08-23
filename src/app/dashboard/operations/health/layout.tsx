"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, FileText, Heart, PhoneCall, ShieldAlert, Plus } from "lucide-react";

export default function HealthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Clinic Overview", icon: Activity, href: "/dashboard/operations/health/clinic" },
    { name: "Medical Records", icon: FileText, href: "/dashboard/operations/health/records" },
    { name: "Visits", icon: Heart, href: "/dashboard/operations/health/visits" },
    { name: "Emergency", icon: PhoneCall, href: "/dashboard/operations/health/emergency" },
    { name: "Welfare", icon: ShieldAlert, href: "/dashboard/operations/health/welfare" }
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Primary Color Hero Banner */}
      <div className="bg-primary-900 rounded-3xl p-5 shadow-sm text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Health & Welfare</h1>
            <p className="text-sm font-medium mt-1 text-primary-100">Manage school clinic visits, medical records, and student welfare.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-sm transition-all shadow-sm">
              <Plus className="w-4 h-4" />
              Log Visit
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
