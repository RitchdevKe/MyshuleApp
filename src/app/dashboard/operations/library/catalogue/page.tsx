import React from "react";
import { getBooks, getLibraryStats } from "./actions";
import CatalogueClient from "./CatalogueClient";

export default async function CataloguePage() {
  const booksRes = await getBooks();
  const statsRes = await getLibraryStats();

  const initialBooks = booksRes.success ? booksRes.data : [];
  const initialStats = statsRes.success ? statsRes.data : null;

  return (
    <CatalogueClient 
      initialBooks={initialBooks} 
      initialStats={initialStats} 
    />
  );
}
