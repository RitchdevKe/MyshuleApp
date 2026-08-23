"use client";
import React from "react";
import { Building2, GraduationCap, Calculator, MessageSquare, Link as LinkIcon, Settings2, Lock, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function SettingsDashboard() {
  const modules = [
    {
      id: "school",
      name: "School Settings",
      description: "Manage school identity, structure, contacts, and global preferences.",
      icon: Building2,
      status: "active",
      href: "/dashboard/settings/school",
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      id: "academic",
      name: "Academic Setup",
      description: "Configure terms, grading systems, examinations, and report card templates.",
      icon: GraduationCap,
      status: "active",
      href: "/dashboard/settings/academic",
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      id: "finance",
      name: "Finance & Accounting",
      description: "Set up fee structures, chart of accounts, and financial controls.",
      icon: Calculator,
      status: "locked",
      href: "#",
      color: "text-slate-400",
      bg: "bg-slate-100"
    },
    {
      id: "communication",
      name: "Communication Rules",
      description: "Define notification templates, channels, and automation triggers.",
      icon: MessageSquare,
      status: "active",
      href: "/dashboard/settings/communication",
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      id: "integrations",
      name: "External Integrations",
      description: "Connect payment gateways, SMS providers, and external hardware.",
      icon: LinkIcon,
      status: "active",
      href: "/dashboard/settings/integrations",
      color: "text-rose-600",
      bg: "bg-rose-50"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 p-6 md:p-8 rounded-3xl border border-white/60 backdrop-blur-xl shadow-sm">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
            Tenant Configuration
          </h1>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-2 max-w-2xl">
            Configure how your subscribed modules behave. Controls for identity and access are located in Administration.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-black uppercase tracking-wider rounded-xl px-4 py-2.5 shadow-sm flex items-center gap-2">
            <Settings2 className="w-4 h-4" /> Global Settings
          </span>
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <Link 
            key={mod.id} 
            href={mod.status === 'locked' ? '#' : mod.href}
            className={`relative p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between group ${
              mod.status === 'locked' 
                ? 'bg-slate-50 border-slate-200 opacity-75 cursor-default' 
                : 'bg-white/80 backdrop-blur-xl border-slate-200/80 hover:shadow-md hover:-translate-y-1'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${mod.bg} ${mod.color}`}>
                  <mod.icon className="w-6 h-6" />
                </div>
                {mod.status === 'locked' ? (
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-slate-200 text-slate-600 px-2 py-1 rounded">
                    <Lock className="w-3 h-3" /> Not Included
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                )}
              </div>
              <h3 className={`text-lg font-black mb-2 ${mod.status === 'locked' ? 'text-slate-600' : 'text-slate-800'}`}>
                {mod.name}
              </h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6">
                {mod.description}
              </p>
            </div>
            
            <div className="mt-auto">
              {mod.status === 'locked' ? (
                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider">
                  View Upgrade Plans &rarr;
                </button>
              ) : (
                <div className="flex items-center text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition-colors uppercase tracking-wider">
                  Configure <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
