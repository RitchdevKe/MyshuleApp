import React from "react";
import { getPurchaseOrders, getPurchaseRequests, getSuppliers } from "./actions";
import POClient from "./components/POClient";

export default async function POsPage() {
  const [purchaseOrders, purchaseRequests, suppliers] = await Promise.all([
    getPurchaseOrders(),
    getPurchaseRequests(),
    getSuppliers(),
  ]);

  return (
    <POClient
      initialPOs={purchaseOrders}
      requests={purchaseRequests}
      suppliers={suppliers}
    />
  );
}
