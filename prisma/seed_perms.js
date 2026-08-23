const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Permissions...');
  
  // Find modules
  const coreModule = await prisma.systemModule.findFirst({ where: { name: 'Core Academics' } });
  const financeModule = await prisma.systemModule.findFirst({ where: { name: 'Finance & Billing' } });

  if (coreModule) {
    await prisma.permission.createMany({
      data: [
        { moduleId: coreModule.id, actionName: 'MANAGE_CLASSES' },
        { moduleId: coreModule.id, actionName: 'MANAGE_SUBJECTS' },
        { moduleId: coreModule.id, actionName: 'VIEW_TIMETABLE' },
        { moduleId: coreModule.id, actionName: 'MANAGE_CURRICULUM' },
      ],
      skipDuplicates: true
    });
  }

  if (financeModule) {
    await prisma.permission.createMany({
      data: [
        { moduleId: financeModule.id, actionName: 'MANAGE_INVOICES' },
        { moduleId: financeModule.id, actionName: 'RECORD_PAYMENTS' },
        { moduleId: financeModule.id, actionName: 'VIEW_REPORTS' },
      ],
      skipDuplicates: true
    });
  }
  
  console.log('Permissions seeded successfully.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
