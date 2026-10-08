"use client";

import React, { useState } from 'react';
import { Info } from 'lucide-react';

export default function CustomerSupportPage() {
  const [phone, setPhone] = useState('712 3## ###');
  const [duration, setDuration] = useState('');
  const [unit, setUnit] = useState('HOURS');
  const [reason, setReason] = useState('');

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-primary-600 mb-2">Account Access Permission</h2>
        
        <div className="flex gap-2 items-start text-slate-500 mb-6">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-400" />
          <p>Give a MyShule App Representative permission to access your school</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-slate-300 rounded-md overflow-hidden bg-white">
              <div className="px-3 py-2 border-r border-slate-300 flex items-center gap-2 bg-slate-50">
                <span className="text-lg">🇰🇪</span>
                <span className="font-medium text-slate-700">+254 ▾</span>
              </div>
              <input 
                type="text" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 px-3 py-2 outline-none text-slate-700 font-medium tracking-wider"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-medium text-slate-700 mb-1">
                Duration <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none focus:border-primary-500 text-slate-700"
              />
            </div>
            <div className="w-1/3">
              <label className="block font-medium text-slate-700 mb-1">
                Unit <span className="text-red-500">*</span>
              </label>
              <select 
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none focus:border-primary-500 text-slate-700 bg-white"
              >
                <option value="HOURS">HOURS</option>
                <option value="DAYS">DAYS</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Reason For Access <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              placeholder="Reason for Access"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none focus:border-primary-500 text-slate-700"
            />
          </div>

          <div className="flex justify-end mt-4">
            <button className="px-6 py-2 bg-teal-400 hover:bg-teal-500 text-white font-medium rounded-md transition-colors shadow-sm">
              Grant Access
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-hidden">
        <h2 className="text-xl font-bold text-primary-600 mb-4">Access Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 font-bold text-slate-700">Granted on</th>
                <th className="py-3 px-4 font-bold text-slate-700">Granted By</th>
                <th className="py-3 px-4 font-bold text-slate-700">Granted To</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3} className="py-8 text-center text-slate-500 italic">No access logs found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

