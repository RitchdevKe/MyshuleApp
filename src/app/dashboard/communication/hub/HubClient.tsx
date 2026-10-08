"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Search, Plus, Filter, User, Bell, CheckCircle2, MoreVertical, Send, Paperclip, Image as ImageIcon, X } from "lucide-react";
import { getConversationMessages, sendMessage } from "./actions";

interface ConversationInfo {
  id: string;
  sender: string;
  role: string;
  preview: string;
  time: string;
  unread: boolean;
}

interface UserOption {
  id: string;
  name: string;
  role: string;
}

interface MessageInfo {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  time: string;
}

export default function HubClient({ initialConversations, users, currentUserId }: { initialConversations: ConversationInfo[], users: UserOption[], currentUserId: string }) {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeChat, setActiveChat] = useState<string | null>(initialConversations[0]?.id || null);
  const [messages, setMessages] = useState<MessageInfo[]>([]);
  const [search, setSearch] = useState("");
  const [composeText, setComposeText] = useState("");
  const [loadingMsg, setLoadingMsg] = useState(false);
  
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatUser, setNewChatUser] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeChat) {
      getConversationMessages(activeChat).then(msgs => {
        setMessages(msgs);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [activeChat]);

  const handleSend = async () => {
    if (!composeText.trim() || !activeChat) return;
    setLoadingMsg(true);
    try {
      await sendMessage({ conversationId: activeChat, content: composeText });
      setComposeText("");
      const msgs = await getConversationMessages(activeChat);
      setMessages(msgs);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } finally {
      setLoadingMsg(false);
    }
  };

  const handleCreateChat = async () => {
    if (!newChatUser) return;
    setLoadingMsg(true);
    try {
      const convId = await sendMessage({ recipientId: newChatUser, content: "Hello!" });
      setShowNewChat(false);
      window.location.reload(); // Quick refresh to load the new conversation list
    } finally {
      setLoadingMsg(false);
    }
  };

  const filtered = conversations.filter(c => !search || c.sender.toLowerCase().includes(search.toLowerCase()));

  const activeChatDetails = conversations.find(c => c.id === activeChat);

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex h-[600px]">
        {/* Sidebar / Message List */}
        <div className="w-full md:w-1/3 border-r border-slate-200/60 flex flex-col bg-slate-50/50">
           <div className="p-5 border-b border-slate-200/60 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                 <h2 className="text-lg font-black text-slate-800">Inbox</h2>
                 <button onClick={() => setShowNewChat(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
                    <Plus className="w-4 h-4" />
                    New Message
                 </button>
              </div>
              <div className="flex gap-2">
                 <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
                 </div>
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto">
              {filtered.map((msg) => (
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
                        <span className={`text-[10px] font-bold ${msg.unread ? 'text-secondary-600' : 'text-slate-400'}`}>
                          {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                     </div>
                     <p className={`text-xs line-clamp-1 ${msg.unread ? 'font-semibold text-slate-700' : 'text-slate-500'}`}>{msg.preview}</p>
                     <div className="mt-2 flex gap-2">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${activeChat === msg.id ? 'bg-secondary-200 text-secondary-800' : 'bg-slate-200 text-slate-600'}`}>{msg.role}</span>
                       {msg.unread && <span className="w-2 h-2 rounded-full bg-primary-500 mt-0.5 ml-auto"></span>}
                    </div>
                 </div>
              ))}
              {filtered.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-sm">No conversations found.</div>
              )}
           </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-1 flex-col bg-white">
           {activeChat && activeChatDetails ? (
              <>
                 <div className="p-5 border-b border-slate-200/60 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                          <User className="w-5 h-5" />
                       </div>
                       <div>
                          <h3 className="font-bold text-slate-800">{activeChatDetails.sender}</h3>
                          <p className="text-xs font-medium text-slate-500">{activeChatDetails.role}</p>
                       </div>
                    </div>
                    <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
                       <MoreVertical className="w-5 h-5" />
                    </button>
                 </div>

                 <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 flex flex-col gap-4">
                    {messages.map((m) => {
                      const isMe = m.senderId === currentUserId;
                      return (
                        <div key={m.id} className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                           <div className={`p-3 rounded-2xl ${isMe ? 'bg-primary-900 text-white rounded-br-sm shadow-sm shadow-primary-900/20' : 'bg-white border border-slate-200 shadow-sm rounded-bl-sm'}`}>
                              <p className="text-sm">{m.content}</p>
                           </div>
                           <span className="text-[10px] font-bold text-slate-400 mt-1 px-1">
                             {new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </span>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                 </div>

                 <div className="p-4 border-t border-slate-200/60 bg-white">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-primary-900 focus-within:border-transparent transition-all">
                       <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><Paperclip className="w-5 h-5" /></button>
                       <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><ImageIcon className="w-5 h-5" /></button>
                       <input 
                         type="text" 
                         value={composeText}
                         onChange={e => setComposeText(e.target.value)}
                         onKeyDown={e => e.key === 'Enter' && handleSend()}
                         placeholder="Type a message..." 
                         className="flex-1 bg-transparent px-2 text-sm focus:outline-none" 
                       />
                       <button 
                         onClick={handleSend}
                         disabled={loadingMsg || !composeText.trim()}
                         className="p-2 bg-primary-900 hover:bg-primary-800 disabled:opacity-50 text-white rounded-xl shadow-sm transition-colors"
                       >
                          <Send className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
              </>
           ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                 <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                 <p className="font-bold text-lg text-slate-500">Select a conversation</p>
                 <p className="text-sm">Or start a new message</p>
              </div>
           )}
        </div>
      </div>

      {showNewChat && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-800">New Message</h3>
              <button onClick={() => setShowNewChat(false)} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1 block">Select Recipient</label>
                <select value={newChatUser} onChange={e => setNewChatUser(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900">
                  <option value="">Select a user...</option>
                  {users.filter(u => u.id !== currentUserId).map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-5 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowNewChat(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
              <button onClick={handleCreateChat} disabled={loadingMsg || !newChatUser} className="px-4 py-2 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl disabled:opacity-50">Start Chat</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
