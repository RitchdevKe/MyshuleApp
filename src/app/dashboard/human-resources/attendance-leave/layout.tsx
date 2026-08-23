"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, CalendarOff, Activity, FileClock, Plus } from "lucide-react";

export default function AttendanceLeaveLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Attendance", icon: Clock, href: "/dashboard/human-resources/attendance-leave/attendance" },
    { name: "Leave Requests", icon: CalendarOff, href: "/dashboard/human-resources/attendance-leave/leave-requests" },
    { name: "Leave Balances", icon: Activity, href: "/dashboard/human-resources/attendance-leave/leave-balances" },
    { name: "Timesheets", icon: FileClock, href: "/dashboard/human-resources/attendance-leave/timesheets" }
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Slim Glassmorphic Hero Banner */}
      <div className="bg-primary-900 rounded-3xl p-5 shadow-lg border border-primary-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Attendance & Leave</h1>
            <p className="text-sm text-primary-200 font-medium mt-1">Track employee attendance, manage leave requests, and monitor timesheets.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-secondary-500 hover:bg-secondary-600 text-white rounded-xl font-bold text-sm transition-all shadow-sm">
              <Plus className="w-4 h-4" />
              Log Attendance
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
                  isActive ? "bg-white text-primary-900 shadow-sm" : "bg-primary-800/50 text-primary-100 hover:bg-primary-800 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-primary-900" : "text-primary-100"}`} />
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
