// src/pages/Learning.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as signalR from "@microsoft/signalr"; // ĐÃ THÊM: Import SignalR
import axiosClient from '../../api/axiosClient'; 
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import NodeDrawer from '../../components/dashboard/learning/NodeDrawer';
import SkillTree from '../../components/dashboard/learning/SkillTree'; 
import { Spinner } from 'react-bootstrap';

function Learning() {
  const [skillNodes, setSkillNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false); 
  const [refreshKey, setRefreshKey] = useState(0); 
  
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const navigate = useNavigate();

  // 1. GỌI API LẤY LỘ TRÌNH (Tự động chạy lại khi refreshKey thay đổi)
  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/api/learning-hub/my-roadmap');
        
        if (response.data && response.data.data) {
          const formattedNodes = response.data.data.map(node => ({
            id: node.nodeId,
            title: node.nodeName, 
            nodeName: node.nodeName,
            description: node.description,
            status: node.isCompleted ? 'completed' : (node.isLocked ? 'locked' : 'learning')
          }));
          
          setSkillNodes(formattedNodes);
          setNeedsOnboarding(false); // Reset lại state nếu đã có data
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

  // 2. KẾT NỐI SIGNALR ĐỂ LẮNG NGHE SỰ KIỆN TỪ BACKEND
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Giải mã JWT Token để lấy UserId (sub)
    let userId = "";
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload.sub || payload.nameid; // 'sub' là Claim chuẩn cho User ID
    } catch(e) { 
      console.error("Lỗi parse token:", e); 
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7196/hubs/roadmap", {
        accessTokenFactory: () => token 
      })
      .withAutomaticReconnect()
      .build();

    // Biến cờ để ngăn lỗi AbortError của React StrictMode
    let isMounted = true;

    connection.start()
      .then(() => {
        if (isMounted) {
          console.log("Đã kết nối Real-time Roadmap Hub!");
          // BẮT BUỘC: Gọi hàm Backend để Join vào Group thông báo của riêng mình
          if (userId) {
            connection.invoke("SubscribeToRoadmapUpdates", userId)
              .catch(err => console.error("Lỗi khi tham gia Group Roadmap:", err));
          }
        }
      })
      .catch(err => {
        if (isMounted) console.error("Lỗi kết nối SignalR: ", err);
      });

    // Lắng nghe sự kiện TargetRoleChanged
    connection.on("TargetRoleChanged", (data) => {
      console.log("Tín hiệu Realtime nhận được:", data.message);
      // Tự động thay đổi refreshKey để useEffect fetchRoadmap chạy lại
      setRefreshKey(prev => prev + 1); 
    });

    // Cleanup khi component bị unmount (rời khỏi trang)
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

  return (
    <div className="d-flex" style={{ backgroundColor: '#020205', minHeight: '100vh', color: '#fff' }}>
      <Sidebar />
      <div className="flex-grow-1 p-4 overflow-auto">
        <DashboardHeader />
        <h3 className="fw-bold mb-4">Lộ trình học tập (Roadmap)</h3>

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
            <button
              className="btn btn-success fw-bold px-4 py-2 rounded-pill shadow"
              onClick={() => navigate('/dashboard/profile')} 
            >
              <i className="bi bi-person-lines-fill me-2"></i> Thiết lập Mục tiêu ngay
            </button>
          </div>
        ) : (
          <SkillTree 
            skillNodes={skillNodes} 
            onNodeClick={(node) => {
              if (node.status !== 'locked') {
                  setSelectedNode(node);
                  setShowDrawer(true);
              } else {
                  alert("Bạn phải hoàn thành kỹ năng trước đó mới có thể mở khóa bài này!");
              }
            }} 
          />
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