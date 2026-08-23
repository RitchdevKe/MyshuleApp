"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Activity, Trophy, Map, Star, Plus } from "lucide-react";
import { getActivitiesLayoutStats } from "@/app/actions/studentLife";

export default function ActivitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [stats, setStats] = useState([
    { label: "Active Clubs", value: "...", sub: "Registered", color: "from-primary-800 to-primary-900" },
    { label: "Sports Teams", value: "...", sub: "Active rosters", color: "from-emerald-600 to-teal-700" },
    { label: "Upcoming Events", value: "...", sub: "This month", color: "from-indigo-600 to-violet-700" },
    { label: "Student Athletes", value: "...", sub: "Cleared to play", color: "from-amber-500 to-orange-600" },
  ]);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getActivitiesLayoutStats();
        setStats([
          { label: "Active Clubs", value: data.activeClubs.toString(), sub: "Registered", color: "from-primary-800 to-primary-900" },
          { label: "Sports Teams", value: data.sportsTeams.toString(), sub: "Active rosters", color: "from-emerald-600 to-teal-700" },
          { label: "Upcoming Events", value: data.upcomingEvents.toString(), sub: "This month", color: "from-indigo-600 to-violet-700" },
          { label: "Student Athletes", value: data.studentAthletes.toString(), sub: "Cleared to play", color: "from-amber-500 to-orange-600" },
        ]);
      } catch (err) {
        console.error(err);
      }
    }
    loadStats();
  }, []);

  const tabs = [
    { id: "overview", label: "Overview", icon: Users },
    { id: "clubs", label: "Clubs", icon: Users },
    { id: "sports", label: "Sports", icon: Activity },
    { id: "events", label: "Events & Trips", icon: Map },
    { id: "participation", label: "Participation", icon: Star },
    { id: "achievements", label: "Achievements", icon: Trophy },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Contextual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-primary-900 p-5 rounded-3xl border border-primary-800 shadow-lg shadow-primary-900/20">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight capitalize">
            Clubs & Activities
          </h1>
          <p className="text-sm text-primary-100 font-medium mt-1">
            Manage clubs, sports teams, trips, and track student achievements in one place.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 md:mt-0 md:ml-6">
          {stats.map(s => (
            <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl px-4 py-3 text-white min-w-[110px]`}>
              <p className="text-xl font-black leading-none">{s.value}</p>
              <p className="text-[10px] font-black text-white/70 mt-1 leading-tight">{s.label}</p>
              <p className="text-[9px] text-white/50 font-bold">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Tab Navigation */}
      <div className="flex space-x-2 bg-white/40 p-1.5 rounded-2xl overflow-x-auto border border-white/60 backdrop-blur-md shadow-sm hide-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === `/dashboard/student-life/activities/${tab.id}`;
          return (
            <Link
              key={tab.id}
              href={`/dashboard/student-life/activities/${tab.id}`}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? "bg-secondary-500 text-white shadow-md border-transparent"
                  : "bg-primary-900 text-white hover:bg-primary-800 shadow-sm border-transparent opacity-90 hover:opacity-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white/80 backdrop-blur-lg border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[500px]">
        {children}
      </div>
    </div>
  );
}
