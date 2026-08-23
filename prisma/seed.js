const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.tenant.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.systemModule.deleteMany({});

  console.log('Starting seed...');

  // 1. Create Core System Modules
  const coreModule = await prisma.systemModule.create({
    data: { name: 'Core Academics', isMandatory: true, description: 'Base module' }
  });
  const financeModule = await prisma.systemModule.create({
    data: { name: 'Finance & Billing', isMandatory: false, description: 'Billing module' }
  });

  // 2. Create the Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'CDM EMMANUEL GROUP OF SCHOOLS',
      domainPrefix: 'cdmemmanuel',
    }
  });
  console.log('Tenant Created:', tenant.name);

  // 3. Subscribe Tenant to Modules
  await prisma.tenantSubscription.createMany({
    data: [
      { tenantId: tenant.id, moduleId: coreModule.id },
      { tenantId: tenant.id, moduleId: financeModule.id }
    ]
  });

  // 4. Create Branches
  const primaryBranch = await prisma.branch.create({
    data: { tenantId: tenant.id, name: 'Main Primary', levelType: 'PRIMARY' }
  });

  // 5. Create System Roles
  const adminRole = await prisma.role.create({ data: { tenantId: tenant.id, name: 'Admin' } });
  const teacherRole = await prisma.role.create({ data: { tenantId: tenant.id, name: 'Teacher' } });
  const parentRole = await prisma.role.create({ data: { tenantId: tenant.id, name: 'Parent' } });

  // 6. Create Users (3 Admins, 3 Teachers, 3 Parents)
  // Admins
  for (let i = 1; i <= 3; i++) {
    const user = await prisma.user.create({
      data: {
        email: `admin${i}@cdmemmanuel.ke`,
        passwordHash: 'hashed_password_mock',
        isVerified: true,
      }
    });
    await prisma.tenantUser.create({
      data: { userId: user.id, tenantId: tenant.id, roleId: adminRole.id }
    });
  }

  // Teachers
  for (let i = 1; i <= 3; i++) {
    const user = await prisma.user.create({
      data: {
        email: `teacher${i}@cdmemmanuel.ke`,
        passwordHash: 'hashed_password_mock',
        isVerified: true,
      }
    });
    await prisma.tenantUser.create({
      data: { userId: user.id, tenantId: tenant.id, roleId: teacherRole.id }
    });
    await prisma.staff.create({
      data: {
        tenantId: tenant.id,
        userId: user.id,
        employeeNumber: `EMP00${i}`,
        firstName: `Teacher`,
        lastName: `${i}`,
        jobTitle: 'Class Teacher',
        department: 'ACADEMICS',
        hireDate: new Date()
      }
    });
  }

  // Parents & Students
  for (let i = 1; i <= 3; i++) {
    // Parent User
    const parentUser = await prisma.user.create({
      data: {
        email: `parent${i}@gmail.com`,
        passwordHash: 'hashed_password_mock',
        isVerified: true,
      }
    });
    await prisma.tenantUser.create({
      data: { userId: parentUser.id, tenantId: tenant.id, roleId: parentRole.id }
    });
    const parent = await prisma.parent.create({
      data: {
        tenantId: tenant.id,
        userId: parentUser.id,
        firstName: `Parent`,
        lastName: `${i}`,
        phonePrimary: `070000000${i}`
      }
    });

    // Student (No portal login account for now, just profile)
    const student = await prisma.student.create({
      data: {
        tenantId: tenant.id,
        admissionNumber: `ADM2026-00${i}`,
        firstName: `Student`,
        lastName: `${i}`,
        dateOfBirth: new Date('2015-01-01'),
        gender: 'MALE',
        enrollmentDate: new Date()
      }
    });

    // Link Parent to Student
    await prisma.studentParent.create({
      data: {
        tenantId: tenant.id,
        studentId: student.id,
        parentId: parent.id,
        relationship: 'FATHER'
      }
    });
  }

  console.log('Seed completed successfully! 3 Admins, 3 Teachers, 3 Parents, 3 Students created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
