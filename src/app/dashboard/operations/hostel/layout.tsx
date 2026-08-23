"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BedDouble, Key, CheckCircle2, FileText } from "lucide-react";

export default function HostelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Hostels", icon: Home, href: "/dashboard/operations/hostel/hostels" },
    { name: "Rooms & Beds", icon: BedDouble, href: "/dashboard/operations/hostel/rooms" },
    { name: "Allocation", icon: Key, href: "/dashboard/operations/hostel/allocation" },
    { name: "Boarding Attendance", icon: CheckCircle2, href: "/dashboard/operations/hostel/attendance" },
    { name: "Boarding Reports", icon: FileText, href: "/dashboard/operations/hostel/reports" }
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Primary Color Hero Banner */}
      <div className="bg-primary-900 rounded-3xl p-5 shadow-sm text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Hostel & Boarding</h1>
            <p className="text-sm font-medium mt-1 text-primary-100">Manage hostels, room allocations, and boarding attendance.</p>
          </div>
          
          {/* KPI Summary */}
          <div className="flex gap-4">
            <div className="bg-white/10 p-3 rounded-xl border border-white/20 text-center px-6 shadow-sm">
              <div className="text-2xl font-black text-white">320</div>
              <div className="text-[10px] font-bold text-primary-200 uppercase tracking-wider">Total Beds</div>
            </div>
            <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-500/30 text-center px-6 shadow-sm">
              <div className="text-2xl font-black text-emerald-400">278</div>
              <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Occupied</div>
            </div>
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
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-all duration-300 shadow-sm ${
                  isActive
                    ? "bg-secondary-500 text-white border border-secondary-400"
                    : "bg-white/10 text-white hover:bg-white/20 border border-transparent"
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
