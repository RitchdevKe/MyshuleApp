import React from "react";
import { Package, AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";
import { getInventoryItems } from "./actions";
import ItemsClient from "./components/ItemsClient";

export default async function ItemsPage() {
  const items = await getInventoryItems();

  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + (item.unitCost * item.qty), 0);
  const lowStockItems = items.filter(i => i.status === "Low Stock").length;
  const outOfStockItems = items.filter(i => i.status === "Out of Stock").length;

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total SKUs</p>
            <p className="text-2xl font-black text-slate-800">{totalItems}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Value</p>
            <p className="text-2xl font-black text-slate-800">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalValue)}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Low Stock</p>
            <p className="text-2xl font-black text-slate-800">{lowStockItems}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Out of Stock</p>
            <p className="text-2xl font-black text-slate-800">{outOfStockItems}</p>
          </div>
        </div>
      </div>

      <ItemsClient initialItems={items} />
    </div>
  );
}
