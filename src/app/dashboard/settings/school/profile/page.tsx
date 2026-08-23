import React from "react";
import ProfileClient from "./ProfileClient";
import { getSchoolProfile } from "../actions";

export default async function ProfilePage() {
  const profile = await getSchoolProfile();

  return <ProfileClient initialData={profile} />;
}

