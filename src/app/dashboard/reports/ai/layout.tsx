"use client";
import React from "react";
import { Brain, MessageSquare, TrendingUp, AlertTriangle, Lightbulb, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AIReportsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { id: "executive-insight", label: "Executive Insight", icon: Brain },
    { id: "ask-myshule", label: "Ask MyShule", icon: MessageSquare },
    { id: "predictions", label: "Predictions", icon: TrendingUp },
    { id: "anomalies", label: "Anomalies", icon: AlertTriangle },
    { id: "recommendations", label: "Recommendations", icon: Lightbulb },
    { id: "ai-report", label: "AI Report", icon: FileText },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-lg shadow-slate-900/20">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight capitalize">
            AI Analytics & Insights
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Predictive intelligence and deep operational analysis.
          </p>
        </div>
      </div>

      <div className="flex space-x-2 bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl overflow-x-auto border border-white/60 shadow-sm hide-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname.includes(`/dashboard/reports/ai/${tab.id}`);
          return (
            <Link
              key={tab.id}
              href={`/dashboard/reports/ai/${tab.id}`}
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
