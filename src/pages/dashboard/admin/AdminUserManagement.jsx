import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/dashboard/Sidebar";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import axiosClient from "../../../api/axiosClient";

const COLORS = {
  bgContainer: "#000000",
  accentCyan: "#34D399",
  cardBg: "rgba(255, 255, 255, 0.04)",
  cardBorder: "rgba(255, 255, 255, 0.08)",
};

function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // State quản lý xem đang xem Chi tiết / Sửa user nào (nếu null là đang Tạo mới)
  const [editingUserId, setEditingUserId] = useState(null);

  // Form data mặc định (đã thêm studentCode)
  const initialFormState = {
    email: "",
    password: "",
    fullName: "",
    studentCode: "",
    roleId: "2",
    isActive: true,
    currentCompany: "",
    expertiseTags: "",
    department: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  // 1. LẤY DANH SÁCH USER
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/api/admin/users");
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else if (res.data && Array.isArray(res.data.data)) {
        setUsers(res.data.data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Lỗi fetch users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 2. MỞ FORM TẠO MỚI
  const handleOpenCreate = () => {
    setEditingUserId(null);
    setFormData(initialFormState);
    setShowForm(!showForm);
  };

  // 3. XEM CHI TIẾT & SỬA
  const handleDetailClick = async (user) => {
    try {
      setLoading(true);
      // Gọi API lấy đầy đủ chi tiết User từ DB
      const res = await axiosClient.get(`/api/admin/users/${user.userId}`);
      const userDetail = res.data.data || res.data; // Tùy cấu trúc bọc response

      setEditingUserId(userDetail.userId);
      setFormData({
        ...initialFormState,
        email: userDetail.email || "",
        fullName: userDetail.fullName || "",
        studentCode: userDetail.studentCode || "",
        roleId: userDetail.roleId ? userDetail.roleId.toString() : "2",
        isActive:
          userDetail.isActive !== undefined ? userDetail.isActive : true,
        currentCompany: userDetail.currentCompany || "",
        expertiseTags: userDetail.expertiseTags || "",
        department: userDetail.department || "",
      });
      setShowForm(true);
    } catch (err) {
      alert(
        "Không thể tải chi tiết người dùng: " +
          (err.response?.data?.message || "Lỗi server"),
      );
    } finally {
      setLoading(false);
    }
  };

  // 4. XÓA USER
  const handleDeleteClick = async (userId) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa vĩnh viễn người dùng này? Toàn bộ dữ liệu liên quan sẽ bị mất.",
      )
    )
      return;
    try {
      setLoading(true);
      await axiosClient.delete(`/api/admin/users/${userId}`);
      alert("Xóa người dùng thành công!");
      fetchUsers();
    } catch (err) {
      alert(
        "Lỗi xóa user: " + (err.response?.data?.message || "Không thể xóa"),
      );
    } finally {
      setLoading(false);
    }
  };

  // 5. SUBMIT FORM (TẠO HOẶC CẬP NHẬT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingUserId) {
        // GỌI API CẬP NHẬT: Gửi full data cho AdminUpdateUserDto
        await axiosClient.put(`/api/admin/users/${editingUserId}`, {
          roleId: parseInt(formData.roleId),
          isActive: formData.isActive,
          fullName: formData.fullName,
          studentCode: formData.studentCode,
          currentCompany: formData.currentCompany,
          expertiseTags: formData.expertiseTags,
          department: formData.department,
        });
        alert("Cập nhật thông tin chi tiết thành công!");
      } else {
        // GỌI API TẠO MỚI
        await axiosClient.post("/api/admin/users", {
          ...formData,
          roleId: parseInt(formData.roleId),
        });
        alert("Tạo tài khoản thành công!");
      }
      setShowForm(false);
      setEditingUserId(null);
      setFormData(initialFormState);
      fetchUsers();
    } catch (err) {
      alert(
        "Lỗi: " +
          (err.response?.data?.message ||
            err.response?.data?.title ||
            "Thao tác thất bại"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex"
      style={{ backgroundColor: COLORS.bgContainer, minHeight: "100vh" }}
    >
      <Sidebar />
      <div className="flex-grow-1 p-4 text-white">
        <DashboardHeader title="Quản lý người dùng" />

        <button className="btn btn-success mb-3" onClick={handleOpenCreate}>
          {showForm && !editingUserId ? "Đóng Form" : "+ Thêm người dùng mới"}
        </button>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="p-4 border rounded mb-4 shadow-sm"
            style={{ backgroundColor: COLORS.cardBg }}
            autoComplete="off"
          >
            <h5 className="mb-3 text-info">
              {editingUserId
                ? `Chi tiết & Cập nhật: ${formData.email}`
                : "Tạo tài khoản mới"}
            </h5>
            <div className="row g-3">
              {/* CÁC TRƯỜNG CƠ BẢN */}
              <div className="col-md-6">
                <label className="form-label text-secondary small">Email</label>
                <input
                  name="email"
                  value={formData.email}
                  placeholder="Email"
                  className="form-control"
                  onChange={handleChange}
                  autoComplete="off"
                  disabled={editingUserId !== null} // Khóa khi xem chi tiết
                  required
                />
              </div>

              {/* CHỈ HIỂN THỊ MẬT KHẨU KHI TẠO MỚI */}
              {!editingUserId && (
                <div className="col-md-6">
                  <label className="form-label text-secondary small">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    placeholder="Mật khẩu"
                    className="form-control"
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />
                </div>
              )}

              <div className="col-md-6">
                <label className="form-label text-secondary small">
                  Họ và tên
                </label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  placeholder="Họ và tên người dùng"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label text-secondary small">
                  Phân quyền (Role)
                </label>
                <select
                  name="roleId"
                  className="form-select"
                  onChange={handleChange}
                  value={formData.roleId}
                  disabled={editingUserId !== null} // Backend không cho đổi role trực tiếp
                >
                  <option value="2">Student (2)</option>
                  <option value="3">Mentor (3)</option>
                  <option value="4">Counselor (4)</option>
                  <option value="1">Admin (1)</option>
                </select>
              </div>

              <div className="col-md-3 d-flex align-items-end pb-1">
                <div className="form-check form-switch mt-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    id="flexSwitchCheckChecked"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexSwitchCheckChecked"
                  >
                    {formData.isActive ? "Hoạt động" : "Bị khóa"}
                  </label>
                </div>
              </div>

              {/* TRƯỜNG RIÊNG CHO STUDENT */}
              {formData.roleId === "2" && editingUserId && (
                <div className="col-md-6">
                  <label className="form-label text-secondary small">
                    Mã số Sinh viên
                  </label>
                  <input
                    name="studentCode"
                    value={formData.studentCode}
                    placeholder="VD: SE123456"
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* TRƯỜNG RIÊNG CHO MENTOR */}
              {formData.roleId === "3" && (
                <>
                  <div className="col-md-6">
                    <label className="form-label text-secondary small">
                      Công ty hiện tại
                    </label>
                    <input
                      name="currentCompany"
                      value={formData.currentCompany}
                      placeholder="Tên công ty"
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-secondary small">
                      Kỹ năng chuyên môn
                    </label>
                    <input
                      name="expertiseTags"
                      value={formData.expertiseTags}
                      placeholder="C#, React, SQL..."
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {/* TRƯỜNG RIÊNG CHO COUNSELOR */}
              {formData.roleId === "4" && (
                <div className="col-md-6">
                  <label className="form-label text-secondary small">
                    Phòng ban làm việc
                  </label>
                  <input
                    name="department"
                    value={formData.department}
                    placeholder="Phòng ban"
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="col-12 mt-4">
                <button className="btn btn-primary px-4" disabled={loading}>
                  {loading
                    ? "Đang xử lý..."
                    : editingUserId
                      ? "Lưu cập nhật"
                      : "Xác nhận tạo"}
                </button>
                {editingUserId && (
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => {
                      setShowForm(false);
                      setEditingUserId(null);
                    }}
                  >
                    Đóng chi tiết
                  </button>
                )}
              </div>
            </div>
          </form>
        )}

        <table className="table table-dark table-hover align-middle mt-2">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Trạng thái</th>
              <th className="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.length > 0 ? (
              users.map((u) => (
                <tr key={u.userId}>
                  <td>{u.email}</td>
                  <td>
                    {u.roleId === 1 && (
                      <span className="badge bg-danger">Admin</span>
                    )}
                    {u.roleId === 2 && (
                      <span className="badge bg-primary">Student</span>
                    )}
                    {u.roleId === 3 && (
                      <span className="badge bg-warning text-dark">Mentor</span>
                    )}
                    {u.roleId === 4 && (
                      <span className="badge bg-info text-dark">Counselor</span>
                    )}
                  </td>
                  <td>
                    {u.isActive ? (
                      <span className="text-success fw-bold">✓ Hoạt động</span>
                    ) : (
                      <span className="text-danger fw-bold">✗ Bị khóa</span>
                    )}
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-info me-2"
                      onClick={() => handleDetailClick(u)}
                    >
                      Chi tiết
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteClick(u.userId)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Chưa có dữ liệu người dùng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUserManagement;
