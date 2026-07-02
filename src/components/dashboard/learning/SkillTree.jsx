// src/components/dashboard/learning/SkillTree.jsx
import React, { useMemo } from 'react';
import { 
  ReactFlow, 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import CustomSkillNode from './CustomSkillNode';

const nodeTypes = {
  customSkill: CustomSkillNode,
};

function SkillTree({ skillNodes, onNodeClick }) {
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes = [];
    const edges = [];

    // Tọa độ trục giữa. CustomNode của bạn rộng 320px, nên ta set trục khoảng 400-500
    const CENTER_X = 400; 
    const OFFSET_X = 220; // Khoảng cách lệch sang trái/phải
    const SPACING_Y = 180; // Tăng khoảng cách Y lên một chút để đường cong có không gian uốn lượn

    skillNodes.forEach((node, index) => {
      // TẠO DÁNG ZIG-ZAG (S-CURVE)
      // Pattern lặp lại: Giữa -> Phải -> Giữa -> Trái...
      let xPosition = CENTER_X;
      const step = index % 4;
      if (step === 1) xPosition = CENTER_X + OFFSET_X;
      else if (step === 3) xPosition = CENTER_X - OFFSET_X;

      // 1. TẠO NODE
      nodes.push({
        id: node.skillNodeId ? node.skillNodeId.toString() : node.id.toString(),
        type: 'customSkill',
        position: { x: xPosition, y: index * SPACING_Y },
        data: {
          label: node.nodeName || node.title,
          description: node.description,
          status: node.isCompleted ? 'completed' : node.isLocked ? 'locked' : 'learning',
          isTrending: node.isTrending, 
          currentTrendScore: node.currentTrendScore,
          rawNode: node 
        },
      });

      // 2. TẠO EDGE (ĐƯỜNG NỐI)
      if (node.ParentNodeId) {
        edges.push({
          id: `e${node.ParentNodeId}-${node.id}`,
          source: node.ParentNodeId.toString(),
          target: node.id.toString(),
          // Đổi từ 'smoothstep' (vuông vức) sang 'default' (bezier - cong tự nhiên giống nhánh cây)
          type: 'default', 
          animated: node.status === 'learning', 
          style: {
            stroke: node.status === 'completed' ? '#10b981' : node.status === 'learning' ? '#3b82f6' : '#4b5563', 
            strokeWidth: 3, // Cân đối lại độ dày của nhánh
          }
        });
      } else if (index > 0 && !node.ParentNodeId) {
        edges.push({
          id: `e${skillNodes[index - 1].id}-${node.id}`,
          source: skillNodes[index - 1].id.toString(),
          target: node.id.toString(),
          type: 'default', // Đường cong tự nhiên
          animated: node.status === 'learning',
          style: { 
            stroke: node.status === 'completed' ? '#10b981' : node.status === 'learning' ? '#3b82f6' : '#4b5563', 
            strokeWidth: 3 
          }
        });
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [skillNodes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleNodeClick = (event, element) => {
    if (onNodeClick) {
      onNodeClick(element.data.rawNode);
    }
  };

  return (
    <div style={{ width: '100%', height: '75vh', backgroundColor: '#090a0f', borderRadius: '16px', border: '1px solid #1e2235' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        // Thêm padding cho fitView để không bị dính sát lề khi lượn trái/phải
        fitViewOptions={{ padding: 0.2 }} 
        attributionPosition="bottom-right"
      >
        <Background color="#1e2235" gap={20} size={1.5} />
        
        <Controls style={{ backgroundColor: '#1f2937', fill: '#fff', border: 'none' }} />
        
        <MiniMap 
          nodeColor={(n) => {
            if (n.data.status === 'completed') return '#10b981';
            if (n.data.status === 'learning') return '#3b82f6';
            return '#374151';
          }}
          style={{ backgroundColor: '#111827', maskColor: 'rgba(0,0,0,0.6)', border: '1px solid #1e2235', borderRadius: '8px' }}
        />
      </ReactFlow>
    </div>
  );
}

export default SkillTree;