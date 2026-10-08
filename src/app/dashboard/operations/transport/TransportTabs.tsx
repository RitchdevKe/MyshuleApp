"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Truck, Map, Users, Fuel } from "lucide-react";

export default function TransportTabs() {
  const pathname = usePathname();

  const tabs = [
    { name: "Vehicles", icon: Truck, href: "/dashboard/operations/transport/vehicles" },
    { name: "Routes", icon: Map, href: "/dashboard/operations/transport/routes" },
    { name: "Student Transport", icon: Users, href: "/dashboard/operations/transport/students" },
    { name: "Trips", icon: Truck, href: "/dashboard/operations/transport/trips" },
    { name: "Fuel Tracking", icon: Fuel, href: "/dashboard/operations/transport/fuel" }
  ];

  return (
    <div className="flex space-x-3 mt-8 overflow-x-auto hide-scrollbar pb-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-xl whitespace-nowrap transition-all duration-300 shadow-sm ${
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
