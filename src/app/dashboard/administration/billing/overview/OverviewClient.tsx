"use client";

import React, { useTransition } from "react";
import { CreditCard, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface OverviewClientProps {
  subscriptions: any[];
  studentCount: number;
  totalModulesCount: number;
  tenant: any;
}

export default function OverviewClient({ subscriptions, studentCount, totalModulesCount, tenant }: OverviewClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const planName = tenant?.subscriptionPlan || "Free";

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden p-6 space-y-6">
      
      {/* Active Plan Widget */}
      <div className="bg-gradient-to-br from-primary-900 to-primary-950 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10">
          <CreditCard className="w-64 h-64 translate-x-12 translate-y-12" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-primary-300 mb-2">Current Plan</div>
            <h2 className="text-4xl font-black mb-2">{planName}</h2>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" /> Active • Renews Oct 31, 2026
            </div>
          </div>
          
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <button className="bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm shadow-secondary-500/20">
              Upgrade Plan
            </button>
            <button className="bg-primary-950/50 hover:bg-primary-900 border border-primary-700 text-primary-200 font-bold py-2.5 px-6 rounded-xl transition-colors">
              Manage Payment Method
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Usage Metrics */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6">Platform Usage</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Student Profiles</span>
                <span>{studentCount} / 2,000</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, (studentCount / 2000) * 100)}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Cloud Storage</span>
                <span className="text-slate-400">Not tracked yet</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3 text-amber-500"/> SMS Credits</span>
                <span className="text-amber-600">Not tracked yet</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Module Marketplace Preview */}
        <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Active Modules</h3>
            <span className="text-xs font-black text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">{subscriptions.length} of {totalModulesCount}</span>
          </div>
          
          <div className="space-y-3">
            {subscriptions.slice(0, 5).map((sub, idx) => (
              <div key={sub.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                <span className="font-bold text-slate-700 text-sm">{sub.module.name}</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Included</span>
              </div>
            ))}
            
            {subscriptions.length === 0 && (
              <div className="text-sm text-slate-500">No active modules found.</div>
            )}
            
            <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm opacity-60 grayscale">
              <span className="font-bold text-slate-500 text-sm flex items-center gap-2">Alumni Network <span className="text-[10px] bg-slate-100 px-1 rounded uppercase">Add-on</span></span>
              <button className="text-[10px] font-black uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-1 rounded hover:bg-primary-100 transition-colors">Activate</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
