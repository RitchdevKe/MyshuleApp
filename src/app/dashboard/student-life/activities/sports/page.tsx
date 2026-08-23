import React from "react";
import SportsClient from "./SportsClient";
import { getSports, getStaff } from "./actions";

export default async function SportsPage() {
  const sports = await getSports();
  const staff = await getStaff();

  return <SportsClient initialSports={sports} staff={staff} />;
}
