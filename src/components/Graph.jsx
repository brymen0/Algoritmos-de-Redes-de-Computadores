import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

let id = 0;
const getId = () => `node_${id++}`;

export default function EditableGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Crear nodo con clic en lienzo
  const onPaneClick = useCallback((event) => {
    event.preventDefault();
    const bounds = event.target.getBoundingClientRect();
    const position = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
    const newNode = {
      id: getId(),
      data: { label: `Nodo ${id}` },
      position,
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  // Crear arista sin flecha (no dirigida)
  const onConnect = useCallback((connection) => {
    setEdges((eds) =>
      addEdge({ ...connection, markerEnd: undefined }, eds)
    );
  }, [setEdges]);

  return (
    <div style={{ height: 600 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        fitView
        connectionLineStyle={{ stroke: '#888', strokeWidth: 2 }}
        snapToGrid={true}
        snapGrid={[15, 15]}
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
