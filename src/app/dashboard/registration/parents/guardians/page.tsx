"use client";

import React, { useState } from "react";
import {
  Search, Plus, MoreHorizontal, Eye, ChevronLeft, ChevronRight,
  Shield, CheckCircle2, XCircle, AlertTriangle, Phone,
  Car, UserCheck, ShieldCheck, ShieldAlert, Edit2, Trash2, X
} from "lucide-react";

const INITIAL_GUARDIANS = [
  { id: "GRD-001", name: "Peter Kamau",      initials: "PK", relation: "Uncle",        phone: "+254 712 000 001", linkedStudent: "John Kamau · Gr 4",        linkedParent: "Alice Mwangangi", pickupAuth: true,  idVerified: true,  status: "Verified",  notes: "Primary emergency contact" },
  { id: "GRD-002", name: "Ruth Ochieng",     initials: "RO", relation: "Aunt",         phone: "+254 723 000 002", linkedStudent: "Brian Ochieng · Gr 6",     linkedParent: "David Ochieng",   pickupAuth: true,  idVerified: true,  status: "Verified",  notes: "Can collect Mon–Wed only" },
  { id: "GRD-003", name: "Stephen Njau",     initials: "SN", relation: "Grandfather",  phone: "+254 734 000 003", linkedStudent: "Mary Njau · Gr 2",         linkedParent: "Grace Njau",      pickupAuth: false, idVerified: false, status: "Pending",   notes: "Awaiting ID verification" },
  { id: "GRD-004", name: "Agnes Kiprotich",  initials: "AK", relation: "Elder Sister", phone: "+254 745 000 004", linkedStudent: "Mercy Kiprotich · Gr 5",   linkedParent: "Paul Kiprotich",  pickupAuth: true,  idVerified: true,  status: "Verified",  notes: "" },
  { id: "GRD-005", name: "Samson Omondi",    initials: "SO", relation: "Uncle",        phone: "+254 756 000 005", linkedStudent: "Liam Omondi · Gr 6",       linkedParent: "Jane Omondi",     pickupAuth: true,  idVerified: false, status: "Unverified",notes: "ID pending" },
  { id: "GRD-006", name: "Zainab Ali",       initials: "ZA", relation: "Mother's Sis", phone: "+254 767 000 006", linkedStudent: "Fatuma Ali · Gr 6",        linkedParent: "Mohammed Ali",    pickupAuth: false, idVerified: true,  status: "Pending",   notes: "Pickup auth not granted" },
  { id: "GRD-007", name: "Mark Mutua",       initials: "MM", relation: "Elder Brother",phone: "+254 778 000 007", linkedStudent: "Brian Mutua · Jnr Sec",   linkedParent: "Catherine Mutua", pickupAuth: true,  idVerified: true,  status: "Verified",  notes: "Friday pickup only" },
  { id: "GRD-008", name: "Joseph Wanjiru",   initials: "JW", relation: "Grandfather",  phone: "+254 789 000 008", linkedStudent: "Mercy Wanjiru · Gr 4",     linkedParent: "James Wanjiru",   pickupAuth: true,  idVerified: true,  status: "Verified",  notes: "" },
];

const statusConfig = {
  Verified:   { pill: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: ShieldCheck },
  Pending:    { pill: "bg-amber-100 text-amber-700 border-amber-200",       icon: AlertTriangle },
  Unverified: { pill: "bg-rose-100 text-rose-700 border-rose-200",          icon: ShieldAlert },
};

const avatarGrads = [
  "from-primary-700 to-primary-900", "from-secondary-500 to-secondary-700",
  "from-indigo-500 to-violet-600",   "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-500",    "from-sky-500 to-blue-600",
  "from-pink-500 to-rose-600",       "from-cyan-500 to-blue-500",
];

const STATUSES = ["All", "Verified", "Pending", "Unverified"];

