"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coins, LayoutList, FileMinus, FileText, Play } from "lucide-react";
import { getPayrollLayoutStats } from "@/app/actions/hr";

export default function PayrollLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [stats, setStats] = useState([
    { label: "Last Payroll Run", value: "...", sub: "Total Amount", color: "from-primary-800 to-primary-900" },
    { label: "Employees Paid", value: "...", sub: "Last cycle", color: "from-emerald-600 to-teal-700" },
    { label: "Salary Structures", value: "...", sub: "Active", color: "from-amber-500 to-orange-600" },
    { label: "Pending Payslips", value: "...", sub: "To be generated", color: "from-indigo-600 to-violet-700" },
  ]);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getPayrollLayoutStats();
        setStats([
          { label: "Last Payroll Run", value: "$" + data.lastRunTotal.toLocaleString(), sub: "Total Amount", color: "from-primary-800 to-primary-900" },
          { label: "Employees Paid", value: data.employeesPaid.toString(), sub: "Last cycle", color: "from-emerald-600 to-teal-700" },
          { label: "Salary Structures", value: data.activeStructures.toString(), sub: "Active", color: "from-amber-500 to-orange-600" },
          { label: "Pending Payslips", value: data.pendingPayslips.toString(), sub: "To be generated", color: "from-indigo-600 to-violet-700" },
        ]);
      } catch (err) {
        console.error(err);
      }
    }
    loadStats();
  }, []);

  const tabs = [
    { name: "Payroll Runs", icon: Coins, href: "/dashboard/human-resources/payroll/runs" },
    { name: "Salary Structures", icon: LayoutList, href: "/dashboard/human-resources/payroll/salary-structures" },
    { name: "Deductions & Allowances", icon: FileMinus, href: "/dashboard/human-resources/payroll/deductions" },
    { name: "Payslips", icon: FileText, href: "/dashboard/human-resources/payroll/payslips" }
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Primary Color Hero Banner */}
      <div className="bg-primary-900 rounded-3xl p-5 shadow-sm text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Payroll</h1>
            <p className="text-sm font-medium mt-1 text-primary-100">Manage salary structures, process payroll runs, and generate payslips.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-secondary-500 hover:bg-secondary-600 text-white rounded-xl font-bold text-sm transition-all shadow-sm">
              <Play className="w-4 h-4" />
              Run Payroll
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
