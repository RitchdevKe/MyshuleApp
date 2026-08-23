"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Building2, Globe, Save, Upload, Palette } from "lucide-react";
import { updateSchoolProfile } from "../actions";

export default function ProfileClient({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(initialData?.name || "");
  const [domainPrefix, setDomainPrefix] = useState(initialData?.domainPrefix || "");
  const [motto, setMotto] = useState(initialData?.motto || "");
  const [timezone, setTimezone] = useState(initialData?.timezone || "Africa/Nairobi");
  const [primaryColor, setPrimaryColor] = useState(initialData?.primaryColor || "#0ea5e9");
  const [secondaryColor, setSecondaryColor] = useState(initialData?.secondaryColor || "#1e293b");
  const [logoUrl, setLogoUrl] = useState(initialData?.logoUrl || "");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setSuccess(false);
    setError("");
    startTransition(async () => {
      try {
        await updateSchoolProfile({ 
          name, 
          domainPrefix,
          motto,
          timezone,
          primaryColor,
          secondaryColor,
          logoUrl
        });
        router.refresh();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: any) {
        setError(err.message || "Failed to save profile");
      }
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800">School Profile</h3>
          <p className="text-sm font-medium text-slate-500">Manage your institution's core identity, branding, and colors.</p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Logo Upload */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
             {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
             ) : (
                <Building2 className="w-8 h-8 text-slate-300" />
             )}
          </div>
          <div>
             <h4 className="font-bold text-slate-800 mb-2">School Logo</h4>
             <p className="text-sm text-slate-500 mb-4">Upload a high-res logo (PNG or JPG). Max 2MB.</p>
             <label className="cursor-pointer flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                <Upload className="w-4 h-4" /> Upload from Laptop
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
             </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">School Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Workspace Domain Prefix</label>
          <div className="flex items-center shadow-sm rounded-xl overflow-hidden border border-slate-200 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
            <div className="px-4 py-2.5 bg-slate-50 border-r border-slate-200 flex items-center gap-2 text-slate-500 text-sm font-bold">
              <Globe className="w-4 h-4" /> https://
            </div>
            <input 
              type="text" 
              value={domainPrefix}
              onChange={(e) => setDomainPrefix(e.target.value)}
              className="flex-1 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none"
            />
            <div className="px-4 py-2.5 bg-slate-50 border-l border-slate-200 text-slate-500 text-sm font-bold">
              .myshule.ke
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">School Motto</label>
            <input 
              type="text" 
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
              placeholder="e.g. Striving for Excellence"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Timezone</label>
            <select 
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
            >
              <option value="Africa/Nairobi">Africa/Nairobi</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time (US & Canada)</option>
              <option value="Europe/London">London (GMT)</option>
            </select>
          </div>
        </div>

        {/* Brand Colors */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
           <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-slate-600" />
              <h4 className="font-bold text-slate-800">Brand Colors</h4>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Primary Color</label>
                 <div className="flex items-center gap-2">
                    <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
                    <input type="text" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono text-slate-700 uppercase" />
                 </div>
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Secondary Color</label>
                 <div className="flex items-center gap-2">
                    <input type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
                    <input type="text" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono text-slate-700 uppercase" />
                 </div>
              </div>
           </div>
        </div>

        <div className="pt-4 flex items-center gap-4">
          <button 
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {isPending ? "Saving..." : "Save Profile"}
          </button>
          {success && <span className="text-sm font-bold text-emerald-600">Saved successfully!</span>}
          {error && <span className="text-sm font-bold text-red-600">{error}</span>}
        </div>
      </div>
    </div>
  );
}
