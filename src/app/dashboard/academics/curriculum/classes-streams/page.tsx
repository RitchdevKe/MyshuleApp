import React from "react";
import { getClassesAndStreams, getBranches } from "@/app/actions/classes";
import ClassesStreamsClient from "./ClassesStreamsClient";

export default async function ClassesStreamsPage() {
  const [classes, branches] = await Promise.all([
    getClassesAndStreams(),
    getBranches()
  ]);

  return (
    <ClassesStreamsClient classes={classes} branches={branches} />
  );
}