import React from "react";
import JobOpeningsClient from "./JobOpeningsClient";
import { getJobOpenings } from "./actions";

export default async function JobOpeningsPage() {
  const jobOpenings = await getJobOpenings();
  
  return <JobOpeningsClient initialJobOpenings={jobOpenings} />;
}
