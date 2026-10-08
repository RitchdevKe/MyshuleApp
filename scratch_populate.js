const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    console.log("No tenant found!");
    return;
  }
  
  const staffs = await prisma.staff.findMany();
  if (staffs.length === 0) {
    console.log("No staff found!");
    return;
  }
  
  const payrollRun = await prisma.payrollRun.create({
    data: {
      tenantId: tenant.id,
      period: 'Q2 2024',
      date: new Date(),
      status: 'Approved',
    }
  });

  const payslips = staffs.map(staff => ({
    tenantId: tenant.id,
    payrollRunId: payrollRun.id,
    staffId: staff.id,
    basicPay: Math.floor(Math.random() * 50000) + 10000,
    allowances: Math.floor(Math.random() * 10000),
    deductions: Math.floor(Math.random() * 5000),
    netPay: 0, 
    status: 'Generated',
  }));

  for(let p of payslips) {
     p.netPay = p.basicPay + p.allowances - p.deductions;
  }

  await prisma.payslip.createMany({
    data: payslips
  });

  console.log(`Created ${payslips.length} payslips for payroll run ${payrollRun.id}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
