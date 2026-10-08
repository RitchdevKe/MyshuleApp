import React from "react";
import CirculationClient from "./CirculationClient";
import { getLibraryCirculations, getLibraryBooks, getLibraryMembers } from "./actions";

export const dynamic = "force-dynamic";

export default async function CirculationPage() {
  const [circulations, books, members] = await Promise.all([
    getLibraryCirculations(),
    getLibraryBooks(),
    getLibraryMembers(),
  ]);

  return (
    <CirculationClient 
      initialCirculations={circulations} 
      books={books} 
      members={members} 
    />
  );
}
