// src/pages/dashboard/AdminResourceList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/dashboard/Sidebar';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';
import axiosClient from '../../../api/axiosClient';

function AdminResourceList() {
  const navigate = useNavigate();
  const [techPaths, setTechPaths] = useState([]);
  const [allNodes, setAllNodes] = useState([]);
  const [loading, setLoading] = useState(true);

  // States quản lý UI - Giao diện 3 Cột
  const [selectedPath, setSelectedPath] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Data & Loading cho cột thứ 3 (Tài liệu)
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);

  // Search filter states
  const [searchPath, setSearchPath] = useState('');
  const [searchNode, setSearchNode] = useState('');

  // Lấy dữ liệu cơ sở (Paths & Nodes)
  useEffect(() => {
    const fetchBaseData = async () => {
      setLoading(true);
      try {
        const [pathsRes, nodesRes] = await Promise.all([
          axiosClient.get('/api/admin/content/tech-paths'),
          axiosClient.get('/api/admin/content/skill-nodes')
        ]);
        setTechPaths(pathsRes.data?.data || []);
        setAllNodes(nodesRes.data?.data || []);
      } catch (error) {
        console.error('Lỗi tải dữ liệu gốc:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBaseData();
  }, []);

  // Khi chọn Path -> Reset Node & Resource
  const handleSelectPath = (path) => {
    if (selectedPath?.techPathId === path.techPathId) return;
    setSelectedPath(path);
    setSelectedNode(null);
    setResources([]);
    setSearchNode('');
  };

  // Khi chọn Node -> Gọi API lấy Resource
  const handleSelectNode = async (node) => {
    if (selectedNode?.skillNodeId === node.skillNodeId) return;
    setSelectedNode(node);
    
    setLoadingResources(true);
    try {
      const response = await axiosClient.get(`/api/admin/content/learning-resources?nodeId=${node.skillNodeId}&page=1&pageSize=100`);
      setResources(response.data?.data?.items || []);
    } catch (error) {
      console.error(`Lỗi tải resources cho node ${node.skillNodeId}:`, error);
      setResources([]);
    } finally {
      setLoadingResources(false);
    }
  };

  // Helpers cho Icon Resource Type
  const getResourceIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'video': return '📹';
      case 'course': return '📘';
      case 'docs': case 'official docs': return '📄';
      case 'tool': return '🛠️';
      default: return '🔗';
    }
  };

  // Filtered Data
  const filteredPaths = techPaths.filter(p => p.pathName.toLowerCase().includes(searchPath.toLowerCase()));
  const nodesForSelectedPath = allNodes.filter(n => n.techPathId === selectedPath?.techPathId);
  const filteredNodes = nodesForSelectedPath.filter(n => n.nodeName.toLowerCase().includes(searchNode.toLowerCase()));

  return (
    <div className="d-flex min-vh-100 w-100" style={{ backgroundColor: '#07090f' }}>
      <Sidebar />
      <div className="flex-grow-1 p-4 overflow-hidden d-flex flex-column text-white" style={{ maxHeight: '100vh', minWidth: 0 }}>
        <DashboardHeader />

        <div className="container-fluid px-0 d-flex flex-column h-100">
          
          {/* HEADER & THỐNG KÊ TỔNG QUAN */}
          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
            <div>
              <h4 className="fw-bold text-white mb-1">Learning Explorer</h4>
              <p className="text-white-50 mb-0">Quản lý không gian học tập: Lộ trình ➔ Kỹ năng ➔ Tài liệu</p>
            </div>
            
            <div className="d-flex gap-3 align-items-center">
              <div className="d-flex gap-3 text-center me-3">
                <div className="px-3 py-2 rounded-3" style={{ backgroundColor: '#111c2e', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="text-info fw-bold fs-5">{techPaths.length}</div>
                  <div className="text-white-50" style={{ fontSize: '12px' }}>Roadmaps</div>
                </div>
                <div className="px-3 py-2 rounded-3" style={{ backgroundColor: '#111c2e', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="text-warning fw-bold fs-5">{allNodes.length}</div>
                  <div className="text-white-50" style={{ fontSize: '12px' }}>Skills</div>
                </div>
              </div>
              <button 
                className="btn btn-primary fw-semibold px-4"
                onClick={() => navigate('/dashboard/admin/resources/create')}
              >
                + Add Resource
              </button>
            </div>
          </div>

          {/* MAIN EXPLORER: 3 CỘT */}
          {loading ? (
            <div className="text-center py-5 text-white-50 mt-5">
              <div className="spinner-border spinner-border-sm text-primary me-2"></div> Đang tải hệ thống...
            </div>
          ) : (
            <div className="row flex-grow-1 overflow-hidden gx-3">
              
              {/* CỘT 1: TECH PATHS */}
              <div className="col-12 col-md-3 d-flex flex-column h-100">
                <div className="p-3 rounded-4 h-100 d-flex flex-column" style={{ backgroundColor: '#0c1421', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h6 className="fw-bold text-white-50 mb-3 text-uppercase" style={{ fontSize: '13px', letterSpacing: '1px' }}>1. Roadmaps</h6>
                  <input 
                    type="text" 
                    className="form-control form-control-sm bg-dark text-white border-secondary mb-3 rounded-pill px-3" 
                    placeholder="🔍 Tìm roadmap..." 
                    value={searchPath}
                    onChange={(e) => setSearchPath(e.target.value)}
                  />
                  <div className="flex-grow-1 overflow-auto pe-1 custom-scrollbar">
                    {filteredPaths.length === 0 ? (
                      <div className="text-white-50 text-center small mt-4">Không tìm thấy roadmap.</div>
                    ) : (
                      <div className="d-flex flex-column gap-2">
                        {filteredPaths.map(path => {
                          const isActive = selectedPath?.techPathId === path.techPathId;
                          return (
                            <div 
                              key={path.techPathId}
                              onClick={() => handleSelectPath(path)}
                              className={`p-2 rounded-3 cursor-pointer transition-all ${isActive ? 'bg-primary bg-opacity-25 border-primary' : 'bg-transparent border-transparent hover-bg-dark'}`}
                              style={{ border: '1px solid transparent', cursor: 'pointer' }}
                            >
                              <div className="d-flex justify-content-between align-items-center">
                                <span className={`fw-semibold ${isActive ? 'text-info' : 'text-light'}`}>
                                  🔵 {path.pathName}
                                </span>
                                <span className="badge bg-dark text-white-50">{path.targetRoleId}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CỘT 2: SKILL NODES */}
              <div className="col-12 col-md-4 d-flex flex-column h-100">
                <div className="p-3 rounded-4 h-100 d-flex flex-column" style={{ backgroundColor: '#0c1421', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h6 className="fw-bold text-white-50 mb-3 text-uppercase" style={{ fontSize: '13px', letterSpacing: '1px' }}>2. Skills</h6>
                  
                  {!selectedPath ? (
                    <div className="m-auto text-center text-white-50">
                      <div className="fs-1 mb-2">👈</div>
                      <p className="small">Chọn một Roadmap<br/>để xem các kỹ năng.</p>
                    </div>
                  ) : (
                    <>
                      <input 
                        type="text" 
                        className="form-control form-control-sm bg-dark text-white border-secondary mb-3 rounded-pill px-3" 
                        placeholder={`🔍 Tìm trong ${selectedPath.pathName}...`} 
                        value={searchNode}
                        onChange={(e) => setSearchNode(e.target.value)}
                      />
                      <div className="flex-grow-1 overflow-auto pe-1 custom-scrollbar">
                        {filteredNodes.length === 0 ? (
                          <div className="text-white-50 text-center small mt-4">Roadmap này chưa có kỹ năng nào.</div>
                        ) : (
                          <div className="d-flex flex-column gap-2">
                            {filteredNodes.map(node => {
                              const isActive = selectedNode?.skillNodeId === node.skillNodeId;
                              return (
                                <div 
                                  key={node.skillNodeId}
                                  onClick={() => handleSelectNode(node)}
                                  className={`p-2 rounded-3 cursor-pointer transition-all ${isActive ? 'bg-primary bg-opacity-25 border-primary' : 'bg-transparent border-transparent hover-bg-dark'}`}
                                  style={{ border: '1px solid transparent', cursor: 'pointer' }}
                                >
                                  <div className="d-flex flex-column">
                                    <span className={`fw-semibold ${isActive ? 'text-warning' : 'text-light'}`}>
                                      🟣 {node.nodeName}
                                    </span>
                                    {node.description && (
                                      <span className="text-white-50 text-truncate ms-4 mt-1" style={{ fontSize: '12px' }}>
                                        {node.description}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* CỘT 3: LEARNING RESOURCES */}
              <div className="col-12 col-md-5 d-flex flex-column h-100">
                <div className="p-3 rounded-4 h-100 d-flex flex-column" style={{ backgroundColor: '#0c1421', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold text-white-50 mb-0 text-uppercase" style={{ fontSize: '13px', letterSpacing: '1px' }}>3. Resources</h6>
                    {selectedNode && (
                      <span className="badge bg-success bg-opacity-25 text-success border border-success">
                        {resources.length} mục
                      </span>
                    )}
                  </div>

                  {!selectedNode ? (
                    <div className="m-auto text-center text-white-50">
                      <div className="fs-1 mb-2">👈</div>
                      <p className="small">Chọn một Kỹ năng<br/>để xem tài liệu chi tiết.</p>
                    </div>
                  ) : loadingResources ? (
                    <div className="m-auto text-center text-white-50">
                      <div className="spinner-border spinner-border-sm text-warning mb-2"></div>
                      <p className="small">Đang tải tài liệu...</p>
                    </div>
                  ) : resources.length === 0 ? (
                    <div className="m-auto text-center text-white-50">
                      <div className="fs-1 mb-3">📂</div>
                      <h6>Trống</h6>
                      <p className="small mb-3">Chưa có tài liệu nào cho kỹ năng này.</p>
                      <button 
                        className="btn btn-sm btn-outline-light rounded-pill px-3"
                        onClick={() => navigate('/dashboard/admin/resources/create')}
                      >
                        + Thêm tài liệu ngay
                      </button>
                    </div>
                  ) : (
                    <div className="flex-grow-1 overflow-auto pe-2 custom-scrollbar">
                      <div className="d-flex flex-column gap-3">
                        {resources.map(res => (
                          <div 
                            key={res.resourceId} 
                            className="p-3 rounded-3 d-flex flex-column gap-2"
                            style={{ backgroundColor: '#141e30', border: '1px solid rgba(255,255,255,0.03)' }}
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <a 
                                href={res.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-light fw-bold text-decoration-none hover-text-info pe-3 d-flex align-items-start gap-2"
                                style={{ lineHeight: '1.4' }}
                              >
                                <span>{getResourceIcon(res.resourceType)}</span>
                                {res.title}
                              </a>
                              <button 
                                className="btn btn-sm btn-outline-secondary border-0 p-1 text-white-50 hover-text-warning"
                                onClick={() => navigate(`/dashboard/admin/resources/edit/${res.resourceId}`)}
                                title="Sửa tài liệu"
                              >
                                ✏️
                              </button>
                            </div>
                            
                            <div className="d-flex align-items-center gap-2 mt-1 flex-wrap" style={{ fontSize: '12px' }}>
                              <span className="badge bg-dark text-info border border-secondary px-2 py-1">
                                {res.resourceType}
                              </span>
                              {res.provider && (
                                <span className="text-white-50 d-flex align-items-center gap-1">
                                  🏢 {res.provider}
                                </span>
                              )}
                              {res.difficultyLevel && (
                                <span className="text-white-50 ms-auto d-flex align-items-center gap-1">
                                  ⭐ {res.difficultyLevel}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Thêm chút CSS Inline để hỗ trợ custom-scrollbar và hover (Bạn có thể bỏ vào file CSS riêng nếu muốn) */}
      <style>{`
        .hover-bg-dark:hover { background-color: rgba(255,255,255,0.02) !important; }
        .hover-text-info:hover { color: #0dcaf0 !important; }
        .hover-text-warning:hover { color: #ffc107 !important; }
        .transition-all { transition: all 0.2s ease-in-out; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}

export default AdminResourceList;