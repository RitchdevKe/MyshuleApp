"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Shield, MessageCircle, Banknote, UserPlus, Download } from "lucide-react";
import { getParentLayoutStats } from "@/app/actions/parents";

const TABS = [
  { name: "Parents",       href: "/dashboard/registration/parents/parents",       icon: Users,          desc: "Parent profiles" },
  { name: "Guardians",     href: "/dashboard/registration/parents/guardians",     icon: Shield,         desc: "Authorised guardians" },
  { name: "Communication", href: "/dashboard/registration/parents/communication", icon: MessageCircle,  desc: "Messages & alerts" },
  { name: "Finance Links", href: "/dashboard/registration/parents/finance",       icon: Banknote,       desc: "Fee responsibility" },
];

export default function ParentsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [stats, setStats] = useState([
    { label: "Total Parents",     value: "...",  sub: "Registered profiles",  color: "from-primary-800 to-primary-900" },
    { label: "Active Guardians",  value: "...",  sub: "Verified pick-up auth", color: "from-indigo-600 to-violet-700" },
    { label: "Msgs This Month",   value: "...", sub: "Sent via SMS & email", color: "from-emerald-600 to-teal-700" },
    { label: "Fee Balance Alerts", value: "...",  sub: "Pending follow-up",    color: "from-amber-500 to-orange-600" },
  ]);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getParentLayoutStats();
        setStats([
          { label: "Total Parents", value: data.totalParents.toString(), sub: "Registered profiles", color: "from-primary-800 to-primary-900" },
          { label: "Active Guardians", value: data.activeGuardians.toString(), sub: "Verified pick-up auth", color: "from-indigo-600 to-violet-700" },
          { label: "Msgs This Month", value: data.messagesCount.toLocaleString(), sub: "Sent via SMS & email", color: "from-emerald-600 to-teal-700" },
          { label: "Fee Balance Alerts", value: data.overdueInvoices.toString(), sub: "Pending follow-up", color: "from-amber-500 to-orange-600" },
        ]);
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-5 pb-16">

      {/* ── Hero Banner ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 shadow-2xl shadow-primary-900/40">
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-secondary-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-36 h-36 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute top-4 left-1/2 w-24 h-24 rounded-full bg-secondary-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-secondary-500 rounded-xl flex items-center justify-center shadow-md">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-black text-white/60 uppercase tracking-widest">Registration</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Parent & Guardian Directory</h1>
            <p className="text-sm text-white/60 font-medium mt-1">Manage profiles, communication, and financial responsibility for all parents and guardians.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map(s => (
              <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl px-4 py-3 text-white min-w-[110px]`}>
                <p className="text-xl font-black leading-none">{s.value}</p>
                <p className="text-[10px] font-black text-white/70 mt-0.5 leading-tight">{s.label}</p>
                <p className="text-[9px] text-white/50 font-bold">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 px-6 pb-4 flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-black text-white bg-secondary-500 hover:bg-secondary-600 rounded-xl shadow-md shadow-secondary-500/30 hover:-translate-y-0.5 transition-all">
            <UserPlus className="w-3.5 h-3.5" /> Add Parent
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-black text-white/80 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all">
            <Download className="w-3.5 h-3.5" /> Export Directory
          </button>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl whitespace-nowrap transition-all duration-200 font-black text-sm flex-shrink-0 shadow-sm ${
                isActive
                  ? "bg-secondary-500 text-white shadow-secondary-500/30 shadow-md"
                  : "bg-primary-900 text-white/80 hover:bg-primary-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
              {isActive && (
                <span className="text-[10px] font-bold text-white/70 hidden sm:block">— {tab.desc}</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* ── Page Content ── */}
      <div>{children}</div>
    </div>
  );
}