"use client";

import React from "react";
import { HardDrive, Users, MessageSquare, Cloud, AlertCircle, ArrowUpRight, FileText } from "lucide-react";

interface UsageStats {
  studentCount: number;
  staffCount: number;
  invoiceCount: number;
}

interface UsageClientProps {
  stats: UsageStats;
}

export default function UsageClient({ stats }: UsageClientProps) {
  const metrics = [
    {
      title: "Student Profiles",
      icon: Users,
      used: stats.studentCount,
      limit: 2000,
      unit: "students",
      color: "bg-primary-500",
      alert: false,
    },
    {
      title: "Staff Profiles",
      icon: Users,
      used: stats.staffCount,
      limit: 200,
      unit: "staff",
      color: "bg-emerald-500",
      alert: false,
    },
    {
      title: "Invoices Generated",
      icon: FileText,
      used: stats.invoiceCount,
      limit: 5000,
      unit: "invoices",
      color: "bg-amber-500",
      alert: stats.invoiceCount > 4500,
      alertText: `Only ${5000 - stats.invoiceCount} invoices remaining`
    },
    {
      title: "Cloud Storage",
      icon: Cloud,
      used: 0,
      limit: 50,
      unit: "GB (Not tracked)",
      color: "bg-indigo-500",
      alert: false,
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[500px] p-6 space-y-8">
      
      <div>
         <h2 className="text-xl font-black text-slate-800 mb-2">Usage & Quotas</h2>
         <p className="text-sm font-medium text-slate-500">Track your current billing cycle usage against your plan limits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {metrics.map((metric, idx) => {
            const percentage = Math.min(100, (metric.used / metric.limit) * 100);
            const Icon = metric.icon;
            
            return (
               <div key={idx} className={`bg-white border p-6 rounded-2xl shadow-sm transition-all ${metric.alert ? 'border-amber-200 bg-amber-50/10' : 'border-slate-200/60'}`}>
                  <div className="flex justify-between items-start mb-6">
                     <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl bg-slate-50 text-slate-500`}>
                           <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-800">{metric.title}</h3>
                     </div>
                     {metric.alert && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">
                           <AlertCircle className="w-3.5 h-3.5" />
                           Low Quota
                        </div>
                     )}
                  </div>
                  
                  <div className="mb-2 flex justify-between items-end">
                     <div className="text-3xl font-black text-slate-800">
                        {metric.used.toLocaleString()} <span className="text-sm font-bold text-slate-400">/ {metric.limit.toLocaleString()} {metric.unit}</span>
                     </div>
                     <div className="text-sm font-bold text-slate-500">
                        {percentage.toFixed(1)}%
                     </div>
                  </div>
                  
                  <div className="w-full bg-slate-100 rounded-full h-3 mb-4">
                     <div className={`${metric.color} h-3 rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
                  </div>
                  
                  {metric.alert ? (
                     <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                        <span className="text-xs font-bold text-amber-600">{metric.alertText}</span>
                        <button className="flex items-center gap-1 text-xs font-bold text-white bg-primary-900 hover:bg-primary-800 px-3 py-1.5 rounded-lg transition-colors">
                           Top Up <ArrowUpRight className="w-3 h-3" />
                        </button>
                     </div>
                  ) : (
                     <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 opacity-0 pointer-events-none select-none">
                        {/* Placeholder for alignment */}
                        <span className="text-xs">Placeholder</span>
                     </div>
                  )}
               </div>
            );
         })}
      </div>
    </div>
  );
}
