"use client";

import React from "react";
import { ShoppingCart, Package, AlertTriangle, ArrowDownToLine, Filter, Search, Plus } from "lucide-react";

export default function InventoryPage() {
  const items = [
    { name: "Maize Flour", category: "Dry Goods", stock: "450 kg", minStock: "200 kg", status: "Healthy", color: "text-emerald-600", bg: "bg-emerald-100", cost: "$0.80/kg" },
    { name: "Cooking Oil", category: "Liquids", stock: "15 L", minStock: "50 L", status: "Low Stock", color: "text-rose-600", bg: "bg-rose-100", cost: "$2.50/L" },
    { name: "Rice (Grade 1)", category: "Dry Goods", stock: "820 kg", minStock: "300 kg", status: "Healthy", color: "text-emerald-600", bg: "bg-emerald-100", cost: "$1.10/kg" },
    { name: "Beans", category: "Dry Goods", stock: "120 kg", minStock: "150 kg", status: "Reorder", color: "text-amber-600", bg: "bg-amber-100", cost: "$0.90/kg" },
  ];

  const inventoryTable = [
    { id: "INV-001", name: "Maize Flour", type: "Dry Goods", stock: "450 kg", reorderLevel: "200 kg", unitCost: "$0.80", status: "Healthy" },
    { id: "INV-002", name: "Cooking Oil", type: "Liquids", stock: "15 L", reorderLevel: "50 L", unitCost: "$2.50", status: "Critical" },
    { id: "INV-003", name: "Rice (Grade 1)", type: "Dry Goods", stock: "820 kg", reorderLevel: "300 kg", unitCost: "$1.10", status: "Healthy" },
    { id: "INV-004", name: "Beans", type: "Dry Goods", stock: "120 kg", reorderLevel: "150 kg", unitCost: "$0.90", status: "Warning" },
    { id: "INV-005", name: "Sugar", type: "Dry Goods", stock: "180 kg", reorderLevel: "100 kg", unitCost: "$1.20", status: "Healthy" },
    { id: "INV-006", name: "Salt", type: "Dry Goods", stock: "45 kg", reorderLevel: "20 kg", unitCost: "$0.30", status: "Healthy" },
    { id: "INV-007", name: "Tomatoes", type: "Perishables", stock: "25 kg", reorderLevel: "30 kg", unitCost: "$0.50", status: "Warning" },
    { id: "INV-008", name: "Onions", type: "Perishables", stock: "40 kg", reorderLevel: "30 kg", unitCost: "$0.60", status: "Healthy" },
  ];

  return (
    <div className="p-6 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Food Inventory</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Track perishables, dry goods, and trigger reorders.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <ArrowDownToLine className="w-4 h-4" /> Export
          </button>
          <button className="px-5 py-2.5 bg-primary-900 text-white font-bold rounded-xl hover:bg-primary-800 transition-colors shadow-sm flex items-center gap-2 justify-center">
            <ShoppingCart className="w-4 h-4" /> Purchase Order
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center shadow-inner`}>
                <Package className="w-5 h-5" />
              </div>
              {item.status !== 'Healthy' && (
                <AlertTriangle className={`w-5 h-5 ${item.color} animate-pulse`} />
              )}
            </div>
            <p className="text-slate-500 font-bold text-xs mb-1">{item.name}</p>
            <p className="text-xl font-black text-slate-800">{item.stock}</p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Min: {item.minStock}</span>
               <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${item.bg} ${item.color}`}>
                  {item.status}
               </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Table */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden flex flex-col">
         {/* Toolbar */}
         <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            <div className="relative max-w-sm w-full">
               <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
               <input 
                  type="text"
                  placeholder="Search inventory..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-all shadow-sm"
               />
            </div>
            <div className="flex gap-2">
               <button className="p-2 bg-white text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
                  <Filter className="w-4 h-4" />
               </button>
               <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors shadow-sm">
                  <Plus className="w-4 h-4" /> Add Item
               </button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Item ID</th>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Category</th>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Current Stock</th>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Reorder Level</th>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Unit Cost</th>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {inventoryTable.map((item, i) => (
                     <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 text-xs font-bold text-slate-400 font-mono">{item.id}</td>
                        <td className="p-4 font-bold text-slate-800 text-sm">{item.name}</td>
                        <td className="p-4 text-sm font-medium text-slate-600">{item.type}</td>
                        <td className="p-4 font-black text-slate-800 text-sm">{item.stock}</td>
                        <td className="p-4 text-sm font-medium text-slate-500">{item.reorderLevel}</td>
                        <td className="p-4 text-sm font-medium text-slate-500">{item.unitCost}</td>
                        <td className="p-4">
                           <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                              item.status === 'Healthy' ? 'bg-emerald-100 text-emerald-700' :
                              item.status === 'Warning' ? 'bg-amber-100 text-amber-700' :
                              'bg-rose-100 text-rose-700'
                           }`}>
                              {item.status}
                           </span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-sm">
            <span className="text-slate-500 font-medium">Showing 8 of 145 items</span>
            <div className="flex gap-1">
               <button className="px-3 py-1 bg-white border border-slate-200 rounded-md text-slate-600 font-medium hover:bg-slate-50">Prev</button>
               <button className="px-3 py-1 bg-primary-900 text-white rounded-md font-medium">1</button>
               <button className="px-3 py-1 bg-white border border-slate-200 rounded-md text-slate-600 font-medium hover:bg-slate-50">2</button>
               <button className="px-3 py-1 bg-white border border-slate-200 rounded-md text-slate-600 font-medium hover:bg-slate-50">3</button>
               <button className="px-3 py-1 bg-white border border-slate-200 rounded-md text-slate-600 font-medium hover:bg-slate-50">Next</button>
            </div>
         </div>
      </div>

    </div>
  );
}
