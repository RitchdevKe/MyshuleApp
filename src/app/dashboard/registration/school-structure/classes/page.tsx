import React from "react";
import ClassesClient from "./ClassesClient";
import { getBranches, getClassesAndStreams } from "@/app/actions/classes";

export default async function ClassesPage() {
  const branches = await getBranches();
  const classes = await getClassesAndStreams();

  return <ClassesClient branches={branches} classes={classes} />;
}