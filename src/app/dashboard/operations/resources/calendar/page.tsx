"use client";

import React from "react";
import { Calendar } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg shadow-slate-200/50 overflow-hidden p-12 flex flex-col items-center justify-center text-center min-h-[500px]">
      <div className="w-20 h-20 bg-gradient-to-br from-primary-50 to-primary-100 text-primary-900 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-primary-200/50">
        <Calendar className="w-10 h-10" />
      </div>
      <h3 className="text-2xl font-black text-slate-800 tracking-tight">Resource Calendar</h3>
      <p className="text-base font-medium text-slate-500 max-w-md mt-3">
        The Resource Calendar is currently being built. View all facility and equipment bookings here.
      </p>
      <div className="mt-8 flex gap-4">
        <button className="px-6 py-2.5 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold transition-all shadow-sm shadow-primary-900/20">
          Notify Me
        </button>
        <button className="px-6 py-2.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl font-bold transition-all shadow-sm">
          Learn More
        </button>
      </div>
    </div>
  );
}
