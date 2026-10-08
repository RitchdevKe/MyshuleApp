"use client";

import React, { useState } from "react";
import { Calendar, Lock, Unlock, Settings, AlertTriangle, Plus, PlayCircle } from "lucide-react";
import { addFinancialYear, updateFinancialYear, closeFinancialYear, openFinancialYear } from "./actions";

type FinancialYear = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isClosed: boolean;
};

export default function FinancialYearClient({ 
  tenantId, 
  financialYears 
}: { 
  tenantId: string;
  financialYears: FinancialYear[];
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  const activeYear = financialYears.find(y => !y.isClosed) || financialYears[0];

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addFinancialYear(tenantId, formData);
    setIsAdding(false);
    setFormData({ name: "", startDate: "", endDate: "" });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      await updateFinancialYear(isEditing, tenantId, formData);
      setIsEditing(null);
      setFormData({ name: "", startDate: "", endDate: "" });
    }
  };

  const openEditModal = (year: FinancialYear) => {
    setFormData({
      name: year.name,
      startDate: new Date(year.startDate).toISOString().split('T')[0],
      endDate: new Date(year.endDate).toISOString().split('T')[0],
    });
    setIsEditing(year.id);
  };

  return (
    <div className="space-y-6">
      
      {/* Active Year Summary */}
      {activeYear ? (
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center shrink-0 border border-primary-100">
              <Calendar className="w-8 h-8 text-primary-900" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{activeYear.name}</h2>
              <p className="text-sm font-bold text-slate-500 mt-1">
                {new Date(activeYear.startDate).toLocaleDateString()} - {new Date(activeYear.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button 
              onClick={() => openEditModal(activeYear)}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              Year Settings
            </button>
            {!activeYear.isClosed && (
              <button 
                onClick={() => closeFinancialYear(activeYear.id, tenantId)}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-rose-50 text-rose-700 rounded-xl font-bold text-sm hover:bg-rose-100 transition-all shadow-sm"
              >
                <Lock className="w-4 h-4" />
                Close Financial Year
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 flex items-center justify-between">
          <p className="text-slate-500 font-bold">No active financial year.</p>
        </div>
      )}

      {/* Grid of Financial Years */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-slate-800 text-lg">Financial Years</h3>
            <p className="text-sm text-slate-500 font-medium">Manage financial years to prevent backdating of transactions.</p>
          </div>
          <button 
            onClick={() => {
              setFormData({ name: "", startDate: "", endDate: "" });
              setIsAdding(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-bold text-sm hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Year
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {financialYears.map((year) => {
              const status = year.isClosed ? 'Closed' : 'Open';
              return (
                <div key={year.id} className={`p-5 rounded-2xl border transition-all ${
                  status === 'Open' ? 'bg-primary-50 border-primary-200 shadow-sm shadow-primary-900/5' :
                  'bg-slate-50 border-slate-200 opacity-75'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <h4 className={`font-bold ${status === 'Open' ? 'text-primary-900' : 'text-slate-700'}`}>
                      {year.name}
                    </h4>
                    {status === 'Closed' ? (
                      <Lock className="w-4 h-4 text-slate-400" />
                    ) : (
                      <Unlock className="w-4 h-4 text-primary-600" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-6">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      status === 'Open' ? 'bg-primary-900 text-white' :
                      'bg-slate-200 text-slate-600'
                    }`}>
                      {status}
                    </span>
                    
                    {status === 'Open' && (
                      <button 
                        onClick={() => closeFinancialYear(year.id, tenantId)}
                        className="text-xs font-bold text-primary-700 hover:text-primary-900 flex items-center gap-1"
                      >
                        Lock <Lock className="w-3 h-3" />
                      </button>
                    )}
                    {status === 'Closed' && (
                      <button 
                        onClick={() => openFinancialYear(year.id, tenantId)}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        Open <PlayCircle className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="p-4 bg-amber-50 border-t border-amber-100 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-amber-800">
            <strong>Warning:</strong> Re-opening a closed financial year requires Administrator approval and may invalidate previously generated reports for that year.
          </p>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(isAdding || isEditing) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold mb-4">{isAdding ? "Add Financial Year" : "Edit Financial Year"}</h3>
            <form onSubmit={isAdding ? handleAddSubmit : handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Year Name</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border-slate-200 rounded-lg px-3 py-2"
                  placeholder="e.g. FY 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Start Date</label>
                <input 
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full border-slate-200 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">End Date</label>
                <input 
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full border-slate-200 rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsAdding(false);
                    setIsEditing(null);
                  }}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-lg"
                >
                  {isAdding ? "Create" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
