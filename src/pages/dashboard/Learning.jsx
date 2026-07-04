// src/pages/Learning.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as signalR from "@microsoft/signalr"; 
import axiosClient from '../../api/axiosClient'; 
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import NodeDrawer from '../../components/dashboard/learning/NodeDrawer';
import SkillTree from '../../components/dashboard/learning/SkillTree'; 
import { Spinner } from 'react-bootstrap';
import { FaCompass, FaRobot, FaInfoCircle, FaStar, FaBrain, FaHandPointer } from 'react-icons/fa';

function Learning() {
  const [skillNodes, setSkillNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false); 
  const [refreshKey, setRefreshKey] = useState(0); 
  
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  // MỚI: State bật/tắt chế độ Highlight các kỹ năng HOT
  const [highlightHotSkills, setHighlightHotSkills] = useState(false); 
  
  const navigate = useNavigate();

  // 1. GỌI API LẤY LỘ TRÌNH
  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/api/learning-hub/my-roadmap');
        
        if (response.data && response.data.data) {
          const formattedNodes = response.data.data.map(node => {
            const isCompleted = node.IsCompleted === true || node.isCompleted === true;
            const isLocked = node.IsLocked === true || node.isLocked === true;
            const isTrending = node.IsTrending === true || node.isTrending === true;
            const currentTrendScore = node.CurrentTrendScore ?? node.currentTrendScore ?? 0;

            const rawId = node.SkillNodeId || node.skillNodeId || node.NodeId || node.nodeId || node.id;
            const name = node.NodeName || node.nodeName || node.title;
            const description = node.Description || node.description;

            const backendStatus = node.Status || node.status;
            const finalStatus = backendStatus ? backendStatus.toLowerCase() : (isCompleted ? 'completed' : (isLocked ? 'locked' : 'learning'));

            return {
              ...node, 
              id: rawId,
              title: name,
              nodeName: name,
              description: description,
              status: finalStatus,
              isCompleted: isCompleted,
              isLocked: isLocked, 
              isTrending: isTrending,              
              currentTrendScore: currentTrendScore 
            };
          });
          
          setSkillNodes(formattedNodes);
          setNeedsOnboarding(false); 
        }
      } catch (error) {
        console.error("Lỗi khi tải Lộ trình học tập:", error);
        if (error.response?.status === 400 && error.response?.data?.requiresOnboarding) {
            setNeedsOnboarding(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [refreshKey]);

  // 2. KẾT NỐI SIGNALR HÚB
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    let userId = "";
    try {
      const base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );
      const payload = JSON.parse(jsonPayload);
      userId = payload.sub || payload.nameid; 
    } catch(e) { 
      console.error("Lỗi parse token an toàn:", e); 
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7196/hubs/roadmap", {
        accessTokenFactory: () => token 
      })
      .withAutomaticReconnect()
      .build();

    let isMounted = true;

    connection.start()
      .then(() => {
        if (isMounted) {
          console.log("Đã kết nối Real-time Roadmap Hub!");
          if (userId) {
            connection.invoke("SubscribeToRoadmapUpdates", userId)
              .catch(err => console.error("Lỗi khi tham gia Group Roadmap:", err));
          }
        }
      })
      .catch(err => {
        if (isMounted) console.error("Lỗi kết nối SignalR: ", err);
      });

    connection.on("TargetRoleChanged", (data) => {
      console.log("Tín hiệu Realtime nhận được:", data.message);
      setRefreshKey(prev => prev + 1); 
    });

    return () => {
      isMounted = false;
      if (connection.state === signalR.HubConnectionState.Connected) {
        if (userId) {
          connection.invoke("UnsubscribeFromRoadmapUpdates", userId)
            .then(() => connection.stop())
            .catch(() => connection.stop());
        } else {
          connection.stop();
        }
      }
    };
  }, []);

  // 3. TÍNH TOÁN CÁC THÔNG SỐ ĐỘNG CHO SUMMARY CARDS & AI CO-PILOT
  const roadmapStats = useMemo(() => {
    if (!skillNodes || skillNodes.length === 0) return { total: 0, completed: 0, percent: 0, nextNode: null, hotSkillsCount: 0 };
    
    const total = skillNodes.length;
    const completed = skillNodes.filter(n => n.status === 'completed' || n.isCompleted).length;
    const percent = Math.round((completed / total) * 100);
    
    const nextNode = skillNodes.find(n => n.status === 'learning');
    const hotSkillsCount = skillNodes.filter(n => n.isTrending).length;

    return { total, completed, percent, nextNode, hotSkillsCount };
  }, [skillNodes]);

  const handleNodeClickAction = (node) => {
    if (node.status !== 'locked' && !node.isLocked) {
      setSelectedNode(node);
      setShowDrawer(true);
    } else {
      alert("Bạn phải hoàn thành kỹ năng trước đó mới có thể mở khóa bài này!");
    }
  };

  return (
    <div className="d-flex" style={{ backgroundColor: '#090a0f', minHeight: '100vh', color: '#fff' }}>
      <Sidebar />
      <div className="flex-grow-1 p-4 overflow-auto">
        <DashboardHeader />

        {/* CỤM HERO HEADER CỦA LEARNING HUB */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-md-items-center gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
          <div>
            <h2 className="fw-bold text-white d-flex align-items-center gap-2 m-0">
              <FaCompass className="text-primary" /> Lộ trình học tập thông minh
            </h2>
            <p className="text-white-50 small m-0 mt-1">Hệ thống AI tự động phân tích kỹ năng và cung cấp tài nguyên chuẩn hóa</p>
          </div>
          {skillNodes.length > 0 && (
            <div>
              <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2 rounded-pill fw-semibold">
                Định hướng: {skillNodes[0]?.pathName || skillNodes[0]?.PathName || "Lộ trình chuẩn hóa"}
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" variant="success" />
          </div>
        ) : needsOnboarding ? (
          <div className="text-center py-5 border border-secondary border-opacity-25 rounded-3 bg-dark bg-opacity-50 mt-4">
            <div className="mb-4">
              <i className="bi bi-compass text-warning" style={{ fontSize: '3rem' }}></i>
            </div>
            <h4 className="text-white fw-bold mb-3">Bạn chưa định hướng nghề nghiệp!</h4>
            <p className="text-white-50 mb-4 mx-auto" style={{ maxWidth: '500px' }}>
              Hệ thống cần biết mục tiêu nghề nghiệp của bạn (Frontend, Backend, Mobile...) để AI có thể thiết kế lộ trình học tập chuẩn xác nhất.
            </p>
            <button className="btn btn-success fw-bold px-4 py-2 rounded-pill shadow" onClick={() => navigate('/dashboard/profile')}>
              <i className="bi bi-person-lines-fill me-2"></i> Thiết lập Mục tiêu ngay
            </button>
          </div>
        ) : (
          <>
            {/* THẺ STATS CARDS ĐẬM CHẤT DASHBOARD CAO CẤP */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="p-3 rounded-4 border border-secondary border-opacity-25 h-100" style={{ background: 'linear-gradient(145deg, #131625, #0b0c14)' }}>
                  <div className="text-white-50 small text-uppercase fw-bold mb-1" style={{ letterSpacing: '0.5px', fontSize: '11px' }}>Tiến độ tổng thể</div>
                  <div className="d-flex align-items-baseline gap-2">
                    <h3 className="text-white fw-bold m-0">{roadmapStats.percent}%</h3>
                    <span className="text-success small fw-semibold">({roadmapStats.completed} / {roadmapStats.total} Node)</span>
                  </div>
                  <div className="progress mt-2" style={{ height: '6px', backgroundColor: '#2d3142' }}>
                    <div className="progress-bar bg-success progress-bar-striped progress-bar-animated" style={{ width: `${roadmapStats.percent}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="p-3 rounded-4 border border-secondary border-opacity-25 h-100" style={{ background: 'linear-gradient(145deg, #131625, #0b0c14)' }}>
                  <div className="text-white-50 small text-uppercase fw-bold mb-1" style={{ letterSpacing: '0.5px', fontSize: '11px' }}>Mục tiêu tiếp theo</div>
                  <h4 className="text-primary fw-bold text-truncate m-0 mt-1" style={{ fontSize: '1.1rem' }}>
                    {roadmapStats.nextNode ? (roadmapStats.nextNode.nodeName || roadmapStats.nextNode.NodeName || roadmapStats.nextNode.title) : "Đã hoàn tất lộ trình!"}
                  </h4>
                  <div className="text-white-50 small mt-1" style={{ fontSize: '12px' }}>Trạng thái: Đang ưu tiên học</div>
                </div>
              </div>

              {/* CARD MARKET PULSE: ĐÃ THÊM CHỨC NĂNG CLICK ĐỂ HIGHLIGHT */}
              <div className="col-md-4">
                <div 
                  className={`p-3 rounded-4 border h-100 transition-all ${highlightHotSkills ? 'border-danger shadow-lg' : 'border-secondary border-opacity-25'}`} 
                  style={{ 
                    background: highlightHotSkills ? 'linear-gradient(145deg, #2a0a0a, #110505)' : 'linear-gradient(145deg, #131625, #0b0c14)',
                    cursor: 'pointer',
                    transform: highlightHotSkills ? 'translateY(-2px)' : 'none'
                  }}
                  onClick={() => setHighlightHotSkills(!highlightHotSkills)}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="text-white-50 small text-uppercase fw-bold mb-1" style={{ letterSpacing: '0.5px', fontSize: '11px' }}>Xếp hạng thị trường</div>
                      <div className="d-flex align-items-center gap-2 mt-1">
                        <span className="badge bg-danger px-2 py-1" style={{ fontSize: '10px' }}>MARKET PULSE</span>
                        <span className="text-white small fw-bold">{roadmapStats.hotSkillsCount} Kỹ năng cốt lõi</span>
                      </div>
                    </div>
                    {/* Icon nhắc nhở người dùng click */}
                    <div className={`rounded-circle p-2 ${highlightHotSkills ? 'bg-danger text-white' : 'bg-dark text-white-50'}`}>
                       <FaHandPointer />
                    </div>
                  </div>
                  <div className={`small mt-2 fw-semibold ${highlightHotSkills ? 'text-danger' : 'text-info'}`} style={{ fontSize: '11px' }}>
                    {highlightHotSkills ? '🔴 Đang lọc: Kỹ năng thịnh hành' : '🖱️ Click vào đây để tìm trên sơ đồ'}
                  </div>
                </div>
              </div>
            </div>

            {/* BỐ CỤC PHÂN CHIA CHÍNH: 75% MAP - 25% PANEL AI TRỢ LÝ */}
            <div className="row g-4">
              <div className="col-xl-9 col-lg-8">
                {/* Lưới bọc SkillTree - TRUYỀN STATE XUỐNG */}
                <SkillTree 
                   skillNodes={skillNodes} 
                   onNodeClick={handleNodeClickAction} 
                   highlightHotSkills={highlightHotSkills} // <-- Prop mới truyền vào đây
                />
              </div>

              {/* CO-PILOT SIDEBAR WIDGET */}
              <div className="col-xl-3 col-lg-4">
                <div className="d-flex flex-column gap-3 h-100">
                  <div className="p-4 rounded-4 border border-secondary border-opacity-25 flex-grow-1 d-flex flex-column" style={{ background: 'linear-gradient(145deg, #121526, #0b0c14)' }}>
                    <h6 className="fw-bold text-white d-flex align-items-center gap-2 mb-3">
                      <FaRobot className="text-danger animate-pulse" /> AI Co-Pilot Assistant
                    </h6>
                    
                    <div className="p-3 rounded-3 bg-dark bg-opacity-50 small text-white-50 border border-secondary border-opacity-10 mb-4" style={{ lineHeight: '1.6', fontSize: '13px' }}>
                      {roadmapStats.nextNode ? (
                        <>
                          Chào bạn, hệ thống ghi nhận bạn đã hoàn thành xuất sắc các nội dung tiên quyết. Hiện tại, bạn nên tập trung dứt điểm kỹ năng <b className="text-white">{roadmapStats.nextNode.nodeName || roadmapStats.nextNode.title}</b>. Click ngay nút bên dưới để mở kho tài liệu thông minh phục vụ bài học này nhé!
                        </>
                      ) : (
                        <>
                          Chúc mừng bạn! Bạn đã hoàn thành toàn bộ các nút kỹ năng trong sơ đồ. Hãy tiếp tục tham gia các bài thực hành chuyên sâu nâng cao tại kho hệ thống.
                        </>
                      )}
                    </div>

                    {roadmapStats.nextNode && (
                      <div className="mt-auto">
                        <div className="text-white-50 mb-2 fw-bold d-flex align-items-center gap-1" style={{ fontSize: '11px' }}>
                          <FaBrain className="text-warning" /> ĐỀ XUẤT HỌC NHANH:
                        </div>
                        <button 
                          onClick={() => handleNodeClickAction(roadmapStats.nextNode)}
                          className="btn btn-sm btn-outline-primary text-start w-100 rounded-3 py-2 px-3 border-opacity-50 text-truncate shadow-sm d-flex justify-content-between align-items-center"
                        >
                          <span className="fw-semibold text-white">🚀 Mở tài liệu {roadmapStats.nextNode.nodeName || roadmapStats.nextNode.title}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* THẺ THÔNG TIN TRỢ GIÚP GÓC PHẢI */}
                  <div className="p-3 rounded-4 border border-secondary border-opacity-25 d-flex gap-2 align-items-start small text-white-50" style={{ background: '#0a0b12' }}>
                    <FaInfoCircle className="text-info flex-shrink-0 mt-1" size={14} />
                    <span style={{ fontSize: '11.5px' }}>
                      Các kỹ năng có nhãn <span className="text-danger fw-bold"><FaStar size={10}/> HOT SKILL</span> là những công nghệ có điểm số nhu cầu tuyển dụng thực tế cao nhất trong tháng này.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <NodeDrawer 
          show={showDrawer} 
          handleClose={() => setShowDrawer(false)} 
          selectedNode={selectedNode} 
          onUpdate={() => setRefreshKey(prev => prev + 1)} 
        />
      </div>
    </div>
  );
}

export default Learning;