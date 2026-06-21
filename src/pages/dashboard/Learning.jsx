// src/pages/Learning.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [refreshKey, setRefreshKey] = useState(0); // State kích hoạt load lại dữ liệu
  
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const navigate = useNavigate();

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
  }, [refreshKey]); // Thêm refreshKey vào mảng dependencies

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