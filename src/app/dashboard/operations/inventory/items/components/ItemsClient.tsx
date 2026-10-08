"use client";

import React, { useState, useMemo } from "react";
import { Package, Search, Filter, Plus, AlertCircle, CheckCircle2, Edit2, Trash2 } from "lucide-react";
import { createInventoryItem, updateInventoryItem, deleteInventoryItem } from "../actions";
import ItemModal from "./ItemModal";

export default function ItemsClient({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Sync state with props in case of revalidation
  React.useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const categories = useMemo(() => {
    const cats = new Set(initialItems.map(i => i.category));
    return ["All Categories", ...Array.from(cats)];
  }, [initialItems]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                            item.code.toLowerCase().includes(search.toLowerCase()) ||
                            item.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "All Categories" || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, categoryFilter]);

  const handleSave = async (data: any) => {
    try {
      if (editingItem) {
        await updateInventoryItem(editingItem.id, data);
      } else {
        await createInventoryItem(data);
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Failed to save item", error);
      alert("Error saving item");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteInventoryItem(id);
      } catch (error) {
        console.error("Failed to delete item", error);
        alert("Error deleting item");
      }
    }
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hidden md:block">
                 <Package className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Item Master (SKU Catalog)</h2>
                 <p className="text-sm font-medium text-slate-500">Central database of all trackable inventory items.</p>
              </div>
           </div>
           <button 
              onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
           >
              <Plus className="w-4 h-4" />
              Add New SKU
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search by SKU, Name, or Category..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" 
              />
           </div>
           <div className="flex gap-2">
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
              >
                 {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 Filter
              </button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">SKU & Item Name</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">In Stock (UoM)</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Unit Value</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{item.code}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium text-slate-600 text-sm">{item.category}</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex flex-col items-end">
                       <span className={`font-black text-sm ${item.qty <= item.minStockLevel ? 'text-rose-600' : 'text-slate-800'}`}>
                          {item.qty}
                       </span>
                       <span className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{item.unit}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="font-bold text-slate-700 text-sm">{item.value}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                      item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600' : 
                      item.status === 'Out of Stock' ? 'bg-rose-50 text-rose-600' : 
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {item.status === 'In Stock' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {(item.status === 'Out of Stock' || item.status === 'Low Stock') && <AlertCircle className="w-3.5 h-3.5" />}
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                    No items found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ItemModal 
          initialData={editingItem}
          onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
          onSave={handleSave}
        />
      )}
    </>
  );
}
