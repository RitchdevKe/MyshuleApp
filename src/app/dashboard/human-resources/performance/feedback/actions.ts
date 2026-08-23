"use server";

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

export async function getStaffMembers() {
  try {
    const staff = await prisma.staff.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        jobTitle: true,
        department: true
      },
      orderBy: {
        firstName: 'asc'
      }
    });
    
    return staff.map(s => ({
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      role: s.jobTitle,
      department: s.department
    }));
  } catch (error) {
    console.error("Error fetching staff:", error);
    return [];
  }
}

export async function getFeedbacks() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      include: {
        sender: true,
        recipient: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return feedbacks.map(fb => ({
      id: fb.id,
      recipientId: fb.recipientId,
      recipientName: fb.recipient ? `${fb.recipient.firstName} ${fb.recipient.lastName}` : "Unknown",
      senderId: fb.senderId,
      senderName: fb.sender ? `${fb.sender.firstName} ${fb.sender.lastName}` : "Unknown",
      type: fb.category,
      date: fb.createdAt.toISOString(),
      content: fb.content,
      likes: fb.likes,
    }));
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return [];
  }
}

export async function createFeedback(data: { recipientId: string, senderId: string, category: string, content: string }) {
  try {
    await prisma.feedback.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        recipientId: data.recipientId,
        senderId: data.senderId,
        category: data.category,
        content: data.content,
      }
    });
    revalidatePath('/dashboard/human-resources/performance/feedback');
    return { success: true };
  } catch (error) {
    console.error("Error creating feedback:", error);
    return { success: false, error: "Failed to create feedback" };
  }
}

export async function updateFeedback(id: string, data: { recipientId: string, senderId: string, category: string, content: string }) {
  try {
    await prisma.feedback.update({
      where: { id },
      data: {
        recipientId: data.recipientId,
        senderId: data.senderId,
        category: data.category,
        content: data.content,
      }
    });
    revalidatePath('/dashboard/human-resources/performance/feedback');
    return { success: true };
  } catch (error) {
    console.error("Error updating feedback:", error);
    return { success: false, error: "Failed to update feedback" };
  }
}

export async function deleteFeedback(id: string) {
  try {
    await prisma.feedback.delete({
      where: { id }
    });
    revalidatePath('/dashboard/human-resources/performance/feedback');
    return { success: true };
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return { success: false, error: "Failed to delete feedback" };
  }
}

export async function likeFeedback(id: string) {
  try {
    await prisma.feedback.update({
      where: { id },
      data: {
        likes: {
          increment: 1
        }
      }
    });
    revalidatePath('/dashboard/human-resources/performance/feedback');
    return { success: true };
  } catch (error) {
    console.error("Error liking feedback:", error);
    return { success: false, error: "Failed to like feedback" };
  }
}
