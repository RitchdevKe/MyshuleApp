"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Link as LinkIcon, CreditCard, MessageSquare, MonitorSmartphone, Save } from "lucide-react";

export default function IntegrationsSettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Payment Gateways", icon: CreditCard, href: "/dashboard/settings/integrations/payment-gateways" },
    { name: "SMS Providers", icon: MessageSquare, href: "/dashboard/settings/integrations/sms-providers" },
    { name: "Hardware", icon: MonitorSmartphone, href: "/dashboard/settings/integrations/hardware" }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Contextual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-primary-900 p-5 rounded-3xl border border-primary-800 shadow-lg shadow-primary-900/20">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
             <LinkIcon className="w-8 h-8 text-primary-200" /> External Integrations
          </h1>
          <p className="text-sm text-primary-100 font-medium mt-1">
            Connect payment gateways, SMS providers, and external hardware.
          </p>
        </div>
        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-primary-900 rounded-xl font-bold text-sm hover:bg-primary-50 transition-colors shadow-sm">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
        </div>
      </div>

      {/* Dynamic Tab Navigation */}
      <div className="flex space-x-2 bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl overflow-x-auto border border-white/60 shadow-sm hide-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? "bg-secondary-500 text-white shadow-sm border border-secondary-600"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/50 border border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[500px]">
        {children}
      </div>
    </div>
  );
}
