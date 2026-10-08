"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, LayoutList, Calculator, ArrowRightLeft, BadgePercent, FileText } from "lucide-react";

export function NavTabs() {
  const pathname = usePathname();

  const tabs = [
    { name: "Student Accounts", icon: Users, href: "/dashboard/finance/fees-billing/student-accounts" },
    { name: "Fee Structures", icon: LayoutList, href: "/dashboard/finance/fees-billing/fee-structures" },
    { name: "Billing Runs", icon: Calculator, href: "/dashboard/finance/fees-billing/billing-runs" },
    { name: "Adjustments", icon: ArrowRightLeft, href: "/dashboard/finance/fees-billing/adjustments" },
    { name: "Discounts & Scholarships", icon: BadgePercent, href: "/dashboard/finance/fees-billing/discounts" },
    { name: "Statements", icon: FileText, href: "/dashboard/finance/fees-billing/statements" }
  ];

  return (
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
  );
}
