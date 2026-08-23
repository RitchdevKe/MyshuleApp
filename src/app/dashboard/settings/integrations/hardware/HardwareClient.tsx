"use client";

import React, { useState } from "react";
import { MonitorSmartphone, Plus, Save, Activity, MapPin, Globe, Fingerprint, Trash2, ShieldCheck, CreditCard } from "lucide-react";
import { createHardwareDevice, deleteHardwareDevice } from "@/app/actions/integrations";
import { HardwareType } from "@prisma/client";

export default function HardwareClient({ devices }: { devices: any[] }) {
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    const name = prompt("Enter device name (e.g. Main Gate Scanner):");
    if (!name) return;
    
    // We'll default to BIOMETRIC_SCANNER for now, the user can edit later in a full implementation
    setLoading(true);
    await createHardwareDevice({
       name,
       type: "BIOMETRIC_SCANNER" as HardwareType,
       location: "Main Gate",
       ipAddress: "192.168.1.100"
    });
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this hardware device?")) return;
    setLoading(true);
    await deleteHardwareDevice(id);
    setLoading(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "BIOMETRIC_SCANNER": return <Fingerprint className="w-5 h-5" />;
      case "RFID_READER": return <CreditCard className="w-5 h-5" />;
      case "SMART_BOARD": return <MonitorSmartphone className="w-5 h-5" />;
      case "ACCESS_CONTROL": return <ShieldCheck className="w-5 h-5" />;
      default: return <MonitorSmartphone className="w-5 h-5" />;
    }
  };

  const formatType = (type: string) => type.replace(/_/g, ' ');

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
               <MonitorSmartphone className="w-5 h-5" />
            </div>
            <div>
               <h3 className="text-xl font-black text-slate-800">Hardware Integrations</h3>
               <p className="text-sm font-medium text-slate-500">Manage external physical devices connected to the school network.</p>
            </div>
         </div>
         <button 
           onClick={handleCreate}
           disabled={loading}
           className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-700 transition-colors disabled:opacity-50"
         >
           <Plus className="w-4 h-4" /> Add Device
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {devices.map(d => (
            <div key={d.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
               <div>
                  <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center">
                           {getIcon(d.type)}
                        </div>
                        <div>
                           <h4 className="font-bold text-slate-800">{d.name}</h4>
                           <span className="text-xs font-black text-slate-500 uppercase tracking-wider">{formatType(d.type)}</span>
                        </div>
                     </div>
                     <button 
                        onClick={() => handleDelete(d.id)}
                        disabled={loading}
                        className="text-red-400 hover:text-red-600 transition-colors"
                     >
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <div>
                           <div className="text-[10px] font-black uppercase text-slate-400">Location</div>
                           <div className="text-xs font-bold text-slate-700">{d.location || "Unassigned"}</div>
                        </div>
                     </div>
                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <div>
                           <div className="text-[10px] font-black uppercase text-slate-400">IP Address</div>
                           <div className="text-xs font-mono font-bold text-slate-700">{d.ipAddress || "DHCP"}</div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                     <div className={`w-2.5 h-2.5 rounded-full ${d.status === 'ONLINE' ? 'bg-emerald-500' : d.status === 'OFFLINE' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                     <span className="text-xs font-bold text-slate-600">{d.status}</span>
                  </div>
                  {d.lastPing && (
                     <div className="flex items-center gap-1.5 text-slate-400">
                        <Activity className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Last seen: {new Date(d.lastPing).toLocaleTimeString()}</span>
                     </div>
                  )}
               </div>
            </div>
         ))}
         
         {devices.length === 0 && (
            <div className="col-span-1 lg:col-span-2 p-12 text-center text-slate-500 bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
               No hardware devices connected.
            </div>
         )}
      </div>

    </div>
  );
}
