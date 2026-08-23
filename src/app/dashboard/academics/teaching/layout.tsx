"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarPlus, ClipboardList, PenTool, Presentation, Download, Plus } from "lucide-react";
import { getTeachingLayoutStats } from "@/app/actions/academic";

const TABS = [
  { name: "Overview", href: "/dashboard/academics/teaching", icon: Presentation, desc: "Teaching overview" },
  { name: "Allocation", href: "/dashboard/academics/teaching/allocation", icon: BookOpen, desc: "Subject assignment" },
  { name: "Lesson Planning", href: "/dashboard/academics/teaching/lesson-planning", icon: CalendarPlus, desc: "Weekly plans" },
  { name: "Assignments", href: "/dashboard/academics/teaching/assignments", icon: PenTool, desc: "Homework & projects" },
  { name: "Records", href: "/dashboard/academics/teaching/records", icon: ClipboardList, desc: "Teaching logs & progress" }
];

export default function TeachingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [stats, setStats] = useState([
    { label: "Total Teachers", value: "...", sub: "Fully active", color: "from-primary-800 to-primary-900" },
    { label: "Plans Approved", value: "...", sub: "This week", color: "from-emerald-600 to-teal-700" },
    { label: "Avg Workload", value: "...", sub: "Lessons/week", color: "from-amber-500 to-orange-600" },
    { label: "Syllabus Covered", value: "...", sub: "Term average", color: "from-slate-600 to-slate-800" },
  ]);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getTeachingLayoutStats();
        setStats([
          { label: "Total Teachers", value: data.totalTeachers.toString(), sub: "Fully active", color: "from-primary-800 to-primary-900" },
          { label: "Plans Approved", value: "0%", sub: "This week", color: "from-emerald-600 to-teal-700" },
          { label: "Avg Workload", value: data.avgWorkload.toString(), sub: "Lessons/week", color: "from-amber-500 to-orange-600" },
          { label: "Syllabus Covered", value: "0%", sub: "Term average", color: "from-slate-600 to-slate-800" },
        ]);
      } catch (err) {
        console.error("Failed to load teaching stats", err);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-5 pb-16">
      {/* ── Hero Banner ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 shadow-2xl shadow-primary-900/40">
        {/* Decorative orbs */}
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-secondary-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-36 h-36 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute top-4 left-1/2 w-24 h-24 rounded-full bg-secondary-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-secondary-500 rounded-xl flex items-center justify-center shadow-md">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-black text-white/60 uppercase tracking-widest">Academics</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Teaching & Planning</h1>
            <p className="text-sm text-white/60 font-medium mt-1">Allocate subjects, manage lesson plans, and track teaching records.</p>
          </div>

          {/* Live stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {stats.map(s => (
              <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl px-4 py-3 text-white min-w-[110px]`}>
                <p className="text-xl font-black leading-none">{s.value}</p>
                <p className="text-[10px] font-black text-white/70 mt-1 leading-tight">{s.label}</p>
                <p className="text-[9px] text-white/50 font-bold">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA buttons row */}
        <div className="relative z-10 px-6 pb-4 flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-black text-white bg-secondary-500 hover:bg-secondary-600 rounded-xl shadow-md shadow-secondary-500/30 hover:-translate-y-0.5 transition-all">
            <Plus className="w-3.5 h-3.5" /> Quick Allocation
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-black text-white/80 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all">
            <Download className="w-3.5 h-3.5" /> Export Schedule
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