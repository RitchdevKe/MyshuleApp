import React from "react";
import { AlertTriangle, TrendingUp, Package, Box, RefreshCcw } from "lucide-react";
import { getInventoryOverviewData } from "./actions";

export default async function InventoryOverviewPage() {
  const data = await getInventoryOverviewData();
  
  const {
    totalValue,
    formattedTotalValue,
    activeSkusCount,
    storesCount,
    lowStockAlertsCount,
    itemsIssuedYtd,
    stockCategories,
    recentAlerts,
  } = data;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
         <h2 className="text-lg font-black text-slate-800">Inventory Dashboard</h2>
         <p className="text-sm font-bold text-slate-500">Real-time overview of organizational stock.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
             <div className="p-2.5 bg-primary-100 text-primary-600 rounded-xl inline-block mb-4">
                <Box className="w-5 h-5" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Stock Value</p>
             <p className="text-3xl font-black text-slate-800">{formattedTotalValue}</p>
             <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Real-time</p>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-amber-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
             <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl inline-block mb-4">
                <Package className="w-5 h-5" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Active SKUs</p>
             <p className="text-3xl font-black text-slate-800">{activeSkusCount}</p>
             <p className="text-xs font-bold text-slate-500 mt-2">Across {storesCount} locations</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-rose-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
             <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl inline-block mb-4">
                <AlertTriangle className="w-5 h-5" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Low Stock Alerts</p>
             <p className="text-3xl font-black text-rose-600">{lowStockAlertsCount}</p>
             <p className="text-xs font-bold text-rose-600 mt-2">Requires immediate attention</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
             <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl inline-block mb-4">
                <RefreshCcw className="w-5 h-5" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Items Issued YTD</p>
             <p className="text-3xl font-black text-slate-800">{itemsIssuedYtd}</p>
             <p className="text-xs font-bold text-slate-500 mt-2">High turnover velocity</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Value by Category */}
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 mb-6">Stock Value by Category</h3>
            <div className="space-y-6">
               {stockCategories.length === 0 ? (
                 <p className="text-sm font-medium text-slate-500">No stock data available.</p>
               ) : (
                 stockCategories.map((cat, index) => (
                    <div key={index}>
                       <div className="flex justify-between items-end mb-2">
                          <span className="text-sm font-bold text-slate-700">{cat.name}</span>
                          <div className="text-right">
                             <span className="text-sm font-black text-slate-800">{cat.formattedValue}</span>
                             <span className="text-xs font-medium text-slate-400 ml-2">({cat.percent}%)</span>
                          </div>
                       </div>
                       <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.percent}%` }}></div>
                       </div>
                    </div>
                 ))
               )}
            </div>
         </div>

         {/* Critical Alerts */}
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-200/60 bg-rose-50/30 flex justify-between items-center">
               <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                  Critical Stock Alerts
               </h3>
               {lowStockAlertsCount > 0 && (
                 <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-1 rounded-md">Action Needed</span>
               )}
            </div>
            
            <div className="divide-y divide-slate-100 flex-grow">
               {recentAlerts.length === 0 ? (
                 <div className="p-4 text-sm font-medium text-slate-500 text-center">No critical stock alerts.</div>
               ) : (
                 recentAlerts.map((alert) => (
                    <div key={alert.id} className="p-4 hover:bg-slate-50/50 transition-colors flex items-center justify-between">
                       <div>
                          <p className="font-bold text-slate-800 text-sm">{alert.item}</p>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">Threshold: {alert.threshold} | Current: <span className="font-bold text-rose-600">{alert.qty}</span></p>
                       </div>
                       <div className="text-right">
                          <span className={`inline-block px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded-md mb-1 ${
                             alert.status === 'Out of Stock' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                             {alert.status}
                          </span>
                          <p className="text-[10px] font-bold text-slate-400">{alert.time}</p>
                       </div>
                    </div>
                 ))
               )}
            </div>
            {recentAlerts.length > 0 && (
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
                 <button className="text-sm font-bold text-primary-600 hover:text-primary-800 transition-colors">
                    View All Alerts →
                 </button>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
