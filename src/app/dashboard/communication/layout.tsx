"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Bell, Users, BarChart3 } from "lucide-react";

export default function CommunicationLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Hub & Messages", icon: MessageSquare, href: "/dashboard/communication/hub" },
    { name: "Announcements", icon: Bell, href: "/dashboard/communication/announcements" },
    { name: "Engagement", icon: Users, href: "/dashboard/communication/engagement" },
    { name: "Reports & Automation", icon: BarChart3, href: "/dashboard/communication/reports" }
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Primary Color Hero Banner */}
      <div className="bg-primary-900 rounded-3xl p-6 shadow-sm text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Communication</h1>
            <p className="text-sm font-medium mt-1 text-primary-100">Manage all school communications, announcements, and parent engagement.</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-3 mt-6 overflow-x-auto hide-scrollbar pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-all duration-300 shadow-sm border ${
                  isActive
                    ? "bg-secondary-500 text-white border-secondary-400"
                    : "bg-white/10 text-white hover:bg-white/20 border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                {tab.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </div>
    </div>
  );
}
