import React from "react";
import { getAnomalies } from "./actions";
import AnomaliesClient from "./AnomaliesClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Anomalies | MyShule",
  description: "Detect anomalies in operational, financial, and behavioral patterns.",
};

export default async function AIAnomaliesPage() {
  const anomalies = await getAnomalies();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
          AI Anomaly Detector
        </h1>
        <p className="text-sm md:text-base text-slate-500 font-medium max-w-2xl">
          Powered by MyShule AI, this module automatically scans your tenant's data for unusual patterns, financial risks, behavioral spikes, and stalled operations.
        </p>
      </div>

      <AnomaliesClient data={anomalies} />
    </div>
  );
}
