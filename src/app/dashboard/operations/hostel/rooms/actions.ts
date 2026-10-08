"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getRooms() {
  try {
    const rooms = await prisma.hostelRoom.findMany({
      include: {
        hostel: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: rooms };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getHostels() {
  try {
    const hostels = await prisma.hostel.findMany({
      orderBy: { name: "asc" },
    });
    return { success: true, data: hostels };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createRoom(data: {
  tenantId: string;
  hostelId: string;
  roomNumber: string;
  capacity: number;
  type: string;
  status: string;
}) {
  try {
    const room = await prisma.hostelRoom.create({
      data,
    });
    revalidatePath("/dashboard/operations/hostel/rooms");
    revalidatePath("/dashboard/operations/hostel");
    return { success: true, data: room };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateRoom(
  id: string,
  data: {
    hostelId: string;
    roomNumber: string;
    capacity: number;
    type: string;
    status: string;
  }
) {
  try {
    const room = await prisma.hostelRoom.update({
      where: { id },
      data,
    });
    revalidatePath("/dashboard/operations/hostel/rooms");
    revalidatePath("/dashboard/operations/hostel");
    return { success: true, data: room };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteRoom(id: string) {
  try {
    await prisma.hostelRoom.delete({
      where: { id },
    });
    revalidatePath("/dashboard/operations/hostel/rooms");
    revalidatePath("/dashboard/operations/hostel");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getHostelStats() {
  try {
    const rooms = await prisma.hostelRoom.findMany();
    const allocations = await prisma.hostelAllocation.count({
      where: { status: "ACTIVE" }
    });

    const totalBeds = rooms.reduce((acc, room) => acc + room.capacity, 0);
    const occupied = allocations; // assuming 1 allocation = 1 bed occupied

    return { success: true, data: { totalBeds, occupied } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
