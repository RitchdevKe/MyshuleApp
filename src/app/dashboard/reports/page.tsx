"use client";
import React from "react";
import { GraduationCap, Calculator, Briefcase, Sparkles, Filter, FileText, ArrowRight, Activity, Calendar } from "lucide-react";
import Link from "next/link";

export default function ReportCenterDashboard() {
  const quickReports = [
    { name: "Academic Performance", icon: GraduationCap, color: "text-indigo-600", bg: "bg-indigo-50", href: "/dashboard/reports/academic" },
    { name: "Fee Collection", icon: Calculator, color: "text-emerald-600", bg: "bg-emerald-50", href: "/dashboard/reports/financial" },
    { name: "Attendance", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50", href: "/dashboard/reports/academic" },
    { name: "Enrollment", icon: Activity, color: "text-amber-600", bg: "bg-amber-50", href: "/dashboard/reports/operational" },
    { name: "Staff", icon: Briefcase, color: "text-rose-600", bg: "bg-rose-50", href: "/dashboard/reports/operational" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Universal Filter Bar Component (Visual Mockup for Landing) */}
      <div className="bg-white/80 backdrop-blur-xl border border-white p-4 rounded-2xl shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider mr-2">
          <Filter className="w-4 h-4" /> Global Filter
        </div>
        
        <select className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:border-indigo-500">
          <option>Academic Year: 2026</option>
        </select>
        <select className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:border-indigo-500">
          <option>Term: Term 2</option>
        </select>
        <select className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:border-indigo-500">
          <option>Campus: All</option>
        </select>
        
        <button className="bg-primary-900 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-sm hover:bg-secondary-500 transition-colors ml-auto">
          Apply Filters
        </button>
      </div>

      {/* Header & AI Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Welcome Section */}
        <div className="lg:col-span-2 flex flex-col justify-center bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white/60 backdrop-blur-md shadow-sm">
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
            Report Center
          </h1>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-2 max-w-2xl">
            Good afternoon, Principal. MyShule has analyzed <span className="font-bold text-indigo-600">18,421</span> data points across your tenant today.
          </p>
          
          <div className="flex gap-4 mt-8">
            <Link href="/dashboard/reports/custom" className="bg-primary-900 hover:bg-secondary-500 text-white font-bold py-3 px-6 rounded-xl shadow-sm shadow-primary-900/20 transition-colors flex items-center gap-2">
              <span className="text-xl leading-none">+</span> Create Report
            </Link>
            <Link href="/dashboard/reports/ai" className="bg-white/80 backdrop-blur-xl border border-primary-200 text-primary-900 font-bold py-3 px-6 rounded-xl shadow-sm hover:bg-secondary-500 hover:text-white transition-colors flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-500 group-hover:text-white" /> Ask MyShule
            </Link>
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="lg:col-span-1 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 p-4">
            <Sparkles className="w-32 h-32" />
          </div>
          
          <h3 className="text-xs font-black text-indigo-300 uppercase tracking-wider mb-6 flex items-center gap-2 relative z-10">
            <Sparkles className="w-4 h-4" /> AI Insights
          </h3>
          
          <div className="space-y-4 relative z-10">
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0 text-rose-400 font-bold text-xs">!</div>
              <p className="text-sm text-slate-200"><strong className="text-white">Grade 8 Math</strong> performance dropped 8.4% this term.</p>
            </div>
            
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 font-bold text-xs">!</div>
              <p className="text-sm text-slate-200"><strong className="text-white">Fee collection</strong> is 11% below the expected monthly target.</p>
            </div>
            
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400 font-bold text-xs">i</div>
              <p className="text-sm text-slate-200"><strong className="text-white">17 students</strong> show combined declining attendance and grades.</p>
            </div>
          </div>
          
          <button className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-colors border border-white/10 relative z-10">
            Investigate Findings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Quick Reports */}
        <div className="md:col-span-1 bg-white/80 border border-slate-200/80 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6">Quick Reports</h3>
          <div className="space-y-3">
            {quickReports.map((report, idx) => (
              <Link key={idx} href={report.href} className="flex items-center justify-between p-3 bg-white/80 backdrop-blur-xl border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:border-primary-100 hover:bg-secondary-50 transition-all group">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${report.bg} ${report.color}`}>
                    <report.icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-700 text-sm group-hover:text-primary-900 transition-colors">{report.name}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-secondary-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Favourites & Recent */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-amber-900 uppercase tracking-wider mb-6 flex items-center gap-2">
              Favourites
            </h3>
            <div className="space-y-3">
              {[
                { name: "Principal Weekly Dashboard", type: "Custom Dashboard" },
                { name: "Fee Arrears by Grade", type: "Financial Report" },
                { name: "Grade 8 Performance Tracker", type: "Academic Report" },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-white/80 backdrop-blur-xl border border-amber-100/60 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-slate-800 text-sm mb-1">{item.name}</h4>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">{item.type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50/50 border border-slate-200/60 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
              Recent Reports
            </h3>
            <div className="space-y-3">
              {[
                { name: "Term 2 Academic Analysis", date: "Generated 2 hours ago", icon: FileText },
                { name: "Monthly Financial Report", date: "Generated yesterday", icon: FileText },
                { name: "Staff Attendance Report", date: "Generated 3 days ago", icon: FileText },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-white/80 backdrop-blur-xl border border-slate-100 rounded-xl shadow-sm flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                     <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                    <span className="text-[10px] font-medium text-slate-500">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