export default function GuardiansPage() {
  const [guardians, setGuardians] = useState(INITIAL_GUARDIANS);
  const [search, setSearch]   = useState("");
  const [statusF, setStatusF] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuardian, setEditingGuardian] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    relation: "",
    phone: "",
    linkedStudent: "",
    linkedParent: "",
    pickupAuth: false,
    idVerified: false,
    status: "Pending",
    notes: ""
  });

  const filtered = guardians.filter(g => {
    const matchSearch = !search || g.name.toLowerCase().includes(search.toLowerCase()) || g.linkedStudent.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusF === "All" || g.status === statusF;
    return matchSearch && matchStatus;
  });

  const counts = {
    Verified:   guardians.filter(g => g.status === "Verified").length,
    Pending:    guardians.filter(g => g.status === "Pending").length,
    Unverified: guardians.filter(g => g.status === "Unverified").length,
    PickupAuth: guardians.filter(g => g.pickupAuth).length,
  };

  const handleOpenAdd = () => {
    setEditingGuardian(null);
    setFormData({
      name: "",
      relation: "",
      phone: "",
      linkedStudent: "",
      linkedParent: "",
      pickupAuth: false,
      idVerified: false,
      status: "Pending",
      notes: ""
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (guardian: any) => {
    setEditingGuardian(guardian);
    setFormData({
      name: guardian.name,
      relation: guardian.relation,
      phone: guardian.phone,
      linkedStudent: guardian.linkedStudent,
      linkedParent: guardian.linkedParent,
      pickupAuth: guardian.pickupAuth,
      idVerified: guardian.idVerified,
      status: guardian.status,
      notes: guardian.notes
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if(confirm("Are you sure you want to delete this guardian?")) {
      setGuardians(guardians.filter(g => g.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate initials from name
    const nameParts = formData.name.trim().split(" ");
    let initials = "NA";
    if (nameParts.length >= 2) {
      initials = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    } else if (nameParts.length === 1 && nameParts[0].length > 0) {
      initials = nameParts[0].substring(0, 2).toUpperCase();
    }

    if (editingGuardian) {
      setGuardians(guardians.map(g => 
        g.id === editingGuardian.id 
          ? { ...g, ...formData, initials } 
          : g
      ));
    } else {
      const newId = `GRD-${Math.floor(1000 + Math.random() * 9000)}`;
      setGuardians([{ id: newId, ...formData, initials }, ...guardians]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Verified",        value: counts.Verified,   icon: ShieldCheck,  color: "from-emerald-600 to-teal-600" },
          { label: "Pending Review",  value: counts.Pending,    icon: AlertTriangle, color: "from-amber-500 to-orange-500" },
          { label: "Unverified",      value: counts.Unverified, icon: ShieldAlert,   color: "from-rose-600 to-red-600" },
          { label: "Pickup Authorised", value: counts.PickupAuth, icon: Car,         color: "from-indigo-600 to-violet-600" },
        ].map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-2xl p-4 text-white shadow-md flex items-center gap-3`}>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-black">{c.value}</p>
                <p className="text-xs font-bold text-white/80 leading-tight">{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table card */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg overflow-hidden">

        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white/80">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search guardians or students..."
                className="pl-9 pr-4 py-2 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all w-56 placeholder:text-slate-400"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {STATUSES.map(s => (
                <button key={s} onClick={() => setStatusF(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${statusF === s ? "bg-primary-900 text-white shadow-md shadow-primary-900/20" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm">
              <UserCheck className="w-4 h-4" /> Verify Auth
            </button>
            <button 
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-4 py-2 text-sm font-black text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-md shadow-primary-900/20 hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Guardian
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Guardian</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Relation</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Phone</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Linked Student</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Parent</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Pickup Auth</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">ID Check</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-sm font-bold text-slate-500">
                    No guardians found.
                  </td>
                </tr>
              ) : (
                filtered.map((g, i) => {
                  const cfg = statusConfig[g.status as keyof typeof statusConfig] || statusConfig.Pending;
                  const StatusIcon = cfg.icon;
                  return (
                    <tr key={g.id} className="hover:bg-primary-50/40 border-l-4 border-transparent hover:border-l-secondary-500 transition-all group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarGrads[i % avatarGrads.length]} flex items-center justify-center text-white text-[10px] font-black shadow-sm flex-shrink-0`}>
                            {g.initials}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{g.name}</p>
                            <p className="text-[10px] font-black text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">{g.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg">{g.relation}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1 text-xs font-bold text-slate-600">
                          <Phone className="w-3 h-3 text-slate-400" />{g.phone}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[10px] font-bold text-primary-800 bg-primary-50 border border-primary-100 px-2 py-0.5 rounded-lg">{g.linkedStudent}</span>
                      </td>
                      <td className="px-5 py-3.5 text-xs font-bold text-slate-500">{g.linkedParent}</td>
                      <td className="px-5 py-3.5">
                        {g.pickupAuth ? (
                          <span className="flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg w-fit">
                            <CheckCircle2 className="w-3 h-3" /> Yes
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-black text-rose-700 bg-rose-50 border border-rose-200 px-2 py-1 rounded-lg w-fit">
                            <XCircle className="w-3 h-3" /> No
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {g.idVerified ? (
                          <span className="flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg w-fit">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg w-fit">
                            <AlertTriangle className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black border w-fit ${cfg.pill}`}>
                          <StatusIcon className="w-3 h-3" />{g.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenEdit(g)}
                            className="p-1.5 text-primary-600 bg-primary-50 hover:bg-primary-100 border border-primary-100 rounded-lg"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(g.id)}
                            className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/60">
          <span className="font-bold">Showing <span className="text-primary-900">{filtered.length}</span> of {guardians.length} guardians</span>
          <div className="flex items-center gap-1">
            <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 bg-white rounded-lg font-bold disabled:opacity-40" disabled>
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-900 text-white text-xs font-black">1</button>
            <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 bg-white rounded-lg font-bold">
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">
                {editingGuardian ? "Edit Guardian" : "Add New Guardian"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="guardianForm" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Guardian Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      placeholder="e.g. Peter Kamau"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Relation</label>
                    <input 
                      type="text" 
                      required
                      value={formData.relation}
                      onChange={e => setFormData({...formData, relation: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      placeholder="e.g. Uncle"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      placeholder="+254..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                    >
                      <option value="Verified">Verified</option>
                      <option value="Pending">Pending</option>
                      <option value="Unverified">Unverified</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Linked Student</label>
                    <input 
                      type="text" 
                      required
                      value={formData.linkedStudent}
                      onChange={e => setFormData({...formData, linkedStudent: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      placeholder="e.g. John Kamau · Gr 4"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Linked Parent</label>
                    <input 
                      type="text" 
                      required
                      value={formData.linkedParent}
                      onChange={e => setFormData({...formData, linkedParent: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      placeholder="e.g. Alice Mwangangi"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.pickupAuth}
                      onChange={e => setFormData({...formData, pickupAuth: e.target.checked})}
                      className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
                    />
                    Pickup Authorized
                  </label>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.idVerified}
                      onChange={e => setFormData({...formData, idVerified: e.target.checked})}
                      className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
                    />
                    ID Verified
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Notes</label>
                  <textarea 
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all min-h-[80px]"
                    placeholder="Any additional notes..."
                  />
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="guardianForm"
                className="px-4 py-2 text-sm font-black text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-md shadow-primary-900/20 transition-all"
              >
                {editingGuardian ? "Save Changes" : "Add Guardian"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}