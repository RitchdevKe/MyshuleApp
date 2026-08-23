"use client";

import React from "react";
import { CalendarOff, CheckSquare, XSquare } from "lucide-react";

export default function LeaveRequestsPage() {
  return (
    <div className="space-y-6">
       <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
         <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Pending Leave Requests</h3>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">2 Pending</span>
         </div>
         <div className="divide-y divide-slate-100">
            {[
               { name: "Jane Doe", type: "Annual Leave", duration: "3 Days (Oct 28 - Oct 30)", reason: "Personal matters" },
               { name: "John Smith", type: "Sick Leave", duration: "2 Days (Oct 25 - Oct 26)", reason: "Medical appointment" }
            ].map((req, i) => (
               <div key={i} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold shrink-0 mt-1">
                        E{i+1}
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-800">{req.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">{req.type}</span>
                           <span className="text-xs text-slate-500">{req.duration}</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-2">{req.reason}</p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <button className="flex items-center gap-1 px-3 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-sm font-bold transition-colors">
                        <CheckSquare className="w-4 h-4" />
                        Approve
                     </button>
                     <button className="flex items-center gap-1 px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-sm font-bold transition-colors">
                        <XSquare className="w-4 h-4" />
                        Reject
                     </button>
                  </div>
               </div>
            ))}
         </div>
       </div>
    </div>
  );
}
