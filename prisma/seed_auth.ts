import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  // 1. Ensure Tenant exists
  let tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: "Acme School",
        domainPrefix: "acme",
      }
    });
  }

  // 2. Ensure Roles exist
  const roles = ["SUPER_ADMIN", "TEACHER", "PARENT", "STUDENT"];
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { id: roleName }, // assuming id can be the name for seeding, but wait id is UUID.
      update: {},
      create: {
        name: roleName,
        tenantId: tenant.id
      }
    }).catch(async () => {
      // If it exists but we don't know ID, find it
      const existing = await prisma.role.findFirst({ where: { name: roleName } });
      if (!existing) {
        await prisma.role.create({ data: { name: roleName, tenantId: tenant.id } });
      }
    });
  }

  // 3. Create Users
  const users = [
    { email: "admin@myshule.ke", role: "SUPER_ADMIN", password: "password123" },
    { email: "teacher@myshule.ke", role: "TEACHER", password: "password123" },
    { email: "parent@myshule.ke", role: "PARENT", password: "password123" },
    { email: "student@myshule.ke", role: "STUDENT", password: "password123" },
    { email: "jose.mfavour@gmail.com", role: "SUPER_ADMIN", password: "Ritch@2026" },
  ];

  for (const u of users) {
    const roleRecord = await prisma.role.findFirst({ where: { name: u.role } });
    const userPasswordHash = await bcrypt.hash(u.password, 10);
    
    let user = await prisma.user.findUnique({ where: { email: u.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: u.email,
          passwordHash: userPasswordHash,
          status: "ACTIVE",
          isVerified: true
        }
      });
    } else {
      await prisma.user.update({
        where: { email: u.email },
        data: { passwordHash: userPasswordHash }
      });
    }

    // Link user to tenant and role
    const existingLink = await prisma.tenantUser.findFirst({
      where: { userId: user.id, tenantId: tenant.id }
    });

    if (!existingLink && roleRecord) {
      await prisma.tenantUser.create({
        data: {
          userId: user.id,
          tenantId: tenant.id,
          roleId: roleRecord.id
        }
      });
    }
  }

  console.log("Seeding complete! Passwords are 'password123'");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
