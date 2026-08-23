import React from "react";
import ProfileClient from "./ProfileClient";
import { getTenantProfile } from "@/app/actions/tenant";

export default async function ProfilePage() {
  const profile = await getTenantProfile();

  return <ProfileClient initialData={profile} />;
}
