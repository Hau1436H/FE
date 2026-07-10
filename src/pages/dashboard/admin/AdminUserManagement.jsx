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
  const [users, setUsers] = useState([]); // Khởi tạo mảng rỗng
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    roleId: "2",
    isActive: true,
    currentCompany: "",
    expertiseTags: "",
    department: "",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/api/admin/users");

      // LOG ĐỂ DEBUG: Kiểm tra cấu trúc Backend trả về trong F12 Console
      console.log("Dữ liệu API trả về:", res.data);

      // SỬA LỖI: Kiểm tra xem res.data có phải là mảng không,
      // nếu Backend trả về { data: [...] } thì dùng res.data.data
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Gọi API tạo User mới đã gộp ở Backend
      await axiosClient.post("/api/admin/users/create", {
        ...formData,
        roleId: parseInt(formData.roleId),
      });
      alert("Tạo tài khoản thành công!");
      setShowForm(false);
      fetchUsers(); // Refresh lại danh sách
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || "Không thể tạo user"));
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

        <button
          className="btn btn-success mb-3"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Đóng Form" : "+ Thêm người dùng mới"}
        </button>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="p-4 border rounded mb-4"
            style={{ backgroundColor: COLORS.cardBg }}
          >
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  name="email"
                  placeholder="Email"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="password"
                  name="password"
                  placeholder="Mật khẩu"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  name="fullName"
                  placeholder="Họ và tên"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <select
                  name="roleId"
                  className="form-select"
                  onChange={handleChange}
                  value={formData.roleId}
                >
                  <option value="2">Student</option>
                  <option value="3">Mentor</option>
                  <option value="4">Counselor</option>
                </select>
              </div>

              {formData.roleId === "3" && (
                <>
                  <div className="col-md-6">
                    <input
                      name="currentCompany"
                      placeholder="Công ty"
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      name="expertiseTags"
                      placeholder="Kỹ năng (Tags)"
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
              {formData.roleId === "4" && (
                <div className="col-md-12">
                  <input
                    name="department"
                    placeholder="Phòng ban"
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>
              )}
              <div className="col-12">
                <button className="btn btn-primary" disabled={loading}>
                  Xác nhận tạo
                </button>
              </div>
            </div>
          </form>
        )}

        <table className="table table-dark">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {/* SỬA LỖI: Thêm kiểm tra Array.isArray để tránh lỗi .map không phải hàm */}
            {Array.isArray(users) && users.length > 0 ? (
              users.map((u) => (
                <tr key={u.userId}>
                  <td>{u.email}</td>
                  <td>{u.roleId}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center">
                  Chưa có dữ liệu
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
