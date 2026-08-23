"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Network, FileSignature, Files, Plus } from "lucide-react";
import { getEmployeeLayoutStats } from "@/app/actions/hr";

export default function EmployeesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [stats, setStats] = useState([
    { label: "Total Employees", value: "...", sub: "Active roster", color: "from-primary-800 to-primary-900" },
    { label: "New Hires", value: "...", sub: "This month", color: "from-emerald-600 to-teal-700" },
    { label: "Contract Renewals", value: "...", sub: "Upcoming", color: "from-amber-500 to-orange-600" },
    { label: "Open Positions", value: "...", sub: "Actively hiring", color: "from-indigo-600 to-violet-700" },
  ]);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getEmployeeLayoutStats();
        setStats([
          { label: "Total Employees", value: data.totalEmployees.toString(), sub: "Active roster", color: "from-primary-800 to-primary-900" },
          { label: "New Hires", value: data.newHires.toString(), sub: "This month", color: "from-emerald-600 to-teal-700" },
          { label: "Contract Renewals", value: data.contractRenewals.toString(), sub: "Upcoming", color: "from-amber-500 to-orange-600" },
          { label: "Open Positions", value: data.openPositions.toString(), sub: "Actively hiring", color: "from-indigo-600 to-violet-700" },
        ]);
      } catch (err) {
        console.error(err);
      }
    }
    loadStats();
  }, []);

  const tabs = [
    { name: "Directory", icon: Users, href: "/dashboard/human-resources/employees/directory" },
    { name: "Org Chart", icon: Network, href: "/dashboard/human-resources/employees/org-chart" },
    { name: "Contracts", icon: FileSignature, href: "/dashboard/human-resources/employees/contracts" },
    { name: "Documents", icon: Files, href: "/dashboard/human-resources/employees/documents" }
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Primary Color Hero Banner */}
      <div className="bg-primary-900 rounded-3xl p-5 shadow-sm text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Employees</h1>
            <p className="text-sm font-medium mt-1 text-primary-100">Manage employee records, contracts, and organizational structure.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open_add_employee_modal'));
                // Also navigate to directory if not already there
                if (!pathname.includes('/directory')) {
                  window.location.href = '/dashboard/human-resources/employees/directory?add=true';
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-secondary-500 hover:bg-secondary-600 text-white rounded-xl font-bold text-sm transition-all shadow-sm">
              <Plus className="w-4 h-4" />
              Add Employee
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
