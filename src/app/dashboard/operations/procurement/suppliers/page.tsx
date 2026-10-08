import React from "react";
import SupplierClient from "./components/SupplierClient";
import { getSuppliers } from "./actions";

export default async function SuppliersPage() {
  const suppliers = await getSuppliers();

  return (
    <div className="space-y-6">
      <SupplierClient suppliers={suppliers} />
    </div>
  );
}
