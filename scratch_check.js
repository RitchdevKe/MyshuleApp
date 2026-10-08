const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const payslips = await prisma.payslip.findMany({ include: { staff: true } });
  console.log("Payslips count:", payslips.length);
  if (payslips.length > 0) {
    console.log("Sample:", payslips[0]);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
