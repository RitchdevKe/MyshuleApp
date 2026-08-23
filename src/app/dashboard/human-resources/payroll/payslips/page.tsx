import React from "react";
import { getPayslips } from "./actions";
import PayslipsClient from "./PayslipsClient";

export const metadata = {
  title: "Payslips | Payroll",
};

export default async function PayslipsPage() {
  const payslips = await getPayslips();

  return (
    <PayslipsClient initialPayslips={payslips} />
  );
}
