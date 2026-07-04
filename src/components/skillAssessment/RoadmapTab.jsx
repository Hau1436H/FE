import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

function RoadmapTab({ sessionId, result }) {
  const hasTaken = result?.hasTaken || false;
  const score = parseFloat(result?.score) || 0;
  const total = parseFloat(result?.total) || 20;
  const progressPercent = Math.round((score / total) * 100);

  const [stages, setStages] = useState([]);
  const [isLoading, setIsLoading] = useState(hasTaken);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiAdvice, setAiAdvice] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // KẾT NỐI SIGNALR ĐỂ AUTO REFRESH TIẾN ĐỘ
  useEffect(() => {
    let connection = null;
    const connectSignalR = async () => {
      try {
        connection = new HubConnectionBuilder()
          .withUrl("https://localhost:7196/hubs/roadmap", { 
            accessTokenFactory: () => localStorage.getItem('token') 
          })
          .configureLogging(LogLevel.Information)
          .withAutomaticReconnect()
          .build();

        connection.on("ReceiveRoadmapUpdate", () => setRefreshKey(prev => prev + 1));
        await connection.start();
      } catch (error) { console.error("SignalR Error:", error); }
    };
    connectSignalR();
    return () => connection?.stop();
  }, []);

  useEffect(() => {
    const fetchRoadmapData = async () => {
      if (!hasTaken) return;
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
  }, [hasTaken, refreshKey]);

  const handleGenerateAiRoadmap = async (isConfirming = false) => {
    setIsGenerating(true);
    try {
      const response = await axiosClient.post(`/api/roadmap-engine/generate-from-session/${sessionId}?confirmSwitch=${isConfirming}`);
      if (response.status === 202) {
        if (window.confirm(response.data.message)) handleGenerateAiRoadmap(true);
        setIsGenerating(false);
        return;
      }
      setAiAdvice(response.data?.message);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      alert("Lỗi hệ thống.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mx-auto pb-5" style={{ maxWidth: '850px', color: '#fff' }}>
      {/* Header với Progress Bar tổng */}
      <div className="bg-dark bg-opacity-50 p-4 rounded-4 border border-secondary border-opacity-25 mb-4 shadow">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4 className="fw-bold mb-0 text-white">Tiến độ tổng quát</h4>
          <span className="text-success fw-bold">{progressPercent}%</span>
        </div>
        <div className="progress bg-secondary bg-opacity-25" style={{ height: '12px' }}>
          <div className="progress-bar bg-success" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {aiAdvice && (
        <div className="alert alert-success border-success bg-transparent text-success mb-4 d-flex align-items-center p-3">
          <i className="bi bi-stars fs-4 me-3"></i> 
          <span>{aiAdvice}</span>
        </div>
      )}

      {stages.length === 0 ? (
        <div className="text-center py-5 border border-dashed border-secondary rounded-4 bg-dark bg-opacity-25">
          <i className="bi bi-cpu fs-1 text-primary mb-3 d-block"></i>
          <h5>Sẵn sàng định hướng nghề nghiệp?</h5>
          <button className="btn btn-primary rounded-pill px-4 mt-3" onClick={() => handleGenerateAiRoadmap(false)}>
            {isGenerating ? "Đang chạy AI..." : "Khởi tạo lộ trình cá nhân hóa"}
          </button>
        </div>
      ) : (
        <div className="timeline-container ps-4">
          {stages.map((stage, idx) => {
            const isDone = stage.isCompleted;
            const isDoing = !stage.isLocked && !isDone;
            return (
              <div key={idx} className="timeline-item d-flex align-items-start mb-4">
                <div className={`mt-2 rounded-circle border border-2 ${isDone ? 'bg-success border-success' : isDoing ? 'bg-warning border-warning' : 'bg-secondary border-secondary'}`} style={{ width: 14, height: 14 }} />
                <div className="card w-100 ms-4 bg-dark border-0 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between">
                      <h6 className="fw-bold text-light mb-1">Chặng {idx + 1}: {stage.nodeName}</h6>
                      {isDone ? <i className="bi bi-check-circle-fill text-success"></i> : isDoing ? <span className="text-warning small fw-bold">ĐANG HỌC</span> : <i className="bi bi-lock-fill text-secondary"></i>}
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