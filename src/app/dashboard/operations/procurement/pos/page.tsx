"use client";

import React from "react";
import { ShoppingCart, Search, Filter, Mail, Truck, CheckCircle2, Download, Printer } from "lucide-react";

export default function POsPage() {
  const purchaseOrders = [
    { poNumber: "PO-24-5092", supplier: "TechCorp Solutions", items: 5, total: "$12,500.00", issuedDate: "Aug 11, 2024", expectedDate: "Aug 15, 2024", status: "Sent" },
    { poNumber: "PO-24-5091", supplier: "Office Max Supplies", items: 120, total: "$850.00", issuedDate: "Aug 10, 2024", expectedDate: "Aug 12, 2024", status: "Partially Fulfilled" },
    { poNumber: "PO-24-5090", supplier: "EduTech Global", items: 2, total: "$4,200.00", issuedDate: "Aug 08, 2024", expectedDate: "Aug 10, 2024", status: "Completed" },
    { poNumber: "PO-24-5089", supplier: "Furniture Plus", items: 1, total: "$600.00", issuedDate: "Aug 02, 2024", expectedDate: "Aug 14, 2024", status: "Sent" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hidden md:block">
                 <ShoppingCart className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Purchase Orders (POs)</h2>
                 <p className="text-sm font-medium text-slate-500">Track and manage issued POs to external suppliers.</p>
              </div>
           </div>
           <div className="flex gap-4">
              <div className="text-center px-4 border-r border-slate-200">
                 <p className="text-2xl font-black text-slate-800">8</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active POs</p>
              </div>
              <div className="text-center px-4">
                 <p className="text-2xl font-black text-indigo-600">$42.1k</p>
                 <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Expected Value</p>
              </div>
           </div>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search PO number or supplier..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Statuses</option>
                 <option>Sent</option>
                 <option>Partially Fulfilled</option>
                 <option>Completed</option>
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
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">PO Number</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Supplier</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Total Value</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Delivery Window</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {purchaseOrders.map((po) => (
                <tr key={po.poNumber} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-700 text-sm">{po.poNumber}</span>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">Issued: {po.issuedDate}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-800 text-sm">{po.supplier}</span>
                    <p className="text-[10px] font-bold text-slate-500 mt-0.5">{po.items} Items</p>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="font-black text-slate-800 text-sm">{po.total}</span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-700 text-sm">Exp: {po.expectedDate}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                      po.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
                      po.status === 'Partially Fulfilled' ? 'bg-amber-50 text-amber-600' : 
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {po.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {po.status === 'Partially Fulfilled' && <Truck className="w-3.5 h-3.5" />}
                      {po.status === 'Sent' && <Mail className="w-3.5 h-3.5" />}
                      {po.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Download PDF">
                           <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Print PO">
                           <Printer className="w-4 h-4" />
                        </button>
                     </div>
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
