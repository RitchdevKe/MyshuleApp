"use client";

import React, { useState } from "react";
import { Navigation2, Users, MapPin, Clock, Plus, Map, Edit, Trash2 } from "lucide-react";
import { createRoute, updateRoute, deleteRoute } from "./actions";

type RouteData = {
  id: string;
  routeName: string;
  vehiclePlate: string | null;
  driver: { firstName: string, lastName: string } | null;
  assignments: any[];
};

export default function RouteClient({ routes, tenantId }: { routes: any[], tenantId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<any>(null);
  const [formData, setFormData] = useState({
    routeName: "",
    vehiclePlate: "",
    costPerTerm: 0,
  });

  const handleOpenModal = (route?: any) => {
    if (route) {
      setEditingRoute(route);
      setFormData({
        routeName: route.routeName,
        vehiclePlate: route.vehiclePlate || "",
        costPerTerm: route.costPerTerm || 0,
      });
    } else {
      setEditingRoute(null);
      setFormData({
        routeName: "",
        vehiclePlate: "",
        costPerTerm: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoute) {
      await updateRoute(editingRoute.id, {
        routeName: formData.routeName,
        vehiclePlate: formData.vehiclePlate,
        costPerTerm: Number(formData.costPerTerm),
      });
    } else {
      await createRoute({
        tenantId,
        routeName: formData.routeName,
        vehiclePlate: formData.vehiclePlate,
        costPerTerm: Number(formData.costPerTerm),
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this route?")) {
      await deleteRoute(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
         <h2 className="text-lg font-black text-slate-800">Transport Routes</h2>
         <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
               <Map className="w-4 h-4" />
               Route Map
            </button>
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
            >
               <Plus className="w-4 h-4" />
               Create Route
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {routes.map((route) => (
            <div key={route.id} className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-20 group-hover:scale-110 transition-transform bg-emerald-500"></div>
               
               <div className="relative z-10 flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                     <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                        <Navigation2 className="w-5 h-5" />
                     </div>
                     <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{route.id.split("-")[0]}</span>
                        <h3 className="text-lg font-black text-slate-800 leading-tight">{route.routeName}</h3>
                     </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(route)} className="p-2 text-slate-400 hover:text-blue-600 bg-white rounded-lg shadow-sm border border-slate-100">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(route.id)} className="p-2 text-slate-400 hover:text-red-600 bg-white rounded-lg shadow-sm border border-slate-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-5 relative z-10">
                  <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Users className="w-3 h-3" /> Students Assigned
                     </p>
                     <p className="text-xl font-black text-slate-800">{route.assignments?.length || 0}</p>
                  </div>
                  <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Total Stops
                     </p>
                     <p className="text-xl font-black text-slate-800">
                       {new Set((route.assignments || []).map((a: any) => a.pickupPoint)).size}
                     </p>
                  </div>
               </div>

               <div className="flex items-center justify-between text-sm pt-4 border-t border-slate-100 relative z-10">
                  <div className="flex flex-col gap-1 text-slate-600">
                     <span className="font-bold">Vehicle: <span className="text-primary-600">{route.vehiclePlate || 'Not assigned'}</span></span>
                     <span className="font-medium text-xs">Driver: {route.driver?.firstName ? `${route.driver.firstName} ${route.driver.lastName}` : 'Unassigned'}</span>
                  </div>
                  <div className="text-right">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Cost / Term</span>
                     <span className="flex items-center gap-1 font-black text-slate-800 bg-slate-100 px-2 py-1 rounded-md">
                        KES {route.costPerTerm || 0}
                     </span>
                  </div>
               </div>
            </div>
         ))}
         {routes.length === 0 && (
           <div className="col-span-full py-12 text-center bg-white border border-slate-200/60 rounded-3xl">
             <Map className="w-12 h-12 text-slate-300 mx-auto mb-3" />
             <h3 className="text-lg font-bold text-slate-700">No Routes Found</h3>
             <p className="text-sm text-slate-500 mt-1">Get started by creating a new transport route.</p>
           </div>
         )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-200">
            <h3 className="text-xl font-black text-slate-800 mb-4">
              {editingRoute ? "Edit Route" : "Create Route"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Route Name</label>
                <input
                  required
                  type="text"
                  value={formData.routeName}
                  onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900"
                  placeholder="e.g. North City Morning Run"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Vehicle Plate</label>
                <input
                  type="text"
                  value={formData.vehiclePlate}
                  onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900"
                  placeholder="e.g. KBC 123Z"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Cost Per Term (KES)</label>
                <input
                  type="number"
                  value={formData.costPerTerm}
                  onChange={(e) => setFormData({ ...formData, costPerTerm: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900"
                  placeholder="0"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-900 text-white font-bold rounded-xl hover:bg-primary-800 transition-colors"
                >
                  {editingRoute ? "Save Changes" : "Create Route"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
