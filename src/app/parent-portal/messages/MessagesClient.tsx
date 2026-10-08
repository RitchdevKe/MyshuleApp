"use client";

import React, { useState } from 'react';
import { MessageSquare, BellRing, ArrowLeft, Send } from 'lucide-react';
import { format } from 'date-fns';

type Announcement = {
  id: string;
  title: string;
  content: string;
  publishDate: Date;
  createdBy: {
    email: string;
    staff: { firstName: string; lastName: string }[];
  } | null;
};

export default function MessagesClient({ announcements }: { announcements: Announcement[] }) {
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

  const activeMessage = announcements.find(a => a.id === activeMessageId);

  return (
    <div className="flex flex-col md:flex-row h-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm overflow-hidden">
      
      {/* Left Pane: Inbox List */}
      <div className={`w-full md:w-[320px] lg:w-[400px] flex-shrink-0 border-r border-slate-200 dark:border-slate-700 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 ${activeMessageId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800/80 shrink-0">
          <h3 className="font-black text-slate-800 dark:text-slate-100 text-xl">Inbox</h3>
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl cursor-pointer">
             <BellRing className="w-5 h-5" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 min-h-0">
          {announcements.length === 0 ? (
            <div className="py-12 text-center text-slate-500 flex flex-col items-center">
              <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="font-medium text-sm">No messages available.</p>
            </div>
          ) : (
            announcements.map((announcement) => {
              const staff = announcement.createdBy?.staff?.[0];
              const fromName = staff 
                ? `${staff.firstName} ${staff.lastName}`
                : announcement.createdBy?.email || 'School Administration';
              const isActive = announcement.id === activeMessageId;

              return (
                <button 
                  key={announcement.id} 
                  onClick={() => setActiveMessageId(announcement.id)}
                  className={`text-left rounded-2xl p-4 transition-all border ${isActive ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 shadow-sm' : 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-bold text-sm leading-tight line-clamp-1 pr-2 ${isActive ? 'text-primary-700 dark:text-primary-300' : 'text-slate-800 dark:text-slate-100'}`}>
                      {announcement.title}
                    </h4>
                    <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap shrink-0">
                      {format(new Date(announcement.publishDate), 'MMM d')}
                    </span>
                  </div>
                  <p className="font-semibold text-primary-600 dark:text-primary-400 text-[10px] uppercase tracking-wider mb-2 line-clamp-1">{fromName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{announcement.content}</p>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane: Active Chat */}
      <div className={`w-full md:flex-1 flex flex-col h-full bg-white dark:bg-slate-800 ${!activeMessageId ? 'hidden md:flex' : 'flex'}`}>
        {!activeMessage ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
             <MessageSquare className="w-16 h-16 text-slate-200 dark:text-slate-800 mb-4" />
             <p className="font-medium text-sm">Select a message to view the thread</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3 bg-white dark:bg-slate-800 shrink-0 shadow-sm z-10">
              <button 
                onClick={() => setActiveMessageId(null)}
                className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg truncate">
                  {activeMessage.title}
                </h3>
                <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider truncate">
                  {activeMessage.createdBy?.staff?.[0] ? `${activeMessage.createdBy.staff[0].firstName} ${activeMessage.createdBy.staff[0].lastName}` : activeMessage.createdBy?.email || 'School Administration'}
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 bg-slate-50/50 dark:bg-slate-900/30">
              {/* Initial Message Bubble */}
              <div className="flex flex-col items-start max-w-[85%] animate-in slide-in-from-bottom-2 fade-in duration-300">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm p-4 shadow-sm relative group">
                   <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{activeMessage.content}</p>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 mt-1.5 ml-1">
                  {format(new Date(activeMessage.publishDate), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              
              {/* Simulated read receipt or system text can go here */}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-end gap-2 shrink-0">
              <textarea 
                placeholder="Reply to this message..."
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none max-h-32 min-h-[44px]"
                rows={1}
                onChange={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
              />
              <button className="p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl transition-colors shadow-sm mb-[1px] shrink-0 active:scale-95">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
