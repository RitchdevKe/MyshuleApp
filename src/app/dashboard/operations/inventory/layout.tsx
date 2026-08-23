"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid, Package, ArrowRightLeft, History, Plus } from "lucide-react";

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Stock Overview", icon: Grid, href: "/dashboard/operations/inventory/overview" },
    { name: "Item Master", icon: Package, href: "/dashboard/operations/inventory/items" },
    { name: "Stores", icon: Grid, href: "/dashboard/operations/inventory/stores" },
    { name: "Stock Movements", icon: ArrowRightLeft, href: "/dashboard/operations/inventory/movements" },
    { name: "Stock Issues", icon: History, href: "/dashboard/operations/inventory/issues" }
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Primary Color Hero Banner */}
      <div className="bg-primary-900 rounded-3xl p-6 shadow-sm text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Inventory & Stores</h1>
            <p className="text-sm font-medium mt-1 text-primary-100">Track stock levels, manage multiple stores, and monitor stock movements.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-sm transition-all shadow-sm">
              <Plus className="w-4 h-4" />
              Issue Stock
            </button>
          </div>
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
