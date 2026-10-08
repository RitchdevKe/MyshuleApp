import React from "react";
import prisma from "@/lib/prisma";
import DepartmentBudgetsClient from "./DepartmentBudgetsClient";

export default async function DepartmentBudgetsPage() {
  const budgets = await prisma.budget.findMany({
    include: {
      departments: true,
    },
  });

  const allDepartments = budgets.flatMap((b) =>
    b.departments.map((d) => ({
      ...d,
      budgetName: b.name,
    }))
  );

  // Fallback to empty state if no budgets exist, but maybe also pass an empty array
  // The client will render an empty list if there's no data.
  // We can pass the budgets so the modal can select one.

  return (
    <DepartmentBudgetsClient 
      departments={allDepartments} 
      budgets={budgets.map(b => ({ id: b.id, name: b.name }))} 
    />
  );
}
