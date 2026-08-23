"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, Check, X, Clock, HelpCircle, FileCheck, CheckCircle2, TrendingUp, AlertCircle, FileText } from "lucide-react";

type RequestStatus = "Pending" | "Approved" | "Rejected";

interface TrainingRequest {
  id: string;
  employee: string;
  role: string;
  course: string;
  provider: string;
  cost: number;
  status: RequestStatus;
  date: string;
}

const initialRequests: TrainingRequest[] = [];

export default function RequestsPage() {
  const [requests, setRequests] = useState<TrainingRequest[]>(initialRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All Statuses");

  const handleApprove = (id: string) => {
    setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: "Approved" } : r));
  };

  const handleReject = (id: string) => {
    setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: "Rejected" } : r));
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesSearch = req.employee.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            req.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            req.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All Statuses" || req.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter(r => r.status === "Pending").length;
    const approved = requests.filter(r => r.status === "Approved").length;
    const rejected = requests.filter(r => r.status === "Rejected").length;
    const totalCost = requests.filter(r => r.status === "Approved").reduce((sum, r) => sum + r.cost, 0);

    return { total, pending, approved, rejected, totalCost };
  }, [requests]);

  const formatCost = (cost: number) => cost === 0 ? "Free" : `$${cost.toFixed(2)}`;

  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl">
             <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Requests</p>
            <p className="text-2xl font-black text-slate-800">{stats.total}</p>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
             <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-black text-slate-800">{stats.pending}</p>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
             <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved</p>
            <p className="text-2xl font-black text-slate-800">{stats.approved}</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
             <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved Cost</p>
            <p className="text-2xl font-black text-slate-800">{formatCost(stats.totalCost)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-2 bg-primary-50 text-primary-600 rounded-xl hidden md:block">
                 <FileCheck className="w-5 h-5" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Training Requests & Approvals</h2>
                 <p className="text-sm font-medium text-slate-500">Manage budget and enrollment approvals for external and internal courses.</p>
              </div>
           </div>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search by employee, role, or course..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" 
              />
           </div>
           <div className="flex gap-2">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
              >
                 <option value="All Statuses">All Statuses</option>
                 <option value="Pending">Pending</option>
                 <option value="Approved">Approved</option>
                 <option value="Rejected">Rejected</option>
              </select>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Request ID</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Course / Program</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Est. Cost</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Manager Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length > 0 ? filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-700 text-sm">{req.id}</span>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{req.date}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-800 text-sm">{req.employee}</span>
                    <p className="text-xs text-slate-500 font-medium">{req.role}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-800 text-sm">{req.course}</p>
                    <p className="text-xs text-slate-500 font-medium">Provider: {req.provider}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-sm font-black ${req.cost === 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {formatCost(req.cost)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                      req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
                      req.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {req.status === 'Approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {req.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                      {req.status === 'Rejected' && <X className="w-3.5 h-3.5" />}
                      {req.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {req.status === 'Pending' ? (
                       <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleApprove(req.id)} 
                            className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors tooltip-trigger" 
                            title="Approve"
                          >
                             <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleReject(req.id)} 
                            className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors tooltip-trigger" 
                            title="Reject"
                          >
                             <X className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors tooltip-trigger" 
                            title="Request Details"
                          >
                             <HelpCircle className="w-4 h-4" />
                          </button>
                       </div>
                    ) : (
                       <button className="text-sm font-bold text-primary-600 hover:text-primary-800 hover:underline">
                         View Details
                       </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                    No requests found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
