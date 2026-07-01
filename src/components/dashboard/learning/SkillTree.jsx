import React, { useMemo } from 'react';
import { 
  ReactFlow, 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css'; // BẮT BUỘC PHẢI IMPORT CSS NÀY

import CustomSkillNode from './CustomSkillNode';

// Khai báo các loại node custom
const nodeTypes = {
  customSkill: CustomSkillNode,
};

function SkillTree({ skillNodes, onNodeClick }) {
  
  // Hàm này chuyển đổi dữ liệu API thành định dạng mà React Flow hiểu được
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes = [];
    const edges = [];

    // Tọa độ giả lập: Giả sử cứ mỗi Node cách nhau 150px theo chiều dọc
    // Nếu đề tài có "nhánh" rẽ ngang, bạn có thể chỉnh tọa độ X
    skillNodes.forEach((node, index) => {
  // 1. TẠO NODE
  nodes.push({
    id: node.skillNodeId ? node.skillNodeId.toString() : node.id.toString(), // Bảo vệ tránh lệch tên property id từ API
    type: 'customSkill',
    position: { x: 250, y: index * 150 },
    data: {
      label: node.nodeName || node.title,
      description: node.description,
      status: node.isCompleted ? 'completed' : node.isLocked ? 'locked' : 'learning', // Chuẩn hóa trạng thái từ cờ bool của API mới
      
      // BỔ SUNG 2 DÒNG NÀY ĐỂ BẮN XUỐNG CUSTOM NODE
      isTrending: node.isTrending, 
      currentTrendScore: node.currentTrendScore,
      
      rawNode: node 
    },
  });

      // 2. TẠO EDGE (ĐƯỜNG NỐI)
      // Nếu Node này có ParentNodeId (Môn tiên quyết), vẽ đường nối từ Parent -> Node này
      if (node.ParentNodeId) {
        edges.push({
          id: `e${node.ParentNodeId}-${node.id}`,
          source: node.ParentNodeId.toString(),
          target: node.id.toString(),
          type: 'smoothstep', // Đường cong mềm mại
          animated: node.status === 'learning', // HIỆU ỨNG CỰC ĐỈNH: Đường nối sẽ chạy rần rần nếu đang học
          style: {
            stroke: node.status === 'completed' ? '#10b981' : '#4b5563', // Đổi màu đường nối
            strokeWidth: 3,
          }
        });
      } else if (index > 0 && !node.ParentNodeId) {
        // Dự phòng: Nếu API chưa có ParentNodeId, cứ nối Node trước với Node sau thành 1 đường thẳng
        edges.push({
          id: `e${skillNodes[index - 1].id}-${node.id}`,
          source: skillNodes[index - 1].id.toString(),
          target: node.id.toString(),
          type: 'smoothstep',
          animated: node.status === 'learning',
          style: { stroke: '#4b5563', strokeWidth: 2 }
        });
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [skillNodes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Xử lý sự kiện click vào Node
  const handleNodeClick = (event, element) => {
    // element.data.rawNode chính là cái 'node' mà file Learning.jsx cần
    if (onNodeClick) {
      onNodeClick(element.data.rawNode);
    }
  };

  return (
    <div style={{ width: '100%', height: '70vh', backgroundColor: '#020205', borderRadius: '16px', border: '1px solid #1e2235' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView // Tự động zoom cho vừa màn hình
        attributionPosition="bottom-right"
      >
        {/* Background dạng dấu chấm chấm chuẩn kĩ thuật */}
        <Background color="#374151" gap={16} size={1} />
        
        {/* Nút điều khiển Zoom in/out góc dưới trái */}
        <Controls style={{ backgroundColor: '#1f2937', fill: '#fff' }} />
        
        {/* Minimap ở góc dưới phải (Bản đồ thu nhỏ) */}
        <MiniMap 
          nodeColor={(n) => {
            if (n.data.status === 'completed') return '#10b981';
            if (n.data.status === 'learning') return '#f59e0b';
            return '#374151';
          }}
          style={{ backgroundColor: '#111827', maskColor: 'rgba(0,0,0,0.5)' }}
        />
      </ReactFlow>
    </div>
  );
}

export default SkillTree;