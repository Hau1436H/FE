import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/dashboard/Sidebar";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import axiosClient from "../../../api/axiosClient";

const COLORS = {
  bgContainer: "#000000",
  accentCyan: "#34D399",
  textSecondary: "#8C8C8C",
  cardBg: "rgba(255, 255, 255, 0.04)",
  cardBorder: "rgba(255, 255, 255, 0.08)",
};

function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", content: "" });

  // Trạng thái cho Form Thêm/Sửa
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    password: "",
    roleId: "2",
    isActive: true,
  });

  // 1. Fetch danh sách Users (GET)
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/api/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Lỗi tải users:", error);
      setMessage({
        type: "error",
        content: "Không thể tải danh sách người dùng.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Xử lý Input Form
  const handleInputChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  // 3. Mở Form Thêm Mới
  const handleOpenCreateForm = () => {
    setIsEditing(false);
    setFormData({
      id: "",
      email: "",
      password: "",
      roleId: "2",
      isActive: true,
    });
    setShowForm(true);
    setMessage({ type: "", content: "" });
  };

  // 4. Mở Form Chỉnh Sửa
  const handleOpenEditForm = (user) => {
    setIsEditing(true);
    setFormData({
      id: user.userId, // Cần map đúng tên trường từ C# (UserId)
      email: user.email,
      password: "", // Không tải password cũ lên
      roleId: user.roleId.toString(),
      isActive: user.isActive,
    });
    setShowForm(true);
    setMessage({ type: "", content: "" });
  };

  // 5. Nút Submit (Tạo mới hoặc Cập nhật)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", content: "" });

    try {
      if (isEditing) {
        // PUT: Cập nhật User
        await axiosClient.put(`/api/admin/users/${formData.id}`, {
          roleId: parseInt(formData.roleId),
          isActive: formData.isActive,
        });
        setMessage({ type: "success", content: "Cập nhật thành công!" });
      } else {
        // POST: Tạo User mới
        await axiosClient.post("/api/admin/users", {
          email: formData.email,
          password: formData.password,
          roleId: parseInt(formData.roleId),
          isActive: formData.isActive,
        });
        setMessage({ type: "success", content: "Tạo tài khoản thành công!" });
      }
      setShowForm(false);
      fetchUsers(); // Tải lại bảng
    } catch (error) {
      setMessage({
        type: "error",
        content: error.response?.data?.message || "Có lỗi xảy ra.",
      });
    }
  };

  // 6. Xóa User (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa User này không?")) return;
    try {
      await axiosClient.delete(`/api/admin/users/${id}`);
      setMessage({ type: "success", content: "Xóa thành công!" });
      fetchUsers();
    } catch (error) {
      setMessage({ type: "error", content: "Lỗi khi xóa người dùng." });
    }
  };

  return (
    <div
      className="d-flex"
      style={{
        backgroundColor: COLORS.bgContainer,
        minHeight: "100vh",
        fontFamily: "system-ui",
      }}
    >
      <Sidebar />

      <div
        className="flex-grow-1 p-4 overflow-auto text-white"
        style={{ maxHeight: "100vh", backgroundColor: "#06060c" }}
      >
        <DashboardHeader title="Quản trị Người Dùng" />

        <div
          className="mt-4 p-4 rounded-4"
          style={{
            backgroundColor: COLORS.cardBg,
            border: `1px solid ${COLORS.cardBorder}`,
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold m-0" style={{ color: COLORS.accentCyan }}>
              Danh sách Tài khoản
            </h4>
            <button
              className="btn btn-sm text-dark fw-bold"
              style={{ backgroundColor: COLORS.accentCyan }}
              onClick={handleOpenCreateForm}
            >
              + Thêm Mới
            </button>
          </div>

          {message.content && (
            <div
              className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} py-2`}
            >
              {message.content}
            </div>
          )}

          {/* FORM THÊM / SỬA */}
          {showForm && (
            <div
              className="mb-4 p-3 rounded-3"
              style={{ border: `1px dashed ${COLORS.accentCyan}` }}
            >
              <h5 className="mb-3">
                {isEditing ? "Chỉnh sửa User" : "Tạo mới User"}
              </h5>
              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-white-50">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control bg-dark text-white border-secondary"
                    required
                    disabled={isEditing}
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                {!isEditing && (
                  <div className="col-md-6">
                    <label className="form-label text-white-50">Mật khẩu</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control bg-dark text-white border-secondary"
                      required
                      minLength="6"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                <div className="col-md-3">
                  <label className="form-label text-white-50">Role ID</label>
                  <select
                    name="roleId"
                    className="form-select bg-dark text-white border-secondary"
                    value={formData.roleId}
                    onChange={handleInputChange}
                  >
                    <option value="1">1 - Admin</option>
                    <option value="2">2 - Student</option>
                    <option value="3">3 - Mentor</option>
                    <option value="4">4 - Counselor</option>
                  </select>
                </div>
                <div className="col-md-3 d-flex align-items-end pb-2">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label text-white-50 ms-2">
                      Hoạt động (Active)
                    </label>
                  </div>
                </div>
                <div className="col-12 mt-3">
                  <button type="submit" className="btn btn-primary me-2">
                    {isEditing ? "Lưu cập nhật" : "Lưu tạo mới"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* BẢNG DỮ LIỆU */}
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-success"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle">
                <thead>
                  <tr>
                    <th className="text-white-50">Email</th>
                    <th className="text-white-50">Role ID</th>
                    <th className="text-white-50">Trạng thái</th>
                    <th className="text-white-50 text-end">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-3 text-muted">
                        Chưa có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.userId}>
                        <td>{user.email}</td>
                        <td>
                          <span className="badge bg-secondary">
                            Role {user.roleId}
                          </span>
                        </td>
                        <td>
                          {user.isActive ? (
                            <span className="badge bg-success">Active</span>
                          ) : (
                            <span className="badge bg-danger">Banned</span>
                          )}
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-warning me-2"
                            onClick={() => handleOpenEditForm(user)}
                          >
                            Sửa
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(user.userId)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUserManagement;
