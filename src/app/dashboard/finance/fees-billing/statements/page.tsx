"use client";

import React from "react";
import { FileSpreadsheet } from "lucide-react";

export default function StatementsPage() {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-8 text-center">
      <div className="w-20 h-20 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
        <FileSpreadsheet className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-black text-slate-800 mb-2">Statement of Account</h3>
      <p className="text-sm text-slate-500 font-medium max-w-md mx-auto mb-6">Generate and print detailed transactional statements for students over a specific date range.</p>
      <div className="flex justify-center gap-3">
         <button className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
            Single Student
         </button>
         <button className="inline-flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-sm transition-all shadow-md">
            Batch Generate Class
         </button>
      </div>
    </div>
  );
}
