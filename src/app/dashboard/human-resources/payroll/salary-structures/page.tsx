import React from "react";
import prisma from "@/lib/prisma";
import SalaryStructuresClient from "./SalaryStructuresClient";

export default async function SalaryStructuresPage() {
  const structures = await prisma.salaryStructure.findMany({
    select: {
      id: true,
      name: true,
      baseRangeMin: true,
      baseRangeMax: true,
      grade: true,
      _count: {
        select: { staff: true }
      }
    },
    orderBy: {
      createdAt: "asc"
    }
  });

  return <SalaryStructuresClient initialStructures={structures} />;
}
