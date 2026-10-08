"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getLibraryCirculations() {
  const circulations = await prisma.libraryCirculation.findMany({
    include: {
      book: true,
      member: {
        include: {
          student: true,
        },
      },
    },
    orderBy: {
      issueDate: "desc",
    },
  });
  return circulations;
}

export async function getLibraryBooks() {
  return await prisma.libraryBook.findMany({
    where: {
      status: "AVAILABLE",
    },
    orderBy: {
      title: "asc",
    },
  });
}

export async function getLibraryMembers() {
  return await prisma.libraryMember.findMany({
    include: {
      student: true,
    },
  });
}

export async function checkoutBook(data: { bookId: string; memberId: string; dueDate: Date }) {
  // Simple checkout: create circulation
  // In a real app we might decrement available copies or change book status to BORROWED
  const { bookId, memberId, dueDate } = data;

  const book = await prisma.libraryBook.findUnique({ where: { id: bookId } });
  if (!book) throw new Error("Book not found");

  const member = await prisma.libraryMember.findUnique({ where: { id: memberId } });
  if (!member) throw new Error("Member not found");

  // Get tenant ID from book or member
  const tenantId = book.tenantId;

  await prisma.libraryCirculation.create({
    data: {
      tenantId,
      bookId,
      memberId,
      dueDate,
      status: "ISSUED",
    },
  });

  // Optionally update book status if needed, assuming 1 copy for simplicity
  await prisma.libraryBook.update({
    where: { id: bookId },
    data: { status: "BORROWED" },
  });

  revalidatePath("/dashboard/operations/library/circulation");
}

export async function checkinBook(circulationId: string) {
  const circulation = await prisma.libraryCirculation.findUnique({
    where: { id: circulationId },
  });

  if (!circulation) throw new Error("Circulation not found");

  await prisma.libraryCirculation.update({
    where: { id: circulationId },
    data: {
      status: "RETURNED",
      returnDate: new Date(),
    },
  });

  // Update book status back to available
  await prisma.libraryBook.update({
    where: { id: circulation.bookId },
    data: { status: "AVAILABLE" },
  });

  revalidatePath("/dashboard/operations/library/circulation");
}
