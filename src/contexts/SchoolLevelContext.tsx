"use client";

import React, { createContext, useContext, useState } from "react";

export type SchoolLevel = "All" | "Pre-Primary" | "Primary" | "Junior" | "Senior";

type SchoolLevelContextType = {
  schoolLevel: SchoolLevel;
  setSchoolLevel: (level: SchoolLevel) => void;
};

const SchoolLevelContext = createContext<SchoolLevelContextType | undefined>(undefined);

export function SchoolLevelProvider({ children }: { children: React.ReactNode }) {
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel>("All");

  return (
    <SchoolLevelContext.Provider value={{ schoolLevel, setSchoolLevel }}>
      {children}
    </SchoolLevelContext.Provider>
  );
}

export function useSchoolLevel() {
  const context = useContext(SchoolLevelContext);
  if (context === undefined) {
    throw new Error("useSchoolLevel must be used within a SchoolLevelProvider");
  }
  return context;
}
