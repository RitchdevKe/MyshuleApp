"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const REVALIDATE_PATH = "/dashboard/communication/hub";

export async function getConversations() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return [];

  const currentUser = await prisma.user.findFirst({
    where: { tenantUsers: { some: { tenantId: tenant.id } } }
  });
  if (!currentUser) return [];

  const conversations = await prisma.conversation.findMany({
    where: {
      tenantId: tenant.id,
      OR: [
        { participantOneId: currentUser.id },
        { participantTwoId: currentUser.id }
      ]
    },
    include: {
      participantOne: {
        include: { staff: true, parents: true, students: true, tenantUsers: { include: { role: true } } }
      },
      participantTwo: {
        include: { staff: true, parents: true, students: true, tenantUsers: { include: { role: true } } }
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      }
    },
    orderBy: { lastMessageAt: "desc" },
  });

  return conversations.map(c => {
    const otherUser = c.participantOneId === currentUser.id ? c.participantTwo : c.participantOne;
    const lastMessage = c.messages[0];

    let name = "Unknown User";
    if (otherUser.staff && otherUser.staff.length > 0) {
      name = `${otherUser.staff[0].firstName} ${otherUser.staff[0].lastName}`;
    } else if (otherUser.parents && otherUser.parents.length > 0) {
      name = `${otherUser.parents[0].firstName} ${otherUser.parents[0].lastName}`;
    } else if (otherUser.students && otherUser.students.length > 0) {
      name = `${otherUser.students[0].firstName} ${otherUser.students[0].lastName}`;
    }
    
    const roleName = otherUser.tenantUsers?.[0]?.role?.name || "User";

    return {
      id: c.id,
      sender: name,
      role: roleName,
      preview: lastMessage ? lastMessage.content : "No messages yet",
      time: lastMessage ? lastMessage.createdAt.toISOString() : c.createdAt.toISOString(),
      unread: lastMessage ? (!lastMessage.isRead && lastMessage.senderId !== currentUser.id) : false,
    };
  });
}

export async function getConversationMessages(conversationId: string) {
  const messages = await prisma.message.findMany({
    where: { conversationId },
    include: { 
      sender: {
        include: { staff: true, parents: true, students: true }
      } 
    },
    orderBy: { createdAt: "asc" },
  });

  // Mark unread as read conceptually
  await prisma.message.updateMany({
    where: { conversationId, isRead: false },
    data: { isRead: true },
  });
  
  return messages.map(m => {
    let name = "Unknown User";
    if (m.sender.staff && m.sender.staff.length > 0) {
      name = `${m.sender.staff[0].firstName} ${m.sender.staff[0].lastName}`;
    } else if (m.sender.parents && m.sender.parents.length > 0) {
      name = `${m.sender.parents[0].firstName} ${m.sender.parents[0].lastName}`;
    } else if (m.sender.students && m.sender.students.length > 0) {
      name = `${m.sender.students[0].firstName} ${m.sender.students[0].lastName}`;
    }

    return {
      id: m.id,
      senderId: m.senderId,
      senderName: name,
      content: m.content,
      time: m.createdAt.toISOString(),
      isRead: m.isRead,
    };
  });
}

export async function getUsersForNewMessage() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return [];

  const tenantUsers = await prisma.tenantUser.findMany({
    where: { tenantId: tenant.id },
    include: {
      user: {
        include: {
          staff: true,
          parents: true,
          students: true
        }
      },
      role: true
    }
  });

  return tenantUsers.map(tu => {
    let name = "Unknown User";
    if (tu.user.staff && tu.user.staff.length > 0) {
      name = `${tu.user.staff[0].firstName} ${tu.user.staff[0].lastName}`;
    } else if (tu.user.parents && tu.user.parents.length > 0) {
      name = `${tu.user.parents[0].firstName} ${tu.user.parents[0].lastName}`;
    } else if (tu.user.students && tu.user.students.length > 0) {
      name = `${tu.user.students[0].firstName} ${tu.user.students[0].lastName}`;
    }

    return {
      id: tu.user.id,
      name,
      role: tu.role.name,
    };
  });
}

export async function sendMessage(data: { conversationId?: string; recipientId?: string; content: string }) {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant");

  const currentUser = await prisma.user.findFirst({
    where: { tenantUsers: { some: { tenantId: tenant.id } } }
  });
  if (!currentUser) throw new Error("No current user");

  let conversationId = data.conversationId;

  if (!conversationId && data.recipientId) {
    // Check if conversation exists
    let conv = await prisma.conversation.findFirst({
      where: {
        OR: [
          { participantOneId: currentUser.id, participantTwoId: data.recipientId },
          { participantOneId: data.recipientId, participantTwoId: currentUser.id }
        ]
      }
    });

    if (!conv) {
      conv = await prisma.conversation.create({
        data: {
          tenantId: tenant.id,
          participantOneId: currentUser.id,
          participantTwoId: data.recipientId,
        }
      });
    }
    conversationId = conv.id;
  }

  if (!conversationId) throw new Error("Could not determine conversation");

  await prisma.message.create({
    data: {
      conversationId: conversationId,
      senderId: currentUser.id,
      content: data.content,
    }
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: new Date() }
  });

  revalidatePath(REVALIDATE_PATH);
  return conversationId;
}
