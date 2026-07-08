import React, { useState } from "react";
import Sidebar from "../../../components/dashboard/Sidebar";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
// Import axiosClient trực tiếp, đảm bảo đường dẫn đúng với dự án của bạn
import axiosClient from "../../../api/axiosClient";

const COLORS = {
  bgContainer: "#000000",
  accentCyan: "#34D399",
  textSecondary: "#8C8C8C",
  cardBg: "rgba(255, 255, 255, 0.04)",
  cardBorder: "rgba(255, 255, 255, 0.08)",
};

function AdminManagement() {
  // State lưu trữ dữ liệu form
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    roleId: "3", // Mặc định là 3 (Mentor)
    fullName: "",
    currentCompany: "",
    expertiseTags: "",
    department: "",
  });

  // State xử lý UI
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  // Xử lý khi gõ vào input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm GỌI API TRỰC TIẾP (Không qua file service)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", content: "" });

    try {
      // Chuẩn bị payload gửi lên Backend
      const payload = {
        email: formData.email,
        password: formData.password,
        roleId: parseInt(formData.roleId),
        fullName: formData.fullName,
        currentCompany:
          formData.roleId === "3" ? formData.currentCompany : null,
        expertiseTags: formData.roleId === "3" ? formData.expertiseTags : null,
        department: formData.roleId === "4" ? formData.department : null,
      };

      // Gọi thẳng Axios tới API Backend
      const response = await axiosClient.post(
        "/api/admin/users/staff",
        payload,
      );

      setMessage({
        type: "success",
        content: response.data.message || "Tạo tài khoản Staff thành công!",
      });

      // Reset form sau khi tạo thành công
      setFormData({
        email: "",
        password: "",
        roleId: "3",
        fullName: "",
        currentCompany: "",
        expertiseTags: "",
        department: "",
      });
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Có lỗi xảy ra khi tạo tài khoản.";
      setMessage({ type: "error", content: errorMsg });
      console.error("Lỗi tạo staff:", error);
    } finally {
      setLoading(false);
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
        <DashboardHeader title="Quản lý Nhân sự (Staff)" />

        <div
          className="mt-4 p-4 rounded-4"
          style={{
            backgroundColor: COLORS.cardBg,
            border: `1px solid ${COLORS.cardBorder}`,
            maxWidth: "800px",
          }}
        >
          <h4 className="fw-bold mb-4" style={{ color: COLORS.accentCyan }}>
            Tạo tài khoản Mentor / Counselor
          </h4>

          {/* Hiển thị thông báo Lỗi hoặc Thành công */}
          {message.content && (
            <div
              className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} py-2`}
            >
              {message.content}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Thông tin đăng nhập chung */}
              <div className="col-md-6">
                <label className="form-label text-white-50">
                  Email đăng nhập *
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control bg-dark text-white border-secondary"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-white-50">Mật khẩu *</label>
                <input
                  type="password"
                  name="password"
                  className="form-control bg-dark text-white border-secondary"
                  required
                  minLength="6"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {/* Phân loại Role */}
              <div className="col-md-6">
                <label className="form-label text-white-50">Họ và Tên *</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control bg-dark text-white border-secondary"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-white-50">
                  Vai trò (Role) *
                </label>
                <select
                  name="roleId"
                  className="form-select bg-dark text-white border-secondary"
                  value={formData.roleId}
                  onChange={handleChange}
                >
                  <option value="3">Mentor (Người hướng dẫn)</option>
                  <option value="4">Counselor (Tư vấn viên)</option>
                </select>
              </div>

              {/* RENDER ĐỘNG THEO ROLE */}
              {formData.roleId === "3" && (
                <>
                  <div className="col-md-6">
                    <label className="form-label text-white-50">
                      Công ty hiện tại
                    </label>
                    <input
                      type="text"
                      name="currentCompany"
                      className="form-control bg-dark text-white border-secondary"
                      value={formData.currentCompany}
                      onChange={handleChange}
                      placeholder="VD: FPT Software, VNG..."
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-white-50">
                      Kỹ năng chuyên môn (Tags)
                    </label>
                    <input
                      type="text"
                      name="expertiseTags"
                      className="form-control bg-dark text-white border-secondary"
                      value={formData.expertiseTags}
                      onChange={handleChange}
                      placeholder="VD: ReactJS, .NET, AI"
                    />
                  </div>
                </>
              )}

              {formData.roleId === "4" && (
                <div className="col-md-12">
                  <label className="form-label text-white-50">
                    Phòng ban (Department)
                  </label>
                  <input
                    type="text"
                    name="department"
                    className="form-control bg-dark text-white border-secondary"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="VD: Academic, Career Support..."
                  />
                </div>
              )}

              {/* Nút Submit */}
              <div className="col-12 mt-4">
                <button
                  type="submit"
                  className="btn fw-bold px-4 py-2 text-dark"
                  style={{ backgroundColor: COLORS.accentCyan }}
                  disabled={loading}
                >
                  {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản Staff"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminManagement;
