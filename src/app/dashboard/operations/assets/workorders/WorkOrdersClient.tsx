"use client";

import React, { useState, useMemo } from "react";
import { ClipboardList, Search, Filter, Plus, Wrench, CircleDashed, Clock, CheckCircle2, User, Building, Monitor, AlertCircle, X, Trash2 } from "lucide-react";
import { createWorkOrder, updateWorkOrderStatus, deleteWorkOrder } from "./actions";

type WorkOrder = {
  id: string;
  orderNumber: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  assignedTo: string | null;
  facility?: { name: string } | null;
  asset?: { name: string } | null;
  createdAt: Date;
};

type Facility = { id: string; name: string };
type Asset = { id: string; name: string };

export default function WorkOrdersClient({
  initialWorkOrders,
  facilities,
  assets,
}: {
  initialWorkOrders: WorkOrder[];
  facilities: Facility[];
  assets: Asset[];
}) {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newWO, setNewWO] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    assignedTo: "",
    facilityId: "",
    assetId: "",
  });

  const filteredWorkOrders = useMemo(() => {
    return workOrders.filter((wo) => {
      const matchesSearch =
        wo.title.toLowerCase().includes(search.toLowerCase()) ||
        wo.orderNumber.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "All" || wo.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [workOrders, search, statusFilter]);

  const stats = {
    total: workOrders.length,
    open: workOrders.filter(w => w.status === "PENDING").length,
    inProgress: workOrders.filter(w => w.status === "IN_PROGRESS").length,
    completed: workOrders.filter(w => w.status === "COMPLETED").length,
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createWorkOrder(newWO);
      setIsCreateModalOpen(false);
      setNewWO({ title: "", description: "", priority: "MEDIUM", assignedTo: "", facilityId: "", assetId: "" });
      // We could refresh data by just relying on server actions to revalidatePath,
      // but since we are holding state we'd need router.refresh()
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // Optimistic update
      setWorkOrders(workOrders.map(w => w.id === id ? { ...w, status: newStatus } : w));
      await updateWorkOrderStatus(id, newStatus);
    } catch (error) {
      console.error(error);
      window.location.reload();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this work order?")) return;
    try {
      setWorkOrders(workOrders.filter(w => w.id !== id));
      await deleteWorkOrder(id);
    } catch (error) {
      console.error(error);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Cards for Aggregated Data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60 flex items-center gap-4">
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Orders</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.total}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.open}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">In Progress</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.inProgress}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Completed</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.completed}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl hidden md:block">
                 <Wrench className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Repair Work Orders</h2>
                 <p className="text-sm font-medium text-slate-500">Helpdesk tracker for asset breakages and facility repairs.</p>
              </div>
           </div>
           <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Plus className="w-4 h-4" />
              Create Work Order
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search tickets by ID or Title..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" 
              />
           </div>
           <div className="flex gap-2">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
              >
                 <option value="All">All Statuses</option>
                 <option value="PENDING">Pending</option>
                 <option value="IN_PROGRESS">In Progress</option>
                 <option value="COMPLETED">Completed</option>
                 <option value="CANCELLED">Cancelled</option>
              </select>
           </div>
        </div>
        
        <div className="p-0">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50">
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Ticket Info</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Target & Location</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Assignee</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {filteredWorkOrders.length === 0 ? (
                   <tr>
                     <td colSpan={5} className="py-8 text-center text-slate-500 text-sm">No work orders found.</td>
                   </tr>
                 ) : filteredWorkOrders.map((wo) => (
                   <tr key={wo.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <span className="font-bold text-slate-800 text-sm">{wo.title}</span>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{wo.orderNumber}</span>
                           <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                           <span className={`text-[10px] font-black uppercase tracking-wider ${
                              wo.priority === 'URGENT' ? 'text-rose-600' :
                              wo.priority === 'HIGH' ? 'text-amber-600' :
                              wo.priority === 'MEDIUM' ? 'text-blue-600' : 'text-slate-500'
                           }`}>
                              {wo.priority} Priority
                           </span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        {wo.asset ? (
                          <div className="flex items-center gap-1.5 mb-1 text-sm">
                             <Monitor className="w-3.5 h-3.5 text-slate-400" />
                             <span className="font-bold text-slate-700">{wo.asset.name}</span>
                          </div>
                        ) : null}
                        {wo.facility ? (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                             <Building className="w-3.5 h-3.5 text-slate-400" />
                             <span className="font-medium">{wo.facility.name}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No specific location</span>
                        )}
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 mb-1 text-sm">
                           <User className="w-3.5 h-3.5 text-slate-400" />
                           <span className="font-bold text-slate-700">{wo.assignedTo || 'Unassigned'}</span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                       <select
                         value={wo.status}
                         onChange={(e) => handleStatusChange(wo.id, e.target.value)}
                         className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg border-none focus:ring-2 cursor-pointer ${
                           wo.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' : 
                           wo.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700' : 
                           wo.status === 'CANCELLED' ? 'bg-slate-100 text-slate-700' : 
                           'bg-amber-50 text-amber-700'
                         }`}
                       >
                         <option value="PENDING">Pending</option>
                         <option value="IN_PROGRESS">In Progress</option>
                         <option value="COMPLETED">Completed</option>
                         <option value="CANCELLED">Cancelled</option>
                       </select>
                     </td>
                     <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => handleDelete(wo.id)} className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
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

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800">New Work Order</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                <input required type="text" value={newWO.title} onChange={e => setNewWO({...newWO, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-900 text-sm" placeholder="E.g. Broken Projector" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                <textarea value={newWO.description} onChange={e => setNewWO({...newWO, description: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-900 text-sm h-24" placeholder="Details about the issue..."></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Priority</label>
                  <select value={newWO.priority} onChange={e => setNewWO({...newWO, priority: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-900 text-sm">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Assignee</label>
                  <input type="text" value={newWO.assignedTo} onChange={e => setNewWO({...newWO, assignedTo: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-900 text-sm" placeholder="E.g. IT Team" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Related Facility</label>
                <select value={newWO.facilityId} onChange={e => setNewWO({...newWO, facilityId: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-900 text-sm">
                  <option value="">None / General</option>
                  {facilities.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Related Asset</label>
                <select value={newWO.assetId} onChange={e => setNewWO({...newWO, assetId: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-900 text-sm">
                  <option value="">None / General</option>
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary-900 hover:bg-primary-800 text-white text-sm font-bold rounded-xl shadow-sm transition-all disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Create Work Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
