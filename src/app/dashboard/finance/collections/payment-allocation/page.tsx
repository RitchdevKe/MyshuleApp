"use client";

import React from "react";
import { SplitSquareHorizontal } from "lucide-react";

export default function PaymentAllocationPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-amber-200/80 shadow-sm p-8 flex flex-col items-center justify-center text-center">
         <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
           <SplitSquareHorizontal className="w-10 h-10" />
         </div>
         <h3 className="text-2xl font-black text-slate-800 mb-2">Unallocated Funds</h3>
         <p className="text-4xl font-black text-amber-500 mb-6">KSh 50,000</p>
         <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto mb-6">These are payments received via Bank or M-Pesa Paybill that could not be automatically matched to a student invoice.</p>
      </div>
      
      <div className="bg-gradient-to-br from-white to-slate-50/80 rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
         <div className="p-5 border-b border-slate-100 bg-white/40">
            <h3 className="font-bold text-slate-800">Pending Allocations (Manual Match Required)</h3>
         </div>
         <div className="p-4 space-y-4">
            {[
               { date: "Oct 12", ref: "KCB-9876", amount: "45,000", likelyMatch: "Jane Smith (92%)" },
               { date: "Oct 13", ref: "RKT987654", amount: "5,000", likelyMatch: "Unknown" }
            ].map((item, i) => (
               <div key={i} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-primary-200 transition-colors">
                  <div>
                     <p className="font-bold text-slate-800">KSh {item.amount} <span className="text-slate-400 font-medium text-sm ml-2">{item.ref}</span></p>
                     <p className="text-xs font-semibold text-slate-500 mt-1">Received {item.date} • Match: <span className={item.likelyMatch !== 'Unknown' ? 'text-primary-900' : 'text-rose-500'}>{item.likelyMatch}</span></p>
                  </div>
                  <button className="px-4 py-2 bg-slate-100 hover:bg-primary-50 hover:text-primary-900 text-slate-600 font-bold text-sm rounded-xl transition-colors">
                     Allocate
                  </button>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
