import React from "react";
import { SplitSquareHorizontal } from "lucide-react";
import { getUnallocatedPayments } from "./actions";
import AllocationList from "./AllocationList";

export default async function PaymentAllocationPage() {
  const { payments, totalUnallocated } = await getUnallocatedPayments();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-amber-200/80 shadow-sm p-8 flex flex-col items-center justify-center text-center">
         <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
           <SplitSquareHorizontal className="w-10 h-10" />
         </div>
         <h3 className="text-2xl font-black text-slate-800 mb-2">Unallocated Funds</h3>
         <p className="text-4xl font-black text-amber-500 mb-6">KSh {totalUnallocated.toLocaleString()}</p>
         <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto mb-6">These are payments received via Bank or M-Pesa Paybill that could not be automatically matched to a student invoice.</p>
      </div>
      
      <div className="bg-gradient-to-br from-white to-slate-50/80 rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-full max-h-[600px]">
         <div className="p-5 border-b border-slate-100 bg-white/40 sticky top-0 z-10">
            <h3 className="font-bold text-slate-800">Pending Allocations (Manual Match Required)</h3>
         </div>
         <div className="p-4 overflow-y-auto flex-1">
            <AllocationList payments={payments} />
         </div>
      </div>
    </div>
  );
}
