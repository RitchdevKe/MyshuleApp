import { getAllUsers, getUserOverviewStats } from "@/app/actions/userManagement";
import { getTenantRoles } from "@/app/actions/permissions";
import { getBranches } from "@/app/actions/classes";
import UsersClient from "./UsersClient";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

export default async function UsersPage() {
  const users = await getAllUsers();
  const stats = await getUserOverviewStats();
  const rolesData = await getTenantRoles(DEFAULT_TENANT_ID);
  const branches = await getBranches();

  return (
    <UsersClient 
      initialUsers={users}
      stats={stats}
      roles={rolesData.data || []}
      branches={branches}
    />
  );
}