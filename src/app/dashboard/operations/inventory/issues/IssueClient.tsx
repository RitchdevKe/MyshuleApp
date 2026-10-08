"use client";

import React, { useState } from "react";
import { History, Search, Filter, CheckCircle2, Clock, XCircle, PackageOpen, Plus, Loader2 } from "lucide-react";
import { createStockIssue, deleteStockIssue } from "./actions";

type Issue = {
  id: string;
  issueNumber: string;
  itemId: string;
  storeId: string;
  quantity: number;
  issuedTo: string;
  department: string | null;
  status: string;
  date: Date;
  notes: string | null;
  item: { name: string; unit: string };
  store: { name: string };
};

type Store = { id: string; name: string };
type Item = { id: string; name: string; unit: string };

export default function IssueClient({ 
  issues: initialIssues,
  stores,
  items,
  summary
}: { 
  issues: Issue[];
  stores: Store[];
  items: Item[];
  summary: { total: number; pending: number; fulfilled: number; rejected: number };
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredIssues = initialIssues.filter(issue => {
    const matchesSearch = 
      issue.issueNumber.toLowerCase().includes(search.toLowerCase()) || 
      issue.issuedTo.toLowerCase().includes(search.toLowerCase()) ||
      issue.item.name.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || issue.status.toUpperCase() === statusFilter.toUpperCase();
    
    return matchesSearch && matchesStatus;
  });

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createStockIssue({
        itemId: formData.get("itemId") as string,
        storeId: formData.get("storeId") as string,
        quantity: Number(formData.get("quantity")),
        issuedTo: formData.get("issuedTo") as string,
        department: formData.get("department") as string,
        notes: formData.get("notes") as string,
      });
      setIsModalOpen(false);
    } catch (error: any) {
      alert(error.message || "Failed to create issue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this issue?")) {
      await deleteStockIssue(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Cards for Aggregated Data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Total Issues</p>
          <p className="text-2xl font-black text-slate-800 mt-1">{summary.total}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Pending</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{summary.pending}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Fulfilled</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{summary.fulfilled}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Rejected</p>
          <p className="text-2xl font-black text-rose-600 mt-1">{summary.rejected}</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl hidden md:block">
                 <History className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Stock Issues & Dispatch</h2>
                 <p className="text-sm font-medium text-slate-500">Track internal requests and distribution of inventory items.</p>
              </div>
           </div>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
           >
              <Plus className="w-4 h-4" />
              New Issue Request
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search by ID, Requester, or Item..." 
                className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           <div className="flex gap-2">
              <select 
                className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                 <option value="All">All Statuses</option>
                 <option value="PENDING">Pending</option>
                 <option value="COMPLETED">Fulfilled</option>
                 <option value="REJECTED">Rejected</option>
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
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Issue ID</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Requester & Dept</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Requested Items</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Source Store</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIssues.map((issue) => (
                <tr key={issue.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-700 text-sm">{issue.issueNumber}</span>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{new Date(issue.date).toLocaleDateString()}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-800 text-sm">{issue.issuedTo}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{issue.department}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-700 text-sm">{issue.item.name} (x{issue.quantity} {issue.item.unit})</p>
                  </td>
                  <td className="py-4 px-6">
                     <span className="text-xs font-medium text-slate-600">{issue.store.name}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                      issue.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 
                      issue.status === 'PARTIAL' ? 'bg-blue-50 text-blue-600' : 
                      issue.status === 'REJECTED' ? 'bg-rose-50 text-rose-600' : 
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {issue.status === 'COMPLETED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {issue.status === 'PARTIAL' && <PackageOpen className="w-3.5 h-3.5" />}
                      {issue.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                      {issue.status === 'REJECTED' && <XCircle className="w-3.5 h-3.5" />}
                      {issue.status === 'COMPLETED' ? 'Fulfilled' : issue.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleDelete(issue.id)}
                          className="text-sm font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                           Delete
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
              {filteredIssues.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-slate-500">
                    No issues found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">New Issue Request</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-sm font-bold text-slate-700">Item to Issue</label>
                  <select name="itemId" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900">
                    <option value="">Select Item</option>
                    {items.map(i => <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Source Store</label>
                  <select name="storeId" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900">
                    <option value="">Select Store</option>
                    {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Quantity</label>
                  <input type="number" name="quantity" required min="1" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" placeholder="e.g. 5" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Issued To</label>
                  <input type="text" name="issuedTo" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" placeholder="e.g. John Doe" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Department</label>
                  <input type="text" name="department" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" placeholder="e.g. IT" />
                </div>
                
                <div className="space-y-1.5 col-span-2">
                  <label className="text-sm font-bold text-slate-700">Notes (Optional)</label>
                  <textarea name="notes" rows={2} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" placeholder="Any additional notes..." />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20 disabled:opacity-70"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Complete Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
