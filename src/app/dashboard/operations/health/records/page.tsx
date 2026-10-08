import React from "react";
import { getSession } from "@/lib/auth";
import { getMedicalRecords, getStudents } from "./actions";
import MedicalRecordsClient from "./MedicalRecordsClient";

export const metadata = {
  title: "Medical Records | School Management System",
};

export default async function MedicalRecordsPage() {
  const session = await getSession();
  const tenantId = session?.tenantId || "default";

  const [initialRecords, initialStudents] = await Promise.all([
    getMedicalRecords(),
    getStudents(),
  ]);

  return (
    <MedicalRecordsClient
      initialRecords={initialRecords}
      initialStudents={initialStudents}
    />
  );
}
