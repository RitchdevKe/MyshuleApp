"use client";

import React, { useState } from "react";
import { FileSignature, Plus, Search, Filter, AlertCircle, CheckCircle2, Clock, Edit2, Trash2, X } from "lucide-react";

type ContractStatus = "Active" | "Expiring Soon" | "Expired";

interface Contract {
  id: string;
  staffId: string;
  employee: string;
  role: string;
  type: string;
  startDate: string;
  endDate: string;
  status: ContractStatus;
}

const mockStaff = [
  { id: "STF-001", name: "Jane Doe", role: "Senior Mathematics Teacher" },
  { id: "STF-002", name: "Michael Ochieng", role: "IT Support Technician" },
  { id: "STF-003", name: "David Kim", role: "Bus Driver" },
  { id: "STF-004", name: "Emily Chen", role: "School Nurse" },
  { id: "STF-005", name: "Sarah Connor", role: "Head of Sciences" },
  { id: "STF-006", name: "John Smith", role: "Maintenance Supervisor" },
];

const initialContracts: Contract[] = [];

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentContract, setCurrentContract] = useState<Partial<Contract>>({});

  const filteredContracts = contracts.filter(c => 
    c.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = contracts.filter(c => c.status === "Active").length;
  const expiringCount = contracts.filter(c => c.status === "Expiring Soon").length;
  const expiredCount = contracts.filter(c => c.status === "Expired").length;

  const handleOpenAddModal = () => {
    setModalMode("add");
    setCurrentContract({
      staffId: "",
      type: "Permanent",
      startDate: "",
      endDate: "",
      status: "Active"
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (contract: Contract) => {
    setModalMode("edit");
    setCurrentContract({ ...contract });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this contract?")) {
      setContracts(contracts.filter(c => c.id !== id));
    }
  };

  const calculateStatus = (endDate: string): ContractStatus => {
    if (!endDate) return "Active";
    const end = new Date(endDate);
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    if (end < now) return "Expired";
    if (end <= thirtyDaysFromNow) return "Expiring Soon";
    return "Active";
  };

  const handleSaveContract = (e: React.FormEvent) => {
    e.preventDefault();
    const staff = mockStaff.find(s => s.id === currentContract.staffId);
    if (!staff) return;

    const status = calculateStatus(currentContract.endDate || "");

    if (modalMode === "add") {
      const newContract: Contract = {
        id: `CNT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`,
        staffId: staff.id,
        employee: staff.name,
        role: staff.role,
        type: currentContract.type || "Permanent",
        startDate: currentContract.startDate || "",
        endDate: currentContract.endDate || "",
        status
      };
      setContracts([newContract, ...contracts]);
    } else {
      setContracts(contracts.map(c => 
        c.id === currentContract.id ? { 
          ...c, 
          staffId: staff.id,
          employee: staff.name,
          role: staff.role,
          type: currentContract.type || c.type,
          startDate: currentContract.startDate || c.startDate,
          endDate: currentContract.endDate || c.endDate,
          status 
        } : c
      ));
    }
    setIsModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // fallback
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
             <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Contracts</p>
            <p className="text-2xl font-black text-slate-800">{activeCount}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
             <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expiring in 30 Days</p>
            <p className="text-2xl font-black text-slate-800">{expiringCount}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
             <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expired</p>
            <p className="text-2xl font-black text-slate-800">{expiredCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search contracts..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" 
              />
           </div>
           <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 Status Filter
              </button>
              <button 
                onClick={handleOpenAddModal}
                className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
              >
                 <Plus className="w-4 h-4" />
                 Generate Contract
              </button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Contract ID</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-700 text-sm">{contract.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-800 text-sm">{contract.employee}</p>
                    <p className="text-xs text-slate-500 font-medium">{contract.role}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">{contract.type}</span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-slate-600 font-medium">{formatDate(contract.startDate)}</p>
                    <p className="text-xs text-slate-400">to {formatDate(contract.endDate)}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                      contract.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                      contract.status === 'Expiring Soon' ? 'bg-amber-50 text-amber-600' : 
                      'bg-red-50 text-red-600'
                    }`}>
                      {contract.status === 'Active' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {contract.status === 'Expiring Soon' && <Clock className="w-3.5 h-3.5" />}
                      {contract.status === 'Expired' && <AlertCircle className="w-3.5 h-3.5" />}
                      {contract.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenEditModal(contract)}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Edit Contract"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(contract.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Contract"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {contract.status !== 'Active' && (
                        <button className="text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 px-3 py-1.5 rounded-lg transition-colors">Renew</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredContracts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No contracts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">
                {modalMode === "add" ? "Generate Contract" : "Edit Contract"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="contract-form" onSubmit={handleSaveContract} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Staff Member</label>
                  <select 
                    required
                    value={currentContract.staffId || ""}
                    onChange={(e) => setCurrentContract({...currentContract, staffId: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  >
                    <option value="" disabled>Select a staff member</option>
                    {mockStaff.map(staff => (
                      <option key={staff.id} value={staff.id}>{staff.name} - {staff.role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Contract Type</label>
                  <select 
                    required
                    value={currentContract.type || ""}
                    onChange={(e) => setCurrentContract({...currentContract, type: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  >
                    <option value="Permanent">Permanent</option>
                    <option value="Fixed-Term (1 Yr)">Fixed-Term (1 Yr)</option>
                    <option value="Fixed-Term (6 Mo)">Fixed-Term (6 Mo)</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contractor">Contractor</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Start Date</label>
                    <input 
                      type="date"
                      required
                      value={currentContract.startDate || ""}
                      onChange={(e) => setCurrentContract({...currentContract, startDate: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">End Date</label>
                    <input 
                      type="date"
                      value={currentContract.endDate || ""}
                      onChange={(e) => setCurrentContract({...currentContract, endDate: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                    />
                    <p className="text-xs text-slate-500 mt-1">Leave empty for Permanent</p>
                  </div>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/50">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-bold text-sm rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="contract-form"
                className="px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white font-bold text-sm rounded-xl transition-all shadow-sm shadow-primary-900/20"
              >
                {modalMode === "add" ? "Generate Contract" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
