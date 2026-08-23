"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderTree, BookOpen, FileSignature, Wallet, Building2, Plus, ArrowRightLeft, CalendarClock } from "lucide-react";

export default function AccountingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Chart of Accounts", icon: FolderTree, href: "/dashboard/finance/accounting/chart-of-accounts" },
    { name: "General Ledger", icon: BookOpen, href: "/dashboard/finance/accounting/general-ledger" },
    { name: "Journals", icon: FileSignature, href: "/dashboard/finance/accounting/journals" },
    { name: "Accounts Payable", icon: Wallet, href: "/dashboard/finance/accounting/accounts-payable" },
    { name: "Accounts Receivable", icon: ArrowRightLeft, href: "/dashboard/finance/accounting/accounts-receivable" },
    { name: "Fixed Assets", icon: Building2, href: "/dashboard/finance/accounting/fixed-assets" },
    { name: "Financial Year", icon: CalendarClock, href: "/dashboard/finance/accounting/financial-year" }
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Top Header Card */}
      <div className="bg-primary-900 p-5 rounded-3xl text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Accounting</h1>
          <p className="text-sm text-primary-200 font-medium mt-1">Manage core accounting functions, ledgers, payables, and assets.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-primary-900 rounded-xl font-bold text-sm transition-all shadow-sm hover:bg-slate-50">
            <Plus className="w-4 h-4" />
            New Journal Entry
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mt-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-all duration-300 shadow-sm ${
                isActive
                  ? "bg-secondary-500 text-white shadow-secondary-500/20"
                  : "bg-primary-900 text-white hover:bg-primary-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div>
        {children}
      </div>
    </div>
  );
}