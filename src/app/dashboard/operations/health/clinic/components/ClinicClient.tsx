"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  Syringe,
  Settings2,
  ShieldCheck,
  AlertCircle,
  Edit2,
  Trash2,
} from "lucide-react";
import {
  createClinicInventoryItem,
  updateClinicInventoryItem,
  deleteClinicInventoryItem,
} from "../actions";
import StockModal from "./StockModal";

interface ClinicItem {
  id: string;
  tenantId: string;
  itemName: string;
  quantity: number;
  unit: string | null;
  expiryDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function ClinicClient({
  initialItems,
}: {
  initialItems: ClinicItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClinicItem | null>(null);

  // Sync state with props on revalidation
  React.useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.itemName.toLowerCase().includes(search.toLowerCase()) ||
        (item.unit || "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All Statuses" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  const handleSave = async (data: {
    itemName: string;
    quantity: number;
    unit?: string;
    expiryDate?: string;
    status?: string;
  }) => {
    try {
      if (editingItem) {
        await updateClinicInventoryItem(editingItem.id, data);
      } else {
        await createClinicInventoryItem(data);
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
        await deleteClinicInventoryItem(id);
      } catch (error) {
        console.error("Failed to delete item", error);
        alert("Error deleting item");
      }
    }
  };

  const formatExpiry = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "IN_STOCK":
        return "Adequate";
      case "LOW_STOCK":
        return "Low Stock";
      case "OUT_OF_STOCK":
        return "Out of Stock";
      default:
        return status;
    }
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hidden md:block">
              <Syringe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">
                Medical Inventory
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Track critical medical supplies and expiry dates.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
          >
            <Plus className="w-4 h-4" />
            Add Stock
          </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Item Name or Unit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
            >
              <option>All Statuses</option>
              <option value="IN_STOCK">Adequate</option>
              <option value="LOW_STOCK">Low Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Item Details
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                    Stock Level
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status & Expiry
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-800 text-sm leading-tight block mb-1">
                        {item.itemName}
                      </span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
                        {item.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-100/50">
                        {item.unit || "—"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex flex-col items-center">
                        <span
                          className={`text-lg font-black ${
                            item.status !== "IN_STOCK"
                              ? "text-amber-600"
                              : "text-slate-800"
                          }`}
                        >
                          {item.quantity}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col items-start gap-1">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg ${
                            item.status === "IN_STOCK"
                              ? "bg-emerald-50 text-emerald-600"
                              : item.status === "LOW_STOCK"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          {item.status === "IN_STOCK" && (
                            <ShieldCheck className="w-3.5 h-3.5" />
                          )}
                          {(item.status === "LOW_STOCK" ||
                            item.status === "OUT_OF_STOCK") && (
                            <AlertCircle className="w-3.5 h-3.5" />
                          )}
                          {getStatusLabel(item.status)}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 ml-1">
                          Expiry: {formatExpiry(item.expiryDate)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setIsModalOpen(true);
                          }}
                          className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors inline-flex"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors inline-flex"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-slate-500 text-sm"
                    >
                      No inventory items found. Click &quot;Add Stock&quot; to add your
                      first item.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <StockModal
          initialData={editingItem}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSave}
        />
      )}
    </>
  );
}
