// src/components/dashboard/learning/SkillTree.jsx
import React, { useMemo, useEffect, useState } from 'react';
import { 
  ReactFlow, 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { FaArrowLeft } from 'react-icons/fa';

import CustomSkillNode from './CustomSkillNode';
import CustomPhaseNode from './CustomPhaseNode';

const nodeTypes = {
  customSkill: CustomSkillNode,
  customPhase: CustomPhaseNode,
};

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({ rankdir: direction, ranksep: 120, nodesep: 100 });

  nodes.forEach((node) => {
    const nodeWidth = node.type === 'customPhase' ? 280 : 320;
    const nodeHeight = node.type === 'customPhase' ? 160 : 100;
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const nodeWidth = node.type === 'customPhase' ? 280 : 320;
    const nodeHeight = node.type === 'customPhase' ? 160 : 100;
    return {
      ...node,
      targetPosition: 'top',
      sourcePosition: 'bottom',
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { layoutedNodes, layoutedEdges: edges };
};

// NHẬN THÊM PROP highlightHotSkills
function SkillTree({ skillNodes, onNodeClick, highlightHotSkills }) {
  const [activePhaseId, setActivePhaseId] = useState(null);

  const CHUNK_SIZE = 6;
  const phases = useMemo(() => {
    const result = [];
    if (!skillNodes || skillNodes.length === 0) return result;

    for (let i = 0; i < skillNodes.length; i += CHUNK_SIZE) {
      const chunk = skillNodes.slice(i, i + CHUNK_SIZE);
      const completedCount = chunk.filter(n => n.IsCompleted || n.isCompleted).length;
      const isLocked = chunk[0].IsLocked || chunk[0].isLocked;
      const isCompleted = completedCount === chunk.length;

      result.push({
        id: `phase-${Math.floor(i / CHUNK_SIZE) + 1}`,
        title: `Chặng ${Math.floor(i / CHUNK_SIZE) + 1}`,
        nodes: chunk,
        completedCount,
        total: chunk.length,
        status: isCompleted ? 'completed' : isLocked ? 'locked' : 'learning'
      });
    }
    return result;
  }, [skillNodes]);

  // THÊM highlightHotSkills VÀO ARRAY DEPENDENCY
  const { initialNodes, initialEdges } = useMemo(() => {
    const rawNodes = [];
    const rawEdges = [];

    if (!activePhaseId) {
      // VIEW TỔNG QUAN: LAYOUT ZIG-ZAG (DUOLINGO STYLE)
      phases.forEach((phase, index) => {
        const isLeft = index % 2 === 0;
        const xPos = isLeft ? -140 : 140; 
        const yPos = index * 240;         

        rawNodes.push({
          id: phase.id,
          type: 'customPhase',
          position: { x: xPos, y: yPos },
          // TRUYỀN highlightMode VÀO DATA
          data: { ...phase, highlightMode: highlightHotSkills }
        });

        if (index > 0) {
          const prevPhase = phases[index - 1];
          rawEdges.push({
            id: `e-${prevPhase.id}-${phase.id}`,
            source: prevPhase.id,
            target: phase.id,
            type: 'bezier', 
            animated: phase.status === 'learning',
            style: { 
              stroke: prevPhase.status === 'completed' ? '#10b981' : '#4b5563', 
              strokeWidth: 4 
            }
          });
        }
      });
      return { initialNodes: rawNodes, initialEdges: rawEdges };

    } else {
      // VIEW CHI TIẾT: CÂY CÓ NHÁNH DỰA TRÊN PARENT_NODE_ID
      const currentPhase = phases.find(p => p.id === activePhaseId);
      if (currentPhase) {
        const chunkNodes = currentPhase.nodes;
        const validNodeIds = new Set(chunkNodes.map(n => (n.SkillNodeId || n.skillNodeId || n.id).toString()));

        chunkNodes.forEach((node) => {
          const isCompleted = node.IsCompleted || node.isCompleted;
          const isLocked = node.IsLocked || node.isLocked;
          const nodeName = node.NodeName || node.nodeName || node.title;
          const parentId = (node.ParentNodeId || node.parentNodeId)?.toString();
          const nodeId = (node.SkillNodeId || node.skillNodeId || node.id).toString();
          const nodeStatus = isCompleted ? 'completed' : isLocked ? 'locked' : 'learning';

          rawNodes.push({
            id: nodeId,
            type: 'customSkill',
            position: { x: 0, y: 0 },
            data: {
              label: nodeName,
              description: node.Description || node.description,
              status: nodeStatus,
              isTrending: node.isTrending === true || node.IsTrending === true,
              currentTrendScore: node.currentTrendScore ?? node.CurrentTrendScore ?? 0,
              highlightMode: highlightHotSkills, // TRUYỀN highlightMode VÀO DATA
              rawNode: node
            },
          });

          if (parentId && validNodeIds.has(parentId)) {
            rawEdges.push({
              id: `e${parentId}-${nodeId}`,
              source: parentId,
              target: nodeId,
              type: 'smoothstep',
              animated: nodeStatus === 'learning',
              style: { stroke: isCompleted ? '#10b981' : nodeStatus === 'learning' ? '#3b82f6' : '#4b5563', strokeWidth: 3 }
            });
          }
        });
      }
      const layout = getLayoutedElements(rawNodes, rawEdges);
      return { initialNodes: layout.layoutedNodes, initialEdges: layout.layoutedEdges };
    }
  }, [phases, activePhaseId, highlightHotSkills]); // <-- ĐÃ THÊM highlightHotSkills VÀO ĐÂY

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const handleNodeClick = (event, element) => {
    if (element.type === 'customPhase') {
      if (element.data.status !== 'locked') {
        setActivePhaseId(element.id); 
      }
    } else {
      if (onNodeClick) onNodeClick(element.data.rawNode); 
    }
  };

  return (
    <div 
      className="position-relative rounded-4 overflow-hidden border border-secondary border-opacity-25 shadow-lg" 
      style={{ 
        width: '100%', 
        height: '70vh', 
        background: 'radial-gradient(circle at 50% 35%, #14172a 0%, #090a10 75%)' 
      }}
    >
      {/* NÚT QUAY LẠI TỔNG QUAN */}
      {activePhaseId && (
        <button 
          onClick={() => setActivePhaseId(null)}
          className="btn btn-sm btn-dark position-absolute d-flex align-items-center rounded-pill px-3 py-2 shadow"
          style={{ top: '20px', left: '20px', zIndex: 10, border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#11131e' }}
        >
          <FaArrowLeft className="me-2 text-primary" /> Tổng quan lộ trình
        </button>
      )}

      <ReactFlow
        key={activePhaseId ? `phase-${activePhaseId}` : 'overview-view'}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: activePhaseId ? 0.2 : 0.35 }}
        attributionPosition="bottom-right"
      >
        <Background color="#1e2235" gap={24} size={1.2} opacity={0.3} />
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

      {/* THANH NHẮC NHỞ HƯỚNG DẪN UX */}
      <div 
        className="position-absolute bottom-0 start-50 translate-middle-x mb-3 px-4 py-2 rounded-pill d-none d-md-flex align-items-center gap-3 shadow"
        style={{ 
          backgroundColor: 'rgba(10, 11, 20, 0.85)', 
          backdropFilter: 'blur(12px)', 
          border: '1px solid rgba(255,255,255,0.08)',
          fontSize: '11.5px',
          color: '#94a3b8',
          zIndex: 5,
          letterSpacing: '0.2px'
        }}
      >
        <span>🖱️ Cuộn chuột để Phóng to/Thu nhỏ</span>
        <div style={{ width: '1px', height: '12px', backgroundColor: '#2d3142' }}></div>
        <span>🖐️ Giữ Shift + Rê chuột để dịch chuyển bản đồ</span>
        <div style={{ width: '1px', height: '12px', backgroundColor: '#2d3142' }}></div>
        <span className="d-flex align-items-center gap-1">
          <span className="rounded-circle d-inline-block" style={{ width: 7, height: 7, backgroundColor: '#10b981' }}></span> Đã học
        </span>
        <span className="d-flex align-items-center gap-1">
          <span className="rounded-circle d-inline-block" style={{ width: 7, height: 7, backgroundColor: '#3b82f6' }}></span> Đang học
        </span>
        <span className="d-flex align-items-center gap-1">
          <span className="rounded-circle d-inline-block" style={{ width: 7, height: 7, backgroundColor: '#4b5563' }}></span> Chưa mở
        </span>
      </div>
    </div>
  );
}

export default SkillTree;