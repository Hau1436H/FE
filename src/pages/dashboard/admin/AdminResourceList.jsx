import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/dashboard/Sidebar';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';
import axiosClient from '../../../api/axiosClient';

function AdminResourceList() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States cho phân trang & tìm kiếm
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Hàm gọi API lấy danh sách phân trang
  const fetchResources = async (currentPage, search) => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/api/admin/content/learning-resources`, {
        params: {
          page: currentPage,
          pageSize: 20, // Render 20 dòng 1 trang để DOM không bị ngộp
          search: search || null
        }
      });
      
      const { items, totalPages, totalCount } = response.data.data;
      setResources(items || []);
      setTotalPages(totalPages || 1);
      setTotalCount(totalCount || 0);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API mỗi khi page thay đổi
  useEffect(() => {
    fetchResources(page, searchTerm);
  }, [page]);

  // Xử lý Search
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset về trang 1 khi search mới
    fetchResources(1, searchTerm);
  };

  return (
    <div className="d-flex min-vh-100 w-100" style={{ backgroundColor: '#07090f' }}>
      <Sidebar />
      <div className="flex-grow-1 p-4 overflow-auto text-white" style={{ maxHeight: '100vh', minWidth: 0 }}>
        <DashboardHeader />

        <div className="container-fluid px-0" style={{ maxWidth: '1100px' }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold text-white mb-1">Quản lý Tài liệu học tập</h4>
              <p className="text-white-50 mb-0">Tổng số: {totalCount} tài liệu trong hệ thống.</p>
            </div>
            <button 
              className="btn btn-success fw-semibold"
              onClick={() => navigate('/dashboard/admin/resources/create')}
            >
              + Thêm tài liệu mới
            </button>
          </div>

          {/* Thanh Search */}
          <div className="p-3 mb-4 rounded-3 d-flex gap-2" style={{ backgroundColor: '#09101c', border: '1px solid rgba(255,255,255,0.08)' }}>
            <input 
              type="text" 
              className="form-control bg-dark text-white border-secondary" 
              placeholder="Nhập tên khóa học / tài liệu để tìm..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
            />
            <button className="btn btn-primary px-4" onClick={handleSearch}>Tìm</button>
          </div>

          {/* Bảng Dữ Liệu */}
          <div className="table-responsive rounded-3" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <table className="table table-dark table-hover mb-0 align-middle">
              <thead>
                <tr>
                  <th scope="col" className="text-white-50 py-3 ps-4">ID</th>
                  <th scope="col" className="text-white-50 py-3">Tiêu đề</th>
                  <th scope="col" className="text-white-50 py-3">Loại</th>
                  <th scope="col" className="text-white-50 py-3">Nguồn</th>
                  <th scope="col" className="text-white-50 py-3 text-end pe-4">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-5">Đang tải...</td></tr>
                ) : resources.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-5 text-white-50">Không có dữ liệu.</td></tr>
                ) : (
                  resources.map((item) => (
                    <tr key={item.resourceId}>
                      <td className="ps-4">#{item.resourceId}</td>
                      <td className="fw-semibold text-truncate" style={{ maxWidth: '300px' }}>
                        <a href={item.url} target="_blank" rel="noreferrer" className="text-info text-decoration-none">
                          {item.title}
                        </a>
                      </td>
                      <td><span className="badge bg-secondary">{item.resourceType}</span></td>
                      <td>{item.provider}</td>
                      <td className="text-end pe-4">
                        <button 
                          className="btn btn-sm btn-outline-warning me-2"
                          onClick={() => navigate(`/dashboard/admin/resources/edit/${item.resourceId}`)}
                        >
                          Sửa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Component Điều hướng Phân Trang */}
          {!loading && totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <button 
                className="btn btn-outline-light" 
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Trang trước
              </button>
              <span className="text-white-50">Trang {page} / {totalPages}</span>
              <button 
                className="btn btn-outline-light" 
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Trang sau
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminResourceList;