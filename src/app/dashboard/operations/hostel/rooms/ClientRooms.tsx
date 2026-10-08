"use client";

import React, { useState } from "react";
import { BedDouble, Search, Filter, Plus, Home, Settings, AlertCircle, CheckCircle2, X, Trash2, Edit } from "lucide-react";
import { createRoom, updateRoom, deleteRoom } from "./actions";

type Room = {
  id: string;
  tenantId: string;
  hostelId: string;
  roomNumber: string;
  capacity: number;
  type: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  hostel?: { name: string };
  allocations?: any[];
};

type Hostel = {
  id: string;
  name: string;
};

export default function ClientRooms({
  initialRooms,
  hostels,
  tenantId
}: {
  initialRooms: Room[];
  hostels: Hostel[];
  tenantId: string;
}) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    hostelId: "",
    roomNumber: "",
    capacity: 1,
    type: "STANDARD",
    status: "AVAILABLE",
  });

  const handleOpenModal = (room?: Room) => {
    if (room) {
      setEditingId(room.id);
      setFormData({
        hostelId: room.hostelId,
        roomNumber: room.roomNumber,
        capacity: room.capacity,
        type: room.type,
        status: room.status,
      });
    } else {
      setEditingId(null);
      setFormData({
        hostelId: hostels[0]?.id || "",
        roomNumber: "",
        capacity: 1,
        type: "STANDARD",
        status: "AVAILABLE",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const res = await updateRoom(editingId, formData);
      if (res.success && res.data) {
        setRooms(rooms.map(r => r.id === editingId ? { ...res.data, hostel: hostels.find(h => h.id === res.data.hostelId) } as Room : r));
        handleCloseModal();
      } else {
        alert(res.error);
      }
    } else {
      const res = await createRoom({ ...formData, tenantId });
      if (res.success && res.data) {
        setRooms([{ ...res.data, hostel: hostels.find(h => h.id === res.data.hostelId) } as Room, ...rooms]);
        handleCloseModal();
      } else {
        alert(res.error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    const res = await deleteRoom(id);
    if (res.success) {
      setRooms(rooms.filter(r => r.id !== id));
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl hidden md:block">
                 <BedDouble className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Rooms & Beds</h2>
                 <p className="text-sm font-medium text-slate-500">Manage individual room capacity and bed availability.</p>
              </div>
           </div>
           <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Plus className="w-4 h-4" />
              Add Room
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by Room Number..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Hostels</option>
                 {hostels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
           </div>
        </div>
        
        <div className="p-0">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50">
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Room Details</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Type & Capacity</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {rooms.map((room) => (
                   <tr key={room.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <span className="font-black text-slate-800 text-sm block mb-1">Room {room.roomNumber}</span>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                           <Home className="w-3 h-3 text-slate-400" /> {room.hostel?.name || "Unknown"}
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-100/50 inline-block w-fit">{room.type}</span>
                          <span className="text-xs font-bold text-slate-500">Capacity: {room.capacity}</span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg ${
                         room.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-600' : 
                         room.status === 'FULL' ? 'bg-blue-50 text-blue-600' : 
                         'bg-amber-50 text-amber-600'
                       }`}>
                         {room.status === 'AVAILABLE' && <CheckCircle2 className="w-3.5 h-3.5" />}
                         {room.status === 'MAINTENANCE' && <AlertCircle className="w-3.5 h-3.5" />}
                         {room.status}
                       </span>
                     </td>
                     <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleOpenModal(room)} className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors inline-flex">
                             <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(room.id)} className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex">
                             <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                     </td>
                   </tr>
                 ))}
                 {rooms.length === 0 && (
                   <tr>
                     <td colSpan={4} className="py-8 text-center text-slate-500 font-medium">No rooms found. Add a room to get started.</td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-lg">
                {editingId ? "Edit Room" : "Add Room"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Hostel</label>
                <select 
                  required
                  value={formData.hostelId} 
                  onChange={e => setFormData({...formData, hostelId: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="" disabled>Select a hostel</option>
                  {hostels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Room Number</label>
                <input
                  type="text"
                  required
                  value={formData.roomNumber}
                  onChange={e => setFormData({...formData, roomNumber: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. 101, A-101"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Capacity</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.capacity}
                    onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 1})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="STANDARD">Standard</option>
                    <option value="DELUXE">Deluxe</option>
                    <option value="DORMATORY">Dormitory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="FULL">Full</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors shadow-sm"
                >
                  {editingId ? "Save Changes" : "Add Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
