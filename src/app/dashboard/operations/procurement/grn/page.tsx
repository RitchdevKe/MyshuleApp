import React from "react";
import { getGRNs, getPurchaseOrders } from "./actions";
import GrnClient from "./components/GrnClient";

export default async function GoodsReceivedPage() {
  const [grns, purchaseOrders] = await Promise.all([
    getGRNs(),
    getPurchaseOrders(),
  ]);

  return <GrnClient initialGRNs={grns} purchaseOrders={purchaseOrders} />;
}
