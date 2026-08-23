"use client";

import React, { useState, useMemo, useTransition } from "react";
import { FileText, Search, Filter, Download, Mail, Eye, Calendar, DollarSign, CheckCircle2, Clock } from "lucide-react";
import { emailPayslips, markPayslipViewed } from "./actions";

type Staff = {
  id: string;
  firstName: string;
  lastName: string;
  employeeNumber: string;
  department: string;
};

type PayslipData = {
  id: string;
  netPay: number;
  status: string;
  createdAt: Date;
  staff: {
    firstName: string;
    lastName: string;
  };
  payrollRun: {
    period: string;
  };
};

export default function PayslipsClient({ initialPayslips }: { initialPayslips: PayslipData[] }) {
  const [payslips, setPayslips] = useState<PayslipData[]>(initialPayslips);
  const [search, setSearch] = useState("");
  const [periodFilter, setPeriodFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  // Derived state
  const filteredPayslips = useMemo(() => {
    return payslips.filter((ps) => {
      const employeeName = `${ps.staff.firstName} ${ps.staff.lastName}`;
      const matchSearch = employeeName.toLowerCase().includes(search.toLowerCase()) || ps.id.toLowerCase().includes(search.toLowerCase());
      const matchPeriod = periodFilter === "All" || ps.payrollRun.period === periodFilter;
      return matchSearch && matchPeriod;
    });
  }, [payslips, search, periodFilter]);

  const allPeriods = useMemo(() => Array.from(new Set(payslips.map(ps => ps.payrollRun.period))), [payslips]);

  const summary = useMemo(() => {
    const total = filteredPayslips.reduce((sum, ps) => sum + ps.netPay, 0);
    const sentViewed = filteredPayslips.filter(ps => ps.status === "Sent" || ps.status === "Viewed").length;
    const generated = filteredPayslips.filter(ps => ps.status === "Generated").length;
    return {
      totalNetPay: total,
      totalCount: filteredPayslips.length,
      processed: sentViewed,
      pending: generated,
    };
  }, [filteredPayslips]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredPayslips.map(p => p.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleEmailSelected = () => {
    if (selectedIds.size === 0) {
      alert("No payslips selected to email.");
      return;
    }
    const idsToEmail = Array.from(selectedIds);
    startTransition(async () => {
        const result = await emailPayslips(idsToEmail);
        if (result.success) {
            setPayslips(prev => prev.map(ps => selectedIds.has(ps.id) ? { ...ps, status: "Sent" } : ps));
            setSelectedIds(new Set());
            alert(`Successfully emailed ${idsToEmail.length} payslips.`);
        } else {
            alert(result.error || "Failed to email payslips.");
        }
    });
  };

  const handleAction = (id: string, action: string) => {
    if (action === "Email") {
      startTransition(async () => {
          const result = await emailPayslips([id]);
          if (result.success) {
              setPayslips(prev => prev.map(ps => ps.id === id ? { ...ps, status: "Sent" } : ps));
              alert(`Payslip ${id} emailed successfully.`);
          } else {
              alert(result.error || "Failed to email payslip.");
          }
      });
    } else if (action === "View") {
        startTransition(async () => {
            const result = await markPayslipViewed(id);
            if (result.success) {
                setPayslips(prev => prev.map(ps => ps.id === id ? { ...ps, status: "Viewed" } : ps));
                alert(`Viewing payslip ${id}. Status updated to Viewed.`);
            }
        });
    } else if (action === "Download") {
        alert(`Downloading PDF for payslip ${id}...`);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-4">
         <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl hidden md:block">
               <FileText className="w-5 h-5" />
            </div>
            <div>
               <h2 className="text-lg font-black text-slate-800">Payslip Archive</h2>
               <p className="text-sm font-medium text-slate-500">View and manage employee payslips</p>
            </div>
         </div>
         <div className="flex gap-2 w-full md:w-auto">
            <select 
               value={periodFilter} 
               onChange={(e) => setPeriodFilter(e.target.value)}
               className="px-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer w-full md:w-auto"
            >
               <option value="All">All Periods</option>
               {allPeriods.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <button 
               onClick={() => alert("Exporting all visible payslips...")}
               className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20 whitespace-nowrap"
            >
               <Download className="w-4 h-4" />
               Export All
            </button>
         </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Net Pay</p>
            <p className="text-xl font-black text-slate-800">{formatCurrency(summary.totalNetPay)}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Payslips</p>
            <p className="text-xl font-black text-slate-800">{summary.totalCount}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Processed (Sent/Viewed)</p>
            <p className="text-xl font-black text-slate-800">{summary.processed}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending (Generated)</p>
            <p className="text-xl font-black text-slate-800">{summary.pending}</p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                 type="text" 
                 placeholder="Search by employee or ID..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" 
              />
           </div>
           <div className="flex gap-2">
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm"
              >
                 <Filter className="w-4 h-4" />
                 Filter
              </button>
              <button 
                onClick={handleEmailSelected}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm"
              >
                 <Mail className="w-4 h-4" />
                 Email Selected
              </button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 w-12">
                   <input 
                     type="checkbox" 
                     className="rounded border-slate-300 text-primary-600 focus:ring-primary-900" 
                     onChange={handleSelectAll}
                     checked={filteredPayslips.length > 0 && selectedIds.size === filteredPayslips.length}
                   />
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Payslip ID</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Period</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Net Pay</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayslips.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">No payslips found.</td>
                </tr>
              ) : filteredPayslips.map((ps) => (
                <tr key={ps.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-900" 
                      checked={selectedIds.has(ps.id)}
                      onChange={() => handleSelect(ps.id)}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-700 text-sm">{ps.id.substring(0, 8)}...</span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-800 text-sm">{ps.staff.firstName} {ps.staff.lastName}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                       <Calendar className="w-4 h-4 text-slate-400" /> {ps.payrollRun.period}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-black text-slate-800">{formatCurrency(ps.netPay)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                      ps.status === 'Sent' ? 'bg-blue-50 text-blue-600' : 
                      ps.status === 'Viewed' ? 'bg-emerald-50 text-emerald-600' : 
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {ps.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                          onClick={() => handleAction(ps.id, "View")}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors tooltip-trigger" 
                          title="View Payslip"
                       >
                          <Eye className="w-4 h-4" />
                       </button>
                       <button 
                          onClick={() => handleAction(ps.id, "Download")}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors tooltip-trigger" 
                          title="Download PDF"
                       >
                          <Download className="w-4 h-4" />
                       </button>
                       <button 
                          onClick={() => handleAction(ps.id, "Email")}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors tooltip-trigger" 
                          title="Email to Employee"
                       >
                          <Mail className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
