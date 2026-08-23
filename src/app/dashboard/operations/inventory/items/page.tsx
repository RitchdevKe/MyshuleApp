"use client";

import React from "react";
import { Package, Search, Filter, MoreHorizontal, Plus, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ItemsPage() {
  const items = [
    { sku: "ITM-001", name: "MacBook Pro M3 (14-inch)", category: "IT Equipment", uom: "Pieces", qty: 2, minLevel: 5, value: "$3,499.00", status: "Low Stock" },
    { sku: "ITM-002", name: "Dell UltraSharp 27 Monitor", category: "IT Equipment", uom: "Pieces", qty: 15, minLevel: 5, value: "$450.00", status: "In Stock" },
    { sku: "ITM-003", name: "Ergonomic Office Chair", category: "Office Furniture", uom: "Pieces", qty: 4, minLevel: 10, value: "$250.00", status: "Low Stock" },
    { sku: "ITM-004", name: "A4 Printer Paper (Ream)", category: "Stationery", uom: "Boxes", qty: 0, minLevel: 50, value: "$5.00", status: "Out of Stock" },
    { sku: "ITM-005", name: "Wireless Keyboard & Mouse Combo", category: "IT Equipment", uom: "Sets", qty: 42, minLevel: 15, value: "$65.00", status: "In Stock" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hidden md:block">
                 <Package className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Item Master (SKU Catalog)</h2>
                 <p className="text-sm font-medium text-slate-500">Central database of all trackable inventory items.</p>
              </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Plus className="w-4 h-4" />
              Add New SKU
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by SKU, Name, or Category..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Categories</option>
                 <option>IT Equipment</option>
                 <option>Office Furniture</option>
                 <option>Stationery</option>
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
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">SKU & Item Name</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">In Stock (UoM)</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Unit Value</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.sku} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{item.sku}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium text-slate-600 text-sm">{item.category}</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex flex-col items-end">
                       <span className={`font-black text-sm ${item.qty <= item.minLevel ? 'text-rose-600' : 'text-slate-800'}`}>
                          {item.qty}
                       </span>
                       <span className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{item.uom}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="font-bold text-slate-700 text-sm">{item.value}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                      item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600' : 
                      item.status === 'Out of Stock' ? 'bg-rose-50 text-rose-600' : 
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {item.status === 'In Stock' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {(item.status === 'Out of Stock' || item.status === 'Low Stock') && <AlertCircle className="w-3.5 h-3.5" />}
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                     <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
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
