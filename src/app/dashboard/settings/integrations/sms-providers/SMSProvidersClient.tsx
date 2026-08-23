"use client";

import React, { useState } from "react";
import { MessageSquare, Save, Key } from "lucide-react";
import { updateCommunicationSettings } from "@/app/actions/communicationSettings";

export default function SMSProvidersClient({ settings }: { settings: any }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
     smsProvider: settings.smsProvider || "TWILIO",
     smsApiKey: settings.smsApiKey || "",
     smsSenderId: settings.smsSenderId || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setLoading(true);
    await updateCommunicationSettings(formData);
    setLoading(false);
    alert("SMS Provider saved successfully!");
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
               <MessageSquare className="w-5 h-5" />
            </div>
            <div>
               <h3 className="text-xl font-black text-slate-800">SMS Gateway</h3>
               <p className="text-sm font-medium text-slate-500">Configure your bulk SMS provider.</p>
            </div>
         </div>
         <button 
           onClick={handleSave}
           disabled={loading}
           className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-700 transition-colors disabled:opacity-50"
         >
           <Save className="w-4 h-4" /> Save Configuration
         </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
         <div className="space-y-5">
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">Provider</label>
               <select 
                  name="smsProvider"
                  value={formData.smsProvider}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
               >
                  <option value="TWILIO">Twilio</option>
                  <option value="AFRICASTALKING">Africa's Talking</option>
                  <option value="MSG91">MSG91</option>
               </select>
            </div>

            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">API Key / Token</label>
               <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input type="password" name="smsApiKey" value={formData.smsApiKey} onChange={handleChange} className="w-full pl-9 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white" placeholder="Enter secret token" />
               </div>
            </div>

            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">Sender ID (Alphanumeric)</label>
               <input type="text" name="smsSenderId" value={formData.smsSenderId} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white" placeholder="e.g. MYSHULE" maxLength={11} />
               <p className="text-xs text-slate-500 mt-2 font-medium">Max 11 characters. Must be registered with your provider.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
