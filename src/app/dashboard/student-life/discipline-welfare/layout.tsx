"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileWarning, HeartHandshake, Stethoscope, FileText, Plus } from "lucide-react";
import { getDisciplineLayoutStats } from "@/app/actions/studentLife";

export default function DisciplineWelfareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [stats, setStats] = useState([
    { label: "Active Cases", value: "...", sub: "Needs attention", color: "from-primary-800 to-primary-900" },
    { label: "Resolved", value: "...", sub: "This term", color: "from-emerald-600 to-teal-700" },
    { label: "Interventions", value: "...", sub: "Active plans", color: "from-indigo-600 to-violet-700" },
    { label: "Counseling", value: "...", sub: "Sessions this week", color: "from-amber-500 to-orange-600" },
  ]);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDisciplineLayoutStats();
        setStats([
          { label: "Active Cases", value: data.activeCases.toString(), sub: "Needs attention", color: "from-primary-800 to-primary-900" },
          { label: "Resolved", value: data.resolvedCases.toString(), sub: "This term", color: "from-emerald-600 to-teal-700" },
          { label: "Interventions", value: data.interventions.toString(), sub: "Active plans", color: "from-indigo-600 to-violet-700" },
          { label: "Counseling", value: data.sessions.toString(), sub: "Sessions this week", color: "from-amber-500 to-orange-600" },
        ]);
      } catch (err) {
        console.error("Failed to load discipline stats", err);
      }
    }
    loadStats();
  }, []);

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "cases", label: "Cases", icon: FileWarning },
    { id: "interventions", label: "Interventions", icon: HeartHandshake },
    { id: "counselling", label: "Counselling", icon: Stethoscope },
    { id: "reports", label: "Reports", icon: FileText },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Contextual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-primary-900 p-5 rounded-3xl border border-primary-800 shadow-lg shadow-primary-900/20">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight capitalize">
            Discipline & Welfare
          </h1>
          <p className="text-sm text-primary-100 font-medium mt-1">
            Unified case management for positive/negative behavior, interventions, and support.
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

      {/* Dynamic Tab Navigation - Styled according to user request */}
      <div className="flex space-x-2 bg-white/40 p-1.5 rounded-2xl overflow-x-auto border border-white/60 backdrop-blur-md shadow-sm hide-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === `/dashboard/student-life/discipline-welfare/${tab.id}`;
          return (
            <Link
              key={tab.id}
              href={`/dashboard/student-life/discipline-welfare/${tab.id}`}
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
