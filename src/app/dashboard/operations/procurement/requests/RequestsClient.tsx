"use client";

import React, { useState } from "react";
import { FileText, Search, Filter, Clock, CheckCircle2, XCircle, MoreHorizontal, Plus, X } from "lucide-react";
import { createPurchaseRequest } from "./actions";
import { PurchaseRequest } from "@prisma/client";

export default function RequestsClient({ requests, summary }: { requests: PurchaseRequest[], summary: { total: number, pending: number, approvedValue: number } }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createPurchaseRequest({
        department: formData.get("department") as string,
        description: formData.get("description") as string,
        amount: parseFloat(formData.get("amount") as string),
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.requestNumber.toLowerCase().includes(search.toLowerCase()) || 
                          r.description.toLowerCase().includes(search.toLowerCase()) || 
                          (r.department && r.department.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "All Statuses" || r.status === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl hidden md:block">
                 <FileText className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Purchase Requests</h2>
                 <p className="text-sm font-medium text-slate-500">Track and manage internal requisition requests from all departments.</p>
              </div>
           </div>
           <div className="flex gap-4 items-center">
              <div className="text-center px-4 border-r border-slate-200">
                 <p className="text-2xl font-black text-slate-800">{summary.total}</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total this month</p>
              </div>
              <div className="text-center px-4 border-r border-slate-200">
                 <p className="text-2xl font-black text-amber-600">{summary.pending}</p>
                 <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Pending Approval</p>
              </div>
              <div className="text-center px-4">
                 <p className="text-2xl font-black text-emerald-600">${(summary.approvedValue / 1000).toFixed(1)}k</p>
                 <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Approved Value</p>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="ml-2 flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Plus className="w-4 h-4" />
                 New Request
              </button>
           </div>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by ID, description, or department..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Statuses</option>
                 <option>Pending</option>
                 <option>Approved</option>
                 <option>Rejected</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 More Filters
              </button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Request ID</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Estimated Cost</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-700 text-sm">{req.requestNumber}</span>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{new Date(req.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-800 text-sm">{req.department || "N/A"}</span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-800 text-sm">{req.description}</p>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="font-black text-slate-800 text-sm">${req.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                      req.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 
                      req.status === 'REJECTED' ? 'bg-rose-50 text-rose-600' : 
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {req.status === 'APPROVED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {req.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                      {req.status === 'REJECTED' && <XCircle className="w-3.5 h-3.5" />}
                      {req.status.charAt(0) + req.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                     <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                     </button>
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                 <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">No requests found.</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">New Purchase Request</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Department</label>
                <input required type="text" name="department" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-900 focus:outline-none" placeholder="e.g. IT & Technology" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description (Items Requested)</label>
                <input required type="text" name="description" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-900 focus:outline-none" placeholder="e.g. MacBook Pro M3 (x5)" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Estimated Cost ($)</label>
                <input required type="number" step="0.01" name="amount" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-900 focus:outline-none" placeholder="e.g. 12500.00" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-xl">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl disabled:opacity-50">
                  {loading ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
