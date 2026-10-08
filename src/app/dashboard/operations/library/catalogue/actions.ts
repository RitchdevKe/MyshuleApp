"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Removed hardcoded TENANT_ID

export async function getBooks() {
  try {
    const books = await prisma.libraryBook.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        circulations: {
          where: {
            status: {
              in: ["ISSUED", "OVERDUE"]
            }
          }
        }
      }
    });

    const booksWithAvailability = books.map(book => {
      const borrowedCount = book.circulations.length;
      return {
        ...book,
        available: book.copies - borrowedCount
      };
    });

    return { success: true, data: booksWithAvailability };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function createBook(data: {
  title: string;
  author: string;
  isbn?: string;
  category?: string;
  copies: number;
  tenantId?: string;
}) {
  try {
    let tenantId = data.tenantId;
    if (!tenantId) {
       const tenant = await prisma.tenant.findFirst();
       if (!tenant) throw new Error("No tenant found");
       tenantId = tenant.id;
    }

    const book = await prisma.libraryBook.create({
      data: {
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        category: data.category,
        copies: data.copies,
        status: "AVAILABLE",
        tenantId, 
      },
    });
    revalidatePath("/dashboard/operations/library/catalogue");
    return { success: true, data: book };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function updateBook(id: string, data: Partial<{
  title: string;
  author: string;
  isbn: string;
  category: string;
  copies: number;
  status: string;
}>) {
  try {
    const book = await prisma.libraryBook.update({
      where: { id },
      data,
    });
    revalidatePath("/dashboard/operations/library/catalogue");
    return { success: true, data: book };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function deleteBook(id: string) {
  try {
    await prisma.libraryBook.delete({
      where: { id },
    });
    revalidatePath("/dashboard/operations/library/catalogue");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function getLibraryStats() {
  try {
    const books = await prisma.libraryBook.findMany();
    const totalBooks = books.reduce((acc, book) => acc + book.copies, 0);

    const activeCirculations = await prisma.libraryCirculation.count({
      where: {
        status: {
          in: ["ISSUED", "OVERDUE"]
        }
      }
    });

    const borrowed = activeCirculations;
    const available = totalBooks - borrowed;

    const lostBooksCount = await prisma.libraryCirculation.count({
      where: { status: "LOST" }
    });

    return { 
      success: true, 
      data: {
        totalBooks,
        borrowed,
        available,
        lost: lostBooksCount
      } 
    };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

