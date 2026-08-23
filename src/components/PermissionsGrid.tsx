'use client'

import { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { toggleRolePermission } from '@/app/actions/permissions';

type Permission = {
  id: string;
  moduleId: string;
  actionName: string;
};

type SystemModule = {
  id: string;
  name: string;
  isMandatory: boolean;
  permissions: Permission[];
};

interface PermissionsGridProps {
  roleId: string;
  modules: SystemModule[];
  initialGrantedPermissionIds: string[];
}

export default function PermissionsGrid({ roleId, modules, initialGrantedPermissionIds }: PermissionsGridProps) {
  // Local state for optimistic updates
  const [grantedPerms, setGrantedPerms] = useState<Set<string>>(new Set(initialGrantedPermissionIds));
  const [isPending, setIsPending] = useState(false);

  const handleToggle = async (permissionId: string) => {
    // If no role is selected, ignore
    if (!roleId) return;

    const isCurrentlyGranted = grantedPerms.has(permissionId);
    const newGrantedStatus = !isCurrentlyGranted;

    // Optimistically update local state
    const updatedSet = new Set(grantedPerms);
    if (newGrantedStatus) {
      updatedSet.add(permissionId);
    } else {
      updatedSet.delete(permissionId);
    }
    setGrantedPerms(updatedSet);

    // Sync with the backend
    setIsPending(true);
    const result = await toggleRolePermission(roleId, permissionId, newGrantedStatus);
    setIsPending(false);

    if (!result.success) {
      // Revert if the server failed
      console.error('Failed to update permission:', result.error);
      const revertedSet = new Set(grantedPerms);
      if (isCurrentlyGranted) {
        revertedSet.add(permissionId);
      } else {
        revertedSet.delete(permissionId);
      }
      setGrantedPerms(revertedSet);
    }
  };

  if (!modules || modules.length === 0) {
    return <div className="text-slate-500 p-4">No modules available to configure.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      {modules.map((mod) => (
        <div 
          key={mod.id} 
          className="bg-white border-x-2 border-b-2 border-red-700/80 border-t-[8px] border-t-orange-400 rounded-3xl p-5 shadow-sm transition-all hover:shadow-md"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100/50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-orange-400"></span>
              <span className="font-bold text-slate-700 tracking-wider text-[14px] uppercase">
                {mod.name}
              </span>
            </div>
          </div>

          {/* List Items */}
          <div className="space-y-1">
            {mod.permissions.length === 0 ? (
              <p className="text-sm text-slate-400 italic py-2">No specific permissions</p>
            ) : (
              mod.permissions.map((perm) => {
                const isGranted = grantedPerms.has(perm.id);
                return (
                  <div 
                    key={perm.id}
                    onClick={() => handleToggle(perm.id)}
                    className="flex items-center gap-3 py-2 px-1 hover:bg-slate-50 transition cursor-pointer select-none rounded-lg group"
                  >
                    {isGranted ? (
                      <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 transition-transform scale-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 shrink-0 group-hover:text-slate-400 transition-colors scale-95" />
                    )}
                    <span 
                      className={`text-[15px] transition-colors ${isGranted ? 'text-slate-800 font-semibold' : 'text-slate-600 font-medium'}`}
                    >
                      {perm.actionName.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ))}
      
      {/* Loading overlay indicator (Optional UX) */}
      {isPending && (
        <div className="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-pulse">
          Saving changes...
        </div>
      )}
    </div>
  );
}
