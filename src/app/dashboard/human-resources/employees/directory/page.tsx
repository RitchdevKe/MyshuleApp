import React from "react";
import DirectoryClient from "./DirectoryClient";
import { getStaff } from "./actions";

export default async function DirectoryPage() {
  const staff = await getStaff();
  
  return <DirectoryClient initialStaff={staff} />;
}
