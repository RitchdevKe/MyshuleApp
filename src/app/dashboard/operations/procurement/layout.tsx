"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, CheckCircle2, ShoppingCart, Truck, History, Plus } from "lucide-react";

export default function ProcurementLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Purchase Requests", icon: FileText, href: "/dashboard/operations/procurement/requests" },
    { name: "Approvals", icon: CheckCircle2, href: "/dashboard/operations/procurement/approvals" },
    { name: "Purchase Orders", icon: ShoppingCart, href: "/dashboard/operations/procurement/pos" },
    { name: "Goods Received", icon: Truck, href: "/dashboard/operations/procurement/grn" },
    { name: "Suppliers", icon: History, href: "/dashboard/operations/procurement/suppliers" }
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Primary Color Hero Banner */}
      <div className="bg-primary-900 rounded-3xl p-6 shadow-sm text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Procurement</h1>
            <p className="text-sm font-medium mt-1 text-primary-100">Manage the complete purchasing lifecycle from requests to goods received.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-sm transition-all shadow-sm">
              <Plus className="w-4 h-4" />
              New Request
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mt-6 overflow-x-auto hide-scrollbar pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? "bg-secondary-500 text-white shadow-md shadow-secondary-500/20 border border-secondary-400"
                    : "bg-white/10 text-white hover:bg-white/20 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
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
