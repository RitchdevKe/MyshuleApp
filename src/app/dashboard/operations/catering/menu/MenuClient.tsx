"use client";

import React, { useState, useEffect } from "react";
import { Utensils, Edit3, Sun, Coffee, Moon, Plus, Search, X, Trash2 } from "lucide-react";
import { createMenuItem, updateMenuItem, deleteMenuItem } from "./actions";

interface MenuItem {
  id: string;
  dayOfWeek: string;
  mealType: string;
  name: string;
  description: string | null;
  status: string;
}

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const MEALS = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];
const mealIcons: Record<string, typeof Coffee> = { BREAKFAST: Coffee, LUNCH: Sun, DINNER: Moon, SNACK: Utensils };

export default function MenuClient({ initialItems }: { initialItems: MenuItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [selectedDay, setSelectedDay] = useState("MONDAY");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setItems(initialItems); }, [initialItems]);

  const [form, setForm] = useState({ dayOfWeek: "MONDAY", mealType: "BREAKFAST", name: "", description: "", status: "ACTIVE" });

  const openCreate = () => {
    setEditing(null);
    setForm({ dayOfWeek: selectedDay, mealType: "BREAKFAST", name: "", description: "", status: "ACTIVE" });
    setShowModal(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditing(item);
    setForm({ dayOfWeek: item.dayOfWeek, mealType: item.mealType, name: item.name, description: item.description || "", status: item.status });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name) return;
    setLoading(true);
    try {
      if (editing) {
        await updateMenuItem(editing.id, form);
        setItems(prev => prev.map(i => i.id === editing.id ? { ...i, ...form, description: form.description || null } : i));
      } else {
        await createMenuItem(form);
        setItems(prev => [...prev, { id: `temp-${Date.now()}`, ...form, description: form.description || null }]);
      }
      setShowModal(false);
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this menu item?")) return;
    await deleteMenuItem(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const dayItems = items.filter(i => i.dayOfWeek === selectedDay);

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl hidden md:block"><Utensils className="w-6 h-6" /></div>
            <div>
              <h2 className="text-lg font-black text-slate-800">Weekly Meal Plan</h2>
              <p className="text-sm font-medium text-slate-500">Manage daily menu for breakfast, lunch, dinner, and snacks.</p>
            </div>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
            <Plus className="w-4 h-4" /> Add Menu Item
          </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-wrap gap-2">
          {DAYS.map(day => (
            <button key={day} onClick={() => setSelectedDay(day)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedDay === day ? "bg-primary-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              {day.slice(0, 3)}
            </button>
          ))}
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MEALS.map(meal => {
              const mealItems = dayItems.filter(i => i.mealType === meal);
              const Icon = mealIcons[meal] || Utensils;
              return (
                <div key={meal} className="bg-slate-50/80 rounded-2xl border border-slate-200/60 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm"><Icon className="w-5 h-5 text-orange-500" /></div>
                    <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">{meal}</h3>
                  </div>
                  {mealItems.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No items planned</p>
                  ) : (
                    <div className="space-y-2">
                      {mealItems.map(item => (
                        <div key={item.id} className="flex justify-between items-start bg-white p-3 rounded-xl border border-slate-100 group">
                          <div>
                            <p className="font-bold text-slate-700 text-sm">{item.name}</p>
                            {item.description && <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>}
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(item)} className="p-1 hover:bg-primary-50 rounded text-primary-600"><Edit3 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-1 hover:bg-rose-50 rounded text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-800">{editing ? "Edit Menu Item" : "Add Menu Item"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Day *</label>
                  <select value={form.dayOfWeek} onChange={e => setForm(p => ({ ...p, dayOfWeek: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900">
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Meal Type *</label>
                  <select value={form.mealType} onChange={e => setForm(p => ({ ...p, mealType: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900">
                    {MEALS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1 block">Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" placeholder="e.g. Tea, Bread, Eggs" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1 block">Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" placeholder="Optional details..." />
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
