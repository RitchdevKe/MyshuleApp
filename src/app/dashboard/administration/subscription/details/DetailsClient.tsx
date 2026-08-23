"use client";

import React from "react";
import { CreditCard, CheckCircle2, Shield, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export default function DetailsClient({ tenant }: { tenant: any }) {
  const activeSubs = tenant.subscriptions.filter((s: any) => s.status === 'ACTIVE');
  const planName = tenant?.subscriptionPlan || "Free";
  const statusColor = planName !== "Free" ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50";

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold bg-secondary-100 text-secondary-700">
              <Shield className="w-4 h-4" />
              Current Plan
            </div>
            <h2 className="text-3xl font-black text-slate-800">{planName} Plan</h2>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                {planName !== "Free" ? 'Active' : 'Basic'}
              </span>
              <span className="text-sm font-medium text-slate-500">
                Tenant: {tenant.name} ({tenant.domainPrefix})
              </span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 min-w-[250px]">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Next Billing</h4>
            <div className="text-2xl font-black text-slate-800 mb-1">
              {planName === "Professional" ? "$49.99" : planName === "Business" ? "$199.99" : planName === "Enterprise" ? "Custom" : "$0.00"}
            </div>
            <p className="text-sm font-medium text-slate-500 mb-3">Renews on Oct 1, 2026</p>
            <button className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm cursor-not-allowed opacity-50">
              Manage Billing
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm p-6 sm:p-8">
          <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-secondary-500" />
            Active Modules
          </h3>
          {tenant.subscriptions.length > 0 ? (
            <ul className="space-y-3">
              {tenant.subscriptions.map((sub: any) => (
                <li key={sub.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <div>
                      <div className="text-sm font-bold text-slate-700">{sub.module.name}</div>
                      <div className="text-xs font-medium text-slate-500">
                        {sub.validUntil ? `Valid until ${format(new Date(sub.validUntil), 'MMM d, yyyy')}` : 'Lifetime access'}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                    {sub.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 text-center text-amber-800 flex flex-col items-center">
              <AlertTriangle className="w-8 h-8 mb-2 text-amber-500" />
              <div className="font-bold">No active subscriptions</div>
              <div className="text-sm font-medium mt-1">Upgrade your plan to access premium modules.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
