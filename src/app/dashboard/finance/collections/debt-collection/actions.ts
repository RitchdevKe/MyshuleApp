"use server";

import prisma from "@/lib/prisma";

export async function getDebtStats() {
  const invoices = await prisma.invoice.findMany({
    where: {
      status: {
        in: ["UNPAID", "PARTIALLY_PAID"],
      },
    },
    select: {
      balanceDue: true,
      dueDate: true,
    },
  });

  const now = new Date();
  
  let totalArrears = 0;
  let zeroToThirty = 0;
  let thirtyOneToSixty = 0;
  let ninetyPlus = 0;

  invoices.forEach((inv) => {
    totalArrears += inv.balanceDue;
    
    const diffTime = now.getTime() - inv.dueDate.getTime();
    const diffDays = diffTime > 0 ? Math.floor(diffTime / (1000 * 60 * 60 * 24)) : 0;
    
    if (diffDays <= 30) {
      zeroToThirty += inv.balanceDue;
    } else if (diffDays <= 60) {
      thirtyOneToSixty += inv.balanceDue;
    } else if (diffDays > 90) {
      ninetyPlus += inv.balanceDue;
    }
  });

  return {
    totalArrears,
    zeroToThirty,
    thirtyOneToSixty,
    ninetyPlus,
  };
}

export async function sendBatchReminders() {
  // Mock sending reminders
  console.log("Sending batch reminders to debtors...");
  // Sleep for 1 second to simulate network request
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Batch reminders sent successfully!");
  
  return { success: true, message: "Reminders sent successfully to all debtors." };
}
