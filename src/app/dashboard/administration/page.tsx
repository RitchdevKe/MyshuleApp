"use client";
import React from "react";
import { Users, Shield, CreditCard, Settings, UserCheck, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function AdministrationDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 p-6 md:p-8 rounded-3xl border border-white/60 backdrop-blur-xl shadow-sm">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
            Administration Control Center
          </h1>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-2 max-w-2xl">
            The central control plane for identity, access, subscriptions, security, and configuration.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black uppercase tracking-wider rounded-xl px-4 py-2.5 shadow-sm flex items-center gap-2">
            <Shield className="w-4 h-4" /> Tenant: Active
          </span>
        </div>
      </div>

      {/* KPI Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/administration/users" className="bg-white/80 border border-slate-200/80 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-center items-center text-center">
          <div className="text-5xl font-black text-indigo-600 group-hover:scale-105 transition-transform">964</div>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Active Users</div>
        </Link>
        
        <Link href="/dashboard/administration/security" className="bg-white/80 border border-slate-200/80 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-center items-center text-center">
          <div className="text-5xl font-black text-emerald-600 group-hover:scale-105 transition-transform">91%</div>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Security Score</div>
        </Link>
        
        <Link href="/dashboard/administration/billing" className="bg-white/80 border border-slate-200/80 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-center items-center text-center">
          <div className="text-5xl font-black text-slate-700 group-hover:scale-105 transition-transform">8</div>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Active Modules</div>
        </Link>
      </div>

      {/* Access Overview & Security Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Security & Access Alerts */}
        <div className="lg:col-span-1 bg-rose-50/50 border border-rose-100 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-black text-rose-800 uppercase tracking-wider mb-6 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" /> Security & Access Alerts
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white border border-rose-100 rounded-xl shadow-sm">
              <span className="text-sm font-bold text-slate-700">Dormant Accounts</span>
              <span className="text-xs font-black bg-rose-100 text-rose-700 px-2 py-1 rounded-md">7</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white border border-amber-100 rounded-xl shadow-sm">
              <span className="text-sm font-bold text-slate-700">Pending Access Requests</span>
              <span className="text-xs font-black bg-amber-100 text-amber-700 px-2 py-1 rounded-md">4</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white border border-amber-100 rounded-xl shadow-sm">
              <span className="text-sm font-bold text-slate-700">Weak Access Policies</span>
              <span className="text-xs font-black bg-amber-100 text-amber-700 px-2 py-1 rounded-md">3</span>
            </div>
          </div>
        </div>

        {/* Subscription Health */}
        <div className="lg:col-span-2 bg-slate-800 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-5 p-4">
            <CreditCard className="w-48 h-48" />
          </div>
          <h3 className="text-sm font-black text-indigo-300 uppercase tracking-wider mb-6 relative z-10 flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Subscription Health: MyShule Business
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-300">Student Capacity</span>
                <span className="text-white">1,842 / 2,000 (92%)</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
                <div className="bg-amber-400 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>

              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-300">Storage Limit</span>
                <span className="text-white">68%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="text-sm font-bold text-slate-400 mb-1">Next Renewal</div>
              <div className="text-2xl font-black mb-4">31 October 2026</div>
              <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-xl transition-colors text-sm w-full md:w-auto">
                Manage Billing
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
