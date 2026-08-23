import React from "react";
import BranchesClient from "./BranchesClient";
import { getBranches } from "../actions";

export default async function BranchesPage() {
  const branches = await getBranches();

  return <BranchesClient branches={branches} />;
}
