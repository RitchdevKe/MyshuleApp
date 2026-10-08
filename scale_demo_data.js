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
  
  const tenantId = demoTenant.id;
  console.log("Tenant ID:", tenantId);

  // 1. Double Students
  const students = await prisma.student.findMany({ where: { tenantId } });
  console.log(`Found ${students.length} students. Doubling...`);
  
  let newStudentsCount = 0;
  for (const student of students) {
    try {
      await prisma.student.create({
        data: {
          tenantId: student.tenantId,
          firstName: student.firstName,
          lastName: student.lastName + " (Copy)",
          dateOfBirth: student.dateOfBirth,
          gender: student.gender,
          admissionNumber: student.admissionNumber + "-" + Math.floor(Math.random()*10000),
          admissionDate: student.admissionDate,
          enrollmentDate: new Date(),
          status: student.status,
          address: student.address,
        }
      });
      newStudentsCount++;
    } catch (e) {
      console.log("Student err:", e.message);
    }
  }
  console.log(`Created ${newStudentsCount} new students.`);

  // 2. Double Staff
  // Skipped because already ran

  // 3. Backdate Payments
  // Skipped because already ran

  // 4. Backdate Bank Transactions
  const bankAccounts = await prisma.bankAccount.findMany({ where: { tenantId } });
  let newBankTxCount = 0;
  for (const acc of bankAccounts) {
    const txs = await prisma.bankTransaction.findMany({ where: { bankAccountId: acc.id } });
    for (const tx of txs) {
      for (let i = 1; i <= 3; i++) {
        const pastDate = new Date(tx.date);
        pastDate.setMonth(pastDate.getMonth() - i);
        try {
          await prisma.bankTransaction.create({
            data: {
              bankAccountId: tx.bankAccountId,
              type: tx.type,
              amount: tx.amount,
              description: tx.description + ` (Month -${i})`,
              date: pastDate,
              reference: tx.reference ? tx.reference + `-M${i  // 5. Backdate Journal Entries
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
}` : null,
              isReconciled: tx.isReconciled
            }
          });
          newBankTxCount++;
        } catch (e) {}
      }
    }
  }
  console.log(`Created ${newBankTxCount} backdated bank transactions.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
