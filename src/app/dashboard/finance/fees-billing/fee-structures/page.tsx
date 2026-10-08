import React from "react";
import { getFeeStructures, getAcademicYears, getClasses } from "./actions";
import FeeStructuresClient from "./FeeStructuresClient";

export default async function FeeStructuresPage() {
  const feeStructures = await getFeeStructures();
  const academicYears = await getAcademicYears();
  const classes = await getClasses();

  return (
    <FeeStructuresClient 
      initialData={feeStructures} 
      academicYears={academicYears} 
      classes={classes} 
    />
  );
}
