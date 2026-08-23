"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LineChart, Target, MessageCircle, Plus } from "lucide-react";
import { getPerformanceLayoutStats } from "@/app/actions/hr";

export default function PerformanceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [stats, setStats] = useState([
    { label: "Active Appraisals", value: "...", sub: "In progress", color: "from-primary-800 to-primary-900" },
    { label: "Goals Met", value: "...", sub: "Completion rate", color: "from-emerald-600 to-teal-700" },
    { label: "Feedback Given", value: "...", sub: "This quarter", color: "from-amber-500 to-orange-600" },
    { label: "Needs Review", value: "...", sub: "Pending action", color: "from-indigo-600 to-violet-700" },
  ]);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getPerformanceLayoutStats();
        setStats([
          { label: "Active Appraisals", value: data.activeAppraisals.toString(), sub: "In progress", color: "from-primary-800 to-primary-900" },
          { label: "Goals Met", value: data.goalsMet.toString() + "%", sub: "Completion rate", color: "from-emerald-600 to-teal-700" },
          { label: "Feedback Given", value: data.feedbackSessions.toString(), sub: "This quarter", color: "from-amber-500 to-orange-600" },
          { label: "Needs Review", value: data.needsReview.toString(), sub: "Pending action", color: "from-indigo-600 to-violet-700" },
        ]);
      } catch (err) {
        console.error(err);
      }
    }
    loadStats();
  }, []);

  const tabs = [
    { name: "Appraisals", icon: LineChart, href: "/dashboard/human-resources/performance/appraisals" },
    { name: "Goals & KPIs", icon: Target, href: "/dashboard/human-resources/performance/goals" },
    { name: "Feedback", icon: MessageCircle, href: "/dashboard/human-resources/performance/feedback" }
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Primary Color Hero Banner */}
      <div className="bg-primary-900 rounded-3xl p-5 shadow-sm text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Performance</h1>
            <p className="text-sm font-medium mt-1 text-primary-100">Manage employee evaluations, track goals, and record feedback.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open_new_appraisal_modal'));
                if (!pathname.includes('/appraisals')) {
                  window.location.href = '/dashboard/human-resources/performance/appraisals?add=true';
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-secondary-500 hover:bg-secondary-600 text-white rounded-xl font-bold text-sm transition-all shadow-sm">
              <Plus className="w-4 h-4" />
              New Appraisal
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {stats.map(s => (
            <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl px-4 py-3 text-white`}>
              <p className="text-xl font-black leading-none">{s.value}</p>
              <p className="text-[10px] font-black text-white/70 mt-1 leading-tight">{s.label}</p>
              <p className="text-[9px] text-white/50 font-bold">{s.sub}</p>
            </div>
          ))}
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
                  isActive ? "bg-secondary-500 text-white shadow-sm border border-secondary-400" : "bg-white/10 text-white hover:bg-white/20 border border-transparent"
                }`}
              >
                <Icon className="w-4 h-4 text-white" />
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
