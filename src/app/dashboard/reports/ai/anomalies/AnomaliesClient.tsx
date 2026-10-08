"use client";

import React, { useRef, useState } from "react";
import { AlertTriangle, AlertCircle, FileText, Wrench, X, Clock, ArrowRight } from "lucide-react";
import { getAnomalyLogs } from "./actions";

type AnomaliesData = {
  massiveInvoices: any[];
  severeIncidents: any[];
  pendingMaintenance: any[];
};

export default function AnomaliesClient({ data }: { data: AnomaliesData }) {
  const [selectedAnomaly, setSelectedAnomaly] = useState<any | null>(null);
  const [anomalyType, setAnomalyType] = useState<"INVOICE" | "DISCIPLINE" | "MAINTENANCE" | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  
  const detailsModalRef = useRef<HTMLDialogElement>(null);
  const logsModalRef = useRef<HTMLDialogElement>(null);

  const openDetails = (anomaly: any, type: "INVOICE" | "DISCIPLINE" | "MAINTENANCE") => {
    setSelectedAnomaly(anomaly);
    setAnomalyType(type);
    detailsModalRef.current?.showModal();
  };

  const closeDetails = () => {
    detailsModalRef.current?.close();
    setSelectedAnomaly(null);
    setAnomalyType(null);
  };

  const openLogs = async (anomaly: any, type: "INVOICE" | "DISCIPLINE" | "MAINTENANCE") => {
    setSelectedAnomaly(anomaly);
    setAnomalyType(type);
    setIsLoadingLogs(true);
    logsModalRef.current?.showModal();
    
    try {
      const result = await getAnomalyLogs(type, anomaly.id);
      setLogs(result);
    } catch (e) {
      console.error(e);
      setLogs([]);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const closeLogs = () => {
    logsModalRef.current?.close();
    setSelectedAnomaly(null);
    setAnomalyType(null);
    setLogs([]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-sm">
        <h2 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-500" /> AI Anomaly Detection
        </h2>
        <p className="text-sm text-slate-500 max-w-2xl">
          The AI engine has scanned your data and identified several operational, financial, and behavioral patterns that require immediate attention.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Anomalies */}
        <div className="bg-rose-50/50 border border-rose-100 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-black text-rose-900 uppercase tracking-wider mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-rose-500" /> High-Risk Invoices
          </h3>
          {data.massiveInvoices.length === 0 ? (
            <p className="text-xs text-slate-500 font-medium">No severe financial anomalies detected.</p>
          ) : (
            <div className="space-y-4">
              {data.massiveInvoices.map((inv) => (
                <div key={inv.id} className="bg-white/80 backdrop-blur-xl border border-rose-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-2 h-full bg-rose-500"></div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800 text-sm">Inv: {inv.invoiceNumber}</h4>
                    <span className="text-xs font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded">
                      {inv.balanceDue.toLocaleString()} Due
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-4 line-clamp-1">
                    Student: {inv.student?.firstName} {inv.student?.lastName}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => openDetails(inv, "INVOICE")} className="flex-1 bg-slate-900 text-white text-[10px] font-bold py-2 rounded-lg hover:bg-slate-800 transition-colors">
                      Investigate
                    </button>
                    <button onClick={() => openLogs(inv, "INVOICE")} className="flex-1 bg-rose-50 text-rose-700 text-[10px] font-bold py-2 rounded-lg border border-rose-200 hover:bg-rose-100 transition-colors">
                      Review Logs
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Behavioral Anomalies */}
        <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-black text-amber-900 uppercase tracking-wider mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" /> Behavioral Spikes
          </h3>
          {data.severeIncidents.length === 0 ? (
            <p className="text-xs text-slate-500 font-medium">No severe behavioral anomalies detected.</p>
          ) : (
            <div className="space-y-4">
              {data.severeIncidents.map((inc) => (
                <div key={inc.id} className="bg-white/80 backdrop-blur-xl border border-amber-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-2 h-full bg-amber-500"></div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800 text-sm">{inc.severity} Incident</h4>
                    <span className="text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      {new Date(inc.incidentDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-4 line-clamp-1">
                    Student: {inc.student?.firstName} {inc.student?.lastName}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => openDetails(inc, "DISCIPLINE")} className="flex-1 bg-slate-900 text-white text-[10px] font-bold py-2 rounded-lg hover:bg-slate-800 transition-colors">
                      Investigate
                    </button>
                    <button onClick={() => openLogs(inc, "DISCIPLINE")} className="flex-1 bg-amber-50 text-amber-700 text-[10px] font-bold py-2 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors">
                      Review Logs
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Operational Anomalies */}
        <div className="bg-slate-50/50 border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-slate-500" /> Stalled Maintenance
          </h3>
          {data.pendingMaintenance.length === 0 ? (
            <p className="text-xs text-slate-500 font-medium">No stalled operational tasks detected.</p>
          ) : (
            <div className="space-y-4">
              {data.pendingMaintenance.map((maint) => (
                <div key={maint.id} className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-2 h-full bg-slate-500"></div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800 text-sm">{maint.type}</h4>
                    <span className="text-xs font-black text-slate-600 bg-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-4 line-clamp-1">
                    Asset: {maint.asset?.name || "N/A"}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => openDetails(maint, "MAINTENANCE")} className="flex-1 bg-primary-900 text-white text-[10px] font-bold py-2 rounded-lg hover:bg-primary-800 transition-colors">
                      Investigate
                    </button>
                    <button onClick={() => openLogs(maint, "MAINTENANCE")} className="flex-1 bg-slate-100 text-slate-700 text-[10px] font-bold py-2 rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors">
                      Review Logs
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      <dialog 
        ref={detailsModalRef} 
        className="bg-transparent p-0 m-auto backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-lg open:animate-in open:fade-in open:zoom-in-95"
      >
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xl">
          <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-black text-slate-800">Anomaly Details</h3>
            <button onClick={closeDetails} className="p-1 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-sm text-slate-600">
            {selectedAnomaly && anomalyType === "INVOICE" && (
              <>
                <p><strong>Invoice Number:</strong> {selectedAnomaly.invoiceNumber}</p>
                <p><strong>Student:</strong> {selectedAnomaly.student?.firstName} {selectedAnomaly.student?.lastName}</p>
                <p><strong>Status:</strong> {selectedAnomaly.status}</p>
                <p><strong>Issue Date:</strong> {new Date(selectedAnomaly.issueDate).toLocaleDateString()}</p>
                <p><strong>Due Date:</strong> <span className="text-rose-600 font-bold">{new Date(selectedAnomaly.dueDate).toLocaleDateString()}</span></p>
                <p><strong>Total Amount:</strong> {selectedAnomaly.totalAmount}</p>
                <p><strong>Amount Paid:</strong> {selectedAnomaly.amountPaid}</p>
                <p><strong>Balance Due:</strong> <span className="text-rose-600 font-bold">{selectedAnomaly.balanceDue}</span></p>
                <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl">
                  <p className="text-xs text-rose-800 font-medium">AI Note: This invoice is significantly overdue and the balance exceeds the typical threshold for this term. Recommend contacting the sponsor.</p>
                </div>
              </>
            )}

            {selectedAnomaly && anomalyType === "DISCIPLINE" && (
              <>
                <p><strong>Severity:</strong> {selectedAnomaly.severity}</p>
                <p><strong>Status:</strong> {selectedAnomaly.status}</p>
                <p><strong>Incident Date:</strong> {new Date(selectedAnomaly.incidentDate).toLocaleString()}</p>
                <p><strong>Student:</strong> {selectedAnomaly.student?.firstName} {selectedAnomaly.student?.lastName}</p>
                <p><strong>Reported By:</strong> {selectedAnomaly.reportedBy?.firstName} {selectedAnomaly.reportedBy?.lastName}</p>
                <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold mb-1">Description:</p>
                  <p>{selectedAnomaly.description}</p>
                </div>
                {selectedAnomaly.actionTaken && (
                  <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-bold mb-1">Action Taken:</p>
                    <p>{selectedAnomaly.actionTaken}</p>
                  </div>
                )}
                <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-xs text-amber-800 font-medium">AI Note: This is marked as SEVERE but is still OPEN. Recommend immediate review by the disciplinary committee.</p>
                </div>
              </>
            )}

            {selectedAnomaly && anomalyType === "MAINTENANCE" && (
              <>
                <p><strong>Type:</strong> {selectedAnomaly.type}</p>
                <p><strong>Status:</strong> {selectedAnomaly.status}</p>
                <p><strong>Date Logged:</strong> {new Date(selectedAnomaly.createdAt).toLocaleDateString()}</p>
                <p><strong>Cost Estimate:</strong> {selectedAnomaly.cost}</p>
                <p><strong>Asset:</strong> {selectedAnomaly.asset?.name || "N/A"}</p>
                <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold mb-1">Description:</p>
                  <p>{selectedAnomaly.description}</p>
                </div>
                <div className="mt-4 p-3 bg-slate-100 border border-slate-200 rounded-xl">
                  <p className="text-xs text-slate-700 font-medium">AI Note: This record has been pending for over 30 days. Recommend escalating to the facility manager.</p>
                </div>
              </>
            )}
          </div>
          <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
            <button onClick={closeDetails} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-800 transition-colors">
              Acknowledge
            </button>
          </div>
        </div>
      </dialog>

      {/* Logs Modal */}
      <dialog 
        ref={logsModalRef} 
        className="bg-transparent p-0 m-auto backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-lg open:animate-in open:fade-in open:zoom-in-95"
      >
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xl">
          <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-black text-slate-800">Related Logs & History</h3>
            <button onClick={closeLogs} className="p-1 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {isLoadingLogs ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-900 rounded-full animate-spin"></div>
              </div>
            ) : logs.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No related logs found for this entity.</p>
            ) : (
              <div className="space-y-3">
                {logs.map((log: any, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                    {anomalyType === "INVOICE" && (
                      <>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-slate-800 text-xs">Payment: {log.receiptNumber}</span>
                          <span className="text-[10px] text-slate-500">{new Date(log.paymentDate).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-600 text-xs">Amount: {log.amount} via {log.paymentMethod}</p>
                      </>
                    )}
                    {anomalyType === "DISCIPLINE" && (
                      <>
                        <p className="text-slate-600 text-xs mb-1"><strong>Action Taken:</strong> {log.actionTaken || "None recorded"}</p>
                        <p className="text-slate-600 text-xs"><strong>Status:</strong> {log.status}</p>
                      </>
                    )}
                    {anomalyType === "MAINTENANCE" && (
                      <>
                        <p className="text-slate-600 text-xs mb-1"><strong>Status:</strong> {log.status}</p>
                        <p className="text-slate-600 text-xs"><strong>Last Updated:</strong> {new Date(log.updatedAt).toLocaleDateString()}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
             <button onClick={closeLogs} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-300 transition-colors">
              Close Logs
            </button>
          </div>
        </div>
      </dialog>

    </div>
  );
}
