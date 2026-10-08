"use client";
import React from "react";
import { SlidersHorizontal, Share2, Clock, CheckSquare, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CustomReportsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { id: "my-reports", label: "My Reports", icon: LayoutDashboard },
    { id: "builder", label: "Report Builder", icon: SlidersHorizontal },
    { id: "templates", label: "Templates", icon: CheckSquare },
    { id: "scheduled", label: "Scheduled", icon: Clock },
    { id: "shared", label: "Shared", icon: Share2 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-lg shadow-slate-900/20">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight capitalize">
            Custom Reports
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Build, schedule, and share tailored data extracts.
          </p>
        </div>
      </div>

      <div className="flex space-x-2 bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl overflow-x-auto border border-white/60 shadow-sm hide-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname.includes(`/dashboard/reports/custom/${tab.id}`);
          return (
            <Link
              key={tab.id}
              href={`/dashboard/reports/custom/${tab.id}`}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm border border-indigo-500"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/50 border border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[500px]">
        {children}
      </div>
    </div>
  );
}
