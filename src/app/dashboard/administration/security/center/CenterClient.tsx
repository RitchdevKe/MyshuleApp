"use client";

import React from "react";
import { ShieldCheck, AlertCircle } from "lucide-react";

export default function CenterClient({ overview, sessions }: { overview: any, sessions: any[] }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden p-6 space-y-6">
      
      {/* Security Score Widget */}
      <div className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2">Tenant Security Health</h3>
          <div className="flex items-center gap-4">
            <div className={`text-5xl font-black ${overview.score >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {overview.score}%
            </div>
            <div className="text-sm font-bold text-slate-500">
              {overview.score >= 80 ? 'Your tenant is secure.' : 'Security improvements needed.'} <br/> 
              {overview.issues} issues detected.
            </div>
          </div>
        </div>
        <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-12 h-12 text-emerald-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Security Checklist */}
        <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Security Checklist</h3>
          <div className="space-y-3">
            <div className={`flex items-center gap-3 p-3 bg-white border ${overview.mfaEnabled ? 'border-emerald-100' : 'border-amber-200 shadow-sm shadow-amber-500/10'} rounded-xl`}>
              <div className={`w-5 h-5 rounded-full ${overview.mfaEnabled ? 'bg-emerald-500' : 'bg-amber-500'} flex items-center justify-center text-white shrink-0`}>
                {overview.mfaEnabled ? '✓' : '!'}
              </div>
              <span className="text-sm font-bold text-slate-700">MFA enabled for Administrators</span>
            </div>
            <div className={`flex items-center gap-3 p-3 bg-white border ${overview.backupHealthy ? 'border-emerald-100' : 'border-amber-200 shadow-sm shadow-amber-500/10'} rounded-xl`}>
              <div className={`w-5 h-5 rounded-full ${overview.backupHealthy ? 'bg-emerald-500' : 'bg-amber-500'} flex items-center justify-center text-white shrink-0`}>
                {overview.backupHealthy ? '✓' : '!'}
              </div>
              <span className="text-sm font-bold text-slate-700">System backup is healthy</span>
            </div>
          </div>
        </div>

        {/* Active Sessions Overview */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Active Sessions (Admins)</h3>
          </div>
          
          <div className="space-y-4">
            {sessions.length === 0 ? (
              <div className="text-sm text-slate-500">No active sessions tracking available</div>
            ) : (
              sessions.map((sess, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-start">
                  <div>
                    <div className="font-bold text-sm text-slate-800">{sess.user?.email || 'Unknown User'}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{sess.ipAddress || 'Unknown IP'}</div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-primary-500 mt-1">{new Date(sess.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
