import React from "react";
import ContactsClient from "./ContactsClient";
import { getSchoolProfile } from "../actions";

export default async function ContactsPage() {
  const tenant = await getSchoolProfile();

  return <ContactsClient tenant={tenant} />;
}

