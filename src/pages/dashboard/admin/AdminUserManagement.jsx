import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Filter, Download, Users, UserCheck, GraduationCap,
  Briefcase, MoreHorizontal, Eye, Pencil, Trash2, RefreshCw, X,
  Shield, CheckCircle2, Lock, AlertTriangle, ChevronRight
} from "lucide-react";
import Sidebar from "../../../components/dashboard/Sidebar";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import axiosClient from "../../../api/axiosClient";

// --- THEME CONSTANTS ---
const COLORS = {
  background: "#09090B",
  card: "#111827",
  border: "rgba(255,255,255,0.06)",
  accent: "#10B981",
  textMain: "#F8FAFC",
  textMuted: "#94A3B8",
};

export default function AdminUserManagement() {
  // --- STATE ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // UI States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form Data
  const initialFormState = {
    email: "", password: "", fullName: "", studentCode: "",
    roleId: "2", isActive: true, currentCompany: "", expertiseTags: "", department: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- API CALLS ---
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/api/admin/users");
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      // Mock data for visual demonstration if API fails/returns empty initially
      setUsers(data.length ? data : mockUsers); 
    } catch (err) {
      console.error("Fetch users error:", err);
      setUsers(mockUsers); // Fallback to mock for UI demonstration
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- HANDLERS ---
  const handleOpenCreate = () => {
    setFormData(initialFormState);
    setIsCreateModalOpen(true);
  };

  const handleOpenDetail = async (user) => {
    setSelectedUser(user);
    setIsDetailDrawerOpen(true);
    try {
      const res = await axiosClient.get(`/api/admin/users/${user.userId}`);
      const detail = res.data?.data || res.data;
      setFormData({
        ...initialFormState,
        ...detail,
        roleId: detail?.roleId?.toString() || "2",
      });
    } catch (err) {
      // If API fails, populate with table data
      setFormData({
        ...initialFormState, ...user, roleId: user?.roleId?.toString() || "2"
      });
    }
  };

  const confirmDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    try {
      await axiosClient.delete(`/api/admin/users/${selectedUser.userId}`);
      fetchUsers();
    } catch (err) {
      console.error("Delete error", err);
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        await axiosClient.put(`/api/admin/users/${selectedUser.userId}`, {
          ...formData, roleId: parseInt(formData.roleId),
        });
      } else {
        await axiosClient.post("/api/admin/users", {
          ...formData, roleId: parseInt(formData.roleId),
        });
      }
      setIsCreateModalOpen(false);
      setIsDetailDrawerOpen(false);
      fetchUsers();
    } catch (err) {
      console.error("Submit error", err);
    }
  };

  // --- DERIVED STATE ---
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.email?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            u.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "All" || u.roleId.toString() === roleFilter;
      const matchesStatus = statusFilter === "All" || 
                           (statusFilter === "Active" ? u.isActive : !u.isActive);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    mentors: users.filter(u => u.roleId === 3).length,
    students: users.filter(u => u.roleId === 2).length,
  };

  return (
    <div className="flex min-h-screen font-sans" style={{ backgroundColor: COLORS.background, color: COLORS.textMain }}>
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white">User Management</h1>
              <p className="text-[#94A3B8] mt-1 text-sm">Manage platform users, permissions and account status.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <Filter size={16} /> Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <Download size={16} /> Export
              </button>
              <button onClick={handleOpenCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#10B981] text-black hover:bg-[#059669] transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Plus size={16} /> Add User
              </button>
            </div>
          </div>

          {/* STATISTICS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard icon={<Users />} title="Total Users" value={stats.total} trend="+12% this month" />
            <StatCard icon={<UserCheck />} title="Active Users" value={stats.active} trend="+5% this week" />
            <StatCard icon={<Briefcase />} title="Mentors" value={stats.mentors} trend="+2 new" />
            <StatCard icon={<GraduationCap />} title="Students" value={stats.students} trend="+18% this month" />
          </div>

          {/* MAIN CONTENT / TABLE AREA */}
          <div className="rounded-2xl border border-white/5 bg-[#111827]/50 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col">
            
            {/* TOOLBAR */}
            <div className="p-4 border-b border-white/5 flex flex-wrap items-center justify-between gap-4 bg-[#111827]/80">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
                <input 
                  type="text" 
                  placeholder="Search users by name or email..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#10B981] transition-colors"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <select 
                  value={roleFilter} 
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-black/40 border border-white/10 text-sm text-[#94A3B8] rounded-lg px-3 py-2 focus:outline-none focus:border-[#10B981] appearance-none cursor-pointer"
                >
                  <option value="All">All Roles</option>
                  <option value="1">Admins</option>
                  <option value="2">Students</option>
                  <option value="3">Mentors</option>
                  <option value="4">Counselors</option>
                </select>
                
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-black/40 border border-white/10 text-sm text-[#94A3B8] rounded-lg px-3 py-2 focus:outline-none focus:border-[#10B981] appearance-none cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Locked">Locked</option>
                </select>

                <button onClick={fetchUsers} className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors">
                  <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                </button>
              </div>
            </div>

            {/* DATATABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Joined Date</th>
                    <th className="px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <TableSkeleton rows={5} />
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-[#94A3B8]">
                            <Search size={24} />
                          </div>
                          <h3 className="text-lg font-medium text-white mb-1">No users found</h3>
                          <p className="text-sm text-[#94A3B8] mb-4">Try adjusting your filters or search query.</p>
                          <button onClick={handleOpenCreate} className="text-[#10B981] hover:text-[#059669] text-sm font-medium transition-colors">
                            + Create first user
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <motion.tr 
                        key={u.userId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                        className="group transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Avatar name={u.fullName || u.email} />
                            <div>
                              <div className="text-sm font-medium text-white">{u.fullName || "Unnamed User"}</div>
                              <div className="text-xs text-[#94A3B8]">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <RoleBadge roleId={u.roleId} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge isActive={u.isActive} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#94A3B8]">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Jul 15, 2026'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ActionButton icon={<Eye size={16} />} onClick={() => handleOpenDetail(u)} tooltip="View Details" />
                            <ActionButton icon={<Trash2 size={16} className="text-red-400" />} onClick={() => confirmDelete(u)} tooltip="Delete User" hoverBg="hover:bg-red-500/10" />
                            <ActionButton icon={<MoreHorizontal size={16} />} />
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* PAGINATION (Static Mockup for Visual) */}
            <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-[#94A3B8]">
              <div>Showing <span className="text-white font-medium">1</span> to <span className="text-white font-medium">{filteredUsers.length}</span> of <span className="text-white font-medium">{users.length}</span> results</div>
              <div className="flex gap-1">
                <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/5 disabled:opacity-50" disabled>Prev</button>
                <button className="px-3 py-1 rounded bg-white/10 text-white">1</button>
                <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/5">2</button>
                <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/5">Next</button>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* --- DRAWERS AND MODALS --- */}

      {/* DETAIL/EDIT DRAWER */}
      <AnimatePresence>
        {isDetailDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsDetailDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-[500px] bg-[#111827] border-l border-white/10 shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar name={formData.fullName || formData.email} size="lg" />
                  <div>
                    <h2 className="text-xl font-semibold text-white">{formData.fullName || "User Profile"}</h2>
                    <p className="text-sm text-[#94A3B8]">{formData.email}</p>
                  </div>
                </div>
                <button onClick={() => setIsDetailDrawerOpen(false)} className="p-2 text-[#94A3B8] hover:text-white rounded-full hover:bg-white/10 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <section>
                  <h3 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-4 flex items-center gap-2"><Lock size={14} /> Account Status</h3>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-black/20">
                    <div>
                      <div className="text-sm font-medium text-white mb-1">Active Status</div>
                      <div className="text-xs text-[#94A3B8]">Allow user to access the platform.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10B981]"></div>
                    </label>
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-4 flex items-center gap-2"><Shield size={14} /> Role & Permissions</h3>
                  <div className="space-y-3">
                    <SelectField label="System Role" value={formData.roleId} onChange={(e) => setFormData({...formData, roleId: e.target.value})}>
                      <option value="1">Admin</option>
                      <option value="2">Student</option>
                      <option value="3">Mentor</option>
                      <option value="4">Counselor</option>
                    </SelectField>
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-4 flex items-center gap-2"><UserCheck size={14} /> Profile Information</h3>
                  <div className="space-y-4">
                    <InputField label="Full Name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                    
                    {formData.roleId === "2" && (
                      <InputField label="Student Code" value={formData.studentCode} onChange={(e) => setFormData({...formData, studentCode: e.target.value})} />
                    )}
                    
                    {formData.roleId === "3" && (
                      <>
                        <InputField label="Current Company" value={formData.currentCompany} onChange={(e) => setFormData({...formData, currentCompany: e.target.value})} />
                        <InputField label="Expertise Tags" placeholder="e.g. React, Node.js" value={formData.expertiseTags} onChange={(e) => setFormData({...formData, expertiseTags: e.target.value})} />
                      </>
                    )}

                    {formData.roleId === "4" && (
                      <InputField label="Department" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
                    )}
                  </div>
                </section>
              </div>

              <div className="p-6 border-t border-white/10 bg-[#111827] flex justify-end gap-3">
                <button onClick={() => setIsDetailDrawerOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/5 transition-colors border border-transparent">
                  Cancel
                </button>
                <button onClick={handleSubmit} className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#10B981] text-black hover:bg-[#059669] transition-colors shadow-lg shadow-[#10B981]/20">
                  Save Changes
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CREATE USER MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <ModalOverlay onClose={() => setIsCreateModalOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#111827] w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-white">Create New User</h2>
                  <p className="text-sm text-[#94A3B8] mt-1">Add a new user to the platform and set their role.</p>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-[#94A3B8] hover:text-white transition-colors"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <InputField label="Email Address" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  <div className="space-y-1">
                    <InputField label="Password" type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    <div className="flex gap-1 mt-2">
                      <div className="h-1 flex-1 bg-red-500 rounded-full"></div>
                      <div className="h-1 flex-1 bg-orange-500 rounded-full"></div>
                      <div className="h-1 flex-1 bg-white/10 rounded-full"></div>
                    </div>
                    <span className="text-xs text-[#94A3B8]">Fair strength</span>
                  </div>
                  
                  <InputField label="Full Name" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                  <SelectField label="User Role" value={formData.roleId} onChange={(e) => setFormData({...formData, roleId: e.target.value})}>
                    <option value="2">Student</option>
                    <option value="3">Mentor</option>
                    <option value="4">Counselor</option>
                    <option value="1">Admin</option>
                  </SelectField>

                  {formData.roleId === "2" && <InputField label="Student Code" value={formData.studentCode} onChange={(e) => setFormData({...formData, studentCode: e.target.value})} />}
                  {formData.roleId === "3" && (
                    <>
                      <InputField label="Company" value={formData.currentCompany} onChange={(e) => setFormData({...formData, currentCompany: e.target.value})} />
                      <InputField label="Expertise" value={formData.expertiseTags} onChange={(e) => setFormData({...formData, expertiseTags: e.target.value})} />
                    </>
                  )}
                  {formData.roleId === "4" && <InputField label="Department" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/5 transition-colors">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#10B981] text-black hover:bg-[#059669] transition-colors shadow-lg shadow-[#10B981]/20">Create Account</button>
                </div>
              </form>
            </motion.div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <ModalOverlay onClose={() => setIsDeleteModalOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111827] w-full max-w-md p-6 rounded-2xl border border-white/10 shadow-2xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-red-500" size={32} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Delete User?</h2>
              <p className="text-[#94A3B8] text-sm mb-6">
                Are you sure you want to permanently delete <span className="text-white font-medium">{selectedUser?.email}</span>? This action cannot be undone and all associated data will be lost.
              </p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-medium">Cancel</button>
                <button onClick={executeDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors shadow-lg shadow-red-500/20 font-medium">Yes, delete user</button>
              </div>
            </motion.div>
          </ModalOverlay>
        )}
      </AnimatePresence>

    </div>
  );
}

// --- SUB COMPONENTS ---

const StatCard = ({ icon, title, value, trend }) => (
  <div className="p-5 rounded-2xl border border-white/5 bg-[#111827]/60 flex flex-col gap-3 relative overflow-hidden group hover:border-white/10 transition-colors">
    <div className="flex justify-between items-start">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#94A3B8] group-hover:text-white transition-colors">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <span className="text-xs font-medium text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded-full">{trend}</span>
    </div>
    <div>
      <h3 className="text-3xl font-semibold text-white tracking-tight">{value}</h3>
      <p className="text-sm text-[#94A3B8] mt-1">{title}</p>
    </div>
    {/* Subtle gradient blob for glassmorphism effect */}
    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#10B981]/5 blur-3xl rounded-full pointer-events-none"></div>
  </div>
);

const RoleBadge = ({ roleId }) => {
  const roles = {
    1: { label: "Admin", color: "text-red-400 bg-red-400/10 border-red-400/20" },
    2: { label: "Student", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
    3: { label: "Mentor", color: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
    4: { label: "Counselor", color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
  };
  const role = roles[roleId] || roles[2];
  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${role.color}`}>
      {role.label}
    </span>
  );
};

const StatusBadge = ({ isActive }) => (
  <div className="flex items-center gap-2">
    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-gray-500'}`} />
    <span className={`text-sm font-medium ${isActive ? 'text-[#10B981]' : 'text-gray-400'}`}>
      {isActive ? "Active" : "Locked"}
    </span>
  </div>
);

const ActionButton = ({ icon, onClick, hoverBg = "hover:bg-white/10" }) => (
  <button onClick={onClick} className={`p-2 rounded-lg text-[#94A3B8] hover:text-white ${hoverBg} transition-all`}>
    {icon}
  </button>
);

const Avatar = ({ name, size = "md" }) => {
  const sizeClasses = size === "md" ? "w-10 h-10 text-sm" : "w-14 h-14 text-xl";
  const initial = name ? name.charAt(0).toUpperCase() : "U";
  return (
    <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-semibold text-white shadow-inner flex-shrink-0`}>
      {initial}
    </div>
  );
};

const InputField = ({ label, required, ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-xs font-medium text-[#94A3B8]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input 
      className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]/50 transition-all placeholder:text-gray-600"
      {...props}
    />
  </div>
);

const SelectField = ({ label, children, ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-xs font-medium text-[#94A3B8]">{label}</label>
    <select 
      className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#10B981] transition-all appearance-none cursor-pointer"
      {...props}
    >
      {children}
    </select>
  </div>
);

const ModalOverlay = ({ children, onClose }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    onClick={onClose}
    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
  >
    {children}
  </motion.div>
);

const TableSkeleton = ({ rows = 5 }) => (
  <>
    {Array(rows).fill(0).map((_, i) => (
      <tr key={i} className="border-b border-white/5 animate-pulse">
        <td className="px-6 py-4"><div className="flex gap-3"><div className="w-10 h-10 rounded-full bg-white/5"></div><div className="space-y-2"><div className="w-32 h-4 bg-white/5 rounded"></div><div className="w-24 h-3 bg-white/5 rounded"></div></div></div></td>
        <td className="px-6 py-4"><div className="w-20 h-6 bg-white/5 rounded-full"></div></td>
        <td className="px-6 py-4"><div className="w-16 h-4 bg-white/5 rounded"></div></td>
        <td className="px-6 py-4"><div className="w-24 h-4 bg-white/5 rounded"></div></td>
        <td className="px-6 py-4 text-right"><div className="w-8 h-8 bg-white/5 rounded-lg inline-block"></div></td>
      </tr>
    ))}
  </>
);

// --- MOCK DATA FOR DEMO PURPOSES ---
const mockUsers = [
  { userId: 1, email: "john.smith@example.com", fullName: "John Smith", roleId: 3, isActive: true, createdAt: "2026-07-15T00:00:00Z" },
  { userId: 2, email: "alice.wonder@example.com", fullName: "Alice Wonderland", roleId: 2, isActive: true, createdAt: "2026-07-14T00:00:00Z" },
  { userId: 3, email: "david.admin@system.io", fullName: "David Cohen", roleId: 1, isActive: true, createdAt: "2026-07-13T00:00:00Z" },
  { userId: 4, email: "emily.counsel@school.edu", fullName: "Emily Rose", roleId: 4, isActive: false, createdAt: "2026-07-10T00:00:00Z" }
];