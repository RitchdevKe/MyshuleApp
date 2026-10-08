import React from "react";
import { getCashFlowData } from "./actions";
import CashFlowClient from "./CashFlowClient";

export default async function CashFlowPage() {
  const { bankTransactions, pettyCashTransactions } = await getCashFlowData();

  return (
    <CashFlowClient 
      bankTransactions={bankTransactions} 
      pettyCashTransactions={pettyCashTransactions} 
    />
  );
}
