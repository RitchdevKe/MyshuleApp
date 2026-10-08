"use client";

import React, { useState, useEffect } from "react";
import { PhoneCall, Search, Plus, ShieldAlert, Phone, Ambulance, AlertTriangle, X, Trash2, Edit } from "lucide-react";
import { createEmergencyContact, updateEmergencyContact, deleteEmergencyContact } from "./actions";

interface Contact {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  alternativePhone: string | null;
  email: string | null;
  priority: number;
}

interface Student {
  id: string;
  name: string;
  admissionNumber: string;
  grade: string;
}

export default function EmergencyClient({ initialContacts, initialStudents }: { initialContacts: Contact[]; initialStudents: Student[] }) {
  const [contacts, setContacts] = useState(initialContacts);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setContacts(initialContacts); }, [initialContacts]);

  const [form, setForm] = useState({ studentId: "", name: "", relationship: "", phoneNumber: "", alternativePhone: "", email: "" });

  const openCreate = () => {
    setEditing(null);
    setForm({ studentId: "", name: "", relationship: "", phoneNumber: "", alternativePhone: "", email: "" });
    setShowModal(true);
  };

  const openEdit = (c: Contact) => {
    setEditing(c);
    setForm({ studentId: c.studentId, name: c.name, relationship: c.relationship, phoneNumber: c.phoneNumber, alternativePhone: c.alternativePhone || "", email: c.email || "" });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.phoneNumber || !form.relationship) return;
    setLoading(true);
    try {
      if (editing) {
        await updateEmergencyContact(editing.id, form);
        setContacts(prev => prev.map(c => c.id === editing.id ? { ...c, ...form, alternativePhone: form.alternativePhone || null, email: form.email || null } : c));
      } else {
        if (!form.studentId) return;
        await createEmergencyContact(form);
        const student = initialStudents.find(s => s.id === form.studentId);
        setContacts(prev => [{ id: `temp-${Date.now()}`, studentId: form.studentId, studentName: student?.name || "", grade: student?.grade || "", name: form.name, relationship: form.relationship, phoneNumber: form.phoneNumber, alternativePhone: form.alternativePhone || null, email: form.email || null, priority: 1 }, ...prev]);
      }
      setShowModal(false);
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact?")) return;
    await deleteEmergencyContact(id);
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const filtered = contacts.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.studentName.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.phoneNumber.includes(q);
  });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-rose-600 p-6 rounded-3xl text-white flex justify-between items-center shadow-lg shadow-rose-600/20">
          <div>
            <h3 className="text-2xl font-black mb-1 flex items-center gap-2"><PhoneCall className="w-6 h-6 animate-pulse" /> Dispatch Ambulance</h3>
            <p className="text-rose-100 font-medium">Quick dial for critical emergencies.</p>
          </div>
          <button className="bg-white text-rose-600 px-6 py-3 rounded-xl font-black text-lg hover:bg-rose-50 transition-colors shadow-sm">911</button>
        </div>
        <div className="bg-amber-500 p-6 rounded-3xl text-white flex justify-between items-center shadow-lg shadow-amber-500/20">
          <div>
            <h3 className="text-2xl font-black mb-1 flex items-center gap-2"><AlertTriangle className="w-6 h-6" /> Local Hospital</h3>
            <p className="text-amber-100 font-medium">City General Hospital ER.</p>
          </div>
          <button className="bg-white text-amber-600 px-6 py-3 rounded-xl font-black text-lg hover:bg-amber-50 transition-colors shadow-sm">(555) 000-9999</button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl hidden md:block"><ShieldAlert className="w-6 h-6" /></div>
            <div>
              <h2 className="text-lg font-black text-slate-800">Emergency Contacts</h2>
              <p className="text-sm font-medium text-slate-500">Rapid access to student guardians and designated family doctors.</p>
            </div>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
            <Plus className="w-4 h-4" /> Add Contact
          </button>
        </div>

        <div className="p-5 border-b border-slate-200/60">
          <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by Student Name or Guardian..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
          </div>
        </div>

        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Primary Guardian</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Numbers</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="py-12 text-center text-slate-400 text-sm">No emergency contacts found.</td></tr>
                )}
                {filtered.map(contact => (
                  <tr key={contact.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-800 text-sm block mb-1">{contact.studentName}</span>
                      <span className="text-[10px] font-medium text-slate-500">{contact.grade}</span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-700 text-sm">{contact.name}</p>
                      <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider bg-primary-50 px-1.5 py-0.5 rounded inline-block mt-0.5">{contact.relationship}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700"><Phone className="w-3.5 h-3.5 text-emerald-500" />{contact.phoneNumber}</div>
                        {contact.alternativePhone && (
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500"><Phone className="w-3.5 h-3.5" />{contact.alternativePhone}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-slate-600">{contact.email || "—"}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(contact)} className="text-sm font-bold text-primary-600 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors border border-primary-100 flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> Edit</button>
                        <button onClick={() => handleDelete(contact.id)} className="text-sm font-bold text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-800">{editing ? "Edit Contact" : "Add Emergency Contact"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              {!editing && (
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Student *</label>
                  <select value={form.studentId} onChange={e => setForm(p => ({ ...p, studentId: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900">
                    <option value="">Select student...</option>
                    {initialStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.admissionNumber})</option>)}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Contact Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" placeholder="Guardian name" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Relationship *</label>
                  <select value={form.relationship} onChange={e => setForm(p => ({ ...p, relationship: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900">
                    <option value="">Select...</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Phone Number *</label>
                  <input type="tel" value={form.phoneNumber} onChange={e => setForm(p => ({ ...p, phoneNumber: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Alt Phone</label>
                  <input type="tel" value={form.alternativePhone} onChange={e => setForm(p => ({ ...p, alternativePhone: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1 block">Email</label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
              </div>
            </div>
            <div className="p-5 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
              <button onClick={handleSave} disabled={loading} className="px-4 py-2 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl disabled:opacity-50">{loading ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
