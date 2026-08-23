"use client";

import React, { useState, useTransition } from "react";
import { Key, Smartphone, Globe, Shield, RefreshCw } from "lucide-react";
import { saveAuthCenterConfig } from "@/app/actions/security_auth_center";
import { useRouter } from "next/navigation";

export default function AuthClient({ initialConfig }: { initialConfig: any }) {
  const [mfaEnabled, setMfaEnabled] = useState(initialConfig.mfaEnabled || false);
  const [ssoGoogle, setSsoGoogle] = useState(initialConfig.googleSso || false);
  const [ssoMicrosoft, setSsoMicrosoft] = useState(initialConfig.microsoftSso || false);
  const [passwordLength, setPasswordLength] = useState(initialConfig.passwordLength || "12");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSave = () => {
    startTransition(async () => {
      await saveAuthCenterConfig({
        mfaEnabled,
        googleSso: ssoGoogle,
        microsoftSso: ssoMicrosoft,
        passwordLength,
      });
      router.refresh();
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[500px]">
      <div className="p-6 border-b border-slate-200/60 bg-slate-50/50">
         <h2 className="text-xl font-black text-slate-800">Authentication Settings</h2>
         <p className="text-sm font-medium text-slate-500 mt-1">Configure MFA, Single Sign-On, and password policies for your organization.</p>
      </div>

      <div className="p-6 space-y-8">
         {/* MFA Section */}
         <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start justify-between">
            <div className="flex gap-4">
               <div className="p-3 bg-primary-50 text-primary-600 rounded-xl shrink-0 h-12 w-12 flex items-center justify-center">
                  <Smartphone className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="font-bold text-slate-800 text-lg">Multi-Factor Authentication (MFA)</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1 max-w-xl">
                     Require users to provide an additional layer of verification (Authenticator App or SMS) when logging in from unknown devices.
                  </p>
                  
                  <div className="mt-4 flex gap-4">
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="mfa_target" className="text-primary-600 focus:ring-primary-900" defaultChecked />
                        <span className="text-sm font-bold text-slate-700">Administrators Only</span>
                     </label>
                  </div>
               </div>
            </div>
            
            <button 
               onClick={() => setMfaEnabled(!mfaEnabled)}
               className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2 ${mfaEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
               <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${mfaEnabled ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
         </div>

         {/* SSO Section */}
         <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Single Sign-On (SSO)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                     <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl">
                        <Globe className="w-5 h-5" />
                     </div>
                     <div>
                        <div className="font-bold text-slate-800 text-sm">Google Workspace</div>
                        <div className="text-xs text-slate-500 font-medium">Log in with Google accounts</div>
                     </div>
                  </div>
                  <button 
                     onClick={() => setSsoGoogle(!ssoGoogle)}
                     className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${ssoGoogle ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                     {ssoGoogle ? 'Enabled' : 'Disabled'}
                  </button>
               </div>
               
               <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                     <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl">
                        <Shield className="w-5 h-5" />
                     </div>
                     <div>
                        <div className="font-bold text-slate-800 text-sm">Microsoft Azure AD</div>
                        <div className="text-xs text-slate-500 font-medium">Log in with Microsoft 365</div>
                     </div>
                  </div>
                  <button 
                     onClick={() => setSsoMicrosoft(!ssoMicrosoft)}
                     className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${ssoMicrosoft ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                     {ssoMicrosoft ? 'Enabled' : 'Disabled'}
                  </button>
               </div>
            </div>
         </div>

         {/* Password Policy */}
         <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Password Policy</h3>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-5">
               <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                     <Key className="w-5 h-5 text-slate-400" />
                     <div>
                        <div className="font-bold text-sm text-slate-800">Minimum Password Length</div>
                     </div>
                  </div>
                  <select 
                     value={passwordLength}
                     onChange={(e) => setPasswordLength(e.target.value)}
                     className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 rounded-lg px-3 py-1.5 outline-none"
                  >
                     <option value="8">8 Characters</option>
                     <option value="12">12 Characters (Recommended)</option>
                     <option value="16">16 Characters</option>
                  </select>
               </div>
            </div>
         </div>
         
         <div className="flex justify-end pt-4">
            <button 
               onClick={handleSave} 
               disabled={isPending}
               className="bg-primary-900 hover:bg-primary-800 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm shadow-primary-900/20 disabled:opacity-50"
            >
               {isPending ? 'Saving...' : 'Save Authentication Settings'}
            </button>
         </div>
      </div>
    </div>
  );
}
