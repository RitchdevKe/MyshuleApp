import React from "react";
import { ShieldAlert } from "lucide-react";
import { getDebtStats } from "./actions";
import DebtRecoveryActions from "./DebtRecoveryActions";

// Function to format KSh currency compactly (e.g., 1.2M, 400K)
function formatCurrency(amount: number) {
  if (amount >= 1000000) {
    return `KSh ${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `KSh ${(amount / 1000).toFixed(0)}K`;
  }
  return `KSh ${amount.toFixed(0)}`;
}

export default async function DebtCollectionPage() {
  const stats = await getDebtStats();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {/* Aging Buckets */}
         <div className="bg-rose-50/50 backdrop-blur-md p-5 rounded-3xl border border-rose-100 shadow-sm">
            <p className="text-xs font-black text-rose-500 uppercase tracking-wider mb-1">Total Arrears</p>
            <p className="text-2xl font-black text-rose-700">{formatCurrency(stats.totalArrears)}</p>
         </div>
         <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-slate-200/80 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">0 - 30 Days</p>
            <p className="text-2xl font-black text-slate-800">{formatCurrency(stats.zeroToThirty)}</p>
         </div>
         <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-slate-200/80 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">31 - 60 Days</p>
            <p className="text-2xl font-black text-slate-800">{formatCurrency(stats.thirtyOneToSixty)}</p>
         </div>
         <div className="bg-rose-600 backdrop-blur-md p-5 rounded-3xl border border-rose-500 shadow-sm text-white">
            <div className="flex justify-between items-start">
               <div>
                  <p className="text-xs font-bold text-rose-200 uppercase tracking-wider mb-1">90+ Days (Critical)</p>
                  <p className="text-2xl font-black">{formatCurrency(stats.ninetyPlus)}</p>
               </div>
               <ShieldAlert className="w-6 h-6 text-rose-300 opacity-50" />
            </div>
         </div>
      </div>

      <DebtRecoveryActions />
    </div>
  );
}
