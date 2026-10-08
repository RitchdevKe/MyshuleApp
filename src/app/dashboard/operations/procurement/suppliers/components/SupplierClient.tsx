"use client";

import React, { useState } from "react";
import { Filter, Phone, Mail, MapPin, Building, Plus, Edit, Trash2, X } from "lucide-react";
import { createSupplier, updateSupplier, deleteSupplier } from "../actions";

type Supplier = {
  id: string;
  name: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  status: string;
  purchaseOrders: { totalAmount: number }[];
};

export default function SupplierClient({ suppliers }: { suppliers: Supplier[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    status: "ACTIVE",
  });

  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === "ACTIVE").length;

  const handleOpenModal = (supplier?: Supplier) => {
    if (supplier) {
      setEditingId(supplier.id);
      setFormData({
        name: supplier.name,
        contactName: supplier.contactName || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        address: supplier.address || "",
        status: supplier.status,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        contactName: "",
        email: "",
        phone: "",
        address: "",
        status: "ACTIVE",
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
    if (editingId) {
      await updateSupplier(editingId, formData);
    } else {
      await createSupplier(formData);
    }
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      await deleteSupplier(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Suppliers</p>
            <p className="text-3xl font-black text-slate-800">{totalSuppliers}</p>
          </div>
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
            <Building className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Active Suppliers</p>
            <p className="text-3xl font-black text-emerald-600">{activeSuppliers}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
            <CheckCircleIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-2">
         <h2 className="text-lg font-black text-slate-800">Supplier Directory</h2>
         <div className="flex gap-2">
            <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm">
               <Plus className="w-4 h-4" />
               Add Supplier
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
               <Filter className="w-4 h-4" />
               Filter
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {suppliers.length === 0 ? (
           <div className="text-center py-10 bg-white rounded-3xl border border-slate-200 shadow-sm">
             <p className="text-slate-500 font-medium">No suppliers found.</p>
           </div>
         ) : suppliers.map((supplier) => {
            const spendYtd = supplier.purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);
            return (
              <div key={supplier.id} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col md:flex-row relative group">
                 
                 <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(supplier)} className="p-2 bg-white text-slate-600 hover:text-primary-600 rounded-lg shadow-sm border border-slate-200">
                       <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(supplier.id)} className="p-2 bg-white text-slate-600 hover:text-rose-600 rounded-lg shadow-sm border border-slate-200">
                       <Trash2 className="w-4 h-4" />
                    </button>
                 </div>

                 <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200/60 bg-slate-50/50 flex flex-col justify-between">
                    <div>
                       <div className="flex justify-between items-start mb-2">
                          <div className="p-2.5 bg-primary-100 text-primary-600 rounded-xl inline-block mb-3">
                             <Building className="w-5 h-5" />
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${supplier.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{supplier.status}</span>
                       </div>
                       <h3 className="text-xl font-black text-slate-800">{supplier.name}</h3>
                       {supplier.address && <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {supplier.address}</p>}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-slate-200/60">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Spend (Orders)</p>
                       <p className="text-2xl font-black text-slate-800">${spendYtd.toLocaleString()}</p>
                    </div>
                 </div>
  
                 <div className="p-6 md:w-2/3 flex flex-col justify-between">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Primary Contact</p>
                          <div className="space-y-3">
                             {supplier.contactName && (
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                     <span className="text-xs font-black text-slate-600">{supplier.contactName.charAt(0)}</span>
                                  </div>
                                  <span className="text-sm font-bold text-slate-700">{supplier.contactName}</span>
                               </div>
                             )}
                             {supplier.email && (
                               <div className="flex items-center gap-3">
                                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                                  <span className="text-sm font-medium text-slate-600">{supplier.email}</span>
                               </div>
                             )}
                             {supplier.phone && (
                               <div className="flex items-center gap-3">
                                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                                  <span className="text-sm font-medium text-slate-600">{supplier.phone}</span>
                               </div>
                             )}
                          </div>
                       </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3">
                       <button className="px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                          View Purchase History
                       </button>
                    </div>
                 </div>
  
              </div>
            )
         })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800">{editingId ? 'Edit Supplier' : 'Add New Supplier'}</h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Company Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Contact Person</label>
                <input type="text" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Phone</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Address</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-xl">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-sm">{editingId ? 'Save Changes' : 'Create Supplier'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
