"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PieChart, Building, SplitSquareHorizontal, CheckSquare, Plus } from "lucide-react";

export default function BudgetPlanningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { id: "budget-overview", label: "Budget Overview", icon: PieChart },
    { id: "department-budgets", label: "Department Budgets", icon: Building },
    { id: "scenario-planning", label: "Scenario Planning", icon: SplitSquareHorizontal },
    { id: "approvals", label: "Approvals", icon: CheckSquare },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Contextual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-primary-900 p-5 rounded-3xl border border-primary-800 shadow-lg shadow-primary-900/20">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight capitalize">
            Budget & Planning
          </h1>
          <p className="text-sm text-primary-100 font-medium mt-1">
            Set targets, monitor spending against budgets, and plan scenarios.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-secondary-500 rounded-xl hover:bg-secondary-600 transition-colors shadow-md shadow-secondary-500/20">
            <Plus className="w-4 h-4" /> New Budget
          </button>
        </div>
      </div>

      {/* Dynamic Tab Navigation */}
      <div className="flex space-x-2 bg-white/40 p-1.5 rounded-2xl overflow-x-auto border border-white/60 backdrop-blur-md shadow-sm hide-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname.includes(`/budget-planning/${tab.id}`);
          return (
            <Link
              key={tab.id}
              href={`/dashboard/finance/budget-planning/${tab.id}`}
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
      <div className="bg-white/80 backdrop-blur-lg border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[500px] p-6">
        {children}
      </div>

    </div>
  );
}
