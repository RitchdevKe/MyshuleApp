"use client";

import React, { useState } from "react";
import { MessageSquare, Search, Plus, Filter, User, Bell, CheckCircle2, MoreVertical, Send, Paperclip, Image } from "lucide-react";

export default function HubAndMessagesPage() {
  const [activeChat, setActiveChat] = useState<number | null>(1);

  const messages = [
    { id: 1, sender: "Sarah Jenkins (Parent)", role: "Parent", preview: "Hi, I wanted to ask about the upcoming field trip...", time: "10:45 AM", unread: true },
    { id: 2, sender: "Mr. Roberts (Math)", role: "Teacher", preview: "The syllabus has been updated for Term 2.", time: "Yesterday", unread: false },
    { id: 3, sender: "PTA Committee", role: "Group", preview: "Agenda for next week's meeting is attached.", time: "Monday", unread: true },
    { id: 4, sender: "Admin Office", role: "Staff", preview: "Please submit your weekly reports by Friday.", time: "Aug 10", unread: false },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
               <MessageSquare className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Unread Messages</p>
               <h3 className="text-2xl font-black text-slate-800">12</h3>
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
               <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Response Rate</p>
               <h3 className="text-2xl font-black text-slate-800">94%</h3>
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
               <Bell className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Approvals</p>
               <h3 className="text-2xl font-black text-slate-800">3</h3>
            </div>
         </div>
      </div>

      {/* Unified Inbox */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex h-[600px]">
        {/* Sidebar / Message List */}
        <div className="w-full md:w-1/3 border-r border-slate-200/60 flex flex-col bg-slate-50/50">
           <div className="p-5 border-b border-slate-200/60 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                 <h2 className="text-lg font-black text-slate-800">Inbox</h2>
                 <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
                    <Plus className="w-4 h-4" />
                    New Message
                 </button>
              </div>
              <div className="flex gap-2">
                 <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Search messages..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
                 </div>
                 <button className="p-2 bg-white border border-slate-200/60 rounded-xl text-slate-500 hover:text-slate-700 transition-colors">
                    <Filter className="w-5 h-5" />
                 </button>
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto">
              {messages.map((msg) => (
                  <div 
                     key={msg.id} 
                     onClick={() => setActiveChat(msg.id)}
                     className={`p-4 border-b border-slate-100 cursor-pointer transition-colors ${
                        activeChat === msg.id 
                           ? 'bg-secondary-50 border-l-4 border-l-secondary-500 shadow-inner' 
                           : 'hover:bg-slate-100'
                     }`}
                  >
                     <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm font-bold ${activeChat === msg.id ? 'text-secondary-900' : (msg.unread ? 'text-slate-900' : 'text-slate-700')}`}>{msg.sender}</h4>
                        <span className={`text-[10px] font-bold ${msg.unread ? 'text-secondary-600' : 'text-slate-400'}`}>{msg.time}</span>
                     </div>
                     <p className={`text-xs line-clamp-1 ${msg.unread ? 'font-semibold text-slate-700' : 'text-slate-500'}`}>{msg.preview}</p>
                     <div className="mt-2 flex gap-2">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${activeChat === msg.id ? 'bg-secondary-200 text-secondary-800' : 'bg-slate-200 text-slate-600'}`}>{msg.role}</span>
                       {msg.unread && <span className="w-2 h-2 rounded-full bg-primary-500 mt-0.5 ml-auto"></span>}
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-1 flex-col bg-white">
           {activeChat ? (
              <>
                 {/* Chat Header */}
                 <div className="p-5 border-b border-slate-200/60 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-400" />
                       </div>
                       <div>
                          <h3 className="font-bold text-slate-800">{messages.find(m => m.id === activeChat)?.sender}</h3>
                          <p className="text-xs text-slate-500 font-medium">{messages.find(m => m.id === activeChat)?.role}</p>
                       </div>
                    </div>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                       <MoreVertical className="w-5 h-5" />
                    </button>
                 </div>

                 {/* Chat Messages */}
                 <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
                    <div className="flex flex-col items-center my-4">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-200 px-3 py-1 rounded-full">Today</span>
                    </div>
                    
                    <div className="flex justify-start">
                       <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 max-w-[80%] text-sm text-slate-700 shadow-sm">
                          <p>Hi, I wanted to ask about the upcoming field trip. What time will the buses return to the school?</p>
                          <span className="text-[10px] text-slate-400 mt-2 block text-left font-medium">10:45 AM</span>
                       </div>
                    </div>

                    <div className="flex justify-end mt-4">
                       <div className="bg-primary-900 text-white rounded-2xl rounded-tr-sm p-4 max-w-[80%] text-sm shadow-sm">
                          <p>Hello Sarah, the buses are scheduled to return at 3:30 PM. We will send an SMS update if there are any delays.</p>
                          <span className="text-[10px] text-primary-200 mt-2 block text-right font-medium">10:52 AM</span>
                       </div>
                    </div>
                 </div>

                 {/* Chat Input */}
                 <div className="p-4 border-t border-slate-200/60 bg-white">
                    <div className="flex items-center gap-2">
                       <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <Paperclip className="w-5 h-5" />
                       </button>
                       <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <Image className="w-5 h-5" />
                       </button>
                       <input 
                          type="text" 
                          placeholder="Type your message..." 
                          className="flex-1 py-2.5 px-4 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                       />
                       <button className="p-2.5 bg-primary-900 hover:bg-primary-800 text-white rounded-xl transition-all shadow-sm shadow-primary-900/20">
                          <Send className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
              </>
           ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                 <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                 <p className="font-medium">Select a message to view the conversation</p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
