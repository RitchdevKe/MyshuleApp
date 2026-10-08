"use client";
import React, { useEffect, useState } from "react";
import { Users, Building, AlertTriangle, ShieldCheck, Activity, Filter, Server } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getOperationalFilterOptions } from "./layout-actions";

type FilterOptions = Awaited<ReturnType<typeof getOperationalFilterOptions>>;

export default function OperationalReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [branchId, setBranchId] = useState(searchParams?.get("branchId") || "");
  const [dateRange, setDateRange] = useState(searchParams?.get("dateRange") || "today");

  useEffect(() => {
    getOperationalFilterOptions().then(setFilters).catch(console.error);
  }, []);

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (branchId) params.set("branchId", branchId);
    else params.delete("branchId");
    
    if (dateRange) params.set("dateRange", dateRange);
    else params.delete("dateRange");

    router.push(`${pathname}?${params.toString()}`);
    router.refresh();
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "students-staff", label: "Students & Staff", icon: Users },
    { id: "operations", label: "Operations", icon: Server },
    { id: "resources", label: "Resources", icon: Building },
    { id: "compliance", label: "Compliance", icon: ShieldCheck },
    { id: "activity", label: "Activity", icon: AlertTriangle },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Contextual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-primary-900 p-5 rounded-3xl border border-primary-800 shadow-lg shadow-primary-900/20">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight capitalize">
            Operational Reports
          </h1>
          <p className="text-sm text-primary-100 font-medium mt-1">
            Whole-school management intelligence, operations, resources, and live activity.
          </p>
        </div>
      </div>

      {/* Universal Filter Bar Component */}
      <div className="bg-white/80 backdrop-blur-xl border border-white p-4 rounded-2xl shadow-sm flex flex-wrap items-center gap-4 print:hidden">
        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider mr-2">
          <Filter className="w-4 h-4" /> Global Filter
        </div>
        
        <select 
          value={branchId}
          onChange={(e) => setBranchId(e.target.value)}
          className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:border-indigo-500"
        >
          <option value="">Campus: All Campuses</option>
          {filters?.branches.map(b => (
            <option key={b.id} value={b.id}>
              Campus: {b.name}
            </option>
          ))}
        </select>
        <select 
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:border-indigo-500"
        >
          <option value="today">Date Range: Today</option>
          <option value="this_week">Date Range: This Week</option>
          <option value="this_month">Date Range: This Month</option>
          <option value="all">Date Range: All Time</option>
        </select>
        
        <button 
          onClick={handleApplyFilters}
          className="bg-primary-900 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-sm hover:bg-secondary-500 transition-colors ml-auto cursor-pointer"
        >
          Apply Filters
        </button>
      </div>

      {/* Dynamic Tab Navigation */}
      <div className="flex space-x-2 bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl overflow-x-auto border border-white/60 backdrop-blur-md shadow-sm hide-scrollbar print:hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === `/dashboard/reports/operational/${tab.id}`;
          return (
            <Link
              key={tab.id}
              href={`/dashboard/reports/operational/${tab.id}`}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? "bg-secondary-500 text-white shadow-sm border border-secondary-600"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/50 border border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[500px]">
        {children}
      </div>

    </div>
  );
}
