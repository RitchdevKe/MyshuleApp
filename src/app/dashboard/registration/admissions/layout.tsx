"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText, ClipboardList, CheckCircle, Upload,
  Search, Filter, Plus, Download, BarChart3,
  Users, TrendingUp, Clock, HeartPulse, LogOut
} from "lucide-react";
import { getApplications } from "@/app/actions/applications";
import { getStudentsDirectory } from "@/app/actions/students";

const tabs = [
  { name: "Admissions",    href: "/dashboard/registration/admissions/admissions",   icon: ClipboardList, desc: "Pipeline & review board" },
  { name: "Directory",     href: "/dashboard/registration/admissions/directory",    icon: Users,         desc: "All enrolled students" },
  { name: "Applications",  href: "/dashboard/registration/admissions/applications", icon: FileText,      desc: "New applicant submissions" },
  { name: "Progress",      href: "/dashboard/registration/admissions/progress",     icon: TrendingUp,    desc: "Promotions & grades" },
  { name: "Welfare",       href: "/dashboard/registration/admissions/welfare",      icon: HeartPulse,    desc: "Health & discipline" },
  { name: "Documents",     href: "/dashboard/registration/admissions/documents",    icon: Upload,        desc: "Document verification" },
  { name: "Exit",          href: "/dashboard/registration/admissions/exit",         icon: LogOut,        desc: "Transfers & leavers" },
];

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const [stats, setStats] = useState([
    { label: "Total Applications", value: "...",  icon: FileText,   color: "bg-primary-900 text-white",     sub: "Loading..." },
    { label: "Pending Review",     value: "...",  icon: Clock,      color: "bg-secondary-500 text-white",   sub: "Loading..." },
    { label: "Admitted",           value: "...",  icon: CheckCircle,color: "bg-emerald-600 text-white",     sub: "Loading..." },
    { label: "Enrolled",           value: "...",  icon: Users,      color: "bg-indigo-600 text-white",      sub: "Loading..." },
  ]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [applications, students] = await Promise.all([
          getApplications(),
          getStudentsDirectory()
        ]);

        const totalApps = applications.length;
        const pendingReview = applications.filter(a => a.stage === 'REVIEW').length;
        const admitted = applications.filter(a => a.stage === 'ADMITTED').length;
        const enrolled = students.length;

        setStats([
          { label: "Total Applications", value: totalApps.toString(), icon: FileText, color: "bg-primary-900 text-white", sub: "All time" },
          { label: "Pending Review", value: pendingReview.toString(), icon: Clock, color: "bg-secondary-500 text-white", sub: "Needs attention" },
          { label: "Admitted", value: admitted.toString(), icon: CheckCircle, color: "bg-emerald-600 text-white", sub: "Term 2 intakes" },
          { label: "Enrolled", value: enrolled.toString(), icon: Users, color: "bg-indigo-600 text-white", sub: "Fully onboarded" },
        ]);
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-5 pb-12 pt-2">

      {/* ── Page Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 rounded-3xl p-6 shadow-xl shadow-primary-900/30">
        {/* Decorative orbs */}
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-secondary-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center">
                <ClipboardList className="w-4 h-4 text-secondary-300" />
              </div>
              <span className="text-xs font-black text-primary-200 uppercase tracking-widest">Registration</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Admissions Pipeline</h1>
            <p className="text-sm text-primary-200 font-medium mt-1">
              Track and process new student applications through the full enrollment pipeline.
            </p>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search applications..."
                className="pl-9 pr-4 py-2.5 text-sm font-semibold bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-400 text-white placeholder:text-white/40 backdrop-blur-md transition-all w-52"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-white bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-md">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-white bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-colors">
              <Download className="w-4 h-4" /> Export
            </button>
            <Link href="/dashboard/registration/admissions/applications/new" className="flex items-center gap-2 px-4 py-2.5 text-sm font-black text-primary-900 bg-secondary-400 hover:bg-secondary-300 rounded-xl transition-all shadow-lg shadow-secondary-500/30 hover:-translate-y-0.5">
              <Plus className="w-4 h-4" /> New Application
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          {stats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-3.5 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xl font-black text-white">{s.value}</p>
                  <p className="text-[10px] font-bold text-primary-200 leading-tight">{s.label}</p>
                  <p className="text-[9px] text-secondary-300 font-bold">{s.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Feature Tabs — primary bg, secondary active ── */}
      <div className="flex gap-2 bg-primary-900 p-2 rounded-2xl shadow-lg shadow-primary-900/20 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl whitespace-nowrap transition-all duration-300 flex-shrink-0 group ${
                isActive
                  ? "bg-secondary-500 text-white shadow-lg shadow-secondary-500/40"
                  : "text-primary-200 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-primary-300 group-hover:text-white"}`} />
              <div>
                <p className={`text-sm font-black leading-tight ${isActive ? "text-white" : ""}`}>{tab.name}</p>
                <p className={`text-[10px] font-medium leading-tight hidden sm:block ${isActive ? "text-secondary-100" : "text-primary-400 group-hover:text-primary-200"}`}>{tab.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Content ── */}
      <div>{children}</div>
    </div>
  );
}