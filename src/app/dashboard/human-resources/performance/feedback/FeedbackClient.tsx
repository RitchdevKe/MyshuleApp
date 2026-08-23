"use client";

import React, { useState, useMemo, useEffect, useTransition } from "react";
import { MessageCircle, Heart, Lightbulb, Users, Plus, Star, Filter, Trash2, Edit2, X, Check, Loader2 } from "lucide-react";
import { createFeedback, updateFeedback, deleteFeedback, likeFeedback } from "./actions";

type StaffMember = {
  id: string;
  name: string;
  role: string;
  department: string;
};

type Feedback = {
  id: string;
  recipientId: string;
  recipientName: string;
  senderId: string;
  senderName: string;
  type: string;
  date: string;
  content: string;
  likes: number;
};

const FEEDBACK_TYPES = [
  { name: "Leadership", icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
  { name: "Teamwork", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { name: "Innovation", icon: Lightbulb, color: "text-emerald-600", bg: "bg-emerald-50" },
  { name: "Core Values", icon: Heart, color: "text-rose-600", bg: "bg-rose-50" },
];

export default function FeedbackClient({ staffMembers, initialFeedbacks }: { staffMembers: StaffMember[], initialFeedbacks: Feedback[] }) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setFeedbacks(initialFeedbacks);
  }, [initialFeedbacks]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    recipientId: "",
    senderId: "",
    type: "Leadership",
    content: "",
  });

  const [filterType, setFilterType] = useState<string>("All");

  const totalFeedback = feedbacks.length;
  const totalLikes = feedbacks.reduce((acc, fb) => acc + fb.likes, 0);
  
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    feedbacks.forEach(fb => {
      counts[fb.type] = (counts[fb.type] || 0) + 1;
    });
    return counts;
  }, [feedbacks]);

  const topType = useMemo(() => {
    let max = 0;
    let type = "None";
    Object.entries(typeCounts).forEach(([k, v]) => {
      if (v > max) {
        max = v;
        type = k;
      }
    });
    return type;
  }, [typeCounts]);

  const handleOpenModal = (fb?: Feedback) => {
    if (fb) {
      setIsEditing(fb.id);
      setFormData({
        recipientId: fb.recipientId,
        senderId: fb.senderId,
        type: fb.type,
        content: fb.content,
      });
    } else {
      setIsEditing(null);
      setFormData({
        recipientId: "",
        senderId: "",
        type: "Leadership",
        content: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.recipientId || !formData.senderId || !formData.content) {
      alert("Please fill all fields");
      return;
    }

    startTransition(async () => {
      const recipient = staffMembers.find(s => s.id === formData.recipientId)?.name || formData.recipientId;
      const sender = staffMembers.find(s => s.id === formData.senderId)?.name || formData.senderId;

      if (isEditing) {
        setFeedbacks(prev => prev.map(fb => fb.id === isEditing ? {
          ...fb,
          recipientId: formData.recipientId,
          recipientName: recipient,
          senderId: formData.senderId,
          senderName: sender,
          type: formData.type,
          content: formData.content,
        } : fb));
        
        await updateFeedback(isEditing, {
          recipientId: formData.recipientId,
          senderId: formData.senderId,
          category: formData.type,
          content: formData.content,
        });
      } else {
        const newFeedback: Feedback = {
          id: `temp-${Date.now()}`,
          recipientId: formData.recipientId,
          recipientName: recipient,
          senderId: formData.senderId,
          senderName: sender,
          type: formData.type,
          date: new Date().toISOString(),
          content: formData.content,
          likes: 0,
        };
        setFeedbacks(prev => [newFeedback, ...prev]);

        await createFeedback({
          recipientId: formData.recipientId,
          senderId: formData.senderId,
          category: formData.type,
          content: formData.content,
        });
      }
      setIsModalOpen(false);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this feedback?")) {
      startTransition(async () => {
        setFeedbacks(prev => prev.filter(fb => fb.id !== id));
        await deleteFeedback(id);
      });
    }
  };

  const handleLike = (id: string) => {
    startTransition(async () => {
      setFeedbacks(prev => prev.map(fb => fb.id === id ? { ...fb, likes: fb.likes + 1 } : fb));
      if (!id.startsWith('temp-')) {
        await likeFeedback(id);
      }
    });
  };

  const filteredFeedbacks = feedbacks.filter(fb => filterType === "All" || fb.type === filterType);

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    if (diff < 14) return "1 week ago";
    return d.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Feedback</p>
            <p className="text-2xl font-bold text-slate-800">{totalFeedback}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Likes</p>
            <p className="text-2xl font-bold text-slate-800">{totalLikes}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Top Quality</p>
            <p className="text-xl font-bold text-slate-800">{topType}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm outline-none"
          >
            <option value="All">All Categories</option>
            {FEEDBACK_TYPES.map(t => (
              <option key={t.name} value={t.name}>{t.name}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
        >
          <Plus className="w-4 h-4" />
          Give Feedback
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {filteredFeedbacks.map((fb) => {
            const typeInfo = FEEDBACK_TYPES.find(t => t.name === fb.type) || FEEDBACK_TYPES[0];
            const Icon = typeInfo.icon;
            
            return (
               <div key={fb.id} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-6 hover:shadow-lg transition-all duration-300 flex gap-4 relative group">
                  <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(fb)} className="p-1.5 bg-slate-100 hover:bg-primary-50 hover:text-primary-600 text-slate-400 rounded-lg transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(fb.id)} className="p-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-400 rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${typeInfo.bg} ${typeInfo.color}`}>
                     <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                     <div className="flex justify-between items-start mb-1 pr-16">
                        <div>
                           <p className="text-sm font-bold text-slate-800">To: {fb.recipientName}</p>
                           <p className="text-xs font-medium text-slate-500">From: {fb.senderName}</p>
                        </div>
                        <span className="text-xs font-bold text-slate-400">{formatDate(fb.date)}</span>
                     </div>
                     <div className="mt-3 mb-3">
                        <span className={`inline-block px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg mb-2 ${typeInfo.bg} ${typeInfo.color}`}>
                           {fb.type}
                        </span>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">"{fb.content}"</p>
                     </div>
                     <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                        <button 
                          onClick={() => handleLike(fb.id)}
                          className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${fb.likes > 0 ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
                        >
                           <Heart className={`w-4 h-4 ${fb.likes > 0 ? 'fill-current' : ''}`} />
                           {fb.likes} {fb.likes === 1 ? 'Like' : 'Likes'}
                        </button>
                     </div>
                  </div>
               </div>
            );
         })}
         {filteredFeedbacks.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 font-medium">
              No feedback found matching the selected filters.
            </div>
         )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">{isEditing ? "Edit Feedback" : "Give Feedback"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Sender</label>
                  <select
                    value={formData.senderId}
                    onChange={(e) => setFormData(prev => ({ ...prev, senderId: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500/20 outline-none"
                  >
                    <option value="">Select Sender...</option>
                    {staffMembers.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                    ))}
                    {/* Fallbacks for mocked data without staff members in DB */}
                    {staffMembers.length === 0 && (
                      <>
                         <option value="mock-1">Jane Doe</option>
                         <option value="mock-2">Alice Wanjiku</option>
                         <option value="mock-4">Robert Kiprono</option>
                         <option value="mock-6">David Mwangi</option>
                      </>
                    )}
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Recipient</label>
                  <select
                    value={formData.recipientId}
                    onChange={(e) => setFormData(prev => ({ ...prev, recipientId: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500/20 outline-none"
                  >
                    <option value="">Select Recipient...</option>
                    {staffMembers.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                    ))}
                    {staffMembers.length === 0 && (
                      <>
                         <option value="mock-3">Sarah Connor</option>
                         <option value="mock-5">John Smith</option>
                         <option value="mock-7">Michael Ochieng</option>
                         <option value="mock-1">Jane Doe</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Category</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {FEEDBACK_TYPES.map(type => (
                    <button
                      key={type.name}
                      onClick={() => setFormData(prev => ({ ...prev, type: type.name }))}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all
                        ${formData.type === type.name 
                          ? `${type.bg} border-${type.color.split('-')[1]}-200 ${type.color}` 
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                    >
                      <type.icon className="w-4 h-4" />
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Feedback Message</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Share your feedback..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500/20 outline-none min-h-[100px] resize-none"
                ></textarea>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                onClick={() => setIsModalOpen(false)}
                disabled={isPending}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200/50 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl text-sm font-bold transition-all shadow-sm shadow-primary-900/20 disabled:opacity-50"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {isEditing ? (isPending ? "Updating..." : "Update") : (isPending ? "Submitting..." : "Submit Feedback")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
