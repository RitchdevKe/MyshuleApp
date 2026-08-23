import React from "react";
import PreferencesClient from "./PreferencesClient";
import { getSchoolProfile } from "../actions";

export default async function PreferencesPage() {
  const tenant = await getSchoolProfile();

  return <PreferencesClient tenant={tenant} />;
}

