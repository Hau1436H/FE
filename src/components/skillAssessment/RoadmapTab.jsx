// .\src\components\skillAssessment\RoadmapTab.jsx
import React, { useState, useEffect } from 'react';
// Import danh sách khóa học ban đầu từ file dữ liệu của bạn
import { INITIAL_COURSES } from '../../data/coursesData'; 

function RoadmapTab({ result }) {
  const { hasTaken, score, total } = result;
  
  // Quản lý dữ liệu lộ trình bằng state để tương lai kết nối API mượt mà
  const [stages, setStages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Giả lập lượt gọi API
    const fetchRoadmapData = async () => {
      setIsLoading(true);
      try {
        // TƯƠNG LAI: const response = await axios.get(`/api/courses?score=${score}`); setStages(response.data);
        // HIỆN TẠI: Lấy trực tiếp từ file dữ liệu INITIAL_COURSES
        const data = INITIAL_COURSES || [];
        setStages(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu lộ trình:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmapData();
  }, [score, total]);

  // Hàm helper render Badge trạng thái tối giản (Đồng bộ màu xanh lá cho active/completed)
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span 
            className="badge text-success border px-3 py-1.5 rounded-pill animate-pulse text-uppercase font-monospace" 
            style={{ 
              fontSize: '0.7rem', 
              letterSpacing: '0.5px',
              // Đồng bộ trực tiếp với biến CSS đang chạy trong hệ thống của bạn
              borderColor: 'color-mix(in srgb, var(--accent) 50%, transparent) !important'
            }}
          >
            Đã hoàn thành
          </span>
        );
      case 'learning':
        return (
            <span 
            className="badge text-success border px-3 py-1.5 rounded-pill animate-pulse text-uppercase font-monospace" 
            style={{ 
              fontSize: '0.7rem', 
              letterSpacing: '0.5px',
              // Đồng bộ trực tiếp với biến CSS đang chạy trong hệ thống của bạn
              borderColor: 'color-mix(in srgb, var(--accent) 50%, transparent) !important'
            }}
          >
            Đang thực hiện
          </span>
        );
      case 'saved':
      default:
        return (
          <span className="badge bg-secondary bg-opacity-10 text-white-50 border border-secondary border-opacity-10 px-3 py-1.5 rounded-pill text-uppercase font-monospace" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
            Lộ trình tiếp theo
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-5 text-white-50 font-monospace small animate-pulse">
        Đang đồng bộ lộ trình học tập từ AI...
      </div>
    );
  }

  return (
    <div className="mx-auto" style={{ maxWidth: '800px', color: '#fff' }}>
      
      {/* Tiêu đề đầu trang */}
      <div className="mb-5 text-center">
        <h4 className="fw-bold text-white mb-2" style={{ letterSpacing: '-0.5px' }}>
          Lộ Trình Học Tập Cá Nhân Hóa
        </h4>
        <p className="text-white-50 small mb-0 mx-auto" style={{ maxWidth: '600px' }}>
          {hasTaken 
            ? `Hệ thống đã tinh chỉnh các giai đoạn dựa trên kết quả kiểm tra của bạn (Đúng ${score}/${total} câu).`
            : "Vui lòng hoàn thành bài kiểm tra năng lực để kích hoạt lộ trình học chính xác nhất từ AI."
          }
        </p>
      </div>

      {/* Danh sách các bước Lộ trình */}
      <div className="d-flex flex-column gap-4">
        {stages.length === 0 ? (
          <div className="text-center text-white-50 py-4 small">Không tìm thấy dữ liệu khóa học.</div>
        ) : (
          stages.map((stage, index) => {
            // Định nghĩa trạng thái khóa dựa trên dữ liệu mới
            const isCompleted = stage.status === 'completed';
            const isLearning = stage.status === 'learning';
            const isSaved = stage.status === 'saved';

            return (
              <div 
                key={stage.id || index} 
                className="card border-secondary border-opacity-25 transition-all overflow-hidden"
                style={{ 
                  backgroundColor: isSaved ? '#07080f' : '#0b0c16',
                  borderLeft: isLearning ? '3px solid #198754' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  opacity: isSaved ? 0.6 : 1
                }}
              >
                <div className="card-body p-4">
                  
                  {/* Dòng Header của Card */}
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <div className="text-warning fw-semibold small font-monospace text-uppercase" style={{ letterSpacing: '1px' }}>
                        Khóa {index + 1}
                      </div>
                      <span className="text-white-25 small">|</span>
                      <span className="text-white-50 small font-monospace">{stage.duration}</span>
                      <span className="text-white-25 small">|</span>
                      <span className="text-white-50 small font-monospace">{stage.level}</span>
                    </div>
                    <div>
                      {renderStatusBadge(stage.status)}
                    </div>
                  </div>

                  {/* Tiêu đề Giai đoạn / Khóa học */}
                  <h5 className={`fw-bold mb-2 ${isCompleted ? 'text-decoration-line-through text-white-50 opacity-50' : 'text-white'}`} style={{ fontSize: '1.15rem' }}>
                    {stage.title}
                  </h5>

                  {/* Giảng viên & Số bài học ẩn nhỏ tinh tế */}
                  <div className="text-white-50 small mb-3 font-monospace" style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                    Giảng viên: {stage.instructor} • {stage.lessons} bài học
                  </div>

                  {/* Mô tả chi tiết */}
                  <p className="text-white-50 small mb-4 lh-base" style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                    {stage.description}
                  </p>

                  {/* Phần Footer chứa Tags và Nút hành động */}
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 pt-3 border-top border-secondary border-opacity-10">
                    
                    {/* Danh sách Tags chủ đề (Map chuẩn theo trường stage.tags) */}
                    <div className="d-flex flex-wrap gap-1.5">
                      {stage.tags && stage.tags.map((tag, i) => (
                        <span 
                          key={i} 
                          className="badge font-monospace fw-normal px-2.5 py-1.5"
                          style={{ backgroundColor: '#121426', color: '#8e90a6', fontSize: '0.725rem', borderRadius: '4px' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Nút thao tác tối giản chuẩn xanh lá hệ thống */}
                    <button 
                      className={`btn btn-sm px-4 py-2 fw-medium rounded-2 transition-all ${
                        isCompleted 
                          ? 'btn-outline-success border-opacity-50' 
                          : 'btn-success text-white shadow-sm'
                      }`}
                      style={{ 
                        fontSize: '0.8rem',
                        backgroundColor: isCompleted ? 'transparent' : '#198754',
                        borderColor: '#198754'
                      }}
                    >
                      {isCompleted ? 'Xem lại bài học' : isLearning ? 'Tiếp tục học' : 'Đăng ký học ngay'}
                    </button>

                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default RoadmapTab;