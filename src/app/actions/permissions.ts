'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

/**
 * Fetch all available system modules and their associated granular permissions.
 * This is used to build the left column of the permissions grid.
 */
export async function getSystemModulesWithPermissions() {
  try {
    let modules = await prisma.systemModule.findMany({
      include: {
        permissions: true
      },
      orderBy: { name: 'asc' }
    });
    
    if (modules.length === 0) {
      // Seed defaults
      const defaultModules = [
        { name: "Academics", perms: ["VIEW_GRADES", "EDIT_GRADES", "MANAGE_CLASSES"] },
        { name: "Finance", perms: ["VIEW_INVOICES", "CREATE_INVOICES", "PROCESS_PAYMENTS"] },
        { name: "Administration", perms: ["MANAGE_USERS", "MANAGE_ROLES", "VIEW_AUDIT_LOGS"] },
        { name: "Communication", perms: ["SEND_MESSAGES", "MANAGE_TEMPLATES"] }
      ];

      for (const m of defaultModules) {
        await prisma.systemModule.create({
          data: {
            name: m.name,
            isMandatory: true,
            permissions: {
              create: m.perms.map(p => ({ actionName: p }))
            }
          }
        });
      }

      modules = await prisma.systemModule.findMany({
        include: {
          permissions: true
        },
        orderBy: { name: 'asc' }
      });
    }

    return { success: true, data: modules };
  } catch (error: any) {
    console.error('Error fetching modules:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch all permissions associated with a specific role ID.
 */
export async function getRolePermissions(roleId: string) {
  try {
    const rolePerms = await prisma.rolePermission.findMany({
      where: { roleId },
      include: { permission: true }
    });
    // Extract just the permission IDs for easier mapping in the UI
    const permissionIds = rolePerms.map(rp => rp.permissionId);
    return { success: true, data: permissionIds };
  } catch (error: any) {
    console.error('Error fetching role permissions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Toggle a specific permission for a role.
 * If 'isGranted' is true, create the link. If false, delete the link.
 */
export async function toggleRolePermission(roleId: string, permissionId: string, isGranted: boolean) {
  try {
    if (isGranted) {
      // Add the permission
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: { roleId, permissionId }
        },
        create: { roleId, permissionId },
        update: {} // Do nothing if it already exists
      });
    } else {
      // Remove the permission
      await prisma.rolePermission.delete({
        where: {
          roleId_permissionId: { roleId, permissionId }
        }
      });
    }

    revalidatePath('/dashboard/settings/permissions'); // Replace with your actual route
    return { success: true };
  } catch (error: any) {
    console.error('Error toggling permission:', error);
    // Ignore P2025 (Record to delete does not exist) because the state is already correct
    if (error.code === 'P2025' && !isGranted) {
      return { success: true }; 
    }
    return { success: false, error: error.message };
  }
}

/**
 * Fetch all roles available to the tenant.
 */
export async function getTenantRoles(tenantId: string) {
  try {
    const roles = await prisma.role.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' }
    });
    return { success: true, data: roles };
  } catch (error: any) {
    console.error('Error fetching roles:', error);
    return { success: false, error: error.message };
  }
}
