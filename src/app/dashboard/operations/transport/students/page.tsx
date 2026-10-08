import React from "react";
import { getTransportAssignments, getRoutes, getRoutesData, getUnassignedStudents } from "./actions";
import StudentTransportClient from "./ClientPage";

export const dynamic = "force-dynamic";

export default async function StudentTransportPage() {
  const students = await getTransportAssignments();
  const routes = await getRoutes();
  const routesData = await getRoutesData();
  const unassignedStudents = await getUnassignedStudents();

  return (
    <StudentTransportClient 
      initialStudents={students} 
      routes={routes} 
      routesData={routesData}
      unassignedStudents={unassignedStudents}
    />
  );
}
