"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface StockModalProps {
  initialData?: any;
  onClose: () => void;
  onSave: (data: {
    itemName: string;
    quantity: number;
    unit?: string;
    expiryDate?: string;
    status?: string;
  }) => Promise<void>;
}

export default function StockModal({
  initialData,
  onClose,
  onSave,
}: StockModalProps) {
  const [itemName, setItemName] = useState(initialData?.itemName || "");
  const [quantity, setQuantity] = useState<number>(
    initialData?.quantity ?? 0
  );
  const [unit, setUnit] = useState(initialData?.unit || "");
  const [expiryDate, setExpiryDate] = useState(
    initialData?.expiryDate
      ? new Date(initialData.expiryDate).toISOString().split("T")[0]
      : ""
  );
  const [status, setStatus] = useState(initialData?.status || "IN_STOCK");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    setSaving(true);
    try {
      await onSave({
        itemName: itemName.trim(),
        quantity,
        unit: unit.trim() || undefined,
        expiryDate: expiryDate || undefined,
        status,
      });
    } catch (error) {
      console.error("Failed to save item", error);
      alert("Error saving item. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-lg font-black text-slate-800">
            {initialData ? "Edit Stock Item" : "Add Stock Item"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Item Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
              placeholder="e.g. Epinephrine Auto-Injector"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Quantity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                required
                min={0}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Unit
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. pcs, bottles, packs"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
              >
                <option value="IN_STOCK">In Stock</option>
                <option value="LOW_STOCK">Low Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !itemName.trim()}
              className="px-4 py-2 bg-primary-900 hover:bg-primary-800 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
            >
              {saving
                ? "Saving..."
                : initialData
                ? "Update Item"
                : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
