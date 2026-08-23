"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, Filter, Search } from "lucide-react";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const tabs = [
    { name: "Fee Structures", href: "/dashboard/finance/student-billing/fee-structures" },
    { name: "Billing", href: "/dashboard/finance/student-billing/billing" },
    { name: "Discounts Waivers", href: "/dashboard/finance/student-billing/discounts-waivers" },
    { name: "Debtors", href: "/dashboard/finance/student-billing/debtors" }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Consistent Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 capitalize">
            Student Billing
          </h1>
          <p className="text-slate-500 mt-1">
            Manage fee structures, generate invoices, and handle student balances.
          </p>
        </div>
        
        {/* Global Toolbar for Workspace */}
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search in Student Billing..." 
              className="pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-primary-700 bg-white border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-primary-700 bg-white border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Pill-style Navigation */}
      <div className="overflow-x-auto pb-2">
        <nav className="flex space-x-2 min-w-max" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`
                  whitespace-nowrap px-4 py-2 text-sm font-semibold rounded-full transition-colors
                  ${isActive 
                    ? 'bg-secondary-500 text-white shadow-md' 
                    : 'bg-primary-900 text-white hover:bg-primary-800 shadow-sm'
                  }
                `}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}