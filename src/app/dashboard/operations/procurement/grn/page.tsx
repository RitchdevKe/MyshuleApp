"use client";

import React from "react";
import { Truck, Search, Filter, CheckCircle2, AlertTriangle, FileBox, FilePlus } from "lucide-react";

export default function GoodsReceivedPage() {
  const grnRecords = [
    { grnId: "GRN-2024-8842", poNumber: "PO-24-5091", supplier: "Office Max Supplies", dateReceived: "Aug 11, 2024", receivedBy: "Jane Doe", warehouse: "Main HQ Storage", status: "Complete Match", discrepancy: null },
    { grnId: "GRN-2024-8841", poNumber: "PO-24-5090", supplier: "EduTech Global", dateReceived: "Aug 09, 2024", receivedBy: "David Kim", warehouse: "North Wing IT", status: "Complete Match", discrepancy: null },
    { grnId: "GRN-2024-8840", poNumber: "PO-24-5085", supplier: "TechCorp Solutions", dateReceived: "Aug 08, 2024", receivedBy: "Michael Ochieng", warehouse: "Main HQ Storage", status: "Discrepancy", discrepancy: "Missing 2 items, 1 damaged box." },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hidden md:block">
                 <Truck className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Goods Received Notes (GRN)</h2>
                 <p className="text-sm font-medium text-slate-500">Log and verify incoming shipments against original Purchase Orders.</p>
              </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <FilePlus className="w-4 h-4" />
              Create New GRN
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by GRN, PO, or supplier..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Statuses</option>
                 <option>Complete Match</option>
                 <option>Discrepancy</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 Filter
              </button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">GRN ID & PO Ref</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Supplier</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Received Info</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Verification Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Documents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grnRecords.map((record) => (
                <tr key={record.grnId} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-700 text-sm">{record.grnId}</span>
                    <div className="flex items-center gap-1 mt-0.5">
                       <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded uppercase">{record.poNumber}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-800 text-sm">{record.supplier}</span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-700 text-sm">{record.dateReceived}</p>
                    <p className="text-[10px] font-medium text-slate-500 mt-0.5">By {record.receivedBy} at {record.warehouse}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg w-fit ${
                         record.status === 'Complete Match' ? 'bg-emerald-50 text-emerald-600' : 
                         'bg-rose-50 text-rose-600'
                       }`}>
                         {record.status === 'Complete Match' && <CheckCircle2 className="w-3.5 h-3.5" />}
                         {record.status === 'Discrepancy' && <AlertTriangle className="w-3.5 h-3.5" />}
                         {record.status}
                       </span>
                       {record.discrepancy && (
                          <span className="text-[10px] font-bold text-rose-600 max-w-[200px] leading-tight">
                             Note: {record.discrepancy}
                          </span>
                       )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                     <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="View GRN Document">
                        <FileBox className="w-5 h-5" />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
