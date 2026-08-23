"use client";

import React, { useState, useTransition } from "react";
import { LayoutList, Plus, Edit, Users, Trash2, X } from "lucide-react";
import { createSalaryStructure, updateSalaryStructure, deleteSalaryStructure } from "./actions";

interface SalaryStructureClientProps {
  id: string;
  name: string;
  baseRangeMin: number;
  baseRangeMax: number;
  grade: string;
  _count: {
    staff: number;
  };
}

export default function SalaryStructuresClient({ initialStructures }: { initialStructures: SalaryStructureClientProps[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    baseRangeMin: "",
    baseRangeMax: "",
    grade: "",
  });
  const [isPending, startTransition] = useTransition();

  const totalStructures = initialStructures.length;
  const totalEmployees = initialStructures.reduce((sum, s) => sum + s._count.staff, 0);
  const avgBaseMin = initialStructures.reduce((sum, s) => sum + s.baseRangeMin, 0) / (totalStructures || 1);
  const avgBaseMax = initialStructures.reduce((sum, s) => sum + s.baseRangeMax, 0) / (totalStructures || 1);

  const openModal = (structure?: SalaryStructureClientProps) => {
    if (structure) {
      setEditingId(structure.id);
      setFormData({
        name: structure.name,
        baseRangeMin: structure.baseRangeMin.toString(),
        baseRangeMax: structure.baseRangeMax.toString(),
        grade: structure.grade,
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", baseRangeMin: "", baseRangeMax: "", grade: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.baseRangeMin || !formData.baseRangeMax) return;

    startTransition(async () => {
      try {
        if (editingId) {
          await updateSalaryStructure(editingId, {
            name: formData.name,
            baseRangeMin: Number(formData.baseRangeMin),
            baseRangeMax: Number(formData.baseRangeMax),
            grade: formData.grade,
          });
        } else {
          await createSalaryStructure({
            name: formData.name,
            baseRangeMin: Number(formData.baseRangeMin),
            baseRangeMax: Number(formData.baseRangeMax),
            grade: formData.grade,
          });
        }
        closeModal();
      } catch (error) {
        console.error("Failed to save salary structure:", error);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this salary structure?")) {
      startTransition(async () => {
        try {
          await deleteSalaryStructure(id);
        } catch (error) {
          console.error("Failed to delete salary structure:", error);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-lg font-black text-slate-800">Salary Structures & Bands</h2>
           <p className="text-sm font-medium text-slate-500">Manage pay grades, base salaries, and standard allowances.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
        >
           <Plus className="w-4 h-4" />
           New Structure
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-6">
           <h3 className="text-sm font-bold text-slate-500 mb-1">Total Structures</h3>
           <p className="text-3xl font-black text-slate-800">{totalStructures}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-6">
           <h3 className="text-sm font-bold text-slate-500 mb-1">Total Employees Covered</h3>
           <p className="text-3xl font-black text-slate-800">{totalEmployees}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-6">
           <h3 className="text-sm font-bold text-slate-500 mb-1">Avg Base Range</h3>
           <p className="text-3xl font-black text-slate-800">${Math.round(avgBaseMin).toLocaleString()} - ${Math.round(avgBaseMax).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {initialStructures.map((structure) => (
            <div key={structure.id} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-6 hover:shadow-xl transition-all duration-300 group flex flex-col">
               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                        <LayoutList className="w-5 h-5" />
                     </div>
                     <div>
                        <h3 className="font-black text-slate-800">{structure.name}</h3>
                        <p className="text-xs font-bold text-slate-400">ID: {structure.id.slice(0, 8)}</p>
                     </div>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => openModal(structure)}
                      className="text-slate-400 hover:text-primary-900 transition-colors p-1 rounded-lg hover:bg-slate-50 opacity-0 group-hover:opacity-100 disabled:opacity-50"
                      disabled={isPending}
                    >
                       <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(structure.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-slate-50 opacity-0 group-hover:opacity-100 disabled:opacity-50"
                      disabled={isPending}
                    >
                       <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
               </div>
               
               <div className="bg-slate-50 rounded-2xl p-4 mb-4 flex-grow">
                  <div className="mb-3">
                     <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Base Salary Range</p>
                     <p className="font-black text-slate-700">${structure.baseRangeMin.toLocaleString()} - ${structure.baseRangeMax.toLocaleString()}</p>
                  </div>
                  <div>
                     <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Grade</p>
                     <p className="text-sm font-medium text-slate-600">{structure.grade || "None"}</p>
                  </div>
               </div>

               <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                     <Users className="w-4 h-4 text-slate-400" />
                     {structure._count.staff} Employees
                  </div>
                  <button className="text-sm font-bold text-primary-600 hover:text-primary-800">
                     View Details
                  </button>
               </div>
            </div>
         ))}
         {initialStructures.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white/50 border border-slate-200/50 rounded-3xl">
              <p className="text-slate-500 font-medium">No salary structures found. Create one to get started.</p>
            </div>
         )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-800 text-lg">
                {editingId ? "Edit Salary Structure" : "New Salary Structure"}
              </h3>
              <button 
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-xl hover:bg-slate-100"
                disabled={isPending}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Structure Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  placeholder="e.g. Senior Teacher"
                  disabled={isPending}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Base Min ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.baseRangeMin}
                    onChange={e => setFormData({...formData, baseRangeMin: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    placeholder="0"
                    disabled={isPending}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Base Max ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.baseRangeMax}
                    onChange={e => setFormData({...formData, baseRangeMax: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    placeholder="0"
                    disabled={isPending}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Grade</label>
                <input
                  type="text"
                  required
                  value={formData.grade}
                  onChange={e => setFormData({...formData, grade: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  placeholder="e.g. A1, B2"
                  disabled={isPending}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isPending}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-sm shadow-primary-900/20 transition-all disabled:opacity-50"
                >
                  {isPending ? "Saving..." : (editingId ? "Save Changes" : "Create Structure")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
