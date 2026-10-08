import React from "react";
import { Package, ShieldAlert, AlertTriangle, List } from "lucide-react";
import { getFoodInventory, getFoodInventoryStats } from "./actions";
import FoodInventoryClient from "./FoodInventoryClient";

export default async function FoodInventoryPage() {
  const [items, stats] = await Promise.all([getFoodInventory(), getFoodInventoryStats()]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Package className="w-6 h-6" /></div>
          <div><p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Items</p><h3 className="text-2xl font-black text-slate-800">{stats.totalItems}</h3></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><List className="w-6 h-6" /></div>
          <div><p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Categories</p><h3 className="text-2xl font-black text-slate-800">{stats.categories}</h3></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><AlertTriangle className="w-6 h-6" /></div>
          <div><p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Low Stock</p><h3 className="text-2xl font-black text-slate-800">{stats.lowStock}</h3></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><ShieldAlert className="w-6 h-6" /></div>
          <div><p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Out of Stock</p><h3 className="text-2xl font-black text-slate-800">{stats.outOfStock}</h3></div>
        </div>
      </div>
      <FoodInventoryClient initialItems={items} />
    </div>
  );
}
