"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Plus, MoreHorizontal, Eye, Mail, Phone,
  MessageSquare, ChevronLeft, ChevronRight, Link2,
  CheckCircle2, XCircle, SlidersHorizontal, GraduationCap, Edit, Trash2, X
} from "lucide-react";
import { addParent, updateParent, deleteParent } from "@/app/actions/parents";

const avatarGrads = [
  "from-primary-700 to-primary-900", "from-secondary-500 to-secondary-700",
  "from-indigo-500 to-violet-600",   "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-500",    "from-sky-500 to-blue-600",
  "from-pink-500 to-rose-600",       "from-cyan-500 to-blue-500",
  "from-lime-500 to-green-600",      "from-fuchsia-500 to-purple-600",
];

const STATUSES = ["All", "Active", "Archived"];

export default function ParentsClient({ initialParents }: { initialParents: any[] }) {
  const router = useRouter();
  const [search, setSearch]   = useState("");
  const [statusF, setStatusF] = useState("All");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phonePrimary: "",
    nationalIdNumber: "",
    status: "Active"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formattedParents = initialParents.map(p => ({
    id: p.id,
    name: `${p.firstName} ${p.lastName}`,
    firstName: p.firstName,
    lastName: p.lastName,
    initials: `${p.firstName?.[0] || ''}${p.lastName?.[0] || ''}`.toUpperCase(),
    phone: p.phonePrimary,
    email: p.user?.email || "N/A",
    students: p.students?.map((s: any) => `${s.student?.firstName} ${s.student?.lastName}`) || [],
    relation: p.students?.[0]?.relationship || "Parent",
    status: p.user?.status === "ACTIVE" ? "Active" : "Archived",
    nationalIdNumber: p.nationalIdNumber || "",
    joined: new Date(p.user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    occupation: "N/A",
  }));

  const filtered = formattedParents.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search);
    const matchStatus = statusF === "All" || p.status === statusF;
    return matchSearch && matchStatus;
  });

  const handleOpenModal = (parent?: any) => {
    if (parent) {
      setEditingParent(parent);
      setFormData({
        firstName: parent.firstName,
        lastName: parent.lastName,
        email: parent.email !== "N/A" ? parent.email : "",
        phonePrimary: parent.phone,
        nationalIdNumber: parent.nationalIdNumber,
        status: parent.status
      });
    } else {
      setEditingParent(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phonePrimary: "",
        nationalIdNumber: "",
        status: "Active"
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingParent) {
        await updateParent(editingParent.id, formData);
      } else {
        await addParent(formData);
      }
      setIsModalOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to save parent");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this parent?")) {
      try {
        await deleteParent(id);
        router.refresh();
      } catch (error) {
        console.error(error);
        alert("Failed to delete parent");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Parents",  value: formattedParents.length,                                    color: "from-primary-800 to-primary-900" },
          { label: "Active",         value: formattedParents.filter(p => p.status === "Active").length,  color: "from-emerald-600 to-teal-600" },
          { label: "Archived",       value: formattedParents.filter(p => p.status === "Archived").length,color: "from-slate-500 to-slate-700" },
          { label: "Students Linked",value: formattedParents.reduce((a, p) => a + p.students.length, 0), color: "from-indigo-600 to-violet-600" },
        ].map(c => (
          <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-2xl px-5 py-3.5 text-white shadow-md`}>
            <p className="text-2xl font-black">{c.value}</p>
            <p className="text-xs font-bold text-white/75">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white/80">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, ID, phone..."
                className="pl-9 pr-4 py-2 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all w-56 placeholder:text-slate-400"
              />
            </div>
            <div className="flex gap-1.5">
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
              <Mail className="w-4 h-4" /> Bulk Email
            </button>
            <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 text-sm font-black text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-md shadow-primary-900/20 hover:-translate-y-0.5 transition-all">
              <Plus className="w-4 h-4" /> Add Parent
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Parent</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Contact</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Linked Students</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Relation</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p, i) => (
                <tr key={p.id} className="hover:bg-primary-50/40 border-l-4 border-transparent hover:border-l-secondary-500 transition-all group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${avatarGrads[i % avatarGrads.length]} flex items-center justify-center text-white text-xs font-black shadow-sm flex-shrink-0`}>
                        {p.initials}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                        <p className="text-[10px] font-black text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">{p.id.substring(0,8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                        <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" /> {p.phone}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                        <Mail className="w-3 h-3 text-slate-300 flex-shrink-0" /> {p.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col gap-1">
                      {p.students.length > 0 ? p.students.map((s: string, j: number) => (
                        <span key={j} className="flex items-center gap-1 text-[10px] font-bold text-primary-800 bg-primary-50 border border-primary-100 px-2 py-0.5 rounded-lg w-fit">
                          <GraduationCap className="w-2.5 h-2.5" /> {s}
                        </span>
                      )) : (
                         <span className="text-xs text-slate-400">None</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg">{p.relation}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    {p.status === "Active" ? (
                      <span className="flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg w-fit">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-black text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg w-fit">
                        <XCircle className="w-3 h-3" /> Archived
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(p)} className="p-1.5 text-primary-600 bg-primary-50 hover:bg-primary-100 border border-primary-100 rounded-lg" title="Edit">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                   <td colSpan={6} className="px-5 py-8 text-center text-slate-500">No parents found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/60">
          <span className="font-bold">Showing <span className="text-primary-900">{filtered.length}</span> of {formattedParents.length} parents</span>
          <div className="flex items-center gap-1">
            <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 disabled:opacity-40 font-bold" disabled>
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-900 text-white text-xs font-black">1</button>
            <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 font-bold" disabled>
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800">{editingParent ? 'Edit Parent' : 'Add Parent'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">First Name *</label>
                  <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Last Name *</label>
                  <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Email *</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Phone *</label>
                <input required type="text" value={formData.phonePrimary} onChange={e => setFormData({...formData, phonePrimary: e.target.value})} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">National ID</label>
                <input type="text" value={formData.nationalIdNumber} onChange={e => setFormData({...formData, nationalIdNumber: e.target.value})} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400">
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
              <div className="pt-4 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 text-sm font-black text-white bg-primary-900 hover:bg-primary-800 rounded-xl disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}