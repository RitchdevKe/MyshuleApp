import React from "react";
import { Plus, MonitorSmartphone, Car, Building, MoreHorizontal, Settings2, Box, Activity, CheckCircle2, Wrench } from "lucide-react";
import prisma from "@/lib/prisma";
import RegisterAssetModal from "./RegisterAssetModal";

// Helper function to pick icon based on category
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Motor Vehicles":
      return Car;
    case "Computers & IT":
      return MonitorSmartphone;
    case "Buildings":
      return Building;
    case "Library":
      return Settings2;
    default:
      return Box;
  }
};

export default async function FixedAssetsPage() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    return <div>No tenant found. Please set up a tenant first.</div>;
  }

  const assets = await prisma.asset.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "desc" },
  });

  const totalAssets = assets.length;
  const totalValue = assets.reduce((sum, asset) => sum + asset.purchaseCost, 0);
  const activeAssets = assets.filter(a => a.status === 'ACTIVE').length;
  const maintenanceAssets = assets.filter(a => a.status === 'MAINTENANCE').length;

  return (
    <div className="space-y-6">
      <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/40 p-5 rounded-2xl border border-white/60 backdrop-blur-md shadow-sm">
         <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Asset Register</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Track school assets and automated depreciation.</p>
         </div>
         <RegisterAssetModal />
      </div>

      {/* Top Cards for Aggregated Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Assets</p>
              <h3 className="text-2xl font-black text-slate-800">{totalAssets}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Value (KSh)</p>
              <h3 className="text-2xl font-black text-slate-800">{totalValue.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Active Assets</p>
              <h3 className="text-2xl font-black text-slate-800">{activeAssets}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">In Maintenance</p>
              <h3 className="text-2xl font-black text-slate-800">{maintenanceAssets}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {assets.length === 0 ? (
           <div className="col-span-full py-12 text-center text-slate-500 font-medium bg-white/40 rounded-2xl border border-dashed border-slate-300">
             No assets registered yet. Click "Register Asset" to add one.
           </div>
         ) : assets.map((asset) => {
            const Icon = getCategoryIcon(asset.category);
            return (
              <div key={asset.id} className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group cursor-pointer">
                 <button className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-primary-900 bg-white/50 hover:bg-white rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-5 h-5" />
                 </button>
                 
                 <div className="w-12 h-12 bg-primary-50 text-primary-900 rounded-2xl flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                 </div>
                 
                 <div className="mb-6">
                   <h3 className="font-black text-slate-800 mb-1 leading-tight">{asset.name}</h3>
                   <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{asset.category}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span className="text-xs font-bold text-slate-400">{asset.assetTag}</span>
                   </div>
                 </div>
                 
                 <div className="space-y-3 pt-4 border-t border-slate-100/80">
                    <div className="flex justify-between items-center text-sm">
                       <span className="font-semibold text-slate-500">Net Book Value</span>
                       <span className="font-black text-slate-800">KSh {asset.purchaseCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="font-semibold text-slate-500">Status</span>
                       <span className={`font-bold px-2 py-0.5 rounded text-xs \${asset.status === 'ACTIVE' ? 'text-primary-600 bg-primary-50' : asset.status === 'MAINTENANCE' ? 'text-orange-600 bg-orange-50' : 'text-slate-600 bg-slate-50'}`}>
                         {asset.status}
                       </span>
                    </div>
                 </div>
              </div>
            );
         })}
      </div>
    </div>
  );
}
