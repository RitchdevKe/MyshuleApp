"use client";

import React, { useState } from "react";
import {
  ShoppingCart,
  Search,
  Filter,
  Mail,
  Truck,
  CheckCircle2,
  Download,
  Printer,
  Plus,
  X,
  Edit,
  Trash2,
} from "lucide-react";
import { createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder } from "../actions";

type PO = any; // We can type this better, but for now `any` to avoid TS issues during drafting
type Request = any;
type Supplier = any;

export default function POClient({
  initialPOs,
  requests,
  suppliers,
}: {
  initialPOs: PO[];
  requests: Request[];
  suppliers: Supplier[];
}) {
  const [purchaseOrders, setPurchaseOrders] = useState<PO[]>(initialPOs);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    poNumber: "",
    requestId: "",
    supplierId: "",
    totalAmount: 0,
    status: "DRAFT",
    expectedDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPOsCount = purchaseOrders.length;
  const totalValue = purchaseOrders.reduce((acc, po) => acc + (po.totalAmount || 0), 0);

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplier.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All Statuses" || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (po?: PO) => {
    if (po) {
      setEditingId(po.id);
      setFormData({
        poNumber: po.poNumber,
        requestId: po.requestId,
        supplierId: po.supplierId,
        totalAmount: po.totalAmount,
        status: po.status,
        expectedDate: po.deliveryDate
          ? new Date(po.deliveryDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      setEditingId(null);
      setFormData({
        poNumber: `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        requestId: "",
        supplierId: "",
        totalAmount: 0,
        status: "DRAFT",
        expectedDate: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updatePurchaseOrder(editingId, formData);
        setPurchaseOrders((prev) =>
          prev.map((p) =>
            p.id === editingId
              ? {
                  ...p,
                  ...formData,
                  supplier: suppliers.find((s) => s.id === formData.supplierId),
                  request: requests.find((r) => r.id === formData.requestId),
                  deliveryDate: formData.expectedDate,
                }
              : p
          )
        );
      } else {
        await createPurchaseOrder(formData);
        // Quick optimistic update for direct display without reload
        const tempId = Math.random().toString();
        setPurchaseOrders((prev) => [
          {
            id: tempId,
            ...formData,
            createdAt: new Date().toISOString(),
            supplier: suppliers.find((s) => s.id === formData.supplierId),
            request: requests.find((r) => r.id === formData.requestId),
            deliveryDate: formData.expectedDate,
          },
          ...prev,
        ]);
      }
      handleCloseModal();
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this PO?")) return;
    try {
      await deletePurchaseOrder(id);
      setPurchaseOrders((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hidden md:block">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">
                Purchase Orders (POs)
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Track and manage issued POs to external suppliers.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-center px-4 border-r border-slate-200">
              <p className="text-2xl font-black text-slate-800">
                {totalPOsCount}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total POs
              </p>
            </div>
            <div className="text-center px-4">
              <p className="text-2xl font-black text-indigo-600">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                Total Value
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create PO
            </button>
          </div>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search PO number or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              <option value="DRAFT">Draft</option>
              <option value="SENT">Sent</option>
              <option value="PARTIALLY_FULFILLED">Partially Fulfilled</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  PO Number
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Total Value
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Delivery Window
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPOs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No purchase orders found.
                  </td>
                </tr>
              ) : (
                filteredPOs.map((po) => (
                  <tr
                    key={po.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-700 text-sm">
                        {po.poNumber}
                      </span>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                        Issued:{" "}
                        {po.createdAt
                          ? new Date(po.createdAt).toLocaleDateString()
                          : "-"}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-800 text-sm">
                        {po.supplier?.name || "Unknown"}
                      </span>
                      {po.request && (
                        <p className="text-[10px] font-bold text-slate-500 mt-0.5">
                          Req: {po.request.requestNumber}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-black text-slate-800 text-sm">
                        ${po.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-700 text-sm">
                        Exp:{" "}
                        {po.deliveryDate
                          ? new Date(po.deliveryDate).toLocaleDateString()
                          : "TBD"}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                          po.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-600"
                            : po.status === "PARTIALLY_FULFILLED"
                            ? "bg-amber-50 text-amber-600"
                            : po.status === "SENT"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {po.status === "COMPLETED" && (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        {po.status === "PARTIALLY_FULFILLED" && (
                          <Truck className="w-3.5 h-3.5" />
                        )}
                        {po.status === "SENT" && (
                          <Mail className="w-3.5 h-3.5" />
                        )}
                        {po.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal(po)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit PO"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(po.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete PO"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Print PO"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">
                {editingId ? "Edit Purchase Order" : "Create Purchase Order"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    PO Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.poNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, poNumber: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="SENT">Sent</option>
                    <option value="PARTIALLY_FULFILLED">Partially Fulfilled</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Purchase Request
                </label>
                <select
                  required
                  value={formData.requestId}
                  onChange={(e) =>
                    setFormData({ ...formData, requestId: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a Request...</option>
                  {requests.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.requestNumber} - {r.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Supplier
                </label>
                <select
                  required
                  value={formData.supplierId}
                  onChange={(e) =>
                    setFormData({ ...formData, supplierId: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a Supplier...</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Total Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.totalAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalAmount: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Expected Delivery Date
                  </label>
                  <input
                    type="date"
                    value={formData.expectedDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expectedDate: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Purchase Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
