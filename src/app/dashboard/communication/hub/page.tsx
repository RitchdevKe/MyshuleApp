import React from "react";
import { MessageSquare, Bell, CheckCircle2 } from "lucide-react";
import { getConversations, getUsersForNewMessage } from "./actions";
import HubClient from "./HubClient";
import prisma from "@/lib/prisma";

export default async function HubAndMessagesPage() {
  const [conversations, users] = await Promise.all([
    getConversations(),
    getUsersForNewMessage(),
  ]);

  const tenant = await prisma.tenant.findFirst();
  const currentUser = tenant ? await prisma.user.findFirst({
    where: { tenantUsers: { some: { tenantId: tenant.id } } }
  }) : null;

  const unreadCount = conversations.reduce((sum, c) => sum + (c.unread ? 1 : 0), 0);
  const total = conversations.length;
  // Mock response rate for UI purposes
  const responseRate = "94%";

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
               <h3 className="text-2xl font-black text-slate-800">{unreadCount}</h3>
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
               <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Conversations</p>
               <h3 className="text-2xl font-black text-slate-800">{total}</h3>
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
               <Bell className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Response Rate</p>
               <h3 className="text-2xl font-black text-slate-800">{responseRate}</h3>
            </div>
         </div>
      </div>

      <HubClient 
        initialConversations={conversations} 
        users={users} 
        currentUserId={currentUser?.id || ""} 
      />
    </div>
  );
}
