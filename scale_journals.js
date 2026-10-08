const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const demoTenant = await prisma.tenant.findUnique({
    where: { domainPrefix: 'demo' }
  });
  if (!demoTenant) return;
  const tenantId = demoTenant.id;

  const journals = await prisma.journalEntry.findMany({ 
    where: { tenantId },
    include: { lines: true }
  });
  console.log(`Found ${journals.length} journal entries. Backdating...`);
  
  let newJournalsCount = 0;
  for (const j of journals) {
    for (let i = 1; i <= 3; i++) {
      const pastDate = new Date(j.entryDate);
      pastDate.setMonth(pastDate.getMonth() - i);
      try {
        await prisma.journalEntry.create({
          data: {
            tenantId: j.tenantId,
            financialYearId: j.financialYearId,
            entryNumber: j.entryNumber + `-M${i}`,
            entryDate: pastDate,
            description: j.description + ` (Month -${i})`,
            status: j.status,
            lines: {
              create: j.lines.map(line => ({
                chartOfAccountId: line.chartOfAccountId,
                amount: line.amount,
                type: line.type,
                description: line.description
              }))
            }
          }
        });
        newJournalsCount++;
      } catch (e) {}
    }
  }
  console.log(`Created ${newJournalsCount} backdated journal entries.`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
