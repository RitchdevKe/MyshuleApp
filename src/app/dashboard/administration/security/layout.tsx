"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Fingerprint, Activity, Eye, Lock, FileWarning } from "lucide-react";

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Security Center", icon: ShieldCheck, href: "/dashboard/administration/security/center" },
    { name: "Authentication", icon: Fingerprint, href: "/dashboard/administration/security/auth" },
    { name: "Sessions", icon: Activity, href: "/dashboard/administration/security/sessions" },
    { name: "Audit Logs", icon: Eye, href: "/dashboard/administration/security/audit" },
    { name: "Policies", icon: Lock, href: "/dashboard/administration/security/policies" },
    { name: "Privacy", icon: FileWarning, href: "/dashboard/administration/security/privacy" }
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Slim Glassmorphic Hero Banner */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Security & Compliance</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Monitor authentication, active sessions, and enterprise audit logs.</p>
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
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
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
