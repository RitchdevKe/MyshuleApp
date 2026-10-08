"use client";

import React, { useState } from "react";
import { Plus, LayoutList, X, Trash2 } from "lucide-react";
import { createFeeStructure } from "./actions";

export default function FeeStructuresClient({ 
  initialData, 
  academicYears, 
  classes 
}: { 
  initialData: any[]; 
  academicYears: any[]; 
  classes: any[]; 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    academicYearId: "",
    classId: "",
  });

  const [items, setItems] = useState<{ name: string; amount: number }[]>([
    { name: "Tuition Fee", amount: 0 }
  ]);

  const handleAddItem = () => {
    setItems([...items, { name: "", amount: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: "name" | "amount", value: string | number) => {
    const newItems = [...items];
    if (field === "name") {
      newItems[index].name = value as string;
    } else {
      newItems[index].amount = Number(value);
    }
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (!formData.name || !formData.academicYearId || !formData.classId) {
        throw new Error("Please fill in all required fields.");
      }
      if (items.length === 0 || items.some(item => !item.name || item.amount <= 0)) {
        throw new Error("Please provide valid fee items with amounts greater than 0.");
      }

      const res = await createFeeStructure({
        name: formData.name,
        academicYearId: formData.academicYearId,
        classId: formData.classId,
        items,
      });

      if (res.success) {
        setIsModalOpen(false);
        setFormData({ name: "", academicYearId: "", classId: "" });
        setItems([{ name: "Tuition Fee", amount: 0 }]);
      } else {
        throw new Error(res.error || "Failed to create fee structure");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString();
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-between items-center bg-white/40 p-4 rounded-2xl border border-white/60 backdrop-blur-md">
           <h2 className="text-lg font-bold text-slate-800">Active Fee Structures</h2>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-sm transition-all shadow-sm"
           >
              <Plus className="w-4 h-4" />
              New Structure
            </button>
        </div>

        {initialData.map((struct) => (
          <div key={struct.id} className="bg-gradient-to-br from-white to-slate-50/80 rounded-3xl border border-slate-200/80 shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
            <div className="flex justify-between items-start mb-6">
               <div className="p-3 bg-secondary-50 text-secondary-600 rounded-2xl">
                  <LayoutList className="w-6 h-6" />
               </div>
               <span className="bg-secondary-100/50 text-secondary-700 text-xs font-extrabold px-3 py-1 rounded-lg border border-secondary-200">Active</span>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-1">{struct.name}</h3>
            <p className="text-xs font-semibold text-slate-500 mb-4">{struct.class?.name} • {struct.academicYear?.name}</p>
            
            <div className="space-y-3 mb-6 flex-grow">
              {struct.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-500">{item.name}</span>
                  <span className="font-bold text-slate-700">KSh {formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-slate-200/80 flex justify-between items-center mt-auto">
               <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Base Total</span>
               <span className="text-xl font-black text-primary-900">KSh {formatCurrency(struct.totalAmount)}</span>
            </div>
          </div>
        ))}
        {initialData.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 py-12 text-center text-slate-500 bg-white/40 rounded-2xl border border-white/60">
            No fee structures found. Click "New Structure" to add one.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">New Fee Structure</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Structure Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grade 1-3 (Lower Primary)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Academic Year</label>
                  <select
                    required
                    value={formData.academicYearId}
                    onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white"
                  >
                    <option value="">Select Academic Year</option>
                    {academicYears.map((ay) => (
                      <option key={ay.id} value={ay.id}>{ay.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Target Class</label>
                  <select
                    required
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white"
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-800">Fee Items</h3>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex items-center gap-2 px-3 py-1.5 bg-secondary-50 text-secondary-600 hover:bg-secondary-100 rounded-lg text-sm font-bold transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <div className="flex-1">
                        <input
                          type="text"
                          required
                          placeholder="Item Name (e.g. Tuition Fee)"
                          value={item.name}
                          onChange={(e) => handleItemChange(index, "name", e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        />
                      </div>
                      <div className="w-48 relative">
                        <span className="absolute left-4 top-2.5 text-slate-400 font-medium">KSh</span>
                        <input
                          type="number"
                          required
                          min="0"
                          value={item.amount || ""}
                          onChange={(e) => handleItemChange(index, "amount", e.target.value)}
                          className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        disabled={items.length === 1}
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-500">Total Amount</span>
                  <span className="text-xl font-black text-primary-900">
                    KSh {formatCurrency(items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0))}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Structure'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
