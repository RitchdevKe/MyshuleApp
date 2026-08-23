"use client";

import React, { useState, useTransition } from "react";
import { ShieldAlert, Network, Smartphone, Clock } from "lucide-react";
import { saveExtendedPoliciesConfig } from "@/app/actions/security_policies_audit";
import { useRouter } from "next/navigation";

export default function PoliciesClient({ initialConfig }: { initialConfig: any }) {
  const [ipWhitelist, setIpWhitelist] = useState(initialConfig.ipWhitelist || false);
  const [deviceTrust, setDeviceTrust] = useState(initialConfig.deviceTrust || false);
  const [idleSessionTimeout, setIdleSessionTimeout] = useState(initialConfig.idleSessionTimeout || "30");
  const [ipRanges, setIpRanges] = useState<string[]>(initialConfig.ipRanges || []);
  const [newIpRange, setNewIpRange] = useState("");
  const [isAddingIp, setIsAddingIp] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSave = () => {
    startTransition(async () => {
      await saveExtendedPoliciesConfig({
        ipWhitelist,
        deviceTrust,
        idleSessionTimeout,
        ipRanges
      });
      router.refresh();
    });
  };

  const addIpRange = () => {
    if (newIpRange.trim()) {
      setIpRanges([...ipRanges, newIpRange.trim()]);
      setNewIpRange("");
      setIsAddingIp(false);
    }
  };

  const removeIpRange = (index: number) => {
    setIpRanges(ipRanges.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[500px]">
      <div className="p-6 border-b border-slate-200/60 bg-slate-50/50">
         <h2 className="text-xl font-black text-slate-800">Security Policies</h2>
         <p className="text-sm font-medium text-slate-500 mt-1">Configure network restrictions, device trust, and session timeouts.</p>
      </div>

      <div className="p-6 space-y-6">
         {/* IP Whitelisting */}
         <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start justify-between">
            <div className="flex gap-4">
               <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0 h-12 w-12 flex items-center justify-center">
                  <Network className="w-6 h-6" />
               </div>
               <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-lg">IP Whitelisting</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1 max-w-xl">
                     Restrict administrative access to specific IP addresses or network ranges (e.g., your school's physical campus network).
                  </p>
                  
                  {ipWhitelist && (
                     <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                        {ipRanges.map((ip, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-white border border-slate-200 p-2 rounded-lg">
                             <span className="font-mono text-sm font-bold text-slate-700">{ip}</span>
                             <button onClick={() => removeIpRange(idx)} className="text-xs text-rose-500 hover:underline">Remove</button>
                          </div>
                        ))}
                        
                        {isAddingIp ? (
                          <div className="flex gap-2 mt-2">
                             <input 
                                type="text" 
                                value={newIpRange}
                                onChange={(e) => setNewIpRange(e.target.value)}
                                placeholder="e.g. 192.168.1.0/24"
                                className="flex-1 bg-white border border-slate-200 text-sm font-mono text-slate-700 rounded-lg px-3 py-1.5 outline-none focus:border-primary-500"
                             />
                             <button onClick={addIpRange} className="text-xs font-bold bg-primary-900 text-white px-3 rounded-lg hover:bg-primary-800">Add</button>
                             <button onClick={() => setIsAddingIp(false)} className="text-xs font-bold text-slate-500 hover:text-slate-700 px-2">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setIsAddingIp(true)} className="text-xs font-bold text-primary-600 hover:text-primary-800 mt-2">+ Add IP Range</button>
                        )}
                     </div>
                  )}
               </div>
            </div>
            
            <button 
               onClick={() => setIpWhitelist(!ipWhitelist)}
               className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2 ${ipWhitelist ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
               <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${ipWhitelist ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
         </div>

         {/* Device Trust */}
         <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start justify-between">
            <div className="flex gap-4">
               <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0 h-12 w-12 flex items-center justify-center">
                  <Smartphone className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="font-bold text-slate-800 text-lg">Trusted Devices Only</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1 max-w-xl">
                     Require users to access the platform only from institutionally managed or explicitly trusted devices.
                  </p>
                  
                  {deviceTrust && (
                     <div className="mt-4 flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200 font-bold">
                        <ShieldAlert className="w-4 h-4" />
                        Warning: Enabling this may lock out users without registered devices.
                     </div>
                  )}
               </div>
            </div>
            
            <button 
               onClick={() => setDeviceTrust(!deviceTrust)}
               className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2 ${deviceTrust ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
               <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${deviceTrust ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
         </div>

         {/* Session Timeout */}
         <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                  <Clock className="w-5 h-5" />
               </div>
               <div>
                  <h3 className="font-bold text-slate-800 text-lg">Idle Session Timeout</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1 max-w-xl">
                     Automatically log out users after a period of inactivity to secure abandoned sessions.
                  </p>
               </div>
            </div>
            
            <div className="ml-16">
               <select 
                  value={idleSessionTimeout}
                  onChange={(e) => setIdleSessionTimeout(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 rounded-lg px-4 py-2 outline-none focus:border-primary-500 w-full max-w-xs"
               >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes (Recommended)</option>
                  <option value="60">60 Minutes</option>
                  <option value="120">2 Hours</option>
               </select>
            </div>
         </div>
         
         <div className="flex justify-end pt-4">
            <button 
               onClick={handleSave} 
               disabled={isPending}
               className="bg-primary-900 hover:bg-primary-800 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm shadow-primary-900/20 disabled:opacity-50"
            >
               {isPending ? 'Saving...' : 'Save Policies'}
            </button>
         </div>
      </div>
    </div>
  );
}
