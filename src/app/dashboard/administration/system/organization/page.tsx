import React from "react";
import ClassesClient from "./ClassesClient";
import { getClassesAndStreams, getBranches } from "@/app/actions/classes";

export default async function OrganizationPage() {
  const classes = await getClassesAndStreams();
  const branches = await getBranches();

  return <ClassesClient classes={classes} branches={branches} />;
}
