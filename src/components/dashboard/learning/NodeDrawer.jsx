// src/components/dashboard/learning/NodeDrawer.jsx
import React, { useState, useEffect } from 'react';
import { Offcanvas, Button, Spinner } from 'react-bootstrap';
import { FaBookOpen, FaVideo, FaCheckCircle, FaExternalLinkAlt } from 'react-icons/fa';
import axiosClient from "../../../api/axiosClient";

function NodeDrawer({ show, handleClose, selectedNode, onUpdate }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // FETCH TÀI LIỆU CỦA NODE TỪ BACKEND
  useEffect(() => {
    if (selectedNode) {
      const fetchResources = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`https://localhost:7196/api/learning-hub/nodes/${selectedNode.id}/resources`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const result = await response.json();
          if (response.ok) setResources(result.data.resources);
        } catch (error) {
          console.error("Lỗi:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchResources();
    }
  }, [selectedNode]);

  // XỬ LÝ NÚT BẤM HOÀN THÀNH KỸ NĂNG
  const handleMarkCompleted = async () => {
    setIsCompleting(true);
    try {
      const response = await axiosClient.post('/api/roadmap/complete-node', {
        nodeId: selectedNode.id
      });
      alert(response.data?.message || "Đã xác nhận hoàn thành kỹ năng!");
      
      // Báo cho Learning.jsx biết để tải lại UI
      if (onUpdate) onUpdate();
      
      handleClose(); // Tự động đóng Drawer sau khi xong
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật tiến độ.");
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <Offcanvas 
      show={show} 
      onHide={handleClose} 
      placement="end" 
      style={{ 
        backgroundColor: 'rgba(11, 12, 22, 0.95)',
        backdropFilter: 'blur(15px)',
        color: '#fff', 
        borderLeft: '1px solid rgba(255,255,255,0.05)',
        width: '450px'
      }}
    >
      <style>{`
        .resource-item {
          transition: all 0.2s ease;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .resource-item:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.15);
          transform: translateX(5px);
        }
        .btn-glow {
          background: linear-gradient(135deg, #198754, #20c997);
          border: none;
          box-shadow: 0 4px 15px rgba(32, 201, 151, 0.3);
          transition: all 0.2s;
        }
        .btn-glow:hover:not(:disabled) {
          box-shadow: 0 6px 20px rgba(32, 201, 151, 0.5);
          transform: translateY(-2px);
        }
      `}</style>

      <Offcanvas.Header closeButton closeVariant="white" className="border-bottom border-secondary border-opacity-25 pb-3">
        // Sửa nhẹ ở tiêu đề Offcanvas.Title trong NodeDrawer.jsx để hiển thị điểm:
<Offcanvas.Title className="fw-bold fs-4">
  <span className="text-warning me-2">#</span>
  {selectedNode?.nodeName || selectedNode?.title || 'Chi tiết Kỹ năng'}
  
  {/* BỔ SUNG: Hiển thị điểm trend thực tế ngay trên Drawer */}
  {selectedNode?.isTrending && (
    <span className="badge bg-danger ms-2" style={{ fontSize: '11px', verticalAlign: 'middle' }}>
      🔥 Market Pulse: {selectedNode.currentTrendScore}/5
    </span>
  )}
</Offcanvas.Title>
      </Offcanvas.Header>
      
      <Offcanvas.Body className="d-flex flex-column p-4">
        <div className="mb-4">
          <h6 className="text-white-50 text-uppercase fw-bold mb-2" style={{ fontSize: '0.8rem', letterSpacing: '1px'}}>MỤC TIÊU BÀI HỌC</h6>
          <p className="text-white bg-dark bg-opacity-50 p-3 rounded-3 border border-secondary border-opacity-25" style={{ fontSize: '0.95rem', lineHeight: '1.6'}}>
            {selectedNode?.description || 'Hoàn thành các tài liệu dưới đây để nắm vững kỹ năng này.'}
          </p>
        </div>

        <h6 className="text-white-50 text-uppercase fw-bold mb-3" style={{ fontSize: '0.8rem', letterSpacing: '1px'}}>TÀI LIỆU KHUYÊN DÙNG</h6>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
             <Spinner animation="grow" variant="success" className="opacity-50" />
          </div>
        ) : resources.length > 0 ? (
          <div className="d-flex flex-column gap-3 mb-4">
            {resources.map((res) => (
              <a 
                key={res.resourceId} 
                href={res.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="resource-item rounded-4 p-3 text-decoration-none d-flex align-items-center justify-content-between"
              >
                <div className="d-flex align-items-center">
                  <div className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                       style={{ width: 40, height: 40, background: res.resourceType === 'Video' ? 'rgba(255, 193, 7, 0.1)' : 'rgba(13, 110, 253, 0.1)' }}>
                    {res.resourceType === 'Video' ? <FaVideo className="text-warning"/> : <FaBookOpen className="text-primary"/>}
                  </div>
                  <div>
                    <h6 className="text-white mb-1 fw-semibold">{res.title}</h6>
                    <span className="badge bg-secondary bg-opacity-25 text-white-50 fw-normal">
                      {res.resourceType === 'Video' ? 'Video hướng dẫn' : 'Tài liệu đọc'}
                    </span>
                  </div>
                </div>
                <FaExternalLinkAlt className="text-white-50 opacity-50" size={12} />
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-white-50 bg-dark bg-opacity-25 rounded-3 border border-secondary border-opacity-25">
            <i className="bi bi-inbox fs-1 mb-2 d-block opacity-50"></i>
            Chưa có tài liệu cho kỹ năng này.
          </div>
        )}

        <div className="mt-auto pt-4">
          <Button 
            className="btn-glow w-100 fw-bold py-3 rounded-pill text-white d-flex justify-content-center align-items-center" 
            onClick={handleMarkCompleted} 
            disabled={isCompleting}
          >
            {isCompleting ? (
              <Spinner animation="border" size="sm" className="me-2" />
            ) : (
              <FaCheckCircle className="me-2 fs-5" />
            )}
            {isCompleting ? 'Đang cập nhật...' : 'Xác nhận Đã Nắm Vững'}
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default NodeDrawer;