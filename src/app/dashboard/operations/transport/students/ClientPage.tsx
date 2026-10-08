"use client";

import React, { useState } from "react";
import { Users, Search, Filter, UserPlus, MapPin, CheckCircle2, AlertCircle, Phone, X } from "lucide-react";
import { assignStudent } from "./actions";

export type StudentTransport = {
  id: string;
  name: string;
  grade: string;
  route: string;
  stop: string;
  guardian: string;
  phone: string;
  status: string;
};

interface ClientPageProps {
  initialStudents: StudentTransport[];
  routes: string[];
  routesData: { id: string, name: string }[];
  unassignedStudents: { id: string, name: string, admissionNumber: string }[];
}

export default function StudentTransportClient({ initialStudents, routes, routesData, unassignedStudents }: ClientPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [routeFilter, setRouteFilter] = useState("All Routes");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    routeId: "",
    pickupPoint: "",
    tripType: "TWO_WAY" as "TWO_WAY" | "ONE_WAY_MORNING" | "ONE_WAY_EVENING"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredStudents = initialStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.stop.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRoute = routeFilter === "All Routes" || student.route === routeFilter;

    return matchesSearch && matchesRoute;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.routeId || !formData.pickupPoint) return;
    
    setIsSubmitting(true);
    try {
      await assignStudent(formData.studentId, formData.routeId, formData.pickupPoint, formData.tripType);
      setIsModalOpen(false);
      setFormData({ studentId: "", routeId: "", pickupPoint: "", tripType: "TWO_WAY" });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl hidden md:block">
                 <Users className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Student Transport Roster</h2>
                 <p className="text-sm font-medium text-slate-500">Manage student route assignments and subscription status.</p>
              </div>
           </div>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
           >
              <UserPlus className="w-4 h-4" />
              Assign Student
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search by Student Name, Route, or Stop..." 
                className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex gap-2">
              <select 
                className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
                value={routeFilter}
                onChange={(e) => setRouteFilter(e.target.value)}
              >
                 <option value="All Routes">All Routes</option>
                 {routes.map(r => (
                   <option key={r} value={r}>{r}</option>
                 ))}
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 More Filters
              </button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Details</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Route & Stop</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Guardian Contact</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Transport Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">
                    No transport assignments found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-800 text-sm">{student.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{student.id}</span>
                         <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                         <span className="text-xs font-medium text-slate-500">{student.grade}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-primary-700 text-sm">{student.route}</p>
                      <div className="flex items-center gap-1 mt-1 text-slate-500">
                         <MapPin className="w-3 h-3" />
                         <span className="text-xs font-medium">{student.stop}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-700 text-sm">{student.guardian}</p>
                      <div className="flex items-center gap-1 mt-1 text-slate-500">
                         <Phone className="w-3 h-3" />
                         <span className="text-xs font-medium">{student.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                        student.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                        student.status === 'Pending Payment' ? 'bg-amber-50 text-amber-600' : 
                        'bg-rose-50 text-rose-600'
                      }`}>
                        {student.status === 'Active' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {(student.status === 'Pending Payment' || student.status === 'Suspended') && <AlertCircle className="w-3.5 h-3.5" />}
                        {student.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-sm font-bold text-primary-600 hover:text-primary-800 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors border border-primary-100">
                             Manage
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Assign Student to Route</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Student</label>
                <select 
                  required
                  value={formData.studentId}
                  onChange={e => setFormData({...formData, studentId: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                >
                  <option value="">Select Student...</option>
                  {unassignedStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.admissionNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Route</label>
                <select 
                  required
                  value={formData.routeId}
                  onChange={e => setFormData({...formData, routeId: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                >
                  <option value="">Select Route...</option>
                  {routesData.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Pickup Point</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Maple Street Junction"
                  value={formData.pickupPoint}
                  onChange={e => setFormData({...formData, pickupPoint: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Trip Type</label>
                <select 
                  value={formData.tripType}
                  onChange={e => setFormData({...formData, tripType: e.target.value as any})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                >
                  <option value="TWO_WAY">Two Way</option>
                  <option value="ONE_WAY_MORNING">One Way (Morning)</option>
                  <option value="ONE_WAY_EVENING">One Way (Evening)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Assigning..." : "Assign Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
