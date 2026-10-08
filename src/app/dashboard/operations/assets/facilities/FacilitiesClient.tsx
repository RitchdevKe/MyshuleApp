"use client";

import React, { useState } from "react";
import { Building2, Search, Filter, Map, Plus, Users, DoorOpen, Wrench, ShieldAlert, X, Edit, Trash2 } from "lucide-react";
import { createFacility, updateFacility, deleteFacility } from "./actions";

type Facility = {
  id: string;
  name: string;
  type: string;
  capacity: number | null;
  location: string | null;
  status: string;
};

export default function FacilitiesClient({
  tenantId,
  facilities,
}: {
  tenantId: string;
  facilities: Facility[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    type: "Academic",
    capacity: 0,
    location: "",
    status: "ACTIVE",
  });

  const totalFacilities = facilities.length;
  const activeFacilities = facilities.filter((f) => f.status === "ACTIVE").length;
  const maintenanceFacilities = facilities.filter((f) => f.status === "MAINTENANCE").length;

  const filteredFacilities = facilities.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.location && f.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenModal = (facility?: Facility) => {
    if (facility) {
      setEditingFacility(facility);
      setFormData({
        name: facility.name,
        type: facility.type,
        capacity: facility.capacity || 0,
        location: facility.location || "",
        status: facility.status,
      });
    } else {
      setEditingFacility(null);
      setFormData({
        name: "",
        type: "Academic",
        capacity: 0,
        location: "",
        status: "ACTIVE",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFacility(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFacility) {
      await updateFacility(editingFacility.id, formData);
    } else {
      await createFacility({ tenantId, ...formData });
    }
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this facility?")) {
      await deleteFacility(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-6 flex items-center gap-4 shadow-sm">
          <div className="p-4 bg-primary-50 text-primary-600 rounded-2xl">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Facilities</p>
            <p className="text-2xl font-black text-slate-800">{totalFacilities}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-6 flex items-center gap-4 shadow-sm">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
            <DoorOpen className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Active Facilities</p>
            <p className="text-2xl font-black text-slate-800">{activeFacilities}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-6 flex items-center gap-4 shadow-sm">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
            <Wrench className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Under Maintenance</p>
            <p className="text-2xl font-black text-slate-800">{maintenanceFacilities}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hidden md:block">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">Facilities & Spaces</h2>
              <p className="text-sm font-medium text-slate-500">
                Manage building blocks, rooms, and space utilization.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
              <Map className="w-4 h-4" />
              View Map
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
            >
              <Plus className="w-4 h-4" />
              Add Space
            </button>
          </div>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Room Name, Block, or Type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
              <option>All Blocks</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-slate-50/30">
          {filteredFacilities.map((facility) => (
            <div
              key={facility.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <h3 className="text-lg font-black text-slate-800 leading-tight mt-1 truncate">
                    {facility.name}
                  </h3>
                  <p className="text-xs font-bold text-primary-600 mt-1">{facility.location || "N/A"}</p>
                </div>
                <span
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-xl ${
                    facility.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-600"
                      : facility.status === "MAINTENANCE"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {facility.status === "ACTIVE" && <DoorOpen className="w-4 h-4" />}
                  {facility.status === "MAINTENANCE" && <Wrench className="w-4 h-4" />}
                  {facility.status === "INACTIVE" && <ShieldAlert className="w-4 h-4" />}
                </span>
              </div>

              <div className="space-y-3 mb-5 relative z-10 flex-grow">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">Type</span>
                  <span className="font-bold text-slate-700">{facility.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> Max Capacity
                  </span>
                  <span className="font-bold text-slate-700">{facility.capacity || 0} pax</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2 relative z-10">
                <button
                  onClick={() => handleOpenModal(facility)}
                  className="text-xs font-bold text-primary-600 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(facility.id)}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">
                {editingFacility ? "Edit Facility" : "Add Facility"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Facility Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="e.g. Main Auditorium"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Recreation">Recreation</option>
                    <option value="Event Space">Event Space</option>
                    <option value="Dining">Dining</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Location / Block</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="e.g. Block A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-900 text-white font-semibold rounded-xl hover:bg-primary-800 transition-colors shadow-sm"
                >
                  {editingFacility ? "Save Changes" : "Create Facility"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
