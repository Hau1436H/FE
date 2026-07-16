import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Filter, Download, Users, UserCheck, GraduationCap,
  Briefcase, MoreHorizontal, Eye, Trash2, RefreshCw, X,
  Shield, Lock, AlertTriangle
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
      setUsers(data.length ? data : mockUsers); 
    } catch (err) {
      console.error("Fetch users error:", err);
      setUsers(mockUsers);
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

  // Bootstrap custom styles cho các component nhỏ để ghi đè default của BS
  const bsInputStyle = { backgroundColor: 'rgba(0,0,0,0.4)', borderColor: COLORS.border, color: 'white' };
  const bsBtnDarkStyle = { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' };

  return (
    <div className="d-flex vh-100" style={{ backgroundColor: COLORS.background, color: COLORS.textMain }}>
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-grow-1 overflow-auto p-4 p-md-5" style={{ gap: '2rem' }}>
          
          {/* HEADER SECTION */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
            <div>
              <h1 className="h3 fw-bold mb-1">User Management</h1>
              <p style={{ color: COLORS.textMuted, fontSize: '0.875rem', margin: 0 }}>Manage platform users, permissions and account status.</p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-sm d-flex align-items-center gap-2" style={bsBtnDarkStyle}>
                <Filter size={16} /> Filter
              </button>
              <button className="btn btn-sm d-flex align-items-center gap-2" style={bsBtnDarkStyle}>
                <Download size={16} /> Export
              </button>
              <button onClick={handleOpenCreate} className="btn btn-sm d-flex align-items-center gap-2 border-0" style={{ backgroundColor: COLORS.accent, color: 'black', fontWeight: '500' }}>
                <Plus size={16} /> Add User
              </button>
            </div>
          </div>

          {/* STATISTICS CARDS */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-3"><StatCard icon={<Users />} title="Total Users" value={stats.total} trend="+12% this month" /></div>
            <div className="col-12 col-md-3"><StatCard icon={<UserCheck />} title="Active Users" value={stats.active} trend="+5% this week" /></div>
            <div className="col-12 col-md-3"><StatCard icon={<Briefcase />} title="Mentors" value={stats.mentors} trend="+2 new" /></div>
            <div className="col-12 col-md-3"><StatCard icon={<GraduationCap />} title="Students" value={stats.students} trend="+18% this month" /></div>
          </div>

          {/* MAIN CONTENT / TABLE AREA */}
          <div className="card border-0 shadow-lg" style={{ backgroundColor: 'rgba(17, 24, 39, 0.5)', borderRadius: '1rem' }}>
            
            {/* TOOLBAR */}
            <div className="card-header border-bottom p-3 d-flex flex-wrap align-items-center justify-content-between gap-3" style={{ backgroundColor: 'rgba(17, 24, 39, 0.8)', borderColor: COLORS.border }}>
              <div className="position-relative flex-grow-1" style={{ maxWidth: '300px' }}>
                <div className="position-absolute top-50 translate-middle-y" style={{ left: '10px', color: COLORS.textMuted }}>
                  <Search size={16} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control form-control-sm"
                  style={{ ...bsInputStyle, paddingLeft: '2.5rem' }}
                />
              </div>
              
              <div className="d-flex align-items-center gap-2">
                <select 
                  value={roleFilter} 
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="form-select form-select-sm"
                  style={{ ...bsInputStyle, color: COLORS.textMuted, width: 'auto' }}
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
                  className="form-select form-select-sm"
                  style={{ ...bsInputStyle, color: COLORS.textMuted, width: 'auto' }}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Locked">Locked</option>
                </select>

                <button onClick={fetchUsers} className="btn btn-sm text-secondary">
                  <RefreshCw size={16} className={loading ? "spinner-border spinner-border-sm" : ""} />
                </button>
              </div>
            </div>

            {/* DATATABLE */}
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0" style={{ '--bs-table-bg': 'transparent', '--bs-table-border-color': COLORS.border }}>
                <thead>
                  <tr>
                    <th className="text-uppercase" style={{ color: COLORS.textMuted, fontSize: '0.75rem', fontWeight: 500, padding: '1rem 1.5rem' }}>User</th>
                    <th className="text-uppercase" style={{ color: COLORS.textMuted, fontSize: '0.75rem', fontWeight: 500, padding: '1rem 1.5rem' }}>Role</th>
                    <th className="text-uppercase" style={{ color: COLORS.textMuted, fontSize: '0.75rem', fontWeight: 500, padding: '1rem 1.5rem' }}>Status</th>
                    <th className="text-uppercase" style={{ color: COLORS.textMuted, fontSize: '0.75rem', fontWeight: 500, padding: '1rem 1.5rem' }}>Joined Date</th>
                    <th className="text-uppercase text-end" style={{ color: COLORS.textMuted, fontSize: '0.75rem', fontWeight: 500, padding: '1rem 1.5rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" className="text-center p-5">Loading...</td></tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center p-5">
                        <div className="d-flex flex-column align-items-center">
                           <Search size={24} className="mb-3 text-secondary" />
                           <h5 className="text-white">No users found</h5>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <motion.tr 
                        key={u.userId}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      >
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <Avatar name={u.fullName || u.email} />
                            <div>
                              <div className="fw-medium text-white" style={{ fontSize: '0.875rem' }}>{u.fullName || "Unnamed User"}</div>
                              <div style={{ fontSize: '0.75rem', color: COLORS.textMuted }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><RoleBadge roleId={u.roleId} /></td>
                        <td className="px-4 py-3"><StatusBadge isActive={u.isActive} /></td>
                        <td className="px-4 py-3" style={{ fontSize: '0.875rem', color: COLORS.textMuted }}>
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US') : 'Jul 15, 2026'}
                        </td>
                        <td className="px-4 py-3 text-end">
                          <ActionButton icon={<Eye size={16} />} onClick={() => handleOpenDetail(u)} />
                          <ActionButton icon={<Trash2 size={16} color="#ef4444" />} onClick={() => confirmDelete(u)} />
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* --- DRAWERS AND MODALS --- */}
      {/* Giữ nguyên Framer Motion cho animation, nhưng bọc CSS bằng Bootstrap */}
      
      {/* DETAIL/EDIT DRAWER */}
      <AnimatePresence>
        {isDetailDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsDetailDrawerOpen(false)}
              className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75" style={{ zIndex: 1040 }}
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="position-fixed top-0 end-0 h-100 d-flex flex-column shadow"
              style={{ width: '100%', maxWidth: '500px', backgroundColor: COLORS.card, borderLeft: `1px solid ${COLORS.border}`, zIndex: 1045 }}
            >
              <div className="p-4 border-bottom d-flex align-items-center justify-content-between" style={{ borderColor: COLORS.border }}>
                <div className="d-flex align-items-center gap-3">
                  <Avatar name={formData.fullName || formData.email} />
                  <div>
                    <h5 className="mb-0 text-white">{formData.fullName || "User Profile"}</h5>
                    <small style={{ color: COLORS.textMuted }}>{formData.email}</small>
                  </div>
                </div>
                <button onClick={() => setIsDetailDrawerOpen(false)} className="btn btn-link text-secondary p-0"><X size={20} /></button>
              </div>

              <div className="flex-grow-1 overflow-auto p-4">
                {/* Form Elements mapped with Bootstrap classes */}
                <div className="mb-4">
                   <h6 className="text-uppercase mb-3 d-flex align-items-center gap-2" style={{ color: COLORS.textMuted, fontSize: '0.75rem' }}><Lock size={14}/> Account Status</h6>
                   <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" role="switch" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} />
                      <label className="form-check-label text-white ms-2">Active Status</label>
                   </div>
                </div>

                <div className="mb-4">
                  <h6 className="text-uppercase mb-3 d-flex align-items-center gap-2" style={{ color: COLORS.textMuted, fontSize: '0.75rem' }}><Shield size={14}/> Role & Permissions</h6>
                  <SelectField label="System Role" value={formData.roleId} onChange={(e) => setFormData({...formData, roleId: e.target.value})}>
                    <option value="1">Admin</option>
                    <option value="2">Student</option>
                    <option value="3">Mentor</option>
                    <option value="4">Counselor</option>
                  </SelectField>
                </div>

                <div className="mb-4">
                  <h6 className="text-uppercase mb-3 d-flex align-items-center gap-2" style={{ color: COLORS.textMuted, fontSize: '0.75rem' }}><UserCheck size={14}/> Profile Info</h6>
                  <InputField label="Full Name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                </div>
              </div>

              <div className="p-4 border-top text-end" style={{ borderColor: COLORS.border }}>
                <button onClick={() => setIsDetailDrawerOpen(false)} className="btn btn-outline-secondary me-2">Cancel</button>
                <button onClick={handleSubmit} className="btn border-0" style={{ backgroundColor: COLORS.accent, color: 'black' }}>Save Changes</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CREATE MODAL - Lược giản UI Bootstrap Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <ModalOverlay onClose={() => setIsCreateModalOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="card shadow" style={{ width: '100%', maxWidth: '600px', backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card-header border-bottom p-4 d-flex justify-content-between align-items-center" style={{ borderColor: COLORS.border }}>
                <h5 className="mb-0 text-white">Create New User</h5>
                <button onClick={() => setIsCreateModalOpen(false)} className="btn btn-link text-secondary p-0"><X size={20} /></button>
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-md-6"><InputField label="Email Address" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
                  <div className="col-md-6"><InputField label="Password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} /></div>
                  <div className="col-md-6"><InputField label="Full Name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} /></div>
                  <div className="col-md-6">
                    <SelectField label="User Role" value={formData.roleId} onChange={(e) => setFormData({...formData, roleId: e.target.value})}>
                      <option value="2">Student</option>
                      <option value="3">Mentor</option>
                      <option value="1">Admin</option>
                    </SelectField>
                  </div>
                </div>
              </div>
              <div className="card-footer p-4 border-top text-end" style={{ borderColor: COLORS.border }}>
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-outline-secondary me-2">Cancel</button>
                <button onClick={handleSubmit} className="btn border-0" style={{ backgroundColor: COLORS.accent, color: 'black' }}>Create Account</button>
              </div>
            </motion.div>
          </ModalOverlay>
        )}
      </AnimatePresence>

    </div>
  );
}

// --- SUB COMPONENTS REFACTORED TO BOOTSTRAP ---

const StatCard = ({ icon, title, value, trend }) => (
  <div className="card h-100 p-3 border-0" style={{ backgroundColor: 'rgba(17, 24, 39, 0.6)', borderRadius: '1rem', border: `1px solid ${COLORS.border}` }}>
    <div className="d-flex justify-content-between align-items-start mb-2">
      <div className="p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: COLORS.textMuted }}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: COLORS.accent }}>{trend}</span>
    </div>
    <h3 className="fw-bold text-white mb-0">{value}</h3>
    <small style={{ color: COLORS.textMuted }}>{title}</small>
  </div>
);

const RoleBadge = ({ roleId }) => {
  const roles = {
    1: { label: "Admin", color: "danger" },
    2: { label: "Student", color: "primary" },
    3: { label: "Mentor", color: "warning" },
    4: { label: "Counselor", color: "info" },
  };
  const role = roles[roleId] || roles[2];
  return <span className={`badge bg-${role.color} bg-opacity-10 text-${role.color} border border-${role.color}`}>{role.label}</span>;
};

const StatusBadge = ({ isActive }) => (
  <span className={`badge ${isActive ? 'bg-success' : 'bg-secondary'}`}>
    {isActive ? "Active" : "Locked"}
  </span>
);

const ActionButton = ({ icon, onClick }) => (
  <button onClick={onClick} className="btn btn-sm btn-link text-secondary p-1 ms-1">
    {icon}
  </button>
);

const Avatar = ({ name }) => {
  const initial = name ? name.charAt(0).toUpperCase() : "U";
  return (
    <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" 
         style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
      {initial}
    </div>
  );
};

const InputField = ({ label, ...props }) => (
  <div className="mb-2">
    <label className="form-label mb-1" style={{ fontSize: '0.75rem', color: COLORS.textMuted, fontWeight: 500 }}>{label}</label>
    <input className="form-control form-control-sm" style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderColor: COLORS.border, color: 'white' }} {...props} />
  </div>
);

const SelectField = ({ label, children, ...props }) => (
  <div className="mb-2">
    <label className="form-label mb-1" style={{ fontSize: '0.75rem', color: COLORS.textMuted, fontWeight: 500 }}>{label}</label>
    <select className="form-select form-select-sm" style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderColor: COLORS.border, color: 'white' }} {...props}>
      {children}
    </select>
  </div>
);

const ModalOverlay = ({ children, onClose }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    onClick={onClose}
    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
    style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050, backdropFilter: 'blur(4px)' }}
  >
    {children}
  </motion.div>
);

const mockUsers = [
  { userId: 1, email: "john@example.com", fullName: "John Smith", roleId: 3, isActive: true },
  { userId: 2, email: "alice@example.com", fullName: "Alice W", roleId: 2, isActive: true },
];