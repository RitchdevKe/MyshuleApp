import React from "react";
import FeeStructuresClient from "./FeeStructuresClient";
import { getFeeStructures } from "@/app/actions/finance";
import { getAcademicYears } from "@/app/actions/academic";
import { getClassesAndStreams } from "@/app/actions/classes";

export default async function FeeStructuresPage() {
  const feeStructures = await getFeeStructures();
  const academicYears = await getAcademicYears();
  const classes = await getClassesAndStreams();

  return (
    <FeeStructuresClient 
      feeStructures={feeStructures} 
      academicYears={academicYears} 
      classes={classes} 
    />
  );
}
