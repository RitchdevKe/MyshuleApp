import prisma from '@/lib/prisma'
import { getSystemModulesWithPermissions, getRolePermissions } from '@/app/actions/permissions'
import PermissionsGrid from '@/components/PermissionsGrid'

export default async function PermissionMatrixPage({ searchParams }: { searchParams: { roleId?: string } }) {
  
  // 1. Fetch available roles
  const roles = await prisma.role.findMany();
  if (roles.length === 0) {
    return <div className="p-8 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm">No roles found in the database. Please run the seeder.</div>;
  }

  // 2. Determine which role is currently selected (defaults to the first one)
  const selectedRoleId = searchParams.roleId || roles[0].id;
  const selectedRole = roles.find(r => r.id === selectedRoleId) || roles[0];

  // 3. Fetch the Modules & Permissions
  const modulesRes = await getSystemModulesWithPermissions();
  const grantedPermsRes = await getRolePermissions(selectedRoleId);

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden p-6 min-h-[500px]">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Permission Configuration Matrix</h2>
        <p className="text-slate-500 text-sm mt-1">Configure exactly what each role can access across the system.</p>
      </div>
      
      {/* Role Selection Tabs */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 hide-scrollbar">
        {roles.map(role => {
          const isSelected = role.id === selectedRoleId;
          return (
            <a 
              key={role.id}
              href={`/dashboard/administration/roles/matrix?roleId=${role.id}`}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap ` + 
                (isSelected 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100')}
            >
              {role.name}
            </a>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100">
        {/* The Reusable Grid Component */}
        <PermissionsGrid 
          roleId={selectedRoleId} 
          modules={modulesRes.data || []} 
          initialGrantedPermissionIds={grantedPermsRes.data || []} 
        />
      </div>
    </div>
  )
}
