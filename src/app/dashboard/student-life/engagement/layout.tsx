"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, MapPin, Target, Shield, Heart, GraduationCap, Award, BookOpen, Star, BarChart3 } from "lucide-react";
import { getEngagementLayoutStats } from "@/app/actions/studentLife";

export default function EngagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [stats, setStats] = useState([
    { label: "Portfolios", value: "...", sub: "Active students", color: "from-primary-800 to-primary-900" },
    { label: "Avg. Participation", value: "...", sub: "Overall metric", color: "from-emerald-600 to-teal-700" },
    { label: "Service Hours", value: "...", sub: "Total tracked", color: "from-indigo-600 to-violet-700" },
    { label: "Awards Given", value: "...", sub: "This year", color: "from-amber-500 to-orange-600" },
  ]);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getEngagementLayoutStats();
        setStats([
          { label: "Portfolios", value: data.activePortfolios.toString(), sub: "Active students", color: "from-primary-800 to-primary-900" },
          { label: "Avg. Participation", value: `${data.averageParticipation}%`, sub: "Overall metric", color: "from-emerald-600 to-teal-700" },
          { label: "Service Hours", value: data.serviceHours.toString(), sub: "Total tracked", color: "from-indigo-600 to-violet-700" },
          { label: "Awards Given", value: data.totalAwards.toString(), sub: "This year", color: "from-amber-500 to-orange-600" },
        ]);
      } catch (err) {
        console.error(err);
      }
    }
    loadStats();
  }, []);

  const tabs = [
    { id: "overview", label: "Overview", icon: Star },
    { id: "portfolio", label: "Student Portfolio", icon: BookOpen },
    { id: "participation", label: "Participation", icon: Target },
    { id: "service", label: "Community Service", icon: Heart },
    { id: "awards", label: "Awards", icon: Award },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Contextual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-primary-900 p-5 rounded-3xl border border-primary-800 shadow-lg shadow-primary-900/20">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight capitalize">
            Student Engagement
          </h1>
          <p className="text-sm text-primary-100 font-medium mt-1">
            The MyShule Student Passport: tracking holistic development and participation.
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
          const isActive = pathname === `/dashboard/student-life/engagement/${tab.id}`;
          return (
            <Link
              key={tab.id}
              href={`/dashboard/student-life/engagement/${tab.id}`}
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
      <div className="bg-white/80 backdrop-blur-lg border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[600px]">
        {children}
      </div>
    </div>
  );
}
