import React from "react";
import { Stethoscope, HeartPulse, ShieldAlert, Package } from "lucide-react";
import { getClinicInventory, getClinicStats } from "./actions";
import ClinicClient from "./components/ClinicClient";

export default async function ClinicPage() {
  const [items, stats] = await Promise.all([
    getClinicInventory(),
    getClinicStats(),
  ]);

  const totalItems = items.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
              Total Stock
            </p>
            <h3 className="text-2xl font-black text-slate-800">
              {stats.totalStock}
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              {totalItems} item{totalItems !== 1 ? "s" : ""} tracked
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
              Low Stock Alerts
            </p>
            <h3 className="text-2xl font-black text-slate-800">
              {stats.lowStockItems}
            </h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
              Out of Stock
            </p>
            <h3 className="text-2xl font-black text-slate-800">
              {stats.outOfStockItems}
            </h3>
          </div>
        </div>
      </div>

      <ClinicClient initialItems={items} />
    </div>
  );
}
