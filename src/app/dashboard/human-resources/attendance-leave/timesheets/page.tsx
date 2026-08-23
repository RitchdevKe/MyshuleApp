"use client";

import React from "react";
import { FileClock, Plus } from "lucide-react";

export default function TimesheetsPage() {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-8 text-center">
      <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
        <FileClock className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-black text-slate-800 mb-2">Timesheet Management</h3>
      <p className="text-sm text-slate-500 font-medium max-w-md mx-auto mb-6">Review and approve hourly work logs and timesheets before payroll processing.</p>
      <button className="inline-flex items-center gap-2 px-5 py-3 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-primary-900/20">
        <Plus className="w-4 h-4" />
        New Timesheet Entry
      </button>
    </div>
  );
}
