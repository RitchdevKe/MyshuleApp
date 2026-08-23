const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const role = await prisma.role.findFirst();
  const perm = await prisma.permission.findFirst();
  if (!role || !perm) {
    console.log("Missing role or permission");
    return;
  }
  
  console.log("Role:", role.name, "Perm:", perm.actionName);
  
  // Try upsert
  const res = await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: { roleId: role.id, permissionId: perm.id }
    },
    create: { roleId: role.id, permissionId: perm.id },
    update: {}
  });
  
  console.log("Upsert Success:", !!res);
  
  const all = await prisma.rolePermission.findMany();
  console.log("All RolePermissions:", all);
}
test().catch(e => console.error(e)).finally(() => prisma.$disconnect());
