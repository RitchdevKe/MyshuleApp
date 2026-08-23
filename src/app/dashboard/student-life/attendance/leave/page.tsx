"use client";
import React, { useState, useMemo } from "react";
import { Plus, Check, X, Clock, FileText, Trash2, Edit2 } from "lucide-react";

type LeaveRequest = {
  id: string;
  student: string;
  grade: string;
  type: string;
  duration: string;
  dates: string;
  status: "Pending" | "Approved" | "Rejected";
  document: boolean;
};

const initialRequests: LeaveRequest[] = [
  { id: "LR-1024", student: "Sarah Wanjiku", grade: "Grade 10B", type: "Medical", duration: "3 Days", dates: "Oct 12 - Oct 14", status: "Pending", document: true },
  { id: "LR-1023", student: "Kevin Ochieng", grade: "Grade 8A", type: "Family Event", duration: "1 Day", dates: "Oct 11", status: "Approved", document: false },
  { id: "LR-1022", student: "Faith Mutheu", grade: "Grade 12C", type: "Sports Competition", duration: "2 Days", dates: "Oct 10 - Oct 11", status: "Rejected", document: true },
];

export default function LeaveManagementTab() {
  const [requests, setRequests] = useState<LeaveRequest[]>(initialRequests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<LeaveRequest>>({
    student: "",
    grade: "",
    type: "Medical",
    duration: "",
    dates: "",
    document: false,
  });

  const pendingCount = useMemo(() => requests.filter(r => r.status === "Pending").length, [requests]);
  const approvedCount = useMemo(() => requests.filter(r => r.status === "Approved").length, [requests]);
  const rejectedCount = useMemo(() => requests.filter(r => r.status === "Rejected").length, [requests]);

  const handleAction = (id: string, action: "Approved" | "Rejected" | "Pending") => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: action } : r));
  };

  const handleDelete = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
  };

  const handleOpenModal = (req?: LeaveRequest) => {
    if (req) {
      setEditingId(req.id);
      setFormData({
        student: req.student,
        grade: req.grade,
        type: req.type,
        duration: req.duration,
        dates: req.dates,
        document: req.document,
      });
    } else {
      setEditingId(null);
      setFormData({
        student: "",
        grade: "",
        type: "Medical",
        duration: "",
        dates: "",
        document: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setRequests(requests.map(r => r.id === editingId ? { ...r, ...formData } as LeaveRequest : r));
    } else {
      const newReq: LeaveRequest = {
        id: `LR-${Math.floor(Math.random() * 10000)}`,
        student: formData.student || "Unknown Student",
        grade: formData.grade || "Unknown Grade",
        type: formData.type || "Medical",
        duration: formData.duration || "1 Day",
        dates: formData.dates || "Unknown Date",
        status: "Pending",
        document: formData.document || false,
      };
      setRequests([newReq, ...requests]);
    }
    handleCloseModal();
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-amber-50/80 backdrop-blur-md border border-amber-200 p-6 rounded-3xl shadow-sm relative overflow-hidden group">
          <div className="absolute right-4 top-4 bg-amber-100 p-3 rounded-2xl group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div className="text-4xl font-black text-amber-600 mb-1">{pendingCount}</div>
          <div className="text-sm font-bold text-amber-800 uppercase tracking-wider">Pending Requests</div>
        </div>
        <div className="bg-emerald-50/80 backdrop-blur-md border border-emerald-200 p-6 rounded-3xl shadow-sm relative overflow-hidden group">
          <div className="absolute right-4 top-4 bg-emerald-100 p-3 rounded-2xl group-hover:scale-110 transition-transform">
            <Check className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="text-4xl font-black text-emerald-600 mb-1">{approvedCount}</div>
          <div className="text-sm font-bold text-emerald-800 uppercase tracking-wider">Approved (This Term)</div>
        </div>
        <div className="bg-rose-50/80 backdrop-blur-md border border-rose-200 p-6 rounded-3xl shadow-sm relative overflow-hidden group">
          <div className="absolute right-4 top-4 bg-rose-100 p-3 rounded-2xl group-hover:scale-110 transition-transform">
            <X className="w-6 h-6 text-rose-600" />
          </div>
          <div className="text-4xl font-black text-rose-600 mb-1">{rejectedCount}</div>
          <div className="text-sm font-bold text-rose-800 uppercase tracking-wider">Rejected (This Term)</div>
        </div>
      </div>

      <div className="flex justify-between items-center bg-white/40 p-4 rounded-3xl border border-white/60 backdrop-blur-md shadow-sm">
        <h2 className="text-lg font-black text-slate-800">Leave Requests</h2>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" /> Log New Leave
        </button>
      </div>

      <div className="bg-white/60 backdrop-blur-md border border-white rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200/50">
              <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Student</th>
              <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Details</th>
              <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Dates</th>
              <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map(request => (
              <tr key={request.id} className="hover:bg-white/80 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-slate-800 text-sm">{request.student}</div>
                  <div className="text-xs font-bold text-slate-400">{request.grade} • {request.id}</div>
                </td>
                <td className="p-4">
                  <div className="font-bold text-slate-700 text-sm">{request.type}</div>
                  <div className="text-xs font-bold text-slate-500 flex items-center gap-1 mt-0.5">
                    {request.duration}
                    {request.document && <FileText className="w-3 h-3 text-indigo-500 ml-1" />}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-bold text-slate-700 text-sm">{request.dates}</div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                    request.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                    request.status === 'Rejected' ? 'bg-rose-100 text-rose-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {request.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2 items-center">
                    {request.status === 'Pending' && (
                      <>
                        <button title="Approve" onClick={() => handleAction(request.id, 'Approved')} className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl transition-colors border border-emerald-200">
                          <Check className="w-4 h-4" />
                        </button>
                        <button title="Reject" onClick={() => handleAction(request.id, 'Rejected')} className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-xl transition-colors border border-rose-200">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button title="Edit" onClick={() => handleOpenModal(request)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-xl transition-colors border border-blue-200">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button title="Delete" onClick={() => handleDelete(request.id)} className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-500 hover:text-white rounded-xl transition-colors border border-slate-200">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-500 font-bold">No leave requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800">{editingId ? 'Edit Leave Request' : 'Log New Leave'}</h3>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Student Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.student} 
                  onChange={(e) => setFormData({...formData, student: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Grade</label>
                <input 
                  required
                  type="text" 
                  value={formData.grade} 
                  onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="e.g. Grade 10B"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Type</label>
                  <select 
                    value={formData.type} 
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="Medical">Medical</option>
                    <option value="Family Event">Family Event</option>
                    <option value="Sports Competition">Sports Competition</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Duration</label>
                  <input 
                    required
                    type="text" 
                    value={formData.duration} 
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    placeholder="e.g. 2 Days"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Dates</label>
                <input 
                  required
                  type="text" 
                  value={formData.dates} 
                  onChange={(e) => setFormData({...formData, dates: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="e.g. Oct 12 - Oct 14"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="document"
                  checked={formData.document} 
                  onChange={(e) => setFormData({...formData, document: e.target.checked})}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="document" className="text-sm font-bold text-slate-600 cursor-pointer">
                  Supporting Document Provided
                </label>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors">
                  {editingId ? 'Save Changes' : 'Create Leave'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
