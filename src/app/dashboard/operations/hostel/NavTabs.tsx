"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BedDouble, Key, CheckCircle2, FileText } from "lucide-react";

export function NavTabs() {
  const pathname = usePathname();

  const tabs = [
    { name: "Hostels", icon: Home, href: "/dashboard/operations/hostel/hostels" },
    { name: "Rooms & Beds", icon: BedDouble, href: "/dashboard/operations/hostel/rooms" },
    { name: "Allocation", icon: Key, href: "/dashboard/operations/hostel/allocation" },
    { name: "Boarding Attendance", icon: CheckCircle2, href: "/dashboard/operations/hostel/attendance" },
    { name: "Boarding Reports", icon: FileText, href: "/dashboard/operations/hostel/reports" }
  ];

  return (
    <div className="flex space-x-2 mt-6 overflow-x-auto hide-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-all duration-300 shadow-sm ${
              isActive
                ? "bg-secondary-500 text-white border border-secondary-400"
                : "bg-white/10 text-white hover:bg-white/20 border border-transparent"
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-primary-100'}`} />
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
