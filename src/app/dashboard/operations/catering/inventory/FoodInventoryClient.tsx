"use client";

import React, { useState, useEffect } from "react";
import { Package, Plus, Search, X, Trash2, Edit, ShieldAlert } from "lucide-react";
import { createFoodItem, updateFoodItem, deleteFoodItem } from "./actions";

interface FoodItem { id: string; itemName: string; category: string; quantity: number; unit: string; minLevel: number; expiryDate: string | null; status: string; }

const CATEGORIES = ["MEAT", "VEGETABLE", "DRY_GOODS", "DAIRY", "BEVERAGE", "SPICE", "GRAIN", "OTHER"];

export default function FoodInventoryClient({ initialItems }: { initialItems: FoodItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setItems(initialItems); }, [initialItems]);

  const [form, setForm] = useState({ itemName: "", category: "DRY_GOODS", quantity: 0, unit: "kg", minLevel: 0, expiryDate: "", status: "IN_STOCK" });

  const openCreate = () => { setEditing(null); setForm({ itemName: "", category: "DRY_GOODS", quantity: 0, unit: "kg", minLevel: 0, expiryDate: "", status: "IN_STOCK" }); setShowModal(true); };
  const openEdit = (i: FoodItem) => { setEditing(i); setForm({ itemName: i.itemName, category: i.category, quantity: i.quantity, unit: i.unit, minLevel: i.minLevel, expiryDate: i.expiryDate?.slice(0, 10) || "", status: i.status }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.itemName) return;
    setLoading(true);
    try {
      if (editing) {
        await updateFoodItem(editing.id, { ...form, quantity: Number(form.quantity), minLevel: Number(form.minLevel) });
        setItems(prev => prev.map(i => i.id === editing.id ? { ...i, ...form, quantity: Number(form.quantity), minLevel: Number(form.minLevel), expiryDate: form.expiryDate || null } : i));
      } else {
        await createFoodItem({ ...form, quantity: Number(form.quantity), minLevel: Number(form.minLevel) });
        setItems(prev => [...prev, { id: `temp-${Date.now()}`, ...form, quantity: Number(form.quantity), minLevel: Number(form.minLevel), expiryDate: form.expiryDate || null }]);
      }
      setShowModal(false);
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => { if (!confirm("Delete this item?")) return; await deleteFoodItem(id); setItems(prev => prev.filter(i => i.id !== id)); };

  const filtered = items.filter(i => {
    const matchSearch = !search || i.itemName.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusBadge = (s: string) => ({ IN_STOCK: "bg-emerald-50 text-emerald-600", LOW_STOCK: "bg-amber-50 text-amber-600", OUT_OF_STOCK: "bg-rose-50 text-rose-600" }[s] || "bg-slate-50 text-slate-600");

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-2xl hidden md:block"><Package className="w-6 h-6" /></div>
            <div>
              <h2 className="text-lg font-black text-slate-800">Food Inventory</h2>
              <p className="text-sm font-medium text-slate-500">Track food stock levels, categories, and purchase orders.</p>
            </div>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"><Plus className="w-4 h-4" /> Purchase Order</button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
            <option value="All">All Statuses</option><option value="IN_STOCK">In Stock</option><option value="LOW_STOCK">Low Stock</option><option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>

        <div className="p-0"><div className="overflow-x-auto"><table className="w-full text-left border-collapse">
          <thead><tr className="bg-slate-50/50">
            <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Item</th>
            <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
            <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Qty</th>
            <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Expiry</th>
            <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
            <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-slate-400 text-sm">No items found.</td></tr>}
            {filtered.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="py-4 px-6 font-bold text-slate-800 text-sm">{item.itemName}</td>
                <td className="py-4 px-6"><span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">{item.category}</span></td>
                <td className="py-4 px-6 text-sm font-bold text-slate-700">{item.quantity} {item.unit}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "—"}</td>
                <td className="py-4 px-6"><span className={`inline-flex items-center px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg ${statusBadge(item.status)}`}>{item.status.replace("_", " ")}</span></td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <button onClick={() => openEdit(item)} className="text-sm font-bold text-primary-600 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors border border-primary-100 flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-sm font-bold text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div></div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-800">{editing ? "Edit Item" : "Add Food Item"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-bold text-slate-700 mb-1 block">Item Name *</label><input type="text" value={form.itemName} onChange={e => setForm(p => ({...p, itemName: e.target.value}))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" /></div>
                <div><label className="text-sm font-bold text-slate-700 mb-1 block">Category *</label><select value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900">{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-sm font-bold text-slate-700 mb-1 block">Quantity *</label><input type="number" value={form.quantity} onChange={e => setForm(p => ({...p, quantity: Number(e.target.value)}))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" /></div>
                <div><label className="text-sm font-bold text-slate-700 mb-1 block">Unit *</label><input type="text" value={form.unit} onChange={e => setForm(p => ({...p, unit: e.target.value}))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" placeholder="kg, liters, pcs" /></div>
                <div><label className="text-sm font-bold text-slate-700 mb-1 block">Min Level</label><input type="number" value={form.minLevel} onChange={e => setForm(p => ({...p, minLevel: Number(e.target.value)}))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-bold text-slate-700 mb-1 block">Expiry Date</label><input type="date" value={form.expiryDate} onChange={e => setForm(p => ({...p, expiryDate: e.target.value}))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" /></div>
                <div><label className="text-sm font-bold text-slate-700 mb-1 block">Status</label><select value={form.status} onChange={e => setForm(p => ({...p, status: e.target.value}))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"><option value="IN_STOCK">In Stock</option><option value="LOW_STOCK">Low Stock</option><option value="OUT_OF_STOCK">Out of Stock</option></select></div>
              </div>
            </div>
            <div className="p-5 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
              <button onClick={handleSave} disabled={loading} className="px-4 py-2 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl disabled:opacity-50">{loading ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
