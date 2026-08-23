"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, TrendingUp, Receipt, Wallet } from "lucide-react";

export default function SubscriptionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Subscription Details", icon: CreditCard, href: "/dashboard/administration/subscription/details" },
    { name: "Upgrades", icon: TrendingUp, href: "/dashboard/administration/subscription/upgrades" },
    { name: "Billing History", icon: Receipt, href: "/dashboard/administration/subscription/billing-history" },
    { name: "Payment Methods", icon: Wallet, href: "/dashboard/administration/subscription/payment-methods" }
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Slim Glassmorphic Hero Banner */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Subscription</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Manage your plan, upgrades, and billing history.</p>
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
                    ? "bg-secondary-500 text-white shadow-sm"
                    : "bg-primary-900 text-white hover:bg-primary-800 shadow-sm"
                }`}
              >
                <Icon className={`w-4 h-4 text-white`} />
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
