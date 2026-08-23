"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Clock, Table, CalendarDays, Settings, Download, CalendarRange } from "lucide-react";
import { getSchedulingLayoutStats } from "@/app/actions/academic";

const TABS = [
  { name: "Overview", href: "/dashboard/academics/scheduling", icon: CalendarRange, desc: "Scheduling hub" },
  { name: "Timetables", href: "/dashboard/academics/scheduling/timetables", icon: Table, desc: "Class schedules" },
  { name: "School Calendar", href: "/dashboard/academics/scheduling/calendar", icon: CalendarDays, desc: "Academic year" },
  { name: "Periods & Bells", href: "/dashboard/academics/scheduling/periods", icon: Clock, desc: "Daily time slots" },
  { name: "Events", href: "/dashboard/academics/scheduling/events", icon: Calendar, desc: "School activities" }
];

export default function SchedulingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [stats, setStats] = useState([
    { label: "Active Timetables", value: "...", sub: "For this term", color: "from-primary-800 to-primary-900" },
    { label: "Upcoming Events", value: "...", sub: "Next 30 days", color: "from-emerald-600 to-teal-700" },
    { label: "Daily Periods", value: "...", sub: "Standard day", color: "from-indigo-600 to-violet-700" },
    { label: "Conflicts", value: "...", sub: "All resolved", color: "from-amber-500 to-orange-600" },
  ]);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getSchedulingLayoutStats();
        setStats([
          { label: "Active Timetables", value: data.activeTimetables.toString(), sub: "For this term", color: "from-primary-800 to-primary-900" },
          { label: "Upcoming Events", value: data.upcomingEvents.toString(), sub: "Next 30 days", color: "from-emerald-600 to-teal-700" },
          { label: "Daily Periods", value: data.dailyPeriods.toString(), sub: "Standard day", color: "from-indigo-600 to-violet-700" },
          { label: "Conflicts", value: data.conflicts.toString(), sub: "All resolved", color: "from-amber-500 to-orange-600" },
        ]);
      } catch (err) {
        console.error("Failed to load scheduling stats", err);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-5 pb-16">
      {/* ── Hero Banner ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 shadow-2xl shadow-primary-900/40">
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-secondary-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-36 h-36 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute top-4 left-1/2 w-24 h-24 rounded-full bg-secondary-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-secondary-500 rounded-xl flex items-center justify-center shadow-md">
                <CalendarRange className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-black text-white/60 uppercase tracking-widest">Academics</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Scheduling</h1>
            <p className="text-sm text-white/60 font-medium mt-1">Manage timetables, academic calendar, and school events.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {stats.map(s => (
              <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl px-4 py-3 text-white min-w-[110px]`}>
                <p className="text-xl font-black leading-none">{s.value}</p>
                <p className="text-[10px] font-black text-white/70 mt-1 leading-tight">{s.label}</p>
                <p className="text-[9px] text-white/50 font-bold">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 px-6 pb-4 flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-black text-white bg-secondary-500 hover:bg-secondary-600 rounded-xl shadow-md shadow-secondary-500/30 hover:-translate-y-0.5 transition-all">
            <Settings className="w-3.5 h-3.5" /> Schedule Settings
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-black text-white/80 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all">
            <Download className="w-3.5 h-3.5" /> Export Timetables
          </button>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl whitespace-nowrap transition-all duration-200 font-black text-sm flex-shrink-0 shadow-sm ${
                isActive
                  ? "bg-secondary-500 text-white shadow-secondary-500/30 shadow-md"
                  : "bg-primary-900 text-white/80 hover:bg-primary-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
              {isActive && (
                <span className="text-[10px] font-bold text-white/70 hidden sm:block">— {tab.desc}</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* ── Page Content ── */}
      <div>{children}</div>
    </div>
  );
}