import React from "react";
import InvitationsClient from "./InvitationsClient";
import { getInvitations } from "@/app/actions/userManagement";
import { getRoles } from "@/app/actions/staff";

export default async function InvitationsPage() {
  const [invitations, roles] = await Promise.all([
    getInvitations(),
    getRoles()
  ]);
  
  return <InvitationsClient initialInvitations={invitations} roles={roles} />;
}
