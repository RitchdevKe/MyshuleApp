"use client";

import React, { useState, useTransition } from "react";
import { Calculator, Plus, Trash2, ListPlus, CheckCircle, Loader2, X, AlertCircle } from "lucide-react";
import { createFeeStructure, deleteFeeStructure } from "@/app/actions/finance";
import { useRouter } from "next/navigation";

export default function FeeStructuresClient({
  feeStructures,
  academicYears,
  classes,
}: {
  feeStructures: any[];
  academicYears: any[];
  classes: any[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");
  const [classId, setClassId] = useState("");
  // Use string for amounts so the field starts empty — no default 0
  const [items, setItems] = useState<{ name: string; amount: string }[]>([
    { name: "Tuition Fee", amount: "" },
  ]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddItem = () =>
    setItems([...items, { name: "", amount: "" }]);

  const handleUpdateItem = (
    index: number,
    field: "name" | "amount",
    value: string
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const total = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const canSave = name && academicYearId && classId && items.length > 0 && items.every(i => i.name && i.amount);

  const handleCreate = () => {
    if (!canSave) return;
    startTransition(async () => {
      await createFeeStructure({
        academicYearId,
        classId,
        name,
        items: items.map(i => ({ name: i.name, amount: parseFloat(i.amount) || 0 })),
      });
      setShowModal(false);
      setName("");
      setAcademicYearId("");
      setClassId("");
      setItems([{ name: "Tuition Fee", amount: "" }]);
      router.refresh();
      showToast("Fee structure created!");
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteFeeStructure(id);
      router.refresh();
      showToast("Fee structure deleted.");
    });
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {toast && (
        <div className="fixed top-6 right-6 z-[100] flex items-center gap-3 bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold">
          <CheckCircle className="w-4 h-4 text-green-400" /> {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">Fee Structures</h3>
            <p className="text-sm font-medium text-slate-500">Configure standard fee templates per class and academic year.</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          disabled={isPending}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-700 transition-colors disabled:opacity-60"
        >
          <Plus className="w-4 h-4" /> New Fee Structure
        </button>
      </div>

      {/* No classes warning */}
      {classes.length === 0 && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-800">No classes found.</p>
            <p className="text-xs font-medium text-amber-700 mt-0.5">
              Go to <strong>Administration → Organization</strong> to create classes and streams first, then come back here.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {feeStructures.map((structure) => (
          <div key={structure.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-black text-slate-800">{structure.name}</h4>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{structure.academicYear?.name}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{structure.class?.name}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(structure.id)}
                disabled={isPending}
                className="text-slate-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 mb-4">
              {structure.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                  <span className="text-slate-600 font-medium">{item.name}</span>
                  <span className="font-bold text-slate-800">
                    KES {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-500">Total</span>
              <span className="text-lg font-black text-blue-600">
                KES {structure.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        ))}

        {feeStructures.length === 0 && (
          <div className="col-span-full p-10 text-center border-2 border-dashed border-slate-200 rounded-2xl">
            <Calculator className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-400">No fee structures yet.</p>
            <p className="text-xs font-medium text-slate-400 mt-1">Create your first fee structure to get started.</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 my-8">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800">Create Fee Structure</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Structure Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Term 1 – Standard Fees"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Academic Year</label>
                  <select
                    value={academicYearId}
                    onChange={(e) => setAcademicYearId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  >
                    <option value="">Select Year...</option>
                    {academicYears.map((yr) => (
                      <option key={yr.id} value={yr.id}>{yr.name}</option>
                    ))}
                  </select>
                  {academicYears.length === 0 && (
                    <p className="text-xs text-amber-600 font-medium mt-1">No academic years — create one in Settings → Academic → Calendar first.</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Class</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  >
                    <option value="">Select Class...</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                  {classes.length === 0 && (
                    <p className="text-xs text-amber-600 font-medium mt-1">No classes found — go to Administration → Organization to create classes.</p>
                  )}
                </div>
              </div>

              {/* Fee Items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-bold text-slate-700">Fee Items</label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:text-blue-700 transition-colors"
                  >
                    <ListPlus className="w-4 h-4" /> Add Item
                  </button>
                </div>
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleUpdateItem(index, "name", e.target.value)}
                          placeholder="Item name (e.g. Tuition, Transport)"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                        />
                      </div>
                      <div className="w-32">
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => handleUpdateItem(index, "amount", e.target.value)}
                          placeholder="Amount"
                          min="0"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveItem(index)}
                        disabled={items.length === 1}
                        className="text-slate-400 hover:text-red-500 p-2 disabled:opacity-30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex justify-between items-center font-black">
                <span>Total Amount:</span>
                <span>KES {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
              <button
                onClick={handleCreate}
                disabled={isPending || !canSave}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm disabled:opacity-50 transition-colors"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Save Fee Structure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
