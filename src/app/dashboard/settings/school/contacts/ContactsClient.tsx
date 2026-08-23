"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Phone, Save } from "lucide-react";
import { updateSchoolProfile } from "../actions";

export default function ContactsClient({ tenant }: { tenant: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    contactEmail: tenant?.contactEmail || "",
    contactPhone: tenant?.contactPhone || "",
    website: tenant?.website || "",
    address: tenant?.address || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateSchoolProfile(formData);
        router.refresh();
        alert("Contacts saved successfully!");
      } catch (e) {
        alert("Failed to save contacts");
      }
    });
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">Contact Information</h3>
            <p className="text-sm font-medium text-slate-500">Official school contact details.</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {isPending ? "Saving..." : "Save Contacts"}
        </button>
      </div>

      <div className="max-w-3xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Official Email</label>
            <input 
              type="email" 
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="info@school.edu"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
            <input 
              type="text" 
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder="+254 700 000 000"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Website</label>
            <input 
              type="url" 
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://www.school.edu"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white" 
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Physical Address</label>
          <textarea 
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            placeholder="123 School Lane..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white resize-none" 
          ></textarea>
        </div>
      </div>
    </div>
  );
}
