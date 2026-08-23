"use client";

import React, { useState, useTransition } from "react";
import { Settings, Bell, Globe, Languages, Key } from "lucide-react";
import { updateTenantProfile } from "@/app/actions/tenant";
import { useRouter } from "next/navigation";

export default function ConfigurationClient({ tenant, commSettings }: { tenant: any; commSettings: any }) {
  const router = useRouter();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  
  const [dateFormat, setDateFormat] = useState(tenant?.dateFormat || "DD/MM/YYYY");
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      await updateTenantProfile({ dateFormat });
      // Here we would also update CommunicationSettings if we had fields for it
      router.refresh();
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[500px]">
      <div className="p-6 border-b border-slate-200/60 bg-slate-50/50">
         <h2 className="text-xl font-black text-slate-800">Global Configuration</h2>
         <p className="text-sm font-medium text-slate-500 mt-1">Manage system-wide preferences, localization, and feature toggles.</p>
      </div>

      <div className="p-6 space-y-8">
         {/* Localization & Region */}
         <div>
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-400" /> Localization & Region
               </h3>
            </div>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">System Language</label>
                  <div className="relative">
                     <Languages className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                     <select className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-primary-900 focus:ring-1 focus:ring-primary-900 appearance-none">
                        <option>English (US)</option>
                        <option>English (UK)</option>
                        <option>French (FR)</option>
                        <option>Swahili (KE)</option>
                     </select>
                  </div>
               </div>
               <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Date Format</label>
                  <select 
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-primary-900 focus:ring-1 focus:ring-primary-900"
                  >
                     <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                     <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                     <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
               </div>
            </div>
         </div>

         {/* System Notifications */}
         <div>
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Bell className="w-4 h-4 text-slate-400" /> System Notifications
               </h3>
            </div>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-6">
               <div className="flex items-center justify-between">
                  <div>
                     <div className="font-bold text-sm text-slate-800">Email Notifications</div>
                     <div className="text-xs text-slate-500">Allow system to send transactional emails (reports, alerts)</div>
                  </div>
                  <button 
                     onClick={() => setEmailNotifications(!emailNotifications)}
                     className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 ${emailNotifications ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                     <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${emailNotifications ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
               </div>
               <div className="w-full h-px bg-slate-100"></div>
               <div className="flex items-center justify-between">
                  <div>
                     <div className="font-bold text-sm text-slate-800">SMS Notifications</div>
                     <div className="text-xs text-slate-500">Allow system to send critical SMS alerts (Consumes SMS credits)</div>
                  </div>
                  <button 
                     onClick={() => setSmsNotifications(!smsNotifications)}
                     className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 ${smsNotifications ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                     <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${smsNotifications ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
               </div>
            </div>
         </div>

         {/* Advanced Settings */}
         <div>
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Settings className="w-4 h-4 text-slate-400" /> Advanced Settings
               </h3>
            </div>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
               <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                  <div>
                     <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-800">Maintenance Mode</h4>
                        {maintenanceMode && <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-black bg-rose-100 text-rose-700 rounded-lg">Active</span>}
                     </div>
                     <p className="text-xs text-slate-500 font-medium mt-1 max-w-xl">
                        Enabling this will log out all non-admin users and display a maintenance page. Use only during major system updates.
                     </p>
                  </div>
                  <button 
                     onClick={() => setMaintenanceMode(!maintenanceMode)}
                     className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        maintenanceMode 
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20' 
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                     }`}
                  >
                     {maintenanceMode ? 'Disable Maintenance' : 'Enable Maintenance'}
                  </button>
               </div>
            </div>
         </div>

         <div className="flex justify-end pt-4">
            <button 
              onClick={handleSave} 
              disabled={isPending}
              className="bg-primary-900 hover:bg-primary-800 text-white font-bold py-2.5 px-6 rounded-xl transition-colors text-sm shadow-sm shadow-primary-900/20 disabled:opacity-50"
            >
               {isPending ? "Saving..." : "Save Configuration"}
            </button>
         </div>
      </div>
    </div>
  );
}
