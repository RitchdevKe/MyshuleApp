import React from "react";
import GradingClient from "./GradingClient";
import { getGradingScales } from "@/app/actions/grading";

export default async function GradingPage() {
  const gradingScales = await getGradingScales();
  return <GradingClient gradingScales={gradingScales} />;
}
