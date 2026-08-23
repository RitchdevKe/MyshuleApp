"use client";

import React, { useState } from "react";
import { Search, Plus, Filter, Users, ShieldCheck, UserCheck, Activity, MoreHorizontal, Building2, Key, Edit, Trash2 } from "lucide-react";
import { createUser, changeUserRole, deleteUser } from "@/app/actions/userManagement";

const roleColors: Record<string, string> = {
  "Super Admin":   "bg-rose-50 text-rose-700 border-rose-200",
  "Head Teacher":  "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Secretary":     "bg-sky-50 text-sky-700 border-sky-200",
  "Teacher":       "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Bursar":        "bg-amber-50 text-amber-700 border-amber-200",
  "Branch Admin":  "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Standard":      "bg-slate-50 text-slate-700 border-slate-200",
};

const avatarGrads = [
  "from-primary-700 to-primary-900", "from-secondary-500 to-secondary-700",
  "from-indigo-500 to-violet-600",   "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-500",    "from-sky-500 to-blue-600",
];

export default function UsersClient({ 
  initialUsers, 
  roles, 
  branches,
  stats
}: { 
  initialUsers: any[];
  roles: any[];
  branches: any[];
  stats: any;
}) {
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({ name: "", email: "", roleId: "", branchId: "" });
  const [editUser, setEditUser] = useState<any>(null);

  const filtered = initialUsers.filter(u => {
    const userRole = u.tenantUsers?.[0]?.role?.name || "Unknown Role";
    const userName = u.email; // Use email as name since there's no name field in User model by default
    return (
      userName.toLowerCase().includes(search.toLowerCase()) || 
      userRole.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUser(formData);
      setIsAddModalOpen(false);
      setFormData({ name: "", email: "", roleId: "", branchId: "" });
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await changeUserRole(editUser.id, formData.roleId);
      setIsEditModalOpen(false);
      setEditUser(null);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this user?")) return;
    setLoading(true);
    try {
      await deleteUser(id);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users",      value: stats.total.toString(),   icon: Users,       color: "from-primary-600 to-primary-800" },
          { label: "Active",           value: stats.active.toString(),    icon: Activity,    color: "from-emerald-500 to-teal-600" },
          { label: "Suspended",        value: stats.suspended.toString(), icon: ShieldCheck, color: "from-rose-500 to-red-600" },
          { label: "Pending Invites",  value: stats.pendingRequests.toString(), icon: UserCheck,   color: "from-amber-500 to-orange-500" },
        ].map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-2xl p-4 text-white shadow-md flex items-center gap-3`}>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-black leading-tight">{c.value}</p>
                <p className="text-xs font-bold text-white/80">{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Card */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white/80">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search users or roles..."
              className="pl-9 pr-4 py-2 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all w-64 placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-black text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-md shadow-primary-900/20 hover:-translate-y-0.5 transition-all">
              <Plus className="w-4 h-4" /> Add User
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">User Details</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Role & Access</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Branch</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Last Active</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u, i) => {
                const isActive = u.status === "ACTIVE";
                const tenantUser = u.tenantUsers?.[0];
                const roleName = tenantUser?.role?.name || "No Role";
                const branchName = tenantUser?.branch?.name || "All Branches";
                const initials = u.email.substring(0, 2).toUpperCase();
                
                return (
                  <tr key={u.id} className="hover:bg-primary-50/40 border-l-4 border-transparent hover:border-l-secondary-500 transition-all group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarGrads[i % avatarGrads.length]} flex items-center justify-center text-white text-xs font-black shadow-sm flex-shrink-0`}>
                          {initials}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{u.email}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-black text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded">ID: {u.id.substring(0,8)}</span>
                            <span className="text-[10px] font-bold text-slate-500">{u.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${roleColors[roleName] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                          {roleName}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          <Key className="w-3 h-3" /> Standard
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg w-fit">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" /> {branchName}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-bold text-slate-600">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : 'Never'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black border ${
                        isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setEditUser(u);
                            setFormData({
                              name: u.email,
                              email: u.email,
                              roleId: tenantUser?.roleId || "",
                              branchId: tenantUser?.branchId || ""
                            });
                            setIsEditModalOpen(true);
                          }}
                          className="p-1.5 text-primary-600 bg-primary-50 hover:bg-primary-100 border border-primary-100 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(u.id)} className="p-1.5 text-rose-500 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500 text-sm">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-black text-slate-800">Add New User</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="e.g. user@myshule.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
                <select
                  required
                  value={formData.roleId}
                  onChange={e => setFormData({ ...formData, roleId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="">Select a role</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Branch (Optional)</label>
                <select
                  value={formData.branchId}
                  onChange={e => setFormData({ ...formData, branchId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="">All Branches</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl">
                  Cancel
                </button>
                <button disabled={loading} type="submit" className="px-4 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm disabled:opacity-50">
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-black text-slate-800">Edit User Role</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>
            <form onSubmit={handleEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">User Email</label>
                <input
                  disabled
                  type="email"
                  value={formData.email}
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-sm text-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
                <select
                  required
                  value={formData.roleId}
                  onChange={e => setFormData({ ...formData, roleId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="">Select a role</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl">
                  Cancel
                </button>
                <button disabled={loading} type="submit" className="px-4 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
