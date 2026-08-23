import React from "react";
import StaffClient from "./StaffClient";
import { getStaff, getRoles } from "@/app/actions/staff";

export default async function StaffPage() {
  const staffMembers = await getStaff();
  const roles = await getRoles();
  
  return <StaffClient staffMembers={staffMembers} roles={roles} />;
}
