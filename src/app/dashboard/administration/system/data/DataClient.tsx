"use client";

import React, { useTransition } from "react";
import { Database, Upload, Download, Archive, Server, RefreshCw } from "lucide-react";
import { triggerBackup, createExportJob, startImportWizard, archiveData } from "./actions";

export default function DataClient() {
  const [isPending, startTransition] = useTransition();

  const handleAction = (action: () => Promise<any>) => {
    startTransition(async () => {
      const res = await action();
      if (res?.message) {
        alert(res.message);
      }
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[500px]">
      <div className="p-6 border-b border-slate-200/60 bg-slate-50/50">
         <h2 className="text-xl font-black text-slate-800">Data Management</h2>
         <p className="text-sm font-medium text-slate-500 mt-1">Bulk imports, exports, and system backups.</p>
      </div>

      <div className="p-6 space-y-8">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Bulk Import */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:border-primary-300 transition-colors group">
               <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6" />
               </div>
               <h3 className="font-bold text-slate-800 text-lg">Bulk Import</h3>
               <p className="text-sm text-slate-500 font-medium mt-1 mb-6">
                  Upload CSV files to securely mass-import Students, Staff, Parents, or Inventory items into the database.
               </p>
               <button 
                 onClick={() => handleAction(startImportWizard)} 
                 disabled={isPending}
                 className="w-full py-2.5 bg-slate-50 border border-slate-200 hover:bg-primary-900 hover:border-primary-900 hover:text-white text-slate-700 rounded-xl font-bold text-sm transition-all disabled:opacity-50">
                  {isPending ? "Processing..." : "Start Import Wizard"}
               </button>
            </div>

            {/* Bulk Export */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:border-primary-300 transition-colors group">
               <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <Download className="w-6 h-6" />
               </div>
               <h3 className="font-bold text-slate-800 text-lg">Data Export</h3>
               <p className="text-sm text-slate-500 font-medium mt-1 mb-6">
                  Generate CSV or Excel exports of your tabular data for external reporting or custom analysis.
               </p>
               <button 
                 onClick={() => handleAction(createExportJob)} 
                 disabled={isPending}
                 className="w-full py-2.5 bg-slate-50 border border-slate-200 hover:bg-primary-900 hover:border-primary-900 hover:text-white text-slate-700 rounded-xl font-bold text-sm transition-all disabled:opacity-50">
                  {isPending ? "Processing..." : "Create Export Job"}
               </button>
            </div>

            {/* Database Backups */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:border-primary-300 transition-colors group">
               <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                     <Server className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-emerald-100 text-emerald-700">
                     <RefreshCw className="w-3 h-3 animate-spin" /> Auto-Backup Active
                  </span>
               </div>
               <h3 className="font-bold text-slate-800 text-lg">System Backups</h3>
               <p className="text-sm text-slate-500 font-medium mt-1 mb-6">
                  Your data is backed up automatically every 24 hours. You can also trigger a manual backup before major changes.
               </p>
               <button 
                 onClick={() => handleAction(triggerBackup)} 
                 disabled={isPending}
                 className="w-full py-2.5 bg-slate-50 border border-slate-200 hover:bg-primary-900 hover:border-primary-900 hover:text-white text-slate-700 rounded-xl font-bold text-sm transition-all disabled:opacity-50">
                  {isPending ? "Processing..." : "Create Backup"}
               </button>
            </div>

            {/* Data Archiving */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:border-primary-300 transition-colors group">
               <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                  <Archive className="w-6 h-6" />
               </div>
               <h3 className="font-bold text-slate-800 text-lg">Data Archiving</h3>
               <p className="text-sm text-slate-500 font-medium mt-1 mb-6">
                  Archive old academic years or graduated students to keep the active database fast and uncluttered.
               </p>
               <button 
                 onClick={() => handleAction(archiveData)} 
                 disabled={isPending}
                 className="w-full py-2.5 bg-slate-50 border border-slate-200 hover:bg-primary-900 hover:border-primary-900 hover:text-white text-slate-700 rounded-xl font-bold text-sm transition-all disabled:opacity-50">
                  {isPending ? "Processing..." : "Archive Data"}
               </button>
            </div>
            
         </div>

         <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <Database className="w-8 h-8 text-slate-400" />
               <div>
                  <h4 className="font-bold text-slate-800">Storage Usage</h4>
                  <p className="text-xs font-medium text-slate-500">You are currently using 34.5 GB of your 50 GB database limit.</p>
               </div>
            </div>
            <div className="w-64">
               <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-primary-500 h-2 rounded-full" style={{ width: '68%' }}></div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
