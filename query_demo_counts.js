const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const demoTenant = await prisma.tenant.findUnique({
    where: { domainPrefix: 'demo' }
  });
  
  if (!demoTenant) {
    console.log("Demo tenant not found");
    return;
  }
  
  console.log("Tenant:", demoTenant.name, demoTenant.id);
  
  const studentCount = await prisma.student.count({ where: { tenantId: demoTenant.id } });
  const staffCount = await prisma.staff.count({ where: { tenantId: demoTenant.id } });
  
  console.log("Students:", studentCount);
  console.log("Staff:", staffCount);
  
  const staff = await prisma.staff.findMany({ 
    where: { tenantId: demoTenant.id },
    select: { type: true }
  });
  
  const teacherCount = staff.filter(s => s.type === 'TEACHING').length;
  const supportCount = staff.filter(s => s.type === 'SUPPORT').length;
  
  console.log("Teachers:", teacherCount);
  console.log("Support Staff:", supportCount);
}

main().catch(console.error).finally(() => prisma.$disconnect());
