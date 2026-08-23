"use client";

import React, { useState } from "react";
import { CreditCard, Settings, CheckCircle2, AlertTriangle, KeyRound, Plus, Trash2 } from "lucide-react";
import { createPaymentGateway, deletePaymentGateway } from "@/app/actions/finance";

export default function PaymentGatewaysClient({ gateways }: { gateways: any[] }) {
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
     const provider = prompt("Enter provider name (e.g. M-PESA, Stripe, Airtel Money):");
     if (!provider) return;
     const paybill = prompt("Enter Paybill/Till number or Account ID:");
     if (!paybill) return;
     
     setLoading(true);
     await createPaymentGateway({ providerName: provider, paybillNumber: paybill });
     setLoading(false);
  };

  const handleDelete = async (id: string) => {
     if (!confirm("Remove this payment gateway?")) return;
     setLoading(true);
     await deletePaymentGateway(id);
     setLoading(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
               <CreditCard className="w-5 h-5" />
            </div>
            <div>
               <h3 className="text-xl font-black text-slate-800">Payment Gateways</h3>
               <p className="text-sm font-medium text-slate-500">Configure integrations with mobile money and card processors.</p>
            </div>
         </div>
         <button 
           onClick={handleCreate}
           disabled={loading}
           className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors disabled:opacity-50"
         >
            <Plus className="w-4 h-4" /> Add Gateway
         </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {gateways.map(g => (
           <div key={g.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full hover:border-emerald-300 transition-colors">
               <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-inner">
                           {g.providerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                           <h4 className="font-black text-slate-800 text-lg">{g.providerName}</h4>
                           <div className="flex items-center gap-1.5 mt-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-xs font-bold text-emerald-600">Connected & Active</span>
                           </div>
                        </div>
                     </div>
                     <button 
                        onClick={() => handleDelete(g.id)}
                        disabled={loading}
                        className="text-red-400 hover:text-red-600 transition-colors"
                     >
                        <Trash2 className="w-5 h-5" />
                     </button>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                     <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500">Paybill / ID</span>
                        <span className="text-sm font-black text-slate-800">{g.paybillNumber}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500">Status</span>
                        <span className="text-sm font-black text-slate-800">{g.isActive ? 'Active' : 'Inactive'}</span>
                     </div>
                  </div>
               </div>
           </div>
        ))}

        {gateways.length === 0 && (
           <div className="col-span-1 md:col-span-2 p-12 text-center text-slate-500 bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
              No payment gateways configured.
           </div>
        )}

      </div>
    </div>
  );
}
