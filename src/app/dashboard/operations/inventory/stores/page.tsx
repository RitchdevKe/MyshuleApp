import React from "react";
import StoreClient from "./StoreClient";
import { getStores, getStaffList } from "./actions";

export default async function StoresPage() {
  const stores = await getStores();
  const staffList = await getStaffList();

  const totalStores = stores.length;
  const totalUniqueItems = stores.reduce((sum, store) => sum + store.itemsCount, 0);
  const totalValue = stores.reduce((sum, store) => sum + store.totalValue, 0);
  const avgCapacity = totalStores > 0 ? Math.round(stores.reduce((sum, store) => sum + store.capacity, 0) / totalStores) : 0;

  const topCards = {
    totalStores,
    totalUniqueItems,
    totalValue,
    avgCapacity
  };

  return <StoreClient stores={stores} staffList={staffList} topCards={topCards} />;
}
