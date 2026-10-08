"use client";

import React, { useState, useRef } from "react";
import { getExecutiveInsightSummary } from "./actions";

type Anomaly = {
  id: string;
  title: string;
  description: string;
  severity: string;
  type: string;
};

type InsightData = {
  metrics: {
    totalStudents: number;
    totalStaff: number;
    totalRevenueExpected: number;
    totalRevenueCollected: number;
    totalOutstanding: number;
    collectionRate: number;
    averageScore: number;
  };
  insights: {
    financialHealth: string;
    academicInsight: string;
    summaryText: string;
  };
  anomalies: Anomaly[];
};

export default function ExecutiveInsightClient({ initialData }: { initialData: InsightData }) {
  const [data, setData] = useState<InsightData>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const newData = await getExecutiveInsightSummary();
      setData(newData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const openDialog = (anomaly: Anomaly) => {
    setSelectedAnomaly(anomaly);
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
    setSelectedAnomaly(null);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-end print:hidden">
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          {isRefreshing ? "Refreshing..." : "Generate new summary"}
        </button>
        <button 
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition-colors"
        >
          Export to PDF
        </button>
      </div>

      {/* Summary Block */}
      <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">AI Executive Summary</h3>
        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
          {data.insights.summaryText}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Students" 
          value={data.metrics.totalStudents.toString()} 
          subtitle="Active enrollments" 
        />
        <MetricCard 
          title="Total Staff" 
          value={data.metrics.totalStaff.toString()} 
          subtitle="Active employees" 
        />
        <MetricCard 
          title="Revenue Collected" 
          value={`$${data.metrics.totalRevenueCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
          subtitle={`${data.metrics.collectionRate.toFixed(1)}% collection rate`} 
        />
        <MetricCard 
          title="Outstanding Balance" 
          value={`$${data.metrics.totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
          subtitle="Unpaid invoices" 
        />
      </div>

      {/* Anomalies Section */}
      <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Detected Anomalies</h3>
        {data.anomalies.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">No anomalies detected.</p>
        ) : (
          <div className="space-y-4">
            {data.anomalies.map(anomaly => (
              <div key={anomaly.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      anomaly.severity === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      anomaly.severity === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {anomaly.severity}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">{anomaly.type}</span>
                  </div>
                  <h4 className="font-medium text-slate-900 dark:text-white">{anomaly.title}</h4>
                </div>
                <button 
                  onClick={() => openDialog(anomaly)}
                  className="px-4 py-2 text-sm font-medium rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white transition-colors"
                >
                  Investigate issue
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Native Dialog for Investigations */}
      <dialog 
        ref={dialogRef} 
        className="p-0 rounded-3xl backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm bg-transparent w-full max-w-lg m-auto border-none shadow-2xl"
      >
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl w-full">
          <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
            Investigation Details
          </h3>
          {selectedAnomaly && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Issue</p>
                <p className="text-slate-900 dark:text-white">{selectedAnomaly.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Description</p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedAnomaly.description}</p>
              </div>
              <div className="flex gap-4">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Severity</p>
                    <p className="text-slate-900 dark:text-white">{selectedAnomaly.severity}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Type</p>
                    <p className="text-slate-900 dark:text-white">{selectedAnomaly.type}</p>
                </div>
              </div>
            </div>
          )}
          <div className="mt-8 flex justify-end">
            <button 
              onClick={closeDialog}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

function MetricCard({ title, value, subtitle }: { title: string, value: string, subtitle: string }) {
  return (
    <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{title}</h4>
      <div>
        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}
