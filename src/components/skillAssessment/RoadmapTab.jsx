import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

function RoadmapTab({ sessionId, result }) {
  const hasTaken = result?.hasTaken || false;
  const score = parseFloat(result?.score) || 0;
  const total = parseFloat(result?.total) || 20;

  const [stages, setStages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiAdvice, setAiAdvice] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // HELPER DECODE JWT CHUẨN TRÁNH LỖI ATOB
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  // KẾT NỐI SIGNALR (CHỐNG LỖI RACE CONDITION CỦA REACT STRICT MODE)
  useEffect(() => {
    let connection = null;
    let isMounted = true;
    let timeoutId = null; // Thêm bộ đếm giờ

    const connectSignalR = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        connection = new HubConnectionBuilder()
          .withUrl("https://localhost:7196/hubs/roadmap", { 
            accessTokenFactory: () => token 
          })
          .configureLogging(LogLevel.Error) // Chỉ in ra lỗi nghiêm trọng, bỏ qua log rác
          .withAutomaticReconnect()
          .build();

        connection.on("ReceiveRoadmapUpdate", () => {
          if (isMounted) setRefreshKey(prev => prev + 1);
        });

        // TRÌ HOÃN 100MS ĐỂ BYPASS REACT STRICT MODE UNMOUNT
        timeoutId = setTimeout(async () => {
          if (!isMounted) return; // Nếu đã bị unmount thì hủy kết nối ngay

          try {
            await connection.start();
            
            if (isMounted) {
              const payload = parseJwt(token);
              if (payload) {
                const studentId = payload.studentId || payload.StudentId || payload.sub;
                if (studentId) {
                  await connection.invoke("SubscribeToRoadmapUpdates", studentId);
                }
              }
            }
          } catch (err) {
            // Không log lỗi nếu component đã unmount
            if (isMounted) console.warn("Lỗi kết nối SignalR:", err.message);
          }
        }, 100);

      } catch (error) { 
        if (isMounted) console.warn("Lỗi khởi tạo SignalR:", error.message);
      }
    };

    connectSignalR();

    return () => {
      isMounted = false; // Đánh dấu chết
      if (timeoutId) clearTimeout(timeoutId); // Hủy đếm giờ (Chặn gửi request nếu unmount lẹ)
      if (connection) {
        connection.stop().catch(() => {}); // Hủy an toàn
      }
    };
  }, []);

  // XỬ LÝ ĐỒNG BỘ BÀI TEST NGAY KHI VÀO TAB NẾU CÓ SESSION ID
  useEffect(() => {
    const processSession = async () => {
      if (sessionId && hasTaken) {
        setIsProcessing(true);
        try {
          const response = await axiosClient.post(`/api/roadmap-engine/process-assessment/${sessionId}`);
          if (response.data?.data?.aiAdvice) {
            setAiAdvice(response.data.data.aiAdvice);
          } else if (response.data?.message) {
            setAiAdvice(response.data.message);
          }
          setRefreshKey(prev => prev + 1);
        } catch (error) {
          console.error("Lỗi đồng bộ bài test vào Roadmap:", error);
        } finally {
          setIsProcessing(false);
        }
      }
    };
    processSession();
  }, [sessionId, hasTaken]);

  // LOAD DỮ LIỆU SƠ ĐỒ CÂY ROADMAP
  useEffect(() => {
    const fetchRoadmapData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosClient.get('/api/roadmap/skill-tree');
        setStages(response.data?.data || []);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu lộ trình:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoadmapData();
  }, [refreshKey]);

  const completedCount = stages.filter(s => s.isCompleted).length;
  const progressPercent = stages.length > 0 ? Math.round((completedCount / stages.length) * 100) : 0;

  if (isLoading || isProcessing) {
    return (
      <div className="text-center py-5 text-white">
        <div className="spinner-border text-success mb-3" role="status"></div>
        <p className="text-white-50">{isProcessing ? "AI Mentor đang đồng bộ kết quả bài test vào Roadmap..." : "Đang tải lộ trình học tập..."}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto pb-5" style={{ maxWidth: '850px', color: '#fff' }}>
      {/* Header Tiến độ tổng */}
      <div className="bg-dark bg-opacity-50 p-4 rounded-4 border border-secondary border-opacity-25 mb-4 shadow">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4 className="fw-bold mb-0 text-white">Tiến độ lộ trình học tập</h4>
          <span className="text-success fw-bold fs-5">{progressPercent}%</span>
        </div>
        <div className="progress bg-secondary bg-opacity-25" style={{ height: '12px' }}>
          <div className="progress-bar bg-success" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* Thông điệp từ AI Mentor */}
      {aiAdvice && (
        <div className="alert alert-success border-success bg-dark bg-opacity-50 text-success mb-4 d-flex align-items-center p-3 rounded-3">
          <i className="bi bi-stars fs-3 me-3 text-warning"></i> 
          <div>
            <strong className="d-block text-white mb-1">Cố vấn AI Mentor:</strong>
            <span className="text-white-50">{aiAdvice}</span>
          </div>
        </div>
      )}

      {/* Cây Roadmap */}
      {stages.length === 0 ? (
        <div className="text-center py-5 border border-dashed border-secondary rounded-4 bg-dark bg-opacity-25">
          <i className="bi bi-journal-x fs-1 text-secondary mb-3 d-block"></i>
          <h5>Chưa có lộ trình học tập</h5>
          <p className="text-white-50 small">Vui lòng chọn Nghề nghiệp mục tiêu ở trang Hồ sơ (Profile) để hệ thống kích hoạt lộ trình.</p>
        </div>
      ) : (
        <div className="timeline-container ps-4">
          {stages.map((stage, idx) => {
            const isDone = stage.isCompleted;
            const isDoing = !stage.isLocked && !isDone;
            return (
              <div key={stage.nodeId || idx} className="timeline-item d-flex align-items-start mb-4">
                <div 
                  className={`mt-2 rounded-circle border border-2 ${
                    isDone ? 'bg-success border-success' : isDoing ? 'bg-warning border-warning' : 'bg-secondary border-secondary'
                  }`} 
                  style={{ width: 14, height: 14, minWidth: 14 }} 
                />
                <div className="card w-100 ms-4 bg-dark border border-secondary border-opacity-10 shadow-sm">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <h6 className="fw-bold text-light mb-0">Chặng {idx + 1}: {stage.nodeName}</h6>
                      {isDone ? (
                        <span className="badge bg-success"><i className="bi bi-check-circle-fill me-1"></i> HOÀN THÀNH</span>
                      ) : isDoing ? (
                        <span className="badge bg-warning text-dark fw-bold">ĐANG HỌC</span>
                      ) : (
                        <span className="badge bg-secondary"><i className="bi bi-lock-fill me-1"></i> BỊ KHÓA</span>
                      )}
                    </div>
                    <p className="small text-white-50 mb-0">{stage.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RoadmapTab;