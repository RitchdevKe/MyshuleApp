import React from "react";
import { getAllocations, getStudentsForDropdown, getHostelsWithRooms } from "./actions";
import AllocationClient from "./AllocationClient";

export default async function AllocationPage() {
  const allocations = await getAllocations();
  const students = await getStudentsForDropdown();
  const hostels = await getHostelsWithRooms();

  return <AllocationClient allocations={allocations} students={students} hostels={hostels} />;
}
