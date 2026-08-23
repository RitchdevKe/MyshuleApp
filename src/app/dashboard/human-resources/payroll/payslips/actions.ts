"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPayslips() {
    try {
        const payslips = await prisma.payslip.findMany({
            include: {
                staff: true,
                payrollRun: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return payslips;
    } catch (error) {
        console.error("Failed to fetch payslips:", error);
        return [];
    }
}

export async function emailPayslips(ids: string[]) {
    try {
        await prisma.payslip.updateMany({
            where: {
                id: { in: ids }
            },
            data: {
                status: "Sent"
            }
        });
        revalidatePath("/dashboard/human-resources/payroll/payslips");
        return { success: true };
    } catch (error) {
        console.error("Failed to email payslips:", error);
        return { success: false, error: "Failed to email payslips" };
    }
}

export async function markPayslipViewed(id: string) {
    try {
        await prisma.payslip.update({
            where: { id },
            data: { status: "Viewed" }
        });
        revalidatePath("/dashboard/human-resources/payroll/payslips");
        return { success: true };
    } catch (error) {
        console.error("Failed to mark payslip as viewed:", error);
        return { success: false };
    }
}

export async function fetchStaffForPayslips() {
    try {
        const staff = await prisma.staff.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                employeeNumber: true,
                department: true,
            },
            take: 10,
        });
        return staff;
    } catch (error) {
        console.error("Failed to fetch staff:", error);
        return [];
    }
}
