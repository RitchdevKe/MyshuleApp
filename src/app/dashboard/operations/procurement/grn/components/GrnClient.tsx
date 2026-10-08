"use client";

import React, { useState, useTransition } from "react";
import { Truck, Search, Filter, CheckCircle2, AlertTriangle, FileBox, FilePlus, X, Save, Trash2, Edit } from "lucide-react";
import { createGRN, updateGRN, deleteGRN } from "../actions";

export default function GrnClient({
  initialGRNs,
  purchaseOrders
}: {
  initialGRNs: any[];
  purchaseOrders: any[];
}) {
  const [grns, setGrns] = useState(initialGRNs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGRN, setEditingGRN] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  // Form states
  const [grnNumber, setGrnNumber] = useState("");
  const [poId, setPoId] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [condition, setCondition] = useState("GOOD");
  const [status, setStatus] = useState("COMPLETED");
  const [receivedDate, setReceivedDate] = useState(new Date().toISOString().split("T")[0]);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const openModal = (grn: any = null) => {
    if (grn) {
      setEditingGRN(grn);
      setGrnNumber(grn.grnNumber);
      setPoId(grn.poId);
      setReceivedBy(grn.receivedBy);
      setCondition(grn.condition || "GOOD");
      setStatus(grn.status || "COMPLETED");
      setReceivedDate(new Date(grn.receivedDate).toISOString().split("T")[0]);
    } else {
      setEditingGRN(null);
      setGrnNumber(`GRN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
      setPoId("");
      setReceivedBy("");
      setCondition("GOOD");
      setStatus("COMPLETED");
      setReceivedDate(new Date().toISOString().split("T")[0]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!poId) {
      alert("Please select a Purchase Order");
      return;
    }

    const selectedPO = purchaseOrders.find((po) => po.id === poId);
    if (!selectedPO) return;

    const formData = {
      grnNumber,
      poId,
      supplierId: selectedPO.supplierId,
      receivedBy,
      condition,
      status,
      receivedDate,
    };

    startTransition(async () => {
      try {
        if (editingGRN) {
          await updateGRN(editingGRN.id, formData);
          setGrns(grns.map(g => g.id === editingGRN.id ? { ...g, ...formData, purchaseOrder: selectedPO, supplier: selectedPO.supplier } : g));
        } else {
          await createGRN(formData);
          // In a real app we'd fetch the latest or append the new object.
          // For now, we'll optimistically add it with a fake ID so it appears immediately,
          // though Server Action revalidatePath will refresh it.
          window.location.reload(); 
        }
        closeModal();
      } catch (error) {
        console.error("Error saving GRN:", error);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this GRN?")) {
      startTransition(async () => {
        try {
          await deleteGRN(id);
          setGrns(grns.filter(g => g.id !== id));
        } catch (error) {
          console.error("Error deleting GRN:", error);
        }
      });
    }
  };

  const filteredGRNs = grns.filter((g) => {
    const matchesSearch =
      g.grnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.purchaseOrder?.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All Statuses" || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total GRNs</h3>
          <p className="text-3xl font-black text-slate-800 mt-2">{grns.length}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Completed</h3>
          <p className="text-3xl font-black text-emerald-600 mt-2">{grns.filter(g => g.status === 'COMPLETED').length}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Discrepancies</h3>
          <p className="text-3xl font-black text-rose-600 mt-2">{grns.filter(g => g.status === 'DISCREPANCY').length}</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hidden md:block">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">Goods Received Notes (GRN)</h2>
              <p className="text-sm font-medium text-slate-500">Log and verify incoming shipments against original Purchase Orders.</p>
            </div>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
          >
            <FilePlus className="w-4 h-4" />
            Create New GRN
          </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by GRN, PO, or supplier..."
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
              <option>COMPLETED</option>
              <option>DISCREPANCY</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">GRN ID & PO Ref</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Supplier</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Received Info</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status & Condition</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGRNs.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-700 text-sm">{record.grnNumber}</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded uppercase">
                        {record.purchaseOrder?.poNumber || "Unknown PO"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-800 text-sm">{record.supplier?.name || "Unknown"}</span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-700 text-sm">
                      {new Date(record.receivedDate).toLocaleDateString()}
                    </p>
                    <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                      By {record.receivedBy}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg w-fit ${
                          record.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {record.status === "COMPLETED" && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {record.status === "DISCREPANCY" && <AlertTriangle className="w-3.5 h-3.5" />}
                        {record.status}
                      </span>
                      {record.condition && record.condition !== "GOOD" && (
                        <span className="text-[10px] font-bold text-rose-600 max-w-[200px] leading-tight">
                          Note: {record.condition}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal(record)}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Edit GRN"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete GRN"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredGRNs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No Goods Received Notes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">
                {editingGRN ? "Edit GRN" : "Create New GRN"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-slate-200/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">GRN Number</label>
                  <input
                    type="text"
                    required
                    value={grnNumber}
                    onChange={(e) => setGrnNumber(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Purchase Order</label>
                  <select
                    required
                    value={poId}
                    onChange={(e) => setPoId(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  >
                    <option value="" disabled>Select a PO</option>
                    {purchaseOrders.map((po) => (
                      <option key={po.id} value={po.id}>
                        {po.poNumber} - {po.supplier?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Received Date</label>
                  <input
                    type="date"
                    required
                    value={receivedDate}
                    onChange={(e) => setReceivedDate(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Received By</label>
                  <input
                    type="text"
                    required
                    value={receivedBy}
                    onChange={(e) => setReceivedBy(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                    placeholder="E.g. Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  >
                    <option value="COMPLETED">Completed</option>
                    <option value="DISCREPANCY">Discrepancy</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Condition / Notes (Optional)</label>
                  <textarea
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 min-h-[100px]"
                    placeholder="E.g. GOOD, Missing 2 items, 1 damaged box."
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isPending ? "Saving..." : "Save GRN"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
