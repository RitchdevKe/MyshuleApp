import React from "react";
import ContactsClient from "./ContactsClient";
import { getTenantProfile } from "@/app/actions/tenant";

export default async function ContactsPage() {
  const tenant = await getTenantProfile();

  return <ContactsClient tenant={tenant} />;
}
