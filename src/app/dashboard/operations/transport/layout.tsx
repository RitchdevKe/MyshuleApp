"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Truck, Map, Users, Fuel, Plus } from "lucide-react";

export default function TransportLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Vehicles", icon: Truck, href: "/dashboard/operations/transport/vehicles" },
    { name: "Routes", icon: Map, href: "/dashboard/operations/transport/routes" },
    { name: "Student Transport", icon: Users, href: "/dashboard/operations/transport/students" },
    { name: "Trips", icon: Truck, href: "/dashboard/operations/transport/trips" },
    { name: "Fuel Tracking", icon: Fuel, href: "/dashboard/operations/transport/fuel" }
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Primary Color Hero Banner */}
      <div className="bg-primary-900 rounded-3xl p-6 shadow-sm text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Transport</h1>
            <p className="text-sm font-medium mt-1 text-primary-100">Manage school vehicles, routes, drivers, and fuel consumption.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/10 p-3 rounded-xl border border-white/20 text-center px-6 shadow-sm">
              <div className="text-2xl font-black text-white">12</div>
              <div className="text-[10px] font-bold text-primary-200 uppercase tracking-wider">Vehicles</div>
            </div>
            <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-500/30 text-center px-6 shadow-sm">
              <div className="text-2xl font-black text-emerald-400">10</div>
              <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Active</div>
            </div>
            <button className="flex items-center justify-center gap-2 bg-white/10 text-white hover:bg-white/20 border border-white/20 px-5 py-3 rounded-xl font-bold transition-all shadow-sm">
              <Plus className="w-5 h-5" />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
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
      </div>

      {/* Main Content Area */}
      <div>
        {children}
      </div>
    </div>
  );
}
